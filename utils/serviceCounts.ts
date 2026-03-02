import { 
    getActiveJobs, 
    getActiveCars, 
    getActiveLawyers, 
    getActiveAccountants, 
    getActiveTravelAgents, 
    getActiveBusinesses,
    getDrivingInstructors,
    getActiveHomes
} from '../lib/supabase';

export interface ServiceCounts {
    jobs: number;
    cars: number;
    lawyers: number;
    accountants: number;
    travelAgents: number;
    businesses: number;
    drivingInstructors: number;
    homes: number;
}

export async function getServiceCounts(): Promise<ServiceCounts> {
    try {
        const [jobs, cars, lawyers, accountants, travelAgents, businesses, drivingInstructors, homes] = await Promise.all([
            getActiveJobs(),
            getActiveCars(),
            getActiveLawyers(),
            getActiveAccountants(),
            getActiveTravelAgents(),
            getActiveBusinesses(),
            getDrivingInstructors({ is_active: true }),
            getActiveHomes(),
        ]);

        return {
            jobs: jobs.length,
            cars: cars.length,
            lawyers: lawyers.length,
            accountants: accountants.length,
            travelAgents: travelAgents.length,
            businesses: businesses.length,
            drivingInstructors: drivingInstructors.length,
            homes: homes.length,
        };
    } catch (error) {
        console.error('Error fetching service counts:', error);
        // Return zeros if there's an error
        return {
            jobs: 0,
            cars: 0,
            lawyers: 0,
            accountants: 0,
            travelAgents: 0,
            businesses: 0,
            drivingInstructors: 0,
            homes: 0,
        };
    }
}

