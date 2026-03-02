import type { Language } from '../types';
import { 
    getCategories, 
    getResourcesByCategory, 
    getAllResources,
    getTopicsByCategory,
    getAllTopics,
    getDrivingInstructors,
    type CategoryData,
    type Resource as DBResource,
    type Topic,
    type DrivingInstructor
} from '../lib/supabase';
import { stripHtml } from './htmlUtils';

export interface SearchResult {
    type: 'category' | 'resource' | 'topic' | 'instructor';
    categoryId: string;
    categoryLabel: string;
    resource?: {
        id: string;
        title: string;
        description: string | null;
        link?: string | null;
        phone?: string | null;
        email?: string | null;
        slug?: string | null;
    };
    topic?: {
        id: string;
        title: string;
        description: string | null;
        slug: string;
    };
    instructor?: {
        id: string;
        name: string;
        location: string;
        phone: string;
        bio: string | null;
    };
    matchText: string;
}

export async function searchContent(query: string, language: Language): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    try {
        // Get all categories for reference
        const allCategories = await getCategories(language);
        const categoryMap = new Map<string, CategoryData>();
        allCategories.forEach(cat => {
            categoryMap.set(cat.id, cat);
        });

        // Get category name based on language
        const getCategoryName = (cat: CategoryData): string => {
            if (language === 'ku') return cat.name_ku;
            if (language === 'ar') return cat.name_ar;
            return cat.name_en || cat.name_ku;
        };

        const getCategoryDesc = (cat: CategoryData): string => {
            if (language === 'ku') return cat.description_ku || '';
            if (language === 'ar') return cat.description_ar || '';
            return cat.description_en || cat.description_ku || '';
        };

        // 1. Search Categories
        for (const category of allCategories) {
            const categoryName = getCategoryName(category).toLowerCase();
            const categoryDesc = getCategoryDesc(category).toLowerCase();

            if (categoryName.includes(searchTerm) || categoryDesc.includes(searchTerm)) {
                results.push({
                    type: 'category',
                    categoryId: category.id,
                    categoryLabel: getCategoryName(category),
                    matchText: categoryDesc || categoryName,
                });
            }
        }

        // 2. Search Resources
        const allResources = await getAllResources(undefined, language);
        for (const resource of allResources) {
            if (!resource.is_active) continue;

            const title = resource.title.toLowerCase();
            const description = resource.description?.toLowerCase() || '';
            const htmlContent = stripHtml(resource.html_content || '').toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || htmlContent.includes(searchTerm)) {
                const category = categoryMap.get(resource.category_id);
                results.push({
                    type: 'resource',
                    categoryId: resource.category_id,
                    categoryLabel: category ? getCategoryName(category) : 'Unknown',
                    resource: {
                        id: resource.id,
                        title: resource.title,
                        description: resource.description,
                        link: resource.external_link,
                        phone: resource.phone,
                        email: resource.email,
                        slug: resource.slug,
                    },
                    matchText: description || title,
                });
            }
        }

        // 3. Search Topics
        const allTopics = await getAllTopics();
        for (const topic of allTopics) {
            if (!topic.is_active) continue;

            const category = categoryMap.get(topic.category_id);
            if (!category) continue;

            const title = (language === 'ku' ? topic.title_ku : language === 'ar' ? topic.title_ar : topic.title_en || topic.title_ku).toLowerCase();
            const description = (language === 'ku' ? topic.description_ku : language === 'ar' ? topic.description_ar : topic.description_en || topic.description_ku || '').toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                results.push({
                    type: 'topic',
                    categoryId: topic.category_id,
                    categoryLabel: getCategoryName(category),
                    topic: {
                        id: topic.id,
                        title: language === 'ku' ? topic.title_ku : language === 'ar' ? topic.title_ar : topic.title_en || topic.title_ku,
                        description: language === 'ku' ? topic.description_ku : language === 'ar' ? topic.description_ar : topic.description_en,
                        slug: topic.slug,
                    },
                    matchText: description || title,
                });
            }
        }

        // 4. Search Driving Instructors
        const instructors = await getDrivingInstructors({ searchQuery: query });
        for (const instructor of instructors) {
            if (!instructor.is_active) continue;

            results.push({
                type: 'instructor',
                categoryId: '', // Instructors don't belong to a category
                categoryLabel: language === 'ku' ? 'مامۆستای شۆفێری' : language === 'ar' ? 'مدرس قيادة' : 'Driving Instructor',
                instructor: {
                    id: instructor.id,
                    name: instructor.name,
                    location: instructor.location,
                    phone: instructor.phone,
                    bio: instructor.bio,
                },
                matchText: instructor.bio || instructor.name,
            });
        }

        // Sort results by relevance (exact title matches first, then description matches)
        results.sort((a, b) => {
            const aTitle = (a.resource?.title || a.topic?.title || a.instructor?.name || '').toLowerCase();
            const bTitle = (b.resource?.title || b.topic?.title || b.instructor?.name || '').toLowerCase();
            
            const aExactMatch = aTitle === searchTerm;
            const bExactMatch = bTitle === searchTerm;
            
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            
            const aStartsWith = aTitle.startsWith(searchTerm);
            const bStartsWith = bTitle.startsWith(searchTerm);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            return 0;
        });

    } catch (error) {
        console.error('Error searching content:', error);
    }

    return results;
}

