
import 'cordova-plugin-purchase';
import { Capacitor } from '@capacitor/core';


export const PRODUCTS = {
    LIGHT_MONTHLY: {
        id: 'light_monthly',
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: Capacitor.getPlatform() === 'ios' ? CdvPurchase.Platform.APPLE_APPSTORE : CdvPurchase.Platform.GOOGLE_PLAY,
    },
    GOLD_MONTHLY: {
        id: 'gold_monthly',
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: Capacitor.getPlatform() === 'ios' ? CdvPurchase.Platform.APPLE_APPSTORE : CdvPurchase.Platform.GOOGLE_PLAY,
    },
    BUSINESS_MONTHLY: {
        id: 'business_monthly',
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: Capacitor.getPlatform() === 'ios' ? CdvPurchase.Platform.APPLE_APPSTORE : CdvPurchase.Platform.GOOGLE_PLAY,
    }
};

export function getStore() {
    // Check if CdvPurchase is available
    if (typeof window !== 'undefined' && window.CdvPurchase) {
        // Ensure store exists
        if (!window.CdvPurchase.store) {
            console.warn('CdvPurchase.store not initialized yet');
            return null;
        }
        return window.CdvPurchase.store;
    }
    console.warn('CdvPurchase not available. Are you running on a device?');
    return null;
}

export function initializePurchases() {
    const store = getStore();
    if (!store) return;

    // Register products
    store.register([
        PRODUCTS.LIGHT_MONTHLY,
        PRODUCTS.GOLD_MONTHLY,
        PRODUCTS.BUSINESS_MONTHLY
    ]);

    // Setup logging for debugging
    store.verbosity = CdvPurchase.LogLevel.INFO;

    // Refresh to get product details (price, etc.) from Google/Apple
    const platform = Capacitor.getPlatform() === 'ios' ? CdvPurchase.Platform.APPLE_APPSTORE : CdvPurchase.Platform.GOOGLE_PLAY;
    store.initialize([
        platform
    ]).then(() => {
        console.log('Store initialized for platform:', platform);
    }).catch(err => {
        console.error('Store initialization failed', err);
    });
}



export async function restorePurchases(): Promise<string[]> {
    const store = getStore();
    if (!store) {
        throw new Error('Store not available');
    }

    return new Promise((resolve, reject) => {
        const ownedProducts: string[] = [];
        let completed = false;

        // Set a timeout
        const timeout = setTimeout(() => {
            if (!completed) {
                completed = true;
                resolve(ownedProducts);
            }
        }, 5000);

        store.ready(() => {
            if (completed) return;

            const products = [
                PRODUCTS.LIGHT_MONTHLY.id,
                PRODUCTS.GOLD_MONTHLY.id,
                PRODUCTS.BUSINESS_MONTHLY.id
            ];

            products.forEach(id => {
                const product = store.get(id);
                if (product && product.owned) {
                    ownedProducts.push(id);
                }
            });

            completed = true;
            clearTimeout(timeout);
            resolve(ownedProducts);
        });

        store.refresh();
    });
}
