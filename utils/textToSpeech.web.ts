/**
 * Web implementation of TextToSpeech plugin (fallback)
 */
export class TextToSpeechWeb {
    async speak(options: { text: string; language: string; rate?: number; pitch?: number }): Promise<{ success: boolean }> {
        return Promise.reject(new Error('Web implementation not used'));
    }

    async stop(): Promise<void> {
        return Promise.resolve();
    }

    async pause(): Promise<void> {
        return Promise.resolve();
    }

    async resume(): Promise<void> {
        return Promise.resolve();
    }

    async isAvailable(): Promise<{ available: boolean }> {
        return Promise.resolve({ available: false });
    }
}

