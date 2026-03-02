
import type { Category } from '../types';
import { FileText, Home, Briefcase, GraduationCap, Heart, Scale, Wallet, Globe, Phone } from 'lucide-react';

export const CATEGORIES_DATA: Category[] = [
    { id: 'immigration', labelKey: 'immigration', color: 'bg-blue-600', icon: FileText },
    { id: 'housing', labelKey: 'housing', color: 'bg-purple-600', icon: Home },
    { id: 'employment', labelKey: 'employment', color: 'bg-teal-600', icon: Briefcase },
    { id: 'education', labelKey: 'education', color: 'bg-rose-600', icon: GraduationCap },
    { id: 'healthcare', labelKey: 'healthcare', color: 'bg-pink-500', icon: Heart },
    { id: 'legal', labelKey: 'legal', color: 'bg-orange-600', icon: Scale },
    { id: 'financial', labelKey: 'financial', color: 'bg-purple-600', icon: Wallet },
    { id: 'culture', labelKey: 'culture', color: 'bg-teal-600', icon: Globe },
    { id: 'emergency', labelKey: 'emergency', color: 'bg-blue-600', icon: Phone },
];
