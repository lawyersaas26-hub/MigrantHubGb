import { createClient } from '@supabase/supabase-js';
import { cache } from '../utils/cache';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase URL or Anon Key is missing. Please check your .env file.');
    console.warn('Required variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client (will still work even if URL/key is empty, but API calls will fail)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Resource type matching your database schema
export interface Resource {
    id: string;
    category_id: string;
    language: 'ku' | 'ar' | 'en';
    title: string;
    slug: string | null;
    html_content: string;
    description: string | null;
    external_link: string | null;
    phone: string | null;
    email: string | null;
    source: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Fetch resources by category and language
export async function getResourcesByCategory(
    categoryId: string,
    language: 'ku' | 'ar' | 'en' = 'ku'
): Promise<Resource[]> {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('category_id', categoryId)
            .eq('language', language)
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('title', { ascending: true });

        if (error) {
            console.error('Error fetching resources:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch resources:', error);
        return [];
    }
}

// Fetch a single resource by ID
export async function getResourceById(resourceId: string): Promise<Resource | null> {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', resourceId)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching resource:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch resource:', error);
        return null;
    }
}

// Fetch a resource by category, language, and slug
export async function getResourceBySlug(
    categoryId: string,
    language: 'ku' | 'ar' | 'en',
    slug: string
): Promise<Resource | null> {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('category_id', categoryId)
            .eq('language', language)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching resource by slug:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch resource by slug:', error);
        return null;
    }
}

// ==================== ADMIN FUNCTIONS ====================

