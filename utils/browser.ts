import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Opens a URL natively using Capacitor Browser plugin
 * This is the most professional solution:
 * - No iframe blocking issues
 * - No error messages or redirects
 * - Opens immediately in native in-app browser
 * - Works reliably for all websites
 * - iOS: Opens as modal sheet (clean, no address bar initially)
 * - Android: Opens in Chrome Custom Tabs (minimal, professional toolbar)
 */
export async function openLink(url: string, title?: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
        // Use Capacitor Browser plugin - professional, reliable, native
        // Opens immediately without any blocking issues or error messages
        await Browser.open({
            url: url,
            toolbarColor: '#ffffff',
            presentationStyle: 'popover', // iOS: modal sheet, Android: Chrome Custom Tabs
        });
    } else {
        // Web fallback - navigate to webview page for iframe
        const currentUrl = window.location.origin;
        const webViewUrl = `${currentUrl}/webview?url=${encodeURIComponent(url)}${title ? `&title=${encodeURIComponent(title)}` : ''}`;
        window.location.href = webViewUrl;
    }
}

/**
 * Open link using React Router navigation (for WebView page approach)
 * Note: This is now primarily for the webview page navigation
 */
export function openLinkWithNavigate(navigate: (path: string) => void, url: string, title?: string): void {
    if (Capacitor.isNativePlatform()) {
        // On native, use Browser plugin directly for best experience
        openLink(url, title);
    } else {
        // On web, navigate to webview page
        const queryParams = new URLSearchParams({ url });
        if (title) {
            queryParams.set('title', title);
        }
        navigate(`/webview?${queryParams.toString()}`);
    }
}

