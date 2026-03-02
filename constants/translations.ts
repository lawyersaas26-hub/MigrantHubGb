import type { Language, TranslationSet } from '../types';

export const translations: Record<Language, TranslationSet> = {
  ku: {
    welcomeUser: "بەخێربێیت",
    search: "گەڕان بە دوای سەرچاوەکان...",
    home: "سەرەکی",
    favorites: "دڵخوازەکان",
    account: "هەژمار",
    featuredServices: "خزمەتگوزاریە تایبەتەکان",
    viewAll: "بینینی هەموو",
    available: "بەردەست",
    categories: {
      immigration: "کۆچکردن",
      housing: "نیشتەجێبوون",
      employment: "کارکردن",
      education: "پەروەردە",
      healthcare: "تەندروستی",
      legal: "یاسایی",
      financial: "دارایی",
      culture: "کلتور",
      emergency: "فریاگوزاری"
    },
    services: {
      jobs: "کارەکان",
      cars: "ئۆتۆمبێلەکان",
      lawyers: "پارێزه‌ره کان",
      accountants: "ژمێریارەکان",
      travelAgents: "گەشت",
      businesses: "کاروبارەکان",
      drivingInstructors: "شۆفێری",
      homes: " خانوو بۆ کرێ"
    }
  },
  ar: {
    welcomeUser: "مرحباً User",
    search: "البحث عن الموارد...",
    home: "الرئيسية",
    favorites: "المفضلة",
    account: "حسابي",
    featuredServices: "خدمات مميزة",
    viewAll: "عرض الكل",
    available: "متاح",
    categories: {
      immigration: "الهجرة",
      housing: "السكن",
      employment: "التوظيف",
      education: "التعليم",
      healthcare: "الصحة",
      legal: "القانونية",
      financial: "المالية",
      culture: "الثقافة",
      emergency: "الطوارئ"
    },
    services: {
      jobs: "الوظائف",
      cars: "السيارات",
      lawyers: "المحامين",
      accountants: "المحاسبين",
      travelAgents: "وكلاء السفر",
      businesses: "الأعمال التجارية",
      drivingInstructors: "السياقة",
      homes: "البيوت للإيجار"
    }
  },
  en: {
    welcomeUser: "Welcome User",
    search: "Search for resources...",
    home: "Home",
    favorites: "Favorites",
    account: "Account",
    featuredServices: "Featured Services",
    viewAll: "View All",
    available: "Available",
    categories: {
      immigration: "Immigration",
      housing: "Housing",
      employment: "Employment",
      education: "Education",
      healthcare: "Healthcare",
      legal: "Legal",
      financial: "Financial",
      culture: "Culture",
      emergency: "Emergency"
    },
    services: {
      jobs: "Jobs",
      cars: "Cars",
      lawyers: "Lawyers",
      accountants: "Accountants",
      travelAgents: "Travel Agents",
      businesses: "Businesses",
      drivingInstructors: "Driving Instructors",
      homes: "Homes for Rent"
    }
  }
};