// Admin: Get resource by ID (including inactive)
export async function getResourceByIdAdmin(resourceId: string): Promise<Resource | null> {
    try {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', resourceId)
            .single();

        if (error) {
            console.error('Error fetching resource:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch resource:', error);
        return null;
    }
}

// Admin: Get all resources (including inactive)
export async function getAllResources(
    categoryId?: string,
    language?: 'ku' | 'ar' | 'en'
): Promise<Resource[]> {
    try {
        let query = supabase
            .from('resources')
            .select('*');

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        if (language) {
            query = query.eq('language', language);
        }

        const { data, error } = await query
            .order('category_id', { ascending: true })
            .order('language', { ascending: true })
            .order('display_order', { ascending: true })
            .order('title', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all resources:', error);
        return [];
    }
}

// Admin: Create resource
export async function createResource(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Promise<Resource | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('resources')
            .insert({
                ...resource,
                created_by: user?.id || null,
                updated_by: user?.id || null,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating resource:', error);
        throw error;
    }
}

// Admin: Update resource
export async function updateResource(
    id: string,
    updates: Partial<Omit<Resource, 'id' | 'created_at' | 'created_by'>>
): Promise<Resource | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('resources')
            .update({
                ...updates,
                updated_by: user?.id || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating resource:', error);
        throw error;
    }
}

// Admin: Delete resource
export async function deleteResource(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting resource:', error);
        throw error;
    }
}

// ==================== CATEGORY TYPES & FUNCTIONS ====================

export interface CategoryData {
    id: string;
    name_ku: string;
    name_ar: string;
    name_en: string | null;
    color: string;
    icon_name: string;
    display_order: number;
    is_active: boolean;
    description_ku: string | null;
    description_ar: string | null;
    description_en: string | null;
    topics_section_title_ku: string | null;
    topics_section_title_ar: string | null;
    topics_section_title_en: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
}

// Fetch all active categories
export async function getCategories(language: 'ku' | 'ar' | 'en' = 'ku'): Promise<CategoryData[]> {
    // Check cache first
    const cacheKey = `categories_${language}`;
    const cached = cache.get<CategoryData[]>(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        const result = data || [];
        // Cache for 10 minutes
        cache.set(cacheKey, result, 10 * 60 * 1000);
        return result;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

// Admin: Get all categories (including inactive)
export async function getAllCategories(): Promise<CategoryData[]> {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true })
            .order('id', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all categories:', error);
        return [];
    }
}

// Admin: Get category by ID
export async function getCategoryById(categoryId: string): Promise<CategoryData | null> {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch category:', error);
        return null;
    }
}

// Admin: Create category
export async function createCategory(category: Omit<CategoryData, 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<CategoryData | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('categories')
            .insert({
                ...category,
                created_by: user?.id || null,
                updated_by: user?.id || null,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

// Admin: Update category
export async function updateCategory(
    id: string,
    updates: Partial<Omit<CategoryData, 'id' | 'created_at' | 'created_by'>>
): Promise<CategoryData | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('categories')
            .update({
                ...updates,
                updated_by: user?.id || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

// Admin: Delete category
export async function deleteCategory(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

// ==================== DRIVING INSTRUCTORS ====================

export interface DrivingInstructor {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    location: string;
    postcode: string | null;
    languages_spoken: string[];
    experience_years: number;
    rating: number;
    total_reviews: number;
    price_per_hour: number | null;
    vehicle_type: string | null;
    availability: string | null;
    bio: string | null;
    specialties: string[];
    is_active: boolean;
    is_verified: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
}

// Fetch all active driving instructors
export async function getDrivingInstructors(filters?: {
    location?: string;
    language?: string;
    minRating?: number;
    maxPrice?: number;
    vehicleType?: string;
    searchQuery?: string;
}): Promise<DrivingInstructor[]> {
    try {
        let query = supabase
            .from('driving_instructors')
            .select('*')
            .eq('is_active', true)
            .order('is_verified', { ascending: false }) // Verified first
            .order('rating', { ascending: false })
            .order('display_order', { ascending: true });

        if (filters?.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }

        if (filters?.language) {
            query = query.contains('languages_spoken', [filters.language]);
        }

        if (filters?.minRating) {
            query = query.gte('rating', filters.minRating);
        }

        if (filters?.maxPrice) {
            query = query.lte('price_per_hour', filters.maxPrice);
        }

        if (filters?.vehicleType) {
            query = query.eq('vehicle_type', filters.vehicleType);
        }

        if (filters?.searchQuery) {
            const searchTerm = filters.searchQuery.toLowerCase();
            query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching driving instructors:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch driving instructors:', error);
        return [];
    }
}

// Fetch a single driving instructor by ID (for public use - only active)
export async function getDrivingInstructorById(id: string): Promise<DrivingInstructor | null> {
    try {
        const { data, error } = await supabase
            .from('driving_instructors')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching driving instructor:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch driving instructor:', error);
        return null;
    }
}

// Admin: Get driving instructor by ID (including inactive)
export async function getDrivingInstructorByIdAdmin(id: string): Promise<DrivingInstructor | null> {
    try {
        const { data, error } = await supabase
            .from('driving_instructors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching driving instructor:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch driving instructor:', error);
        return null;
    }
}

// Admin: Get all driving instructors (including inactive)
export async function getAllDrivingInstructors(): Promise<DrivingInstructor[]> {
    try {
        const { data, error } = await supabase
            .from('driving_instructors')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all driving instructors:', error);
        return [];
    }
}

// Admin: Create driving instructor
export async function createDrivingInstructor(
    instructor: Omit<DrivingInstructor, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
): Promise<DrivingInstructor | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('driving_instructors')
            .insert({
                ...instructor,
                created_by: user?.id,
                updated_by: user?.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating driving instructor:', error);
        throw error;
    }
}

// Admin: Update driving instructor
export async function updateDrivingInstructor(
    id: string,
    updates: Partial<DrivingInstructor>
): Promise<DrivingInstructor | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('driving_instructors')
            .update({
                ...updates,
                updated_by: user?.id,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating driving instructor:', error);
        throw error;
    }
}

// Admin: Delete driving instructor
export async function deleteDrivingInstructor(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('driving_instructors')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting driving instructor:', error);
        throw error;
    }
}

// Public: Submit driving instructor (pending approval - is_active = false)
export async function submitDrivingInstructor(
    instructor: Omit<DrivingInstructor, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'is_verified' | 'rating' | 'total_reviews'>
): Promise<{ success: boolean; message: string }> {
    try {
        const { error } = await supabase
            .from('driving_instructors')
            .insert({
                ...instructor,
                is_active: false, // Pending admin approval
                is_verified: false,
                rating: 0,
                total_reviews: 0,
            });

        if (error) throw error;
        return { success: true, message: 'Instructor submitted successfully. It will be reviewed by admin.' };
    } catch (error) {
        console.error('Error submitting driving instructor:', error);
        throw error;
    }
}

// ==================== JOBS ====================

// Submit a new job (public submission, pending admin approval)
export async function submitJob(job: {
    title: string;
    company: string;
    location: string;
    salary?: string;
    type?: string;
    description: string;
    requirements?: string;
    apply_url?: string;
    apply_email?: string;
    category?: string;
    contact_phone?: string;
}): Promise<{ success: boolean; message: string }> {
    try {
        // Use the anon key client for public submissions (bypasses RLS if needed)
        const { data, error } = await supabase
            .from('jobs')
            .insert({
                title: job.title.trim(),
                company: job.company.trim(),
                location: job.location.trim(),
                salary: job.salary?.trim() || null,
                type: job.type || null,
                description: job.description.trim(),
                requirements: job.requirements?.trim() || null,
                apply_url: job.apply_url?.trim() || null,
                apply_email: job.apply_email?.trim() || null,
                category: job.category || null,
                contact_phone: job.contact_phone?.trim() || null,
                is_active: false, // Pending admin approval
                posted_date: new Date().toISOString().split('T')[0],
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        return { success: true, message: 'Job submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting job:', error);
        // Provide more detailed error message
        const errorMessage = error?.message || 'An error occurred while submitting the job.';
        throw new Error(errorMessage);
    }
}

// Job type matching database schema
export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string | null;
    type: string | null;
    description: string;
    requirements: string | null;
    apply_url: string | null;
    apply_email: string | null;
    category: string | null;
    contact_phone: string | null;
    is_active: boolean;
    posted_date: string;
    created_at: string;
    updated_at: string;
}

// Public: Get active/approved jobs only
export async function getActiveJobs(): Promise<Job[]> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active jobs:', error);
        return [];
    }
}

// Admin: Get all jobs (including inactive/pending)
export async function getAllJobs(): Promise<Job[]> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        return [];
    }
}

// Admin: Get job by ID
export async function getJobById(jobId: string): Promise<Job | null> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching job:', error);
        return null;
    }
}

// Admin: Update job
export async function updateJob(
    id: string,
    updates: Partial<Job>
): Promise<Job | null> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating job:', error);
        throw error;
    }
}

