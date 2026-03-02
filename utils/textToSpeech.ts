/**
 * Text-to-Speech utility for Kurdish and Arabic languages
 * Uses Web Speech API (speechSynthesis) or Capacitor native plugin
 */

import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';

export interface SpeechOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
}

// Define the native plugin interface
interface TextToSpeechPlugin {
    speak(options: { text: string; language: string; rate?: number; pitch?: number }): Promise<{ success: boolean }>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    isAvailable(): Promise<{ available: boolean }>;
}

// Register the native plugin
const TextToSpeechNative = registerPlugin<TextToSpeechPlugin>('TextToSpeech', {
    web: () => import('./textToSpeech.web').then(m => new m.TextToSpeechWeb()),
});

// Log plugin registration
console.log('TextToSpeech: Plugin registered', { isNative: Capacitor.isNativePlatform() });

export class TextToSpeech {
    private synth: SpeechSynthesis | null = null;
    private utterance: SpeechSynthesisUtterance | null = null;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private useNative: boolean = false;

    constructor() {
        // Check if we're on a native platform
        if (Capacitor.isNativePlatform()) {
            this.useNative = true;
            console.log('TextToSpeech: Using native Capacitor TTS');
            return;
        }

        // Use Web Speech API for web
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            console.log('TextToSpeech: Using Web Speech API');
        } else {
            // On Android WebView, speechSynthesis might not be available
            // Don't throw error, just log a warning
            console.warn('TextToSpeech: Speech synthesis is not supported in this browser/WebView');
            // Create a mock synth object to prevent crashes
            this.synth = {
                speak: () => {},
                cancel: () => {},
                pause: () => {},
                resume: () => {},
                getVoices: () => [],
                speaking: false,
                pending: false,
                paused: false,
            } as any;
        }
    }

    /**
     * Extract text content from HTML string
     */
    private extractTextFromHTML(html: string): string {
        // Create a temporary DOM element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Remove script and style elements
        const scripts = tempDiv.querySelectorAll('script, style');
        scripts.forEach(el => el.remove());
        
        // Get text content and clean it up
        let text = tempDiv.textContent || tempDiv.innerText || '';
        
        // Clean up extra whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        // Remove common HTML artifacts
        text = text.replace(/&nbsp;/g, ' ');
        text = text.replace(/&amp;/g, '&');
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        text = text.replace(/&quot;/g, '"');
        
        return text;
    }

    /**
     * Get language code for speech synthesis
     */
    private getLanguageCode(language: 'ku' | 'ar' | 'en'): string {
        const langMap: Record<string, string> = {
            'ku': 'ku', // Kurdish - may need to try 'ckb' (Central Kurdish) if 'ku' doesn't work
            'ar': 'ar-SA', // Arabic (Saudi Arabia)
            'en': 'en-GB', // English (UK)
        };
        return langMap[language] || 'en-GB';
    }

    /**
     * Check if speech synthesis is available
     */
    async isAvailable(): Promise<boolean> {
        // Check native plugin first
        if (this.useNative) {
            try {
                console.log('TextToSpeech: Checking native TTS availability...');
                // Check if plugin is actually registered
                if (!TextToSpeechNative) {
                    console.warn('TextToSpeech: Plugin not registered');
                    return false;
                }
                
                const result = await TextToSpeechNative.isAvailable();
                console.log('TextToSpeech: Native TTS available:', result.available);
                return result.available;
            } catch (error) {
                console.warn('TextToSpeech: Native TTS not available:', error);
                // If plugin call fails, try to use Web Speech API as fallback
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    console.log('TextToSpeech: Falling back to Web Speech API');
                    this.useNative = false;
                    this.synth = window.speechSynthesis;
                    return true;
                }
                return false;
            }
        }

        // Check Web Speech API
        if (typeof window === 'undefined') return false;
        
        // Check if speechSynthesis exists and is functional
        if ('speechSynthesis' in window) {
            try {
                // Try to create an utterance to verify it works
                const testUtterance = new SpeechSynthesisUtterance('');
                return testUtterance !== null;
            } catch (e) {
                console.warn('SpeechSynthesis exists but may not be functional:', e);
                return false;
            }
        }
        
        return false;
    }

    /**
     * Get available voices
     */
    getVoices(): SpeechSynthesisVoice[] {
        try {
            const voices = this.synth.getVoices();
            // On Android, voices might be empty initially, so return empty array instead of error
            return voices || [];
        } catch (error) {
            console.warn('Error getting voices:', error);
            return [];
        }
    }

    /**
     * Find a voice for the specified language
     */
    findVoice(language: 'ku' | 'ar' | 'en'): SpeechSynthesisVoice | null {
        const langCode = this.getLanguageCode(language);
        const voices = this.getVoices();
        
        // Try exact match first
        let voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
        
        // If Kurdish not found, try Central Kurdish
        if (!voice && language === 'ku') {
            voice = voices.find(v => v.lang.includes('ku') || v.lang.includes('ckb'));
        }
        
        // Fallback to any available voice
        if (!voice) {
            voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0])) || voices[0];
        }
        
        return voice || null;
    }

    /**
     * Speak text
     */
    speak(text: string, language: 'ku' | 'ar' | 'en' = 'ku', options?: SpeechOptions): Promise<void> {
        // Use native plugin if available
        if (this.useNative) {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log('TextToSpeech: Using native TTS to speak', { textLength: text.length, language });
                    
                    // Stop any current speech
                    await this.stop();

                    // Extract text from HTML if needed
                    const cleanText = text.includes('<') ? this.extractTextFromHTML(text) : text;

                    if (!cleanText.trim()) {
                        reject(new Error('No text to speak'));
                        return;
                    }

                    console.log('TextToSpeech: Calling native speak with text length:', cleanText.length);
                    this.isPlaying = true;
                    this.isPaused = false;

                    await TextToSpeechNative.speak({
                        text: cleanText,
                        language: language,
                        rate: options?.rate || 0.9,
                        pitch: options?.pitch || 1.0,
                    });

                    console.log('TextToSpeech: Native speak completed');
                    this.isPlaying = false;
                    this.isPaused = false;
                    resolve();
                } catch (error) {
                    console.error('TextToSpeech: Native TTS error:', error);
                    this.isPlaying = false;
                    this.isPaused = false;
                    reject(error);
                }
            });
        }

        // Use Web Speech API
        return new Promise(async (resolve, reject) => {
            if (!this.synth) {
                reject(new Error('Speech synthesis not available'));
                return;
            }

            // Stop any current speech
            await this.stop();

            // Extract text from HTML if needed
            const cleanText = text.includes('<') ? this.extractTextFromHTML(text) : text;

            if (!cleanText.trim()) {
                reject(new Error('No text to speak'));
                return;
            }

            // Create utterance
            this.utterance = new SpeechSynthesisUtterance(cleanText);
            
            // Set language
            const langCode = this.getLanguageCode(language);
            this.utterance.lang = langCode;

            // Find and set voice (try multiple times on Android)
            const setVoice = () => {
                const voice = this.findVoice(language);
                if (voice) {
                    this.utterance!.voice = voice;
                    console.log('Using voice:', voice.name, voice.lang);
                } else {
                    console.warn('No voice found for language:', language, 'Using default');
                }
            };

            // Try to set voice immediately
            setVoice();

            // On Android, voices might load later, so try again
            if (this.getVoices().length === 0) {
                setTimeout(setVoice, 500);
                setTimeout(setVoice, 1000);
            }

            // Set options
            this.utterance.rate = options?.rate || 0.9;
            this.utterance.pitch = options?.pitch || 1.0;
            this.utterance.volume = options?.volume || 1.0;

            // Event handlers
            this.utterance.onend = () => {
                this.isPlaying = false;
                this.isPaused = false;
                resolve();
            };

            this.utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.isPlaying = false;
                this.isPaused = false;
                reject(event);
            };

            // Speak
            try {
                this.synth.speak(this.utterance);
                this.isPlaying = true;
                this.isPaused = false;
                console.log('Started speaking:', cleanText.substring(0, 50) + '...');
            } catch (error) {
                console.error('Error starting speech:', error);
                this.isPlaying = false;
                this.isPaused = false;
                reject(error);
            }
        });
    }

    /**
     * Pause speech
     */
    async pause(): Promise<void> {
        if (this.useNative) {
            await TextToSpeechNative.pause();
            this.isPaused = true;
            this.isPlaying = false;
            return;
        }

        if (this.isPlaying && !this.isPaused && this.synth) {
            this.synth.pause();
            this.isPaused = true;
        }
    }

    /**
     * Resume speech
     */
    async resume(): Promise<void> {
        if (this.useNative) {
            await TextToSpeechNative.resume();
            this.isPaused = false;
            this.isPlaying = true;
            return;
        }

        if (this.isPaused && this.synth) {
            this.synth.resume();
            this.isPaused = false;
        }
    }

    /**
     * Stop speech
     */
    async stop(): Promise<void> {
        if (this.useNative) {
            await TextToSpeechNative.stop();
            this.isPlaying = false;
            this.isPaused = false;
            this.utterance = null;
            return;
        }

        if (this.synth && (this.synth.speaking || this.isPaused)) {
            this.synth.cancel();
            this.isPlaying = false;
            this.isPaused = false;
            this.utterance = null;
        }
    }

    /**
     * Check if currently playing
     */
    getPlaying(): boolean {
        return this.isPlaying && !this.isPaused;
    }

    /**
     * Check if currently paused
     */
    getPaused(): boolean {
        return this.isPaused;
    }
}

// Create singleton instance
let ttsInstance: TextToSpeech | null = null;

export const getTextToSpeech = (): TextToSpeech => {
    if (!ttsInstance) {
        try {
            ttsInstance = new TextToSpeech();
        } catch (error) {
            console.error('Text-to-speech not available:', error);
            // Return a mock object that won't crash
            return {
                isAvailable: () => false,
                speak: () => Promise.reject(new Error('Not available')),
                pause: () => {},
                resume: () => {},
                stop: () => {},
                getPlaying: () => false,
                getPaused: () => false,
                getVoices: () => [],
                findVoice: () => null,
            } as TextToSpeech;
        }
    }
    return ttsInstance;
};

