import { useState, useEffect, useRef, useCallback } from 'react';
import { getTextToSpeech, type TextToSpeech } from '../utils/textToSpeech';
import type { Language } from '../types';

export interface UseTextToSpeechReturn {
    isPlaying: boolean;
    isPaused: boolean;
    isAvailable: boolean;
    play: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    toggle: () => void;
}

export const useTextToSpeech = (
    text: string,
    language: Language = 'ku'
): UseTextToSpeechReturn => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const ttsRef = useRef<TextToSpeech | null>(null);

    useEffect(() => {
        // Check if speech synthesis is available
        const checkAvailability = async (retryCount = 0) => {
            if (typeof window === 'undefined') {
                setIsAvailable(false);
                return;
            }

            try {
                // Initialize TTS first
                const tts = getTextToSpeech();
                ttsRef.current = tts;
                
                // Check if TTS is actually available (this will check native first, then web)
                const available = await tts.isAvailable();
                
                if (!available && retryCount < 3) {
                    // On Android, TTS might not be initialized yet, retry after a delay
                    console.log(`Text-to-speech not available yet, retrying... (${retryCount + 1}/3)`);
                    setTimeout(() => checkAvailability(retryCount + 1), 1000);
                    return;
                }
                
                setIsAvailable(available);
                
                if (available) {
                    console.log('Text-to-speech available');
                    
                    // Try to get voices immediately (only for web)
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        const voices = tts.getVoices();
                        console.log('Available voices:', voices.length);
                        if (voices.length > 0) {
                            console.log('Sample voices:', voices.slice(0, 3).map(v => ({ name: v.name, lang: v.lang })));
                        }
                    }
                } else {
                    console.warn('Text-to-speech not available after retries');
                }
            } catch (error) {
                console.error('Failed to initialize text-to-speech:', error);
                if (retryCount < 3) {
                    setTimeout(() => checkAvailability(retryCount + 1), 1000);
                } else {
                    setIsAvailable(false);
                }
            }
        };

        // Initial check with retries
        checkAvailability();

        // Load voices for web (some browsers need this, especially Android)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const loadVoices = () => {
                if (ttsRef.current) {
                    const voices = ttsRef.current.getVoices();
                    console.log('Voices loaded:', voices.length);
                    if (voices.length > 0) {
                        setIsAvailable(true);
                    }
                }
            };
            
            // Some browsers (especially Android) load voices asynchronously
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
            
            // Try loading voices multiple times (Android sometimes needs this)
            loadVoices();
            setTimeout(loadVoices, 500);
            setTimeout(loadVoices, 1000);
            setTimeout(loadVoices, 2000);
        }

        // Cleanup on unmount
        return () => {
            if (ttsRef.current) {
                ttsRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const play = useCallback(async () => {
        console.log('TTS play() called', { textLength: text.length, hasTTS: !!ttsRef.current, isPaused, isPlaying });
        
        if (!text.trim()) {
            console.warn('No text to speak');
            return;
        }

        // Try to initialize TTS if not already done (for Android)
        if (!ttsRef.current) {
            try {
                console.log('Initializing TTS on demand...');
                const tts = getTextToSpeech();
                ttsRef.current = tts;
                
                // Check availability
                const available = await tts.isAvailable();
                setIsAvailable(available);
                console.log('TTS available:', available);
                
                if (!available) {
                    console.error('Speech synthesis not available');
                    alert(language === 'ku' 
                        ? 'خوێندنەوە بە دەنگ بەردەست نییە لەم براوزەرەدا'
                        : 'القراءة الصوتية غير متاحة في هذا المتصفح');
                    return;
                }
            } catch (error) {
                console.error('Failed to initialize TTS:', error);
                alert(language === 'ku' 
                    ? 'هەڵە لە دامەزراندنی خوێندنەوە بە دەنگ'
                    : 'خطأ في تهيئة القراءة الصوتية');
                return;
            }
        }

        try {
            // If paused, resume
            if (isPaused) {
                console.log('Resuming TTS...');
                await ttsRef.current.resume();
                setIsPaused(false);
                setIsPlaying(true);
                return;
            }

            // Otherwise, start new speech
            console.log('Starting TTS speech...', { textLength: text.length, language });
            await ttsRef.current.speak(text, language, {
                rate: 0.9,
                pitch: 1.0,
                volume: 1.0,
            });
            console.log('TTS speech started successfully');
            setIsPlaying(true);
            setIsPaused(false);
        } catch (error) {
            console.error('Error playing speech:', error);
            setIsPlaying(false);
            setIsPaused(false);
            // Show user-friendly error
            alert(language === 'ku' 
                ? 'نەتوانرا دەنگ بخوێنرێتەوە. تکایە هەوڵ بدەرەوە'
                : 'لا يمكن قراءة النص. يرجى المحاولة مرة أخرى');
        }
    }, [text, language, isPaused, isPlaying]);

    const pause = useCallback(async () => {
        if (ttsRef.current) {
            await ttsRef.current.pause();
            setIsPaused(true);
            setIsPlaying(false);
        }
    }, []);

    const resume = useCallback(async () => {
        if (ttsRef.current) {
            await ttsRef.current.resume();
            setIsPaused(false);
            setIsPlaying(true);
        }
    }, []);

    const stop = useCallback(async () => {
        if (ttsRef.current) {
            await ttsRef.current.stop();
            setIsPlaying(false);
            setIsPaused(false);
        }
    }, []);

    const toggle = useCallback(async () => {
        console.log('TTS toggle() called', { isPlaying, isPaused, isAvailable });
        
        if (!isAvailable && !ttsRef.current) {
            console.warn('TTS not available, trying to initialize...');
            // Try to initialize
            try {
                const tts = getTextToSpeech();
                ttsRef.current = tts;
                const available = await tts.isAvailable();
                setIsAvailable(available);
                
                if (!available) {
                    alert(language === 'ku' 
                        ? 'خوێندنەوە بە دەنگ بەردەست نییە'
                        : 'القراءة الصوتية غير متاحة');
                    return;
                }
            } catch (error) {
                console.error('Failed to initialize TTS in toggle:', error);
                return;
            }
        }
        
        if (isPlaying) {
            await pause();
        } else if (isPaused) {
            await resume();
        } else {
            await play();
        }
    }, [isPlaying, isPaused, isAvailable, play, pause, resume, language]);

    // Update state based on TTS state
    useEffect(() => {
        if (!ttsRef.current) return;

        const interval = setInterval(() => {
            if (ttsRef.current) {
                const playing = ttsRef.current.getPlaying();
                const paused = ttsRef.current.getPaused();
                
                setIsPlaying(prev => playing !== prev ? playing : prev);
                setIsPaused(prev => paused !== prev ? paused : prev);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return {
        isPlaying,
        isPaused,
        isAvailable,
        play,
        pause,
        resume,
        stop,
        toggle,
    };
};

