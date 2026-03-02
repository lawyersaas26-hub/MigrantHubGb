/// <reference types="cordova-plugin-purchase" />

declare interface Window {
    CdvPurchase?: {
        store: CdvPurchase.Store;
        ProductType: typeof CdvPurchase.ProductType;
        Platform: typeof CdvPurchase.Platform;
        LogLevel: typeof CdvPurchase.LogLevel;
    };
}