// Admin: Delete job
export async function deleteJob(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error;
    }
}

// Admin: Approve job (set is_active = true)
export async function approveJob(id: string): Promise<Job | null> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving job:', error);
        throw error;
    }
}

// Admin: Reject job (set is_active = false)
export async function rejectJob(id: string): Promise<Job | null> {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting job:', error);
        throw error;
    }
}

// ==================== CARS ====================

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    mileage: number | null;
    price: number;
    location: string;
    description: string | null;
    fuel_type: string | null;
    transmission: string | null;
    color: string | null;
    condition: string | null;
    contact_name: string;
    contact_phone: string;
    contact_email: string | null;
    images: string[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Public: Submit a new car (public submission, pending admin approval)
export async function submitCar(car: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    price: number;
    location: string;
    description?: string;
    fuel_type?: string;
    transmission?: string;
    color?: string;
    condition?: string;
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
}): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .insert({
                make: car.make.trim(),
                model: car.model.trim(),
                year: car.year,
                mileage: car.mileage || null,
                price: car.price,
                location: car.location.trim(),
                description: car.description?.trim() || null,
                fuel_type: car.fuel_type || null,
                transmission: car.transmission || null,
                color: car.color?.trim() || null,
                condition: car.condition || null,
                contact_name: car.contact_name.trim(),
                contact_phone: car.contact_phone.trim(),
                contact_email: car.contact_email?.trim() || null,
                is_active: false, // Pending admin approval
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        return { success: true, message: 'Car advertisement submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting car:', error);
        const errorMessage = error?.message || 'An error occurred while submitting the car advertisement.';
        throw new Error(errorMessage);
    }
}

// Public: Get active/approved cars only
export async function getActiveCars(): Promise<Car[]> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active cars:', error);
        return [];
    }
}

// Admin: Get all cars (including inactive/pending)
export async function getAllCars(): Promise<Car[]> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all cars:', error);
        return [];
    }
}

// Admin: Get car by ID
export async function getCarById(carId: string): Promise<Car | null> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', carId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching car:', error);
        return null;
    }
}

// Admin: Update car
export async function updateCar(
    id: string,
    updates: Partial<Car>
): Promise<Car | null> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating car:', error);
        throw error;
    }
}

