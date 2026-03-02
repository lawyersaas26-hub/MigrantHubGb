import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Loader2, CreditCard, Shield, Lock, Sparkles, Crown, Briefcase } from 'lucide-react';
import { useTranslations } from '../context/LanguageContext';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { supabase } from '../lib/supabase';
import { getCurrentUserProfile } from '../lib/userAuth';
import { getStore, PRODUCTS } from '../utils/purchases';
import 'cordova-plugin-purchase';

const Payment: React.FC = () => {
    const { planType } = useParams<{ planType: 'light' | 'gold' | 'business' }>();
    const navigate = useNavigate();
    const { language } = useTranslations();
    const isRTL = language === 'ku' || language === 'ar';
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Plan details
    const planDetails = {
        light: {
            id: 'light_monthly',
            price: '£6.99',
            name: language === 'ku' ? 'Light' : language === 'ar' ? 'لايت' : 'Light',
            icon: Sparkles,
            features: [
                language === 'ku' ? 'دەستگەیشتن بە هەموو سەرچاوەکان' : language === 'ar' ? 'الوصول إلى جميع الموارد' : 'Access to all resources',
                language === 'ku' ? 'گەڕان بە دوای سەرچاوەکان' : language === 'ar' ? 'البحث عن الموارد' : 'Search functionality',
                language === 'ku' ? 'دڵخوازەکان' : language === 'ar' ? 'المفضلة' : 'Favorites',
                language === 'ku' ? 'زانیاری کۆچکردن' : language === 'ar' ? 'معلومات الهجرة' : 'Immigration information',
            ]
        },
        gold: {
            id: 'gold_monthly',
            price: '£19.99',
            name: language === 'ku' ? 'Gold' : language === 'ar' ? 'جولد' : 'Gold',
            icon: Crown,
            features: [
                language === 'ku' ? 'هەموو تایبەتمەندیەکانی Light' : language === 'ar' ? 'جميع ميزات Light' : 'All Light features',
                language === 'ku' ? 'دەستگەیشتن بە لیستی کارەکان' : language === 'ar' ? 'الوصول إلى قائمة الوظائف' : 'Access to job listings',
                language === 'ku' ? 'دەستگەیشتن بە لیستی پارێزه‌رکان' : language === 'ar' ? 'الوصول إلى قائمة المحامين' : 'Access to lawyers list',
                language === 'ku' ? 'دەستگەیشتن بە لیستی ژمێریارەکان' : language === 'ar' ? 'الوصول إلى قائمة المحاسبين' : 'Access to accountants list',
                language === 'ku' ? 'دەستگەیشتن بە لیستی مامۆستاکانی شۆفێری' : language === 'ar' ? 'الوصول إلى قائمة مدرسي القيادة' : 'Access to driving instructors',
                language === 'ku' ? 'دەستگەیشتن بە لیستی ئۆتۆمبێلەکان' : language === 'ar' ? 'الوصول إلى قائمة السيارات' : 'Access to car listings',
            ]
        },
        business: {
            id: 'business_monthly',
            price: '£39.99',
            name: language === 'ku' ? 'Business' : language === 'ar' ? 'بيزنس' : 'Business',
            icon: Briefcase,
            features: [
                language === 'ku' ? 'هەموو تایبەتمەندیەکانی Gold' : language === 'ar' ? 'جميع ميزات Gold' : 'All Gold features',
                language === 'ku' ? 'زیادکردنی کار' : language === 'ar' ? 'إضافة وظيفة' : 'Post job listings',
                language === 'ku' ? 'زیادکردنی ئۆتۆمبێل' : language === 'ar' ? 'إضافة سيارة' : 'Post car listings',
                language === 'ku' ? 'زیادکردنی پارێزه‌ر' : language === 'ar' ? 'إضافة محامي' : 'Add lawyer listing',
                language === 'ku' ? 'زیادکردنی ژمێریار' : language === 'ar' ? 'إضافة محاسب' : 'Add accountant listing',
                language === 'ku' ? 'زیادکردنی دەستەی گەشت' : language === 'ar' ? 'إضافة وكيل سفر' : 'Add travel agent listing',
                language === 'ku' ? 'یارمەتی تایبەت' : language === 'ar' ? 'دعم مخصص' : 'Priority support',
                language === 'ku' ? 'بێ سنوور زیادکردن' : language === 'ar' ? 'إضافات غير محدودة' : 'Unlimited listings',
            ]
        }
    };

    const currentPlan = planType ? planDetails[planType] : null;
    const PlanIcon = currentPlan?.icon || Sparkles;

    useEffect(() => {
        checkUser();
        
        // Also listen for auth changes to update user
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                await checkUser();
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        try {
            const profile = await getCurrentUserProfile();
            setUser(profile);
            console.log('User loaded:', profile?.id, 'Subscription:', profile?.subscription_plan);
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    const handlePurchase = async () => {
        if (!currentPlan || !user) {
            setError(language === 'ku' ? 'تکایە چوونەژوورەوە بکە' : language === 'ar' ? 'يرجى تسجيل الدخول' : 'Please sign in first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (Capacitor.isNativePlatform()) {
                // For native platforms (Android/iOS), use in-app purchases
                await handleNativePurchase();
            } else {
                // For web, simulate purchase (for testing)
                await handleWebPurchase();
            }
        } catch (err: any) {
            console.error('Purchase error:', err);
            setError(err.message || (language === 'ku' ? 'پارەدان سەرکەوتوو نەبوو' : language === 'ar' ? 'فشل الدفع' : 'Purchase failed. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            const setupListeners = async () => {
                // Wait for CdvPurchase to be available on window
                let retries = 0;
                let Store: any = null;
                
                // Wait for window.CdvPurchase to be available
                while (retries < 20) {
                    if (typeof window !== 'undefined' && (window as any).CdvPurchase?.store) {
                        Store = (window as any).CdvPurchase.store;
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));
                    retries++;
                }

                if (!Store) {
                    console.error('Store not available after retries. window.CdvPurchase:', (window as any).CdvPurchase);
                    return;
                }

                // Register products first
                try {
                    if (Store.register && typeof Store.register === 'function') {
                        Store.register([
                            PRODUCTS.LIGHT_MONTHLY,
                            PRODUCTS.GOLD_MONTHLY,
                            PRODUCTS.BUSINESS_MONTHLY
                        ]);
                    }
                } catch (err) {
                    console.error('Error registering products:', err);
                }

                // Ensure store is initialized
                if (!Store.isReady && Store.initialize && typeof Store.initialize === 'function') {
                    try {
                        await Store.initialize([CdvPurchase.Platform.GOOGLE_PLAY]);
                    } catch (err) {
                        console.error('Error initializing store:', err);
                        return;
                    }
                }

                // Wait for store to be ready before setting up listeners
                if (Store.ready && typeof Store.ready === 'function') {
                    await new Promise<void>((resolve) => {
                        if (Store.isReady) {
                            resolve();
                            return;
                        }
                        Store.ready(() => {
                            resolve();
                        });
                        // Timeout after 5 seconds
                        setTimeout(() => resolve(), 5000);
                    });
                }

                // Setup listeners for all approved transactions and receipt updates
                // Try accessing when() method - it should exist after initialization
                try {
                    // Define the callback function first
                    const handleApprovedTransaction = async (transaction: any) => {
                        console.log('Transaction approved:', transaction);
                        // Transactions have a products array, get the first product ID
                        const productId = transaction.products && transaction.products.length > 0 
                            ? transaction.products[0].id 
                            : null;
                        const plans = ['light_monthly', 'gold_monthly', 'business_monthly'];
                        
                        // Only process if it's one of our subscription plans
                        if (productId && plans.includes(productId)) {
                            console.log('Processing approved transaction for:', productId);
                            // Ensure user is loaded before saving
                            if (!user || !user.id) {
                                console.log('User not loaded, loading now...');
                                await checkUser();
                                // Wait a bit for user to be set
                                await new Promise(resolve => setTimeout(resolve, 500));
                            }
                            // Save to database FIRST, then acknowledge
                            // This ensures we have the subscription saved before acknowledging
                            try {
                                await saveSubscriptionToDatabase(transaction);
                                // Only acknowledge after successful save
                                if (typeof transaction.finish === 'function') {
                                    console.log('Acknowledging transaction after successful save...');
                                    await transaction.finish();
                                    console.log('Transaction acknowledged successfully');
                                }
                            } catch (error) {
                                console.error('Error saving subscription, not acknowledging:', error);
                                // Don't acknowledge if save failed
                            }
                        } else {
                            console.log('Transaction productId not in plans:', productId);
                        }
                    };

                    // Also listen for receipt updates (purchases might come through here)
                    const handleReceiptUpdated = async (receipt: any) => {
                        console.log('Receipt updated:', receipt);
                        if (receipt && receipt.transactions && receipt.transactions.length > 0) {
                            // Use for...of loop to properly handle async/await
                            for (const transaction of receipt.transactions) {
                                const productId = transaction.products && transaction.products.length > 0 
                                    ? transaction.products[0].id 
                                    : null;
                                const plans = ['light_monthly', 'gold_monthly', 'business_monthly'];
                                
                                const txState = transaction.state || (transaction as any).transactionState;
                                const isApproved = txState === 'approved' || 
                                                   txState === 'APPROVED' || 
                                                   txState === CdvPurchase.TransactionState.APPROVED;
                                
                                if (productId && plans.includes(productId) && isApproved) {
                                    console.log('Found approved transaction in receipt update:', productId, 'State:', txState);
                                    // Save to database FIRST, then acknowledge
                                    try {
                                        await saveSubscriptionToDatabase(transaction);
                                        // Only acknowledge after successful save
                                        if (typeof transaction.finish === 'function') {
                                            console.log('Acknowledging transaction after successful save...');
                                            await transaction.finish();
                                            console.log('Transaction acknowledged successfully');
                                        }
                                    } catch (error) {
                                        console.error('Error saving subscription, not acknowledging:', error);
                                        // Don't acknowledge if save failed
                                    }
                                }
                            }
                        }
                    };
                    
                    // Check if when method exists
                    if (!Store.when) {
                        console.error('Store.when does not exist. Store type:', typeof Store);
                        console.error('Store constructor:', Store.constructor?.name);
                        console.error('Available methods:', Object.getOwnPropertyNames(Store).filter(name => typeof Store[name] === 'function'));
                        
                        // Try alternative: check if store has a different structure
                        // Sometimes the store might be accessed differently
                        const storeAlt = (window as any).CdvPurchase?.Store ? new (window as any).CdvPurchase.Store() : null;
                        if (storeAlt && typeof storeAlt.when === 'function') {
                            console.log('Using alternative store instance');
                            storeAlt.when().approved(handleApprovedTransaction);
                            return;
                        }
                        
                        // Last resort: try to access approvedCallbacks directly if available
                        if ((Store as any).approvedCallbacks && typeof (Store as any).approvedCallbacks.push === 'function') {
                            console.log('Using approvedCallbacks directly');
                            (Store as any).approvedCallbacks.push(handleApprovedTransaction);
                            return;
                        }
                        
                        console.error('Could not set up approved listener - when() method not available');
                        return;
                    }
                    
                    if (typeof Store.when !== 'function') {
                        console.error('Store.when is not a function:', typeof Store.when, Store.when);
                        return;
                    }
                    
                    // Call when() and set up the approved callback and receipt updated callback
                    try {
                        const whenResult = Store.when();
                        if (!whenResult) {
                            console.error('Store.when() returned null/undefined');
                            return;
                        }
                        
                        // Set up approved listener
                        if (typeof whenResult.approved === 'function') {
                            whenResult.approved(handleApprovedTransaction);
                            console.log('Successfully set up approved listener via Store.when()');
                        } else {
                            console.error('whenResult.approved is not a function. whenResult:', whenResult);
                        }

                        // Also listen for receipt updates
                        if (typeof whenResult.receiptUpdated === 'function') {
                            whenResult.receiptUpdated(handleReceiptUpdated);
                            console.log('Successfully set up receiptUpdated listener');
                        }

                        // Listen for initiated transactions too (they become approved after refresh)
                        if (typeof whenResult.initiated === 'function') {
                            whenResult.initiated((transaction: any) => {
                                console.log('Transaction initiated:', transaction);
                                // After initiation, refresh to get the approved state
                                setTimeout(() => {
                                    Store.update().catch((err: any) => {
                                        console.error('Error updating store after initiation:', err);
                                    });
                                }, 1000);
                            });
                        }
                    } catch (whenErr: any) {
                        console.error('Error calling Store.when():', whenErr);
                        console.error('Error details:', whenErr.message, whenErr.stack);
                    }
                } catch (err: any) {
                    console.error('Error setting up approved listener:', err);
                    console.error('Error stack:', err.stack);
                }
            };

            // Wait for app to be ready, then setup listeners
            const initListeners = async () => {
                // Wait a bit for Capacitor to initialize
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Check if we're on a native platform and plugin is available
                if (Capacitor.isNativePlatform()) {
                    // Try to access the store directly
                    const checkStore = () => {
                        if (typeof window !== 'undefined' && (window as any).CdvPurchase?.store) {
                            setupListeners();
                        } else {
                            // Retry after a delay
                            setTimeout(checkStore, 500);
                        }
                    };
                    checkStore();
                }
            };
            
            initListeners();
        }
    }, []);

    const handleNativePurchase = async () => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const Store = getStore();
                if (!Store) {
                    reject(new Error('Store not available'));
                    return;
                }

                const productId = currentPlan!.id;

                // Register products first (in case they weren't registered yet)
                try {
                    Store.register([
                        PRODUCTS.LIGHT_MONTHLY,
                        PRODUCTS.GOLD_MONTHLY,
                        PRODUCTS.BUSINESS_MONTHLY
                    ]);
                } catch (regErr) {
                    console.warn('Products may already be registered:', regErr);
                }

                // Ensure store is initialized
                if (!Store.isReady) {
                    try {
                        await Store.initialize([CdvPurchase.Platform.GOOGLE_PLAY]);
                    } catch (initErr: any) {
                        reject(new Error(`Failed to initialize store: ${initErr.message}`));
                        return;
                    }
                }

                // Wait for store to be ready and products to be loaded
                await new Promise<void>((readyResolve, readyReject) => {
                    if (Store.isReady) {
                        readyResolve();
                        return;
                    }
                    
                    Store.ready(() => {
                        readyResolve();
                    });

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        readyReject(new Error('Store initialization timeout'));
                    }, 10000);
                });

                // Get the product
                const product = Store.get(productId);
                if (!product) {
                    reject(new Error(`Product ${productId} not found. Make sure it's registered in Google Play Console.`));
                    return;
                }

                // Check if product can be purchased
                if (!product.canPurchase) {
                    reject(new Error(`Product ${productId} cannot be purchased. It may already be owned.`));
                    return;
                }

                // Get the best offer (first offer or default)
                const offer = product.getOffer();
                if (!offer) {
                    reject(new Error(`No offer available for product ${productId}`));
                    return;
                }

                // Initiate purchase using offer.order()
                try {
                    const orderResult = await offer.order();
                    if (orderResult) {
                        // orderResult is an error if present
                        reject(new Error(`Purchase failed: ${orderResult.message || 'Unknown error'}`));
                        return;
                    }

                    console.log('Purchase order initiated successfully');

                    // After purchase, refresh the store to detect the new purchase
                    // This is important because Google Play might not immediately trigger the approved callback
                    // Try multiple times with increasing delays
                    const checkPurchase = async (attempt: number = 1) => {
                        try {
                            console.log(`Checking purchase (attempt ${attempt})...`);
                            
                            // Ensure user is loaded
                            let currentUser = user;
                            if (!currentUser || !currentUser.id) {
                                console.log('User not loaded, reloading...');
                                currentUser = await getCurrentUserProfile();
                                if (currentUser) {
                                    setUser(currentUser);
                                }
                                if (!currentUser || !currentUser.id) {
                                    if (attempt < 5) {
                                        setTimeout(() => checkPurchase(attempt + 1), 1000);
                                    }
                                    return;
                                }
                            }

                            // Refresh store
                            await Store.update();
                            console.log('Store updated, checking for owned products...');
                            
                            // Wait a bit for receipts to load
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            // Check if the product is now owned
                            const purchasedProduct = Store.get(productId);
                            console.log('Product check:', { 
                                productId, 
                                found: !!purchasedProduct, 
                                owned: purchasedProduct?.owned,
                                canPurchase: purchasedProduct?.canPurchase 
                            });
                            
                            if (purchasedProduct && purchasedProduct.owned) {
                                console.log('Product is now owned, saving to database...');
                                // Get the transaction from the receipts
                                const receipts = Store.localReceipts || [];
                                console.log('Local receipts:', receipts.length);
                                
                                for (const receipt of receipts) {
                                    if (receipt.platform === CdvPurchase.Platform.GOOGLE_PLAY) {
                                        const transactions = receipt.transactions || [];
                                        console.log('Receipt transactions:', transactions.length);
                                        
                                        for (const transaction of transactions) {
                                            const txProductId = transaction.products && transaction.products.length > 0 
                                                ? transaction.products[0].id 
                                                : null;
                                            const txState = transaction.state || (transaction as any).transactionState;
                                            
                                            console.log('Transaction check:', { 
                                                txProductId, 
                                                productId, 
                                                matches: txProductId === productId,
                                                state: txState,
                                                isApproved: txState === 'approved' || txState === 'APPROVED' || txState === CdvPurchase.TransactionState.APPROVED
                                            });
                                            
                                            if (txProductId === productId && 
                                                (txState === 'approved' || 
                                                 txState === 'APPROVED' || 
                                                 txState === CdvPurchase.TransactionState.APPROVED ||
                                                 txState === 'INITIATED')) {
                                                console.log('Found matching transaction, saving...');
                                                // Save to database FIRST, then acknowledge
                                                try {
                                                    await saveSubscriptionToDatabase(transaction);
                                                    // Only acknowledge after successful save
                                                    if (typeof transaction.finish === 'function') {
                                                        console.log('Acknowledging transaction after successful save...');
                                                        await transaction.finish();
                                                        console.log('Transaction acknowledged successfully');
                                                    }
                                                } catch (error) {
                                                    console.error('Error saving subscription, not acknowledging:', error);
                                                    // Don't acknowledge if save failed
                                                }
                                                return; // Exit the function
                                            }
                                        }
                                    }
                                }
                                
                                // If we didn't find a transaction but product is owned, save subscription directly
                                if (attempt >= 2 && purchasedProduct.owned && currentUser && currentUser.id) {
                                    console.log('Product is owned but no transaction found, creating subscription record directly...');
                                    const mockTransaction = {
                                        products: [{ id: productId }],
                                        id: `owned_${productId}_${Date.now()}`,
                                        state: 'approved',
                                        productId: productId
                                    };
                                    // Temporarily set user for saveSubscriptionToDatabase
                                    const originalUser = user;
                                    setUser(currentUser);
                                    await saveSubscriptionToDatabase(mockTransaction);
                                    return;
                                }
                            }
                            
                            // Retry if not found yet
                            if (attempt < 5) {
                                setTimeout(() => checkPurchase(attempt + 1), 2000);
                            } else {
                                console.error('Purchase not detected after 5 attempts');
                                setError('Purchase completed but could not be verified. Please contact support or try restoring purchases.');
                            }
                        } catch (updateErr: any) {
                            console.error(`Error checking purchase (attempt ${attempt}):`, updateErr);
                            if (attempt < 5) {
                                setTimeout(() => checkPurchase(attempt + 1), 2000);
                            }
                        }
                    };
                    
                    // Start checking after 2 seconds
                    setTimeout(() => checkPurchase(1), 2000);

                    // The approved listener will handle the rest
                    // We resolve here to allow the UI to continue
                    // The actual success is handled by the approved callback or the refresh check above
                    resolve();
                } catch (orderErr: any) {
                    reject(new Error(`Failed to initiate purchase: ${orderErr.message}`));
                }

            } catch (error: any) {
                reject(error);
            }
        });
    };

    const saveSubscriptionToDatabase = async (transaction: any) => {
        console.log('saveSubscriptionToDatabase called with transaction:', transaction);
        
        // Ensure user is loaded
        let currentUser = user;
        if (!currentUser || !currentUser.id) {
            console.log('User not loaded, loading now...');
            currentUser = await getCurrentUserProfile();
            // Wait a bit for user to be set
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (!currentUser || !currentUser.id) {
                console.error('User still not available after reload. Cannot save subscription.');
                setError('User session expired. Please sign in again.');
                return;
            }
        }
        
        console.log('User confirmed:', currentUser.id);

        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now

        // Get receipt/transaction ID - try multiple possible fields
        const receipt = transaction.id ||
            transaction.transactionIdentifier ||
            transaction.transaction?.id ||
            transaction.transaction?.transactionIdentifier ||
            transaction.purchaseToken ||
            transaction.orderId ||
            transaction.productId ||
            JSON.stringify(transaction);
        
        // Get productId from transaction - it might be in products array or as a direct property
        const productId = (transaction.products && transaction.products.length > 0 
            ? transaction.products[0].id 
            : null) || (transaction as any).productId || currentPlan!.id;
        
        console.log('Saving subscription:', { productId, receipt, userId: currentUser.id });

        try {
            // STEP 1: Ensure user profile exists in user_profiles table
            const { data: existingProfile, error: profileCheckError } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', currentUser.id)
                .maybeSingle();

            if (profileCheckError && profileCheckError.code !== 'PGRST116') {
                console.error('Error checking profile:', profileCheckError);
            }

            if (!existingProfile) {
                console.log('User profile not found, creating one...');
                // Create user profile if it doesn't exist
                const { error: createProfileError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: currentUser.id,
                        email: currentUser.email || '',
                        full_name: currentUser.full_name || null,
                        avatar_url: currentUser.avatar_url || null,
                        subscription_plan: null,
                        subscription_status: 'inactive',
                    });

                if (createProfileError) {
                    console.error('Error creating user profile:', createProfileError);
                    // Try to continue anyway - profile might exist but query failed
                } else {
                    console.log('User profile created successfully');
                }
            }

            // STEP 2: Save subscription to user_subscriptions table
            const { error: subError, data: subData } = await supabase
                .from('user_subscriptions')
                .upsert({
                    user_id: currentUser.id,
                    plan_type: productId,
                    status: 'active',
                    receipt: receipt,
                    purchase_date: new Date().toISOString(),
                    expires_at: expiresAt.toISOString(),
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id'
                });

            if (subError) {
                console.error('Error saving subscription:', subError);
                throw new Error(subError.message);
            }

            console.log('Subscription saved successfully to user_subscriptions:', subData);

            // STEP 3: Update user profile with subscription info
            const { error: profileError, data: profileData } = await supabase
                .from('user_profiles')
                .update({
                    subscription_plan: productId,
                    subscription_status: 'active',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', currentUser.id)
                .select();

            if (profileError) {
                console.error('Error updating profile:', profileError);
                // Retry once after a short delay
                setTimeout(async () => {
                    await supabase
                        .from('user_profiles')
                        .update({
                            subscription_plan: productId,
                            subscription_status: 'active',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', currentUser.id);
                }, 1000);
            } else {
                console.log('Profile updated successfully in user_profiles:', profileData);
                // Update local user state
                setUser(profileData?.[0] || currentUser);
            }

            setSuccess(true);

            // Refresh user profile to update UI
            await checkUser();

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/account?subscription=success');
            }, 2000);
        } catch (error: any) {
            console.error('Error in saveSubscriptionToDatabase:', error);
            setError(error.message || 'Failed to save subscription. Please contact support.');
        }
    };

    const handleWebPurchase = async () => {
        // Simulate purchase processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // STEP 1: Ensure user profile exists
        const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

        if (!existingProfile) {
            console.log('User profile not found, creating one...');
            await supabase
                .from('user_profiles')
                .insert({
                    id: user.id,
                    email: user.email || '',
                    full_name: user.full_name || null,
                    avatar_url: user.avatar_url || null,
                    subscription_plan: null,
                    subscription_status: 'inactive',
                });
        }

        // STEP 2: Update user subscription in user_subscriptions table
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now

        const { error: subError } = await supabase
            .from('user_subscriptions')
            .upsert({
                user_id: user.id,
                plan_type: currentPlan!.id,
                status: 'active',
                purchase_date: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (subError) {
            throw new Error(subError.message);
        }

        console.log('Subscription saved successfully to user_subscriptions');

        // STEP 3: Update user profile with subscription info
        const { error: profileError } = await supabase
            .from('user_profiles')
            .update({
                subscription_plan: currentPlan!.id,
                subscription_status: 'active',
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (profileError) {
            console.error('Error updating profile:', profileError);
        }

        setSuccess(true);

        // Redirect after 2 seconds
        setTimeout(() => {
            navigate('/account?subscription=success');
        }, 2000);
    };

    if (!currentPlan) {
        return (
            <div className="px-5 py-8">
                <div className="flex items-center gap-4 mb-6 pt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 active:bg-slate-100 dark:active:bg-slate-700 rounded-xl transition-all duration-200 active:scale-95"
                    >
                        <BackIcon size={22} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {language === 'ku' ? 'پلان نەدۆزرایەوە' : language === 'ar' ? 'الخطة غير موجودة' : 'Plan not found'}
                    </h1>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400">
                        {language === 'ku' ? 'پلانی هەڵبژێردراو دەستنیشان نەکراوە' : language === 'ar' ? 'الخطة المحددة غير موجودة' : 'The selected plan was not found'}
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="px-5 py-8">
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                        <Check size={40} className="text-green-600 dark:text-green-400" strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                        {language === 'ku' ? 'پارەدان سەرکەوتوو بوو!' : language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xs leading-relaxed">
                        {language === 'ku'
                            ? 'بەشداریکردنەکەت چالاک کرا'
                            : language === 'ar'
                                ? 'تم تفعيل اشتراكك'
                                : 'Your subscription has been activated'
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-5 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 active:bg-slate-100 dark:active:bg-slate-700 rounded-xl transition-all duration-200 active:scale-95"
                >
                    <BackIcon size={22} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {language === 'ku' ? 'پارەدان' : language === 'ar' ? 'الدفع' : 'Payment'}
                </h1>
            </div>

            {/* Plan Summary Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <PlanIcon size={32} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {currentPlan.name} {language === 'ku' ? 'پلان' : language === 'ar' ? 'خطة' : 'Plan'}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {language === 'ku' ? 'بەشداریکردنی مانگانە' : language === 'ar' ? 'اشتراك شهري' : 'Monthly subscription'}
                        </p>
                    </div>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                            {currentPlan.price}
                        </p>
                        <span className="text-lg text-slate-600 dark:text-slate-400">
                            {language === 'ku' ? '/مانگ' : language === 'ar' ? '/شهر' : '/month'}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {language === 'ku'
                            ? 'بە شێوەیەکی خۆکار نوێ دەکرێتەوە'
                            : language === 'ar'
                                ? 'يتم التجديد تلقائيا'
                                : 'Auto-renews monthly'
                        }
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                        {language === 'ku' ? 'تایبەتمەندیەکان:' : language === 'ar' ? 'الميزات:' : 'Features:'}
                    </h3>
                    {currentPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <Check size={20} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <Shield size={18} className="text-green-600 dark:text-green-400" strokeWidth={2.5} />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                        {language === 'ku'
                            ? 'پارەدانی ئاسوودە و پارێزراو'
                            : language === 'ar'
                                ? 'دفع آمن ومحمي'
                                : 'Secure and protected payment'
                        }
                    </span>
                </div>

                {/* Payment Button */}
                {!user ? (
                    <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                            {language === 'ku'
                                ? 'تکایە چوونەژوورەوە بکە بۆ بەشداریکردن'
                                : language === 'ar'
                                    ? 'يرجى تسجيل الدخول للاشتراك'
                                    : 'Please sign in to subscribe'
                            }
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                        >
                            {language === 'ku' ? 'چوونەژوورەوە' : language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handlePurchase}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>
                                    {language === 'ku' ? 'پارەدان...' : language === 'ar' ? 'جارٍ الدفع...' : 'Processing...'}
                                </span>
                            </>
                        ) : (
                            <>
                                <CreditCard size={20} />
                                <span>
                                    {language === 'ku' ? 'پارەدان' : language === 'ar' ? 'الدفع الآن' : 'Pay Now'}
                                </span>
                            </>
                        )}
                    </button>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                    </div>
                )}

                {Capacitor.isNativePlatform() && (
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
                        {language === 'ku'
                            ? 'پارەدان لە ڕێگەی Google Play دەکرێت'
                            : language === 'ar'
                                ? 'سيتم الدفع عبر Google Play'
                                : 'Payment will be processed through Google Play'
                        }
                    </p>
                )}
            </div>

            {/* Terms and Info */}
            <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        <Lock size={18} className="text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                {language === 'ku' ? 'مەرجەکان' : language === 'ar' ? 'الشروط' : 'Terms'}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {language === 'ku'
                                    ? 'بە پارەدان، تۆ ڕازیت بە مەرجەکانی بەکارهێنان. بەشداریکردنەکەت بە شێوەیەکی خۆکار نوێ دەکرێتەوە هەر مانگێک. دەتوانیت لە هەر کاتێکدا هەڵوەشێنیتەوە.'
                                    : language === 'ar'
                                        ? 'بالدفع، أنت توافق على شروط الاستخدام. سيتم تجديد اشتراكك تلقائيا كل شهر. يمكنك الإلغاء في أي وقت.'
                                        : 'By paying, you agree to our terms of service. Your subscription will auto-renew monthly. You can cancel anytime.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    <p>
                        {language === 'ku'
                            ? 'پارەدانەکان لە ڕێگەی Google Play Billing دەکرێن (بۆ ئەندرۆید)'
                            : language === 'ar'
                                ? 'يتم الدفع عبر Google Play Billing (لـ Android)'
                                : 'Payments are processed through Google Play Billing (for Android)'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;

