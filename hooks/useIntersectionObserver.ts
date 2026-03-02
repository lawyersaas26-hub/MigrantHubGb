import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Custom hook for Intersection Observer API
 * Useful for lazy loading images and triggering animations when elements come into view
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
    options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;
    const elementRef = useRef<T>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
                if (entry.isIntersecting && triggerOnce) {
                    observer.unobserve(element);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [elementRef, isIntersecting];
}