// Admin: Delete car
export async function deleteCar(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting car:', error);
        throw error;
    }
}

// Admin: Approve car (set is_active = true)
export async function approveCar(id: string): Promise<Car | null> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving car:', error);
        throw error;
    }
}

// Admin: Reject car (set is_active = false)
export async function rejectCar(id: string): Promise<Car | null> {
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting car:', error);
        throw error;
    }
}

// ==================== LAWYERS ====================

export interface Lawyer {
    id: string;
    name: string;
    firm_name: string | null;
    specialization: string | null;
    location: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    languages: string[] | null;
    experience_years: number | null;
    consultation_fee: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Public: Submit a new lawyer (public submission, pending admin approval)
export async function submitLawyer(lawyer: {
    name: string;
    firm_name?: string;
    specialization?: string;
    location: string;
    description?: string;
    phone: string;
    email?: string;
    website?: string;
    languages?: string[];
    experience_years?: number;
    consultation_fee?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .insert({
                name: lawyer.name.trim(),
                firm_name: lawyer.firm_name?.trim() || null,
                specialization: lawyer.specialization || null,
                location: lawyer.location.trim(),
                description: lawyer.description?.trim() || null,
                phone: lawyer.phone.trim(),
                email: lawyer.email?.trim() || null,
                website: lawyer.website?.trim() || null,
                languages: lawyer.languages || null,
                experience_years: lawyer.experience_years || null,
                consultation_fee: lawyer.consultation_fee || null,
                is_active: false, // Pending admin approval
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        return { success: true, message: 'Lawyer submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting lawyer:', error);
        const errorMessage = error?.message || 'An error occurred while submitting the lawyer.';
        throw new Error(errorMessage);
    }
}

// Public: Get active/approved lawyers only
export async function getActiveLawyers(): Promise<Lawyer[]> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active lawyers:', error);
        return [];
    }
}

// Admin: Get all lawyers (including inactive/pending)
export async function getAllLawyers(): Promise<Lawyer[]> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all lawyers:', error);
        return [];
    }
}

// Admin: Get lawyer by ID
export async function getLawyerById(lawyerId: string): Promise<Lawyer | null> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .select('*')
            .eq('id', lawyerId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching lawyer:', error);
        return null;
    }
}

// Admin: Update lawyer
export async function updateLawyer(
    id: string,
    updates: Partial<Lawyer>
): Promise<Lawyer | null> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating lawyer:', error);
        throw error;
    }
}

// Admin: Delete lawyer
export async function deleteLawyer(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('lawyers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting lawyer:', error);
        throw error;
    }
}

// Admin: Approve lawyer (set is_active = true)
export async function approveLawyer(id: string): Promise<Lawyer | null> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving lawyer:', error);
        throw error;
    }
}

// Admin: Reject lawyer (set is_active = false)
export async function rejectLawyer(id: string): Promise<Lawyer | null> {
    try {
        const { data, error } = await supabase
            .from('lawyers')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting lawyer:', error);
        throw error;
    }
}

// ==================== ACCOUNTANTS ====================

export interface Accountant {
    id: string;
    name: string;
    firm_name: string | null;
    specialization: string | null;
    location: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    languages: string[] | null;
    experience_years: number | null;
    consultation_fee: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Public: Submit a new accountant (public submission, pending admin approval)
export async function submitAccountant(accountant: {
    name: string;
    firm_name?: string;
    specialization?: string;
    location: string;
    description?: string;
    phone: string;
    email?: string;
    website?: string;
    languages?: string[];
    experience_years?: number;
    consultation_fee?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .insert({
                name: accountant.name.trim(),
                firm_name: accountant.firm_name?.trim() || null,
                specialization: accountant.specialization || null,
                location: accountant.location.trim(),
                description: accountant.description?.trim() || null,
                phone: accountant.phone.trim(),
                email: accountant.email?.trim() || null,
                website: accountant.website?.trim() || null,
                languages: accountant.languages || null,
                experience_years: accountant.experience_years || null,
                consultation_fee: accountant.consultation_fee || null,
                is_active: false, // Pending admin approval
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        return { success: true, message: 'Accountant submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting accountant:', error);
        const errorMessage = error?.message || 'An error occurred while submitting the accountant.';
        throw new Error(errorMessage);
    }
}

// Public: Get active/approved accountants only
export async function getActiveAccountants(): Promise<Accountant[]> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active accountants:', error);
        return [];
    }
}

// Admin: Get all accountants (including inactive/pending)
export async function getAllAccountants(): Promise<Accountant[]> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all accountants:', error);
        return [];
    }
}

