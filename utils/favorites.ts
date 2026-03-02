import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { supabase, type Resource, type Topic } from '../lib/supabase';
import { stripHtml } from './htmlUtils';

export type FavoriteType = 'resource' | 'topic' | 'job' | 'car' | 'lawyer' | 'accountant' | 'travel_agent' | 'business' | 'driving_instructor' | 'home';

export interface FavoriteItem {
    id: string;
    type: FavoriteType;
    resource_id?: string; // For resources
    topic_id?: string; // For topics
    item_id?: string; // Generic ID for other types
    category_id?: string; // Optional for non-resource/topic items
    title: string;
    description: string | null;
    slug: string | null;
    external_link: string | null;
    phone: string | null;
    email: string | null;
    source: string | null;
    added_at: string;
    // Extra fields for specific types
    location?: string;
    price?: string;
    image_url?: string;
}

const FAVORITES_KEY = 'app_favorites';

// Helper: Get user ID if authenticated
async function getUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
}

// Get favorites from appropriate storage
async function getStoredFavorites(): Promise<FavoriteItem[]> {
    try {
        const userId = await getUserId();

        if (userId) {
            // Fetch from Supabase
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', userId);

            if (!error && data) {
                // Map Supabase rows to FavoriteItem
                return data.map((row: any) => {
                    // If details is a string, parse it, otherwise use it as object
                    const details = typeof row.details === 'string' ? JSON.parse(row.details) : row.details;

                    return {
                        ...details,
                        // Ensure critical fields are set from the row columns if missing in details
                        type: row.type || details.type || 'resource',
                        item_id: row.item_id || details.item_id || details.resource_id || details.topic_id,
                        // added_at from row creation time if available
                        added_at: row.created_at || details.added_at || new Date().toISOString()
                    };
                });
            } else {
                console.warn('Error fetching favorites from Supabase, falling back to local:', error);
            }
        }

        // Fallback to local storage
        if (Capacitor.isNativePlatform()) {
            const { value } = await Preferences.get({ key: FAVORITES_KEY });
            return value ? JSON.parse(value) : [];
        } else {
            const stored = localStorage.getItem(FAVORITES_KEY);
            return stored ? JSON.parse(stored) : [];
        }
    } catch (error) {
        console.error('Error reading favorites:', error);
        return [];
    }
}

// Save favorites to storage
async function saveFavorites(favorites: FavoriteItem[]): Promise<void> {
    try {
        // Always save to local storage as cache/backup
        const favoritesJson = JSON.stringify(favorites);
        if (Capacitor.isNativePlatform()) {
            await Preferences.set({ key: FAVORITES_KEY, value: favoritesJson });
        } else {
            localStorage.setItem(FAVORITES_KEY, favoritesJson);
        }
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

// Add a single favorite to Supabase
async function addFavoriteToSupabase(item: FavoriteItem): Promise<void> {
    const userId = await getUserId();
    if (!userId) return;

    // determine definitive item_id
    const itemId = item.item_id || item.resource_id || item.topic_id;
    if (!itemId) return;

    // Construct the payload
    const details = { ...item };

    const { error } = await supabase
        .from('favorites')
        .upsert({
            user_id: userId,
            type: item.type,
            item_id: itemId,
            details: details,
            created_at: new Date().toISOString()
        }, { onConflict: 'user_id,type,item_id' });

    if (error) {
        console.error('Error adding favorite to Supabase:', error);
    }
}

// Remove a single favorite from Supabase
async function removeFavoriteFromSupabase(itemId: string, type?: string): Promise<void> {
    const userId = await getUserId();
    if (!userId) return;

    let query = supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);

    if (type) {
        query = query.eq('type', type);
    }

    const { error } = await query;

    if (error) {
        console.error('Error removing favorite from Supabase:', error);
    }
}

// Check if a resource is favorited
export async function isFavorite(resourceId: string): Promise<boolean> {
    const favorites = await getStoredFavorites();
    return favorites.some(fav => fav.resource_id === resourceId && fav.type === 'resource');
}

// Check if a topic is favorited
export async function isTopicFavorite(topicId: string): Promise<boolean> {
    const favorites = await getStoredFavorites();
    return favorites.some(fav => fav.topic_id === topicId && fav.type === 'topic');
}

// Check if a generic item is favorited
export async function isItemFavorite(itemId: string, type: FavoriteType): Promise<boolean> {
    const favorites = await getStoredFavorites();
    return favorites.some(fav => (fav.item_id === itemId || fav.resource_id === itemId || fav.topic_id === itemId) && fav.type === type);
}

// Toggle favorite status for a resource
export async function toggleFavorite(resource: Resource): Promise<boolean> {
    const favorites = await getStoredFavorites();
    const existingIndex = favorites.findIndex(fav => fav.resource_id === resource.id && fav.type === 'resource');

    if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        await saveFavorites(favorites); // Update local
        await removeFavoriteFromSupabase(resource.id, 'resource'); // Update DB
        return false;
    } else {
        // Add to favorites
        const favoriteItem: FavoriteItem = {
            id: `fav_resource_${resource.id}_${Date.now()}`,
            type: 'resource',
            resource_id: resource.id,
            category_id: resource.category_id,
            title: resource.title,
            description: resource.description,
            slug: resource.slug,
            external_link: resource.external_link,
            phone: resource.phone,
            email: resource.email,
            source: resource.source,
            added_at: new Date().toISOString(),
        };
        favorites.push(favoriteItem);
        await saveFavorites(favorites); // Update local
        await addFavoriteToSupabase(favoriteItem); // Update DB
        return true;
    }
}

