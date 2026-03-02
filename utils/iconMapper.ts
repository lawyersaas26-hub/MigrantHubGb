// Icon mapper utility to convert icon name strings to Lucide React components
import {
    FileText, Home, Briefcase, GraduationCap, Heart, Scale, Wallet, Globe, Phone,
    Building, User, Users, Calendar, MapPin, Mail, PhoneCall, Video, Camera,
    ShoppingBag, CreditCard, Banknote, TrendingUp, Award, Book, BookOpen,
    MessageCircle, Settings, HelpCircle, Info, AlertCircle, CheckCircle, XCircle,
    Star, Bookmark, Bell, Search, Filter, Download, Upload, Share2, Edit, Trash,
    Plus, Minus, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, MoreVertical
} from 'lucide-react';

// Map of icon names to their React components
const iconMap: Record<string, React.ForwardRefExoticComponent<any>> = {
    FileText,
    Home,
    Briefcase,
    GraduationCap,
    Heart,
    Scale,
    Wallet,
    Globe,
    Phone,
    Building,
    User,
    Users,
    Calendar,
    MapPin,
    Mail,
    PhoneCall,
    Video,
    Camera,
    ShoppingBag,
    CreditCard,
    Banknote,
    TrendingUp,
    Award,
    Book,
    BookOpen,
    MessageCircle,
    Settings,
    HelpCircle,
    Info,
    AlertCircle,
    CheckCircle,
    XCircle,
    Star,
    Bookmark,
    Bell,
    Search,
    Filter,
    Download,
    Upload,
    Share2,
    Edit,
    Trash,
    Plus,
    Minus,
    ChevronRight,
    ChevronLeft,
    ArrowRight,
    ArrowLeft,
    MoreVertical,
};

// Get icon component by name, with fallback to FileText
export function getIconByName(iconName: string) {
    return iconMap[iconName] || FileText;
}

// Get all available icon names
export function getAvailableIcons(): string[] {
    return Object.keys(iconMap).sort();
}