// Admin: Get accountant by ID
export async function getAccountantById(accountantId: string): Promise<Accountant | null> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .select('*')
            .eq('id', accountantId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching accountant:', error);
        return null;
    }
}

// Admin: Update accountant
export async function updateAccountant(
    id: string,
    updates: Partial<Accountant>
): Promise<Accountant | null> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating accountant:', error);
        throw error;
    }
}

// Admin: Delete accountant
export async function deleteAccountant(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('accountants')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting accountant:', error);
        throw error;
    }
}

// Admin: Approve accountant (set is_active = true)
export async function approveAccountant(id: string): Promise<Accountant | null> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving accountant:', error);
        throw error;
    }
}

// Admin: Reject accountant (set is_active = false)
export async function rejectAccountant(id: string): Promise<Accountant | null> {
    try {
        const { data, error } = await supabase
            .from('accountants')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting accountant:', error);
        throw error;
    }
}

// ==================== TRAVEL AGENTS ====================

export interface TravelAgent {
    id: string;
    name: string;
    agency_name: string | null;
    services: string[] | null;
    location: string;
    description: string | null;
    phone: string;
    email: string | null;
    website: string | null;
    languages: string[] | null;
    experience_years: number | null;
    consultation_fee: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Public: Submit a new travel agent (public submission, pending admin approval)
export async function submitTravelAgent(travelAgent: {
    name: string;
    agency_name?: string;
    services?: string[];
    location: string;
    description?: string;
    phone: string;
    email?: string;
    website?: string;
    languages?: string[];
    experience_years?: number;
    consultation_fee?: number;
}): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .insert({
                name: travelAgent.name.trim(),
                agency_name: travelAgent.agency_name?.trim() || null,
                services: travelAgent.services || null,
                location: travelAgent.location.trim(),
                description: travelAgent.description?.trim() || null,
                phone: travelAgent.phone.trim(),
                email: travelAgent.email?.trim() || null,
                website: travelAgent.website?.trim() || null,
                languages: travelAgent.languages || null,
                experience_years: travelAgent.experience_years || null,
                consultation_fee: travelAgent.consultation_fee || null,
                is_active: false, // Pending admin approval
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        return { success: true, message: 'Travel agent submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting travel agent:', error);
        const errorMessage = error?.message || 'An error occurred while submitting the travel agent.';
        throw new Error(errorMessage);
    }
}

// Public: Get active/approved travel agents only
export async function getActiveTravelAgents(): Promise<TravelAgent[]> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active travel agents:', error);
        return [];
    }
}

// Admin: Get all travel agents (including inactive/pending)
export async function getAllTravelAgents(): Promise<TravelAgent[]> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all travel agents:', error);
        return [];
    }
}

// Admin: Get travel agent by ID
export async function getTravelAgentById(travelAgentId: string): Promise<TravelAgent | null> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .select('*')
            .eq('id', travelAgentId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching travel agent:', error);
        return null;
    }
}

// Admin: Update travel agent
export async function updateTravelAgent(
    id: string,
    updates: Partial<TravelAgent>
): Promise<TravelAgent | null> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating travel agent:', error);
        throw error;
    }
}

// Admin: Delete travel agent
export async function deleteTravelAgent(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('travel_agents')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting travel agent:', error);
        throw error;
    }
}

// Admin: Approve travel agent (set is_active = true)
export async function approveTravelAgent(id: string): Promise<TravelAgent | null> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving travel agent:', error);
        throw error;
    }
}

// Admin: Reject travel agent (set is_active = false)
export async function rejectTravelAgent(id: string): Promise<TravelAgent | null> {
    try {
        const { data, error } = await supabase
            .from('travel_agents')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting travel agent:', error);
        throw error;
    }
}

// ==================== BUSINESSES ====================