// Toggle favorite status for a topic
export async function toggleTopicFavorite(topic: Topic, language: 'ku' | 'ar' | 'en' = 'ku'): Promise<boolean> {
    const favorites = await getStoredFavorites();
    const existingIndex = favorites.findIndex(fav => fav.topic_id === topic.id && fav.type === 'topic');

    if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        await saveFavorites(favorites);
        await removeFavoriteFromSupabase(topic.id, 'topic');
        return false;
    } else {
        // Add to favorites
        const rawTitle = language === 'ku' ? topic.title_ku :
            language === 'ar' ? topic.title_ar :
                (topic.title_en || topic.title_ar || topic.title_ku);
        const title = stripHtml(rawTitle || '');

        const favoriteItem: FavoriteItem = {
            id: `fav_topic_${topic.id}_${Date.now()}`,
            type: 'topic',
            topic_id: topic.id,
            category_id: topic.category_id,
            title: title,
            description: null,
            slug: topic.slug,
            external_link: null,
            phone: null,
            email: null,
            source: null,
            added_at: new Date().toISOString(),
        };
        favorites.push(favoriteItem);
        await saveFavorites(favorites);
        await addFavoriteToSupabase(favoriteItem);
        return true;
    }
}

// Toggle favorite for generic items (Jobs, Cars, etc.)
export async function toggleItemFavorite(item: any, type: FavoriteType): Promise<boolean> {
    const favorites = await getStoredFavorites();
    const existingIndex = favorites.findIndex(fav => fav.item_id === item.id && fav.type === type);

    if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        await saveFavorites(favorites);
        await removeFavoriteFromSupabase(item.id, type);
        return false;
    } else {
        // Add to favorites
        const favoriteItem: FavoriteItem = {
            id: `fav_${type}_${item.id}_${Date.now()}`,
            type: type,
            item_id: item.id,
            title: item.title || item.name || '',
            description: item.description || item.bio || null,
            slug: null,
            external_link: item.apply_url || item.website || null,
            phone: item.contact_phone || item.phone || null,
            email: item.apply_email || item.email || null,
            source: item.company || null,
            location: item.location || null,
            price: item.salary || item.price || item.price_per_hour || null,
            added_at: new Date().toISOString(),
        };
        favorites.push(favoriteItem);
        await saveFavorites(favorites);
        await addFavoriteToSupabase(favoriteItem);
        return true;
    }
}

// Get all favorites
export async function getFavorites(): Promise<FavoriteItem[]> {
    return await getStoredFavorites();
}

// Remove a favorite
export async function removeFavorite(resourceId: string): Promise<void> {
    const favorites = await getStoredFavorites();
    const filtered = favorites.filter(fav => fav.resource_id !== resourceId);
    await saveFavorites(filtered);
    await removeFavoriteFromSupabase(resourceId, 'resource');
}

// Remove a favorite topic
export async function removeTopicFavorite(topicId: string): Promise<void> {
    const favorites = await getStoredFavorites();
    const filtered = favorites.filter(fav => fav.topic_id !== topicId);
    await saveFavorites(filtered);
    await removeFavoriteFromSupabase(topicId, 'topic');
}

// Remove generic item favorite
export async function removeItemFavorite(itemId: string): Promise<void> {
    const favorites = await getStoredFavorites();
    // Use best effort to find type from local list before deleting
    const itemToRemove = favorites.find(fav => fav.item_id === itemId);

    const filtered = favorites.filter(fav => fav.item_id !== itemId);
    await saveFavorites(filtered);

    if (itemToRemove) {
        await removeFavoriteFromSupabase(itemId, itemToRemove.type);
    } else {
        await removeFavoriteFromSupabase(itemId);
    }
}

// Clear all favorites
export async function clearFavorites(): Promise<void> {
    await saveFavorites([]);
    // Do not clear from Supabase automatically to avoid accidental data loss via this function
    // unless this function is specifically used for 'Unfavorite All' feature.
}
