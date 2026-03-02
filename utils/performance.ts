/**
 * Performance utilities for optimizing app responsiveness
 */

/**
 * Request Animation Frame wrapper for smooth animations
 */
export function raf(callback: () => void): number {
    return requestAnimationFrame(callback);
}

/**
 * Cancel Animation Frame wrapper
 */
export function cancelRaf(id: number): void {
    cancelAnimationFrame(id);
}

/**
 * Throttle function calls using requestAnimationFrame
 */
export function throttleRAF<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
    let rafId: number | null = null;
    let lastArgs: Parameters<T> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        lastArgs = args;
        
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                if (lastArgs) {
                    func(...lastArgs);
                }
                rafId = null;
            });
        }
    };
}

/**
 * Batch DOM updates for better performance
 */
export function batchUpdates(updates: (() => void)[]): void {
    if (updates.length === 0) return;
    
    // Use requestAnimationFrame for batching
    requestAnimationFrame(() => {
        updates.forEach(update => update());
    });
}

/**
 * Check if device is low-end (for performance optimizations)
 */
export function isLowEndDevice(): boolean {
    if (typeof navigator === 'undefined') return false;
    
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;
    
    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;
    
    // Consider low-end if less than 4 cores or less than 4GB RAM
    return cores < 4 || memory < 4;
}

/**
 * Optimize images by adding loading="lazy" and decoding="async"
 */
export function optimizeImage(img: HTMLImageElement): void {
    img.loading = 'lazy';
    img.decoding = 'async';
}