export interface Business {
    id: string;
    business_name: string;
    business_type: string | null;
    category: string | null;
    location: string;
    description: string | null;
    price: number | null;
    contact_name: string;
    contact_phone: string;
    contact_email: string | null;
    website: string | null;
    images: string[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Public: Submit a new business (public submission, pending admin approval)
export async function submitBusiness(business: {
    business_name: string;
    business_type?: string;
    category?: string;
    location: string;
    description?: string;
    price?: number;
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
    website?: string;
    images?: string[];
}): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .insert({
                business_name: business.business_name.trim(),
                business_type: business.business_type || null,
                category: business.category || null,
                location: business.location.trim(),
                description: business.description?.trim() || null,
                price: business.price || null,
                contact_name: business.contact_name.trim(),
                contact_phone: business.contact_phone.trim(),
                contact_email: business.contact_email?.trim() || null,
                website: business.website?.trim() || null,
                images: business.images || null,
                is_active: false, // Pending admin approval
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }

        return { success: true, message: 'Business submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting business:', error);
        const errorMessage = error?.message || 'An error occurred while submitting the business.';
        throw new Error(errorMessage);
    }
}

// Public: Get active/approved businesses only
export async function getActiveBusinesses(): Promise<Business[]> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active businesses:', error);
        return [];
    }
}

// Admin: Get all businesses (including inactive/pending)
export async function getAllBusinesses(): Promise<Business[]> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all businesses:', error);
        return [];
    }
}

// Admin: Get business by ID
export async function getBusinessById(businessId: string): Promise<Business | null> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', businessId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching business:', error);
        return null;
    }
}

// Admin: Update business
export async function updateBusiness(
    id: string,
    updates: Partial<Business>
): Promise<Business | null> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating business:', error);
        throw error;
    }
}

// Admin: Delete business
export async function deleteBusiness(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('businesses')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting business:', error);
        throw error;
    }
}

// Admin: Approve business (set is_active = true)
export async function approveBusiness(id: string): Promise<Business | null> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving business:', error);
        throw error;
    }
}

// Admin: Reject business (set is_active = false)
export async function rejectBusiness(id: string): Promise<Business | null> {
    try {
        const { data, error } = await supabase
            .from('businesses')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting business:', error);
        throw error;
    }
}

// ==================== HOMES ====================

export interface Home {
    id: string;
    title: string;
    address: string;
    city: string;
    location: string;
    description: string;
    rent_amount: number;
    bedrooms?: number;
    bathrooms?: number;
    property_type?: string;
    furnished?: string;
    available_from?: string;
    minimum_tenancy_months?: number;
    deposit_amount?: number;
    bills_included: boolean;
    parking_available: boolean;
    garden_available: boolean;
    pets_allowed: boolean;
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
    images?: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by?: string;
    updated_by?: string;
}

// Get all active homes
export async function getActiveHomes(): Promise<Home[]> {
    try {
        const { data, error } = await supabase
            .from('homes')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching active homes:', error);
        throw error;
    }
}

// Get all homes (admin)
export async function getAllHomes(): Promise<Home[]> {
    try {
        const { data, error } = await supabase
            .from('homes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all homes:', error);
        throw error;
    }
}

// Get home by ID
export async function getHomeById(id: string): Promise<Home | null> {
    try {
        const { data, error } = await supabase
            .from('homes')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching home:', error);
        throw error;
    }
}

