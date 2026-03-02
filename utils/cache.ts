/**
 * Simple in-memory cache utility
 * Useful for caching API responses and expensive computations
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

class SimpleCache {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

    /**
     * Get cached data if it exists and hasn't expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set data in cache with optional TTL
     */
    set<T>(key: string, data: T, ttl?: number): void {
        const expiresAt = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresAt,
        });
    }

    /**
     * Check if key exists and is valid
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    /**
     * Remove specific key from cache
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Clean expired entries
     */
    clean(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

// Export singleton instance
export const cache = new SimpleCache();

// Clean expired entries every 10 minutes
if (typeof window !== 'undefined') {
    setInterval(() => {
        cache.clean();
    }, 10 * 60 * 1000);
}