// Submit a new home (public submission, pending admin approval)
export async function submitHome(home: {
    title: string;
    address: string;
    city: string;
    location: string;
    description: string;
    rent_amount: number;
    bedrooms?: number;
    bathrooms?: number;
    property_type?: string;
    furnished?: string;
    available_from?: string;
    minimum_tenancy_months?: number;
    deposit_amount?: number;
    bills_included?: boolean;
    parking_available?: boolean;
    garden_available?: boolean;
    pets_allowed?: boolean;
    contact_name: string;
    contact_phone: string;
    contact_email?: string;
    images?: string[];
}): Promise<{ success: boolean; message: string }> {
    try {
        const { data, error } = await supabase
            .from('homes')
            .insert({
                ...home,
                is_active: false, // Pending admin approval
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, message: 'Home listing submitted successfully. It will be reviewed by admin.' };
    } catch (error: any) {
        console.error('Error submitting home:', error);
        throw new Error(error?.message || 'An error occurred while submitting the home listing.');
    }
}

// Admin: Approve home
export async function approveHome(id: string): Promise<Home | null> {
    try {
        const { data, error } = await supabase
            .from('homes')
            .update({
                is_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error approving home:', error);
        throw error;
    }
}

// Admin: Reject home
export async function rejectHome(id: string): Promise<Home | null> {
    try {
        const { data, error } = await supabase
            .from('homes')
            .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error rejecting home:', error);
        throw error;
    }
}

// Admin: Delete home
export async function deleteHome(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('homes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting home:', error);
        throw error;
    }
}

// ==================== INSTRUCTOR REVIEWS ====================

export interface InstructorReview {
    id: string;
    instructor_id: string;
    reviewer_name: string;
    reviewer_email: string | null;
    rating: number;
    review_text: string | null;
    is_verified: boolean;
    is_approved: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
}

// Submit a new review for an instructor
export async function submitInstructorReview(review: {
    instructor_id: string;
    reviewer_name: string;
    reviewer_email?: string;
    rating: number;
    review_text?: string;
}): Promise<InstructorReview | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('instructor_reviews')
            .insert({
                instructor_id: review.instructor_id,
                reviewer_name: review.reviewer_name,
                reviewer_email: review.reviewer_email || null,
                rating: review.rating,
                review_text: review.review_text || null,
                created_by: user?.id || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error submitting review:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to submit review:', error);
        throw error;
    }
}

// Fetch reviews for an instructor
export async function getInstructorReviews(instructorId: string): Promise<InstructorReview[]> {
    try {
        const { data, error } = await supabase
            .from('instructor_reviews')
            .select('*')
            .eq('instructor_id', instructorId)
            .eq('is_active', true)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
}

// Admin: Get all reviews (including unapproved)
export async function getAllInstructorReviews(instructorId?: string): Promise<InstructorReview[]> {
    try {
        let query = supabase
            .from('instructor_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (instructorId) {
            query = query.eq('instructor_id', instructorId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }
}

// Admin: Update review (approve, verify, etc.)
export async function updateInstructorReview(
    reviewId: string,
    updates: Partial<InstructorReview>
): Promise<InstructorReview | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('instructor_reviews')
            .update({
                ...updates,
                updated_by: user?.id,
            })
            .eq('id', reviewId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
}

// Admin: Delete review
export async function deleteInstructorReview(reviewId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('instructor_reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
}

// ==================== TOPICS/SUBCATEGORIES ====================

export interface Topic {
    id: string;
    category_id: string;
    title_ku: string;
    title_ar: string;
    title_en: string | null;
    description_ku: string | null;
    description_ar: string | null;
    description_en: string | null;
    slug: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    updated_by: string | null;
}

export interface TopicResource {
    id: string;
    topic_id: string;
    resource_id: string;
    display_order: number;
    created_at: string;
}

// Fetch all active topics for a category
export async function getTopicsByCategory(categoryId: string): Promise<Topic[]> {
    try {
        const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('title_ku', { ascending: true });

        if (error) {
            console.error('Error fetching topics:', error);
            console.error('Category ID:', categoryId);
            throw error;
        }

        console.log(`Fetched ${data?.length || 0} active topics for category "${categoryId}"`);
        if (data && data.length > 0) {
            console.log('Topics data:', data.map(t => ({ id: t.id, title_ku: t.title_ku, is_active: t.is_active, slug: t.slug })));
        } else {
            // Debug: Check if there are any topics for this category (including inactive)
            const { data: allTopics, error: allError } = await supabase
                .from('topics')
                .select('id, title_ku, is_active, slug')
                .eq('category_id', categoryId);

            if (allTopics && allTopics.length > 0) {
                console.warn(`Found ${allTopics.length} topics for category "${categoryId}", but ${allTopics.filter(t => !t.is_active).length} are inactive:`,
                    allTopics.map(t => ({ title: t.title_ku, is_active: t.is_active })));
            } else if (!allError) {
                console.warn(`No topics found for category "${categoryId}"`);
            }
        }

        return data || [];
    } catch (error) {
        console.error('Failed to fetch topics:', error);
        return [];
    }
}

// Fetch a single topic by ID
export async function getTopicById(topicId: string): Promise<Topic | null> {
    try {
        const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('id', topicId)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching topic:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch topic:', error);
        return null;
    }
}

// Fetch a topic by category and slug
export async function getTopicBySlug(categoryId: string, slug: string): Promise<Topic | null> {
    try {
        const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('category_id', categoryId)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error) {
            console.error('Error fetching topic:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch topic:', error);
        return null;
    }
}

// Fetch resources for a topic
export async function getResourcesByTopic(topicId: string, language: 'ku' | 'ar' | 'en' = 'ku'): Promise<Resource[]> {
    try {
        const { data, error } = await supabase
            .from('topic_resources')
            .select(`
                resource_id,
                display_order,
                resources:resource_id (
                    id,
                    category_id,
                    language,
                    title,
                    slug,
                    html_content,
                    description,
                    external_link,
                    phone,
                    email,
                    source,
                    display_order,
                    is_active,
                    created_at,
                    updated_at
                )
            `)
            .eq('topic_id', topicId)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching topic resources:', error);
            throw error;
        }

        // Filter and map the results
        const resources: Resource[] = [];
        if (data) {
            for (const item of data) {
                const resource = item.resources as any;
                if (resource && resource.is_active && resource.language === language) {
                    resources.push({
                        id: resource.id,
                        category_id: resource.category_id,
                        language: resource.language,
                        title: resource.title,
                        slug: resource.slug,
                        html_content: resource.html_content,
                        description: resource.description,
                        external_link: resource.external_link,
                        phone: resource.phone,
                        email: resource.email,
                        source: resource.source,
                        display_order: item.display_order || resource.display_order,
                        is_active: resource.is_active,
                        created_at: resource.created_at,
                        updated_at: resource.updated_at,
                    });
                }
            }
        }

        return resources;
    } catch (error) {
        console.error('Failed to fetch topic resources:', error);
        return [];
    }
}

// Admin: Get all topics (including inactive)
export async function getAllTopics(categoryId?: string): Promise<Topic[]> {
    try {
        let query = supabase
            .from('topics')
            .select('*')
            .order('category_id', { ascending: true })
            .order('display_order', { ascending: true });

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all topics:', error);
        return [];
    }
}

// Admin: Get topic by ID (including inactive)
export async function getTopicByIdAdmin(topicId: string): Promise<Topic | null> {
    try {
        const { data, error } = await supabase
            .from('topics')
            .select('*')
            .eq('id', topicId)
            .single();

        if (error) {
            console.error('Error fetching topic:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch topic:', error);
        return null;
    }
}

// Admin: Create topic
export async function createTopic(
    topic: Omit<Topic, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
): Promise<Topic | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('topics')
            .insert({
                ...topic,
                created_by: user?.id,
                updated_by: user?.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating topic:', error);
        throw error;
    }
}

// Admin: Update topic
export async function updateTopic(
    id: string,
    updates: Partial<Topic>
): Promise<Topic | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('topics')
            .update({
                ...updates,
                updated_by: user?.id,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating topic:', error);
        throw error;
    }
}

// Admin: Delete topic
export async function deleteTopic(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('topics')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
    }
}

// Admin: Add resource to topic
export async function addResourceToTopic(topicId: string, resourceId: string, displayOrder?: number): Promise<TopicResource | null> {
    try {
        const { data, error } = await supabase
            .from('topic_resources')
            .insert({
                topic_id: topicId,
                resource_id: resourceId,
                display_order: displayOrder || 0,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding resource to topic:', error);
        throw error;
    }
}

// Admin: Remove resource from topic
export async function removeResourceFromTopic(topicId: string, resourceId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('topic_resources')
            .delete()
            .eq('topic_id', topicId)
            .eq('resource_id', resourceId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing resource from topic:', error);
        throw error;
    }
}

// Admin: Get all resources for a topic (for admin view)
export async function getTopicResourcesAdmin(topicId: string): Promise<Array<TopicResource & { resource: Resource }>> {
    try {
        const { data, error } = await supabase
            .from('topic_resources')
            .select(`
                *,
                resources:resource_id (*)
            `)
            .eq('topic_id', topicId)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return (data || []).map(item => ({
            ...item,
            resource: item.resources as Resource,
        }));
    } catch (error) {
        console.error('Error fetching topic resources:', error);
        return [];
    }
}


export type Subscription = ReturnType<typeof supabase.auth.onAuthStateChange>['data']['subscription'];
