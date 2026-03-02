import type { CategoryKey, Language } from '../types';

export interface Resource {
    title: string;
    description?: string;
    link?: string;
    phone?: string;
    email?: string;
    source?: string; // Source of information (e.g., "UK Government", "NHS", "Charity")
}

export interface CategoryContent {
    description: string;
    resources: Resource[];
}

type CategoryContentData = Record<Language, Record<CategoryKey, CategoryContent>>;

const categoryContentData: CategoryContentData = {
    ku: {
        immigration: {
            description: 'زانیاری دەربارەی کۆچکردن بۆ بەریتانیا، پەڕەکان، و بەڵگەنامە پێویستەکان.',
            resources: [
                {
                    title: 'ماڵپەڕی کۆچکردنی بەریتانیا',
                    description: 'زانیاری فەرمی دەربارەی کۆچکردن و پەڕەکان',
                    link: 'https://www.gov.uk/browse/visas-immigration',
                    source: 'UK Government',
                },
                {
                    title: 'خزمەتگوزاری کۆچکردنی بەریتانیا',
                    description: 'کۆمەکی بۆ پەڕە و کۆچکردن',
                    link: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration',
                    source: 'UK Visas and Immigration',
                },
                {
                    title: 'بەڵگەنامە پێویستەکان بۆ پەڕە',
                    description: 'لیستی بەڵگەنامە پێویستەکان بۆ پەڕە جۆرە جیاوازەکان',
                    link: 'https://www.gov.uk/check-uk-visa',
                    source: 'UK Government',
                },
                {
                    title: 'ئەنجامدانی پەڕە (Visa Application)',
                    description: 'چۆنیەتی ئەنجامدانی داواکاری پەڕە',
                    link: 'https://www.gov.uk/apply-to-come-to-the-uk',
                    source: 'UK Government',
                },
                {
                    title: 'پێشکەشکردنی نیشانە (Biometric Residence Permit)',
                    description: 'زانیاری دەربارەی BRP و چۆنیەتی پێشکەشکردنی',
                    link: 'https://www.gov.uk/biometric-residence-permits',
                    source: 'UK Government',
                },
                {
                    title: 'ناساندنی نیشتەجێبوون (Settlement)',
                    description: 'زانیاری دەربارەی ناساندنی نیشتەجێبوون لە بەریتانیا',
                    link: 'https://www.gov.uk/browse/visas-immigration/settle-in-the-uk',
                    source: 'UK Government',
                },
                {
                    title: 'Citizens Advice - یارمەتی کۆچکردن',
                    description: 'یارمەتی و ڕێنمایی دەربارەی کۆچکردن',
                    link: 'https://www.citizensadvice.org.uk/immigration/',
                    source: 'Citizens Advice',
                },
            ],
        },
        housing: {
            description: 'یارمەتی دەربارەی نیشتەجێبوون، کرێ، و ماڵی کۆمەڵایەتی.',
            resources: [
                {
                    title: 'ماڵی کۆمەڵایەتی',
                    description: 'زانیاری دەربارەی ماڵی کۆمەڵایەتی لە بەریتانیا',
                    link: 'https://www.gov.uk/council-housing',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی کرێ (Housing Benefit)',
                    description: 'یارمەتی کرێ بۆ کەسانی بەدەرهاتوو',
                    link: 'https://www.gov.uk/housing-benefit',
                    source: 'UK Government',
                },
                {
                    title: 'ڕێنمایی کرێدان',
                    description: 'ڕێنمایی دەربارەی کرێدان و مافی کرێدار',
                    link: 'https://www.gov.uk/private-renting',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی کرێ (Universal Credit)',
                    description: 'یارمەتی کرێ لە ژێر Universal Credit',
                    link: 'https://www.gov.uk/housing-cost-element',
                    source: 'UK Government',
                },
                {
                    title: 'کێشەکانی نیشتەجێبوون',
                    description: 'چۆنیەتی چارەسەرکردنی کێشەکانی نیشتەجێبوون',
                    link: 'https://www.shelter.org.uk/',
                    source: 'Shelter',
                },
                {
                    title: 'دۆزینەوەی ماڵ بە کرێ',
                    description: 'چۆنیەتی دۆزینەوەی ماڵ بە کرێ',
                    link: 'https://www.gov.uk/private-renting',
                    source: 'UK Government',
                },
                {
                    title: 'ماڵی کۆمەڵایەتی - داوای ماڵ',
                    description: 'چۆنیەتی داوای ماڵی کۆمەڵایەتی',
                    link: 'https://www.gov.uk/apply-for-council-housing',
                    source: 'UK Government',
                },
            ],
        },
        employment: {
            description: 'دۆزینەوەی کار، یارمەتی دەربارەی CV، و مۆڵەتی کار.',
            resources: [
                {
                    title: 'Jobcentre Plus',
                    description: 'خزمەتگوزاری دۆزینەوەی کار',
                    link: 'https://www.gov.uk/contact-jobcentre-plus',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی دەربارەی CV',
                    description: 'ڕێنمایی دەربارەی دروستکردنی CV',
                    link: 'https://www.gov.uk/cv-and-covering-letter-examples',
                    source: 'UK Government',
                },
                {
                    title: 'مۆڵەتی کار',
                    description: 'زانیاری دەربارەی مۆڵەتی کار لە بەریتانیا',
                    link: 'https://www.gov.uk/uk-visa-sponsorship-employers',
                    source: 'UK Government',
                },
                {
                    title: 'National Insurance Number',
                    description: 'چۆنیەتی دەستکەوتنی ژمارەی National Insurance',
                    link: 'https://www.gov.uk/apply-national-insurance-number',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی دارایی بۆ کار',
                    description: 'Universal Credit و یارمەتی دارایی بۆ کار',
                    link: 'https://www.gov.uk/universal-credit',
                    source: 'UK Government',
                },
                {
                    title: 'دۆزینەوەی کار (Find a Job)',
                    description: 'ماڵپەڕی فەرمی دۆزینەوەی کار',
                    link: 'https://www.gov.uk/find-a-job',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی دەربارەی Interview',
                    description: 'ڕێنمایی دەربارەی چۆنیەتی ئامادەبوون بۆ Interview',
                    link: 'https://www.gov.uk/job-interview-tips',
                    source: 'UK Government',
                },
                {
                    title: 'حقوقی کارگر',
                    description: 'زانیاری دەربارەی ماف و مافی کارگر لە بەریتانیا',
                    link: 'https://www.gov.uk/employment-rights',
                    source: 'UK Government',
                },
            ],
        },
        education: {
            description: 'قوتابخانەکان، کۆرسەکان، و پەروەردە لە بەریتانیا.',
            resources: [
                {
                    title: 'قوتابخانەکان لە بەریتانیا',
                    description: 'زانیاری دەربارەی قوتابخانەکان',
                    link: 'https://www.gov.uk/find-school-in-england',
                    source: 'UK Government',
                },
                {
                    title: 'کۆلێج و زانکۆ',
                    description: 'زانیاری دەربارەی پەروەردەی باڵا',
                    link: 'https://www.gov.uk/government/organisations/department-for-education',
                    source: 'UK Government',
                },
                {
                    title: 'ناساندن بە قوتابخانە',
                    description: 'چۆنیەتی ناساندنی منداڵ بە قوتابخانە',
                    link: 'https://www.gov.uk/schools-admissions',
                    source: 'UK Government',
                },
                {
                    title: 'کۆرسەکانی زمانی ئینگلیزی (ESOL)',
                    description: 'کۆرسەکانی فێربوونی زمانی ئینگلیزی',
                    link: 'https://www.gov.uk/government/publications/esol-qualifications',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی دارایی بۆ پەروەردە',
                    description: 'یارمەتی دارایی بۆ خوێندن',
                    link: 'https://www.gov.uk/student-finance',
                    source: 'UK Government',
                },
                {
                    title: 'کۆرسەکانی پیشەیی',
                    description: 'کۆرسەکانی پیشەیی و تەکنیکی',
                    link: 'https://www.gov.uk/further-education-courses',
                    source: 'UK Government',
                },
                {
                    title: 'پەروەردەی منداڵ',
                    description: 'زانیاری دەربارەی پەروەردەی منداڵ لە بەریتانیا',
                    link: 'https://www.gov.uk/types-of-school',
                    source: 'UK Government',
                },
            ],
        },
        healthcare: {
            description: 'ناساندن بە NHS، دۆزینەوەی دکتۆر، و خزمەتگوزاریە تەندروستیەکان.',
            resources: [
                {
                    title: 'ناساندن بە NHS',
                    description: 'چۆنیەتی ناساندن بە NHS',
                    link: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
                    source: 'NHS',
                },
                {
                    title: 'دۆزینەوەی دکتۆر',
                    description: 'دۆزینەوەی دکتۆری نزیک',
                    link: 'https://www.nhs.uk/service-search/find-a-gp',
                    source: 'NHS',
                },
                {
                    title: 'NHS 111',
                    description: 'یارمەتی تەندروستی ناپێویست',
                    link: 'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-111/',
                    phone: '111',
                    source: 'NHS',
                },
                {
                    title: 'دەستکەوتنی دەرمان',
                    description: 'زانیاری دەربارەی دەستکەوتنی دەرمان لە NHS',
                    link: 'https://www.nhs.uk/nhs-services/prescriptions-and-pharmacies/',
                    source: 'NHS',
                },
                {
                    title: 'تەندروستی دەروونی',
                    description: 'یارمەتی تەندروستی دەروونی',
                    link: 'https://www.nhs.uk/mental-health/',
                    source: 'NHS',
                },
                {
                    title: 'تەندروستی منداڵان',
                    description: 'خزمەتگوزاریە تەندروستیەکانی منداڵان',
                    link: 'https://www.nhs.uk/conditions/baby/health/',
                    source: 'NHS',
                },
                {
                    title: 'وەکسین',
                    description: 'زانیاری دەربارەی وەکسین لە بەریتانیا',
                    link: 'https://www.nhs.uk/conditions/vaccinations/',
                    source: 'NHS',
                },
            ],
        },
        legal: {
            description: 'یارمەتی یاسایی، یارمەتی بۆ کۆچکەران، و مافەکانت.',
            resources: [
                {
                    title: 'یارمەتی یاسایی',
                    description: 'یارمەتی یاسایی بەخۆڕایی',
                    link: 'https://www.gov.uk/legal-aid',
                    source: 'UK Government',
                },
                {
                    title: 'مافی کۆچکەران',
                    description: 'زانیاری دەربارەی مافەکانت',
                    link: 'https://www.gov.uk/government/organisations/immigration-enforcement',
                    source: 'UK Government',
                },
                {
                    title: 'Citizens Advice - یارمەتی یاسایی',
                    description: 'یارمەتی و ڕێنمایی یاسایی بەخۆڕایی',
                    link: 'https://www.citizensadvice.org.uk/law-and-courts/',
                    source: 'Citizens Advice',
                },
                {
                    title: 'دەستکەوتنی پارێزه‌ر',
                    description: 'چۆنیەتی دەستکەوتنی پارێزه‌ر',
                    link: 'https://www.gov.uk/find-legal-advice',
                    source: 'UK Government',
                },
                {
                    title: 'یارمەتی یاسایی بۆ کۆچکەران',
                    description: 'خزمەتگوزاریە یاساییەکان بۆ کۆچکەران',
                    link: 'https://www.gov.uk/government/organisations/immigration-enforcement',
                    source: 'UK Government',
                },
                {
                    title: 'مافی مرۆڤ',
                    description: 'زانیاری دەربارەی مافی مرۆڤ لە بەریتانیا',
                    link: 'https://www.equalityhumanrights.com/',
                    source: 'Equality and Human Rights Commission',
                },
            ],
        },
        financial: {
            description: 'بانک، یارمەتی دارایی، و بەشداریکردن لە سیستەمی دارایی.',
            resources: [
                {
                    title: 'کردنەوەی هەژماری بانک',
                    description: 'چۆنیەتی کردنەوەی هەژمار لە بانک',
                    link: 'https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-open-a-bank-account',
                    source: 'Money Helper',
                },
                {
                    title: 'یارمەتی دارایی',
                    description: 'یارمەتی دارایی بۆ کەسانی بەدەرهاتوو',
                    link: 'https://www.gov.uk/browse/benefits',
                    source: 'UK Government',
                },
                {
                    title: 'Universal Credit',
                    description: 'یارمەتی دارایی سەرەکی',
                    link: 'https://www.gov.uk/universal-credit',
                    source: 'UK Government',
                },
                {
                    title: 'Child Benefit',
                    description: 'یارمەتی دارایی بۆ منداڵ',
                    link: 'https://www.gov.uk/child-benefit',
                    source: 'UK Government',
                },
                {
                    title: 'باج',
                    description: 'زانیاری دەربارەی باج لە بەریتانیا',
                    link: 'https://www.gov.uk/tax-uk-income-live-abroad',
                    source: 'UK Government',
                },
                {
                    title: 'کردنەوەی هەژماری بانک بەبێ نیشانە',
                    description: 'کردنەوەی هەژماری بانک بۆ کەسانی بەبێ نیشانە',
                    link: 'https://www.moneyhelper.org.uk/en/everyday-money/banking/basic-bank-accounts',
                    source: 'Money Helper',
                },
                {
                    title: 'یارمەتی کرێ',
                    description: 'یارمەتی کرێ و نیشتەجێبوون',
                    link: 'https://www.gov.uk/housing-benefit',
                    source: 'UK Government',
                },
            ],
        },
        culture: {
            description: 'ناوەندەکانی کۆمەڵایەتی، ڕووداوەکان، و سەرچاوە کلتوریەکان.',
            resources: [
                {
                    title: 'ناوەندەکانی کۆمەڵایەتی',
                    description: 'دۆزینەوەی ناوەندە کۆمەڵایەتیەکان',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'UK Government',
                },
                {
                    title: 'کۆمەڵگای عێراقی لە بەریتانیا',
                    description: 'دۆزینەوەی کۆمەڵگا و ناوەندە کلتوریەکان',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'Local Councils',
                },
                {
                    title: 'ڕووداوە کلتوریەکان',
                    description: 'ڕووداوە کلتوریەکان و بۆنەکان',
                    link: 'https://www.visitbritain.com/gb/en/events',
                    source: 'Visit Britain',
                },
                {
                    title: 'کۆمەڵگای کوردی',
                    description: 'ناوەندەکانی کۆمەڵگای کوردی لە بەریتانیا',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'Community Organizations',
                },
            ],
        },
        emergency: {
            description: 'ژمارەکانی فریاگوزاری، پشتگیری قەیران، و یارمەتی فوری.',
            resources: [
                {
                    title: 'ژمارەی فریاگوزاری',
                    description: '999 بۆ پۆلیس، ئاگرکوژێنەوە، یان ئەمبولانس',
                    phone: '999',
                    source: 'Emergency Services',
                },
                {
                    title: 'ژمارەی ناپێویست',
                    description: '101 بۆ پۆلیس (ناپێویست)',
                    phone: '101',
                    source: 'Police Non-Emergency',
                },
                {
                    title: 'یارمەتی فوری تەندروستی',
                    description: '111 بۆ یارمەتی تەندروستی فوری',
                    phone: '111',
                    source: 'NHS 111',
                },
                {
                    title: 'یارمەتی قەیران',
                    description: 'Samaritans - یارمەتی دەروونی لە کاتی قەیران',
                    phone: '116 123',
                    link: 'https://www.samaritans.org/',
                    source: 'Samaritans',
                },
                {
                    title: 'یارمەتی دۆمەستی',
                    description: 'Refuge - یارمەتی بۆ قوربانیانی دۆمەستی',
                    phone: '0808 2000 247',
                    link: 'https://www.refuge.org.uk/',
                    source: 'Refuge',
                },
                {
                    title: 'یارمەتی منداڵان',
                    description: 'Childline - یارمەتی بۆ منداڵان',
                    phone: '0800 1111',
                    link: 'https://www.childline.org.uk/',
                    source: 'Childline',
                },
            ],
        },
    },
    ar: {
        immigration: {
            description: 'معلومات حول الهجرة إلى المملكة المتحدة، التأشيرات، والوثائق المطلوبة.',
            resources: [
                {
                    title: 'موقع الهجرة في المملكة المتحدة',
                    description: 'معلومات رسمية حول الهجرة والتأشيرات',
                    link: 'https://www.gov.uk/browse/visas-immigration',
                    source: 'UK Government',
                },
                {
                    title: 'خدمات الهجرة في المملكة المتحدة',
                    description: 'مساعدة للحصول على التأشيرة والهجرة',
                    link: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration',
                    source: 'UK Visas and Immigration',
                },
                {
                    title: 'الوثائق المطلوبة للتأشيرة',
                    description: 'قائمة بالوثائق المطلوبة لأنواع التأشيرات المختلفة',
                    link: 'https://www.gov.uk/check-uk-visa',
                    source: 'UK Government',
                },
                {
                    title: 'التقدم بطلب للحصول على التأشيرة',
                    description: 'كيفية التقدم بطلب للحصول على التأشيرة',
                    link: 'https://www.gov.uk/apply-to-come-to-the-uk',
                    source: 'UK Government',
                },
                {
                    title: 'تصريح الإقامة البيومترية (BRP)',
                    description: 'معلومات حول BRP وكيفية الحصول عليه',
                    link: 'https://www.gov.uk/biometric-residence-permits',
                    source: 'UK Government',
                },
                {
                    title: 'الإقامة الدائمة',
                    description: 'معلومات حول الإقامة الدائمة في المملكة المتحدة',
                    link: 'https://www.gov.uk/browse/visas-immigration/settle-in-the-uk',
                    source: 'UK Government',
                },
                {
                    title: 'Citizens Advice - مساعدة الهجرة',
                    description: 'المساعدة والنصائح حول الهجرة',
                    link: 'https://www.citizensadvice.org.uk/immigration/',
                    source: 'Citizens Advice',
                },
            ],
        },
        housing: {
            description: 'مساعدة حول السكن، الإيجار، والإسكان الاجتماعي.',
            resources: [
                {
                    title: 'الإسكان الاجتماعي',
                    description: 'معلومات حول الإسكان الاجتماعي في المملكة المتحدة',
                    link: 'https://www.gov.uk/council-housing',
                    source: 'UK Government',
                },
                {
                    title: 'مساعدة الإيجار (Housing Benefit)',
                    description: 'مساعدة الإيجار للأشخاص المحتاجين',
                    link: 'https://www.gov.uk/housing-benefit',
                    source: 'UK Government',
                },
                {
                    title: 'دليل الإيجار',
                    description: 'نصائح حول الإيجار وحقوق المستأجر',
                    link: 'https://www.gov.uk/private-renting',
                    source: 'UK Government',
                },
                {
                    title: 'مساعدة الإيجار (Universal Credit)',
                    description: 'مساعدة الإيجار تحت Universal Credit',
                    link: 'https://www.gov.uk/housing-cost-element',
                    source: 'UK Government',
                },
                {
                    title: 'مشاكل السكن',
                    description: 'كيفية حل مشاكل السكن',
                    link: 'https://www.shelter.org.uk/',
                    source: 'Shelter',
                },
                {
                    title: 'العثور على سكن للإيجار',
                    description: 'كيفية العثور على سكن للإيجار',
                    link: 'https://www.gov.uk/private-renting',
                    source: 'UK Government',
                },
                {
                    title: 'الإسكان الاجتماعي - التقديم',
                    description: 'كيفية التقديم للحصول على إسكان اجتماعي',
                    link: 'https://www.gov.uk/apply-for-council-housing',
                    source: 'UK Government',
                },
            ],
        },
        employment: {
            description: 'العثور على عمل، مساعدة حول السيرة الذاتية، وتصاريح العمل.',
            resources: [
                {
                    title: 'Jobcentre Plus',
                    description: 'خدمات البحث عن عمل',
                    link: 'https://www.gov.uk/contact-jobcentre-plus',
                    source: 'UK Government',
                },
                {
                    title: 'مساعدة السيرة الذاتية',
                    description: 'نصائح حول إنشاء السيرة الذاتية',
                    link: 'https://www.gov.uk/cv-and-covering-letter-examples',
                    source: 'UK Government',
                },
                {
                    title: 'تصريح العمل',
                    description: 'معلومات حول تصريح العمل في المملكة المتحدة',
                    link: 'https://www.gov.uk/uk-visa-sponsorship-employers',
                    source: 'UK Government',
                },
                {
                    title: 'رقم التأمين الوطني (National Insurance)',
                    description: 'كيفية الحصول على رقم التأمين الوطني',
                    link: 'https://www.gov.uk/apply-national-insurance-number',
                    source: 'UK Government',
                },
                {
                    title: 'المساعدة المالية للعمل',
                    description: 'Universal Credit والمساعدة المالية للعمل',
                    link: 'https://www.gov.uk/universal-credit',
                    source: 'UK Government',
                },
                {
                    title: 'البحث عن عمل',
                    description: 'الموقع الرسمي للبحث عن عمل',
                    link: 'https://www.gov.uk/find-a-job',
                    source: 'UK Government',
                },
                {
                    title: 'مساعدة حول المقابلة',
                    description: 'نصائح حول كيفية الاستعداد للمقابلة',
                    link: 'https://www.gov.uk/job-interview-tips',
                    source: 'UK Government',
                },
                {
                    title: 'حقوق العامل',
                    description: 'معلومات حول حقوق وحمايات العامل في المملكة المتحدة',
                    link: 'https://www.gov.uk/employment-rights',
                    source: 'UK Government',
                },
            ],
        },
        education: {
            description: 'المدارس، الدورات، والتعليم في المملكة المتحدة.',
            resources: [
                {
                    title: 'المدارس في المملكة المتحدة',
                    description: 'معلومات حول المدارس',
                    link: 'https://www.gov.uk/find-school-in-england',
                    source: 'UK Government',
                },
                {
                    title: 'الكليات والجامعات',
                    description: 'معلومات حول التعليم العالي',
                    link: 'https://www.gov.uk/government/organisations/department-for-education',
                    source: 'UK Government',
                },
                {
                    title: 'التسجيل في المدرسة',
                    description: 'كيفية تسجيل الطفل في المدرسة',
                    link: 'https://www.gov.uk/schools-admissions',
                    source: 'UK Government',
                },
                {
                    title: 'دورات اللغة الإنجليزية (ESOL)',
                    description: 'دورات تعلم اللغة الإنجليزية',
                    link: 'https://www.gov.uk/government/publications/esol-qualifications',
                    source: 'UK Government',
                },
                {
                    title: 'المساعدة المالية للتعليم',
                    description: 'المساعدة المالية للدراسة',
                    link: 'https://www.gov.uk/student-finance',
                    source: 'UK Government',
                },
                {
                    title: 'الدورات المهنية',
                    description: 'الدورات المهنية والتقنية',
                    link: 'https://www.gov.uk/further-education-courses',
                    source: 'UK Government',
                },
                {
                    title: 'تعليم الأطفال',
                    description: 'معلومات حول تعليم الأطفال في المملكة المتحدة',
                    link: 'https://www.gov.uk/types-of-school',
                    source: 'UK Government',
                },
            ],
        },
        healthcare: {
            description: 'التسجيل في NHS، العثور على طبيب، والخدمات الصحية.',
            resources: [
                {
                    title: 'التسجيل في NHS',
                    description: 'كيفية التسجيل في NHS',
                    link: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
                    source: 'NHS',
                },
                {
                    title: 'العثور على طبيب',
                    description: 'العثور على طبيب قريب',
                    link: 'https://www.nhs.uk/service-search/find-a-gp',
                    source: 'NHS',
                },
                {
                    title: 'NHS 111',
                    description: 'المساعدة الصحية غير الطارئة',
                    link: 'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-111/',
                    phone: '111',
                    source: 'NHS',
                },
                {
                    title: 'الحصول على الأدوية',
                    description: 'معلومات حول الحصول على الأدوية من NHS',
                    link: 'https://www.nhs.uk/nhs-services/prescriptions-and-pharmacies/',
                    source: 'NHS',
                },
                {
                    title: 'الصحة النفسية',
                    description: 'المساعدة في الصحة النفسية',
                    link: 'https://www.nhs.uk/mental-health/',
                    source: 'NHS',
                },
                {
                    title: 'صحة الأطفال',
                    description: 'الخدمات الصحية للأطفال',
                    link: 'https://www.nhs.uk/conditions/baby/health/',
                    source: 'NHS',
                },
                {
                    title: 'التطعيم',
                    description: 'معلومات حول التطعيم في المملكة المتحدة',
                    link: 'https://www.nhs.uk/conditions/vaccinations/',
                    source: 'NHS',
                },
            ],
        },
        legal: {
            description: 'المساعدة القانونية، المساعدة للمهاجرين، وحقوقك.',
            resources: [
                {
                    title: 'المساعدة القانونية',
                    description: 'المساعدة القانونية المجانية',
                    link: 'https://www.gov.uk/legal-aid',
                    source: 'UK Government',
                },
                {
                    title: 'حقوق المهاجرين',
                    description: 'معلومات حول حقوقك',
                    link: 'https://www.gov.uk/government/organisations/immigration-enforcement',
                    source: 'UK Government',
                },
                {
                    title: 'Citizens Advice - المساعدة القانونية',
                    description: 'المساعدة والنصائح القانونية المجانية',
                    link: 'https://www.citizensadvice.org.uk/law-and-courts/',
                    source: 'Citizens Advice',
                },
                {
                    title: 'العثور على محام',
                    description: 'كيفية العثور على محام',
                    link: 'https://www.gov.uk/find-legal-advice',
                    source: 'UK Government',
                },
                {
                    title: 'المساعدة القانونية للمهاجرين',
                    description: 'الخدمات القانونية للمهاجرين',
                    link: 'https://www.gov.uk/government/organisations/immigration-enforcement',
                    source: 'UK Government',
                },
                {
                    title: 'حقوق الإنسان',
                    description: 'معلومات حول حقوق الإنسان في المملكة المتحدة',
                    link: 'https://www.equalityhumanrights.com/',
                    source: 'Equality and Human Rights Commission',
                },
            ],
        },
        financial: {
            description: 'البنوك، المساعدة المالية، والاندماج في النظام المالي.',
            resources: [
                {
                    title: 'فتح حساب مصرفي',
                    description: 'كيفية فتح حساب في البنك',
                    link: 'https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-open-a-bank-account',
                    source: 'Money Helper',
                },
                {
                    title: 'المساعدة المالية',
                    description: 'المساعدة المالية للأشخاص المحتاجين',
                    link: 'https://www.gov.uk/browse/benefits',
                    source: 'UK Government',
                },
                {
                    title: 'Universal Credit',
                    description: 'المساعدة المالية الرئيسية',
                    link: 'https://www.gov.uk/universal-credit',
                    source: 'UK Government',
                },
                {
                    title: 'Child Benefit',
                    description: 'المساعدة المالية للأطفال',
                    link: 'https://www.gov.uk/child-benefit',
                    source: 'UK Government',
                },
                {
                    title: 'الضرائب',
                    description: 'معلومات حول الضرائب في المملكة المتحدة',
                    link: 'https://www.gov.uk/tax-uk-income-live-abroad',
                    source: 'UK Government',
                },
                {
                    title: 'فتح حساب مصرفي بدون عنوان',
                    description: 'فتح حساب مصرفي للأشخاص بدون عنوان',
                    link: 'https://www.moneyhelper.org.uk/en/everyday-money/banking/basic-bank-accounts',
                    source: 'Money Helper',
                },
                {
                    title: 'مساعدة الإيجار',
                    description: 'مساعدة الإيجار والسكن',
                    link: 'https://www.gov.uk/housing-benefit',
                    source: 'UK Government',
                },
            ],
        },
        culture: {
            description: 'مراكز المجتمع، الأحداث، والموارد الثقافية.',
            resources: [
                {
                    title: 'مراكز المجتمع',
                    description: 'العثور على مراكز المجتمع',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'UK Government',
                },
                {
                    title: 'المجتمع العراقي في المملكة المتحدة',
                    description: 'العثور على المجتمعات والمراكز الثقافية',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'Local Councils',
                },
                {
                    title: 'الأحداث الثقافية',
                    description: 'الأحداث الثقافية والمهرجانات',
                    link: 'https://www.visitbritain.com/gb/en/events',
                    source: 'Visit Britain',
                },
                {
                    title: 'المجتمع الكردي',
                    description: 'مراكز المجتمع الكردي في المملكة المتحدة',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'Community Organizations',
                },
            ],
        },
        emergency: {
            description: 'أرقام الطوارئ، دعم الأزمات، والمساعدة الفورية.',
            resources: [
                {
                    title: 'رقم الطوارئ',
                    description: '999 للشرطة، الإطفاء، أو الإسعاف',
                    phone: '999',
                    source: 'Emergency Services',
                },
                {
                    title: 'رقم غير الطوارئ',
                    description: '101 للشرطة (غير طوارئ)',
                    phone: '101',
                    source: 'Police Non-Emergency',
                },
                {
                    title: 'المساعدة الصحية الفورية',
                    description: '111 للمساعدة الصحية الفورية',
                    phone: '111',
                    source: 'NHS 111',
                },
                {
                    title: 'مساعدة الأزمات',
                    description: 'Samaritans - المساعدة النفسية في حالات الأزمات',
                    phone: '116 123',
                    link: 'https://www.samaritans.org/',
                    source: 'Samaritans',
                },
                {
                    title: 'مساعدة العنف المنزلي',
                    description: 'Refuge - المساعدة لضحايا العنف المنزلي',
                    phone: '0808 2000 247',
                    link: 'https://www.refuge.org.uk/',
                    source: 'Refuge',
                },
                {
                    title: 'مساعدة الأطفال',
                    description: 'Childline - المساعدة للأطفال',
                    phone: '0800 1111',
                    link: 'https://www.childline.org.uk/',
                    source: 'Childline',
                },
            ],
        },
    },
    en: {
        immigration: {
            description: 'Information about immigration to the UK, visas, and required documents.',
            resources: [
                {
                    title: 'UK Immigration Website',
                    description: 'Official information about immigration and visas',
                    link: 'https://www.gov.uk/browse/visas-immigration',
                    source: 'UK Government',
                },
                {
                    title: 'UK Visas and Immigration Services',
                    description: 'Help with visas and immigration',
                    link: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration',
                    source: 'UK Visas and Immigration',
                },
                {
                    title: 'Required Documents for Visa',
                    description: 'List of required documents for different visa types',
                    link: 'https://www.gov.uk/check-uk-visa',
                    source: 'UK Government',
                },
                {
                    title: 'Visa Application',
                    description: 'How to apply for a visa',
                    link: 'https://www.gov.uk/apply-to-come-to-the-uk',
                    source: 'UK Government',
                },
                {
                    title: 'Biometric Residence Permit (BRP)',
                    description: 'Information about BRP and how to collect it',
                    link: 'https://www.gov.uk/biometric-residence-permits',
                    source: 'UK Government',
                },
                {
                    title: 'Settlement',
                    description: 'Information about settlement in the UK',
                    link: 'https://www.gov.uk/browse/visas-immigration/settle-in-the-uk',
                    source: 'UK Government',
                },
                {
                    title: 'Citizens Advice - Immigration Help',
                    description: 'Help and guidance about immigration',
                    link: 'https://www.citizensadvice.org.uk/immigration/',
                    source: 'Citizens Advice',
                },
            ],
        },
        housing: {
            description: 'Help with accommodation, rent, and social housing.',
            resources: [
                {
                    title: 'Social Housing',
                    description: 'Information about social housing in the UK',
                    link: 'https://www.gov.uk/council-housing',
                    source: 'UK Government',
                },
                {
                    title: 'Housing Benefit',
                    description: 'Housing benefit for low-income individuals',
                    link: 'https://www.gov.uk/housing-benefit',
                    source: 'UK Government',
                },
                {
                    title: 'Renting Guide',
                    description: 'Guidance about renting and tenant rights',
                    link: 'https://www.gov.uk/private-renting',
                    source: 'UK Government',
                },
                {
                    title: 'Housing Support (Universal Credit)',
                    description: 'Housing support under Universal Credit',
                    link: 'https://www.gov.uk/housing-cost-element',
                    source: 'UK Government',
                },
                {
                    title: 'Housing Problems',
                    description: 'How to resolve housing problems',
                    link: 'https://www.shelter.org.uk/',
                    source: 'Shelter',
                },
                {
                    title: 'Finding a Rental Property',
                    description: 'How to find a rental property',
                    link: 'https://www.gov.uk/private-renting',
                    source: 'UK Government',
                },
                {
                    title: 'Social Housing - Application',
                    description: 'How to apply for social housing',
                    link: 'https://www.gov.uk/apply-for-council-housing',
                    source: 'UK Government',
                },
            ],
        },
        employment: {
            description: 'Finding work, CV help, and work permits.',
            resources: [
                {
                    title: 'Jobcentre Plus',
                    description: 'Job search services',
                    link: 'https://www.gov.uk/contact-jobcentre-plus',
                    source: 'UK Government',
                },
                {
                    title: 'CV Help',
                    description: 'Guidance on creating a CV',
                    link: 'https://www.gov.uk/cv-and-covering-letter-examples',
                    source: 'UK Government',
                },
                {
                    title: 'Work Permit',
                    description: 'Information about work permits in the UK',
                    link: 'https://www.gov.uk/uk-visa-sponsorship-employers',
                    source: 'UK Government',
                },
                {
                    title: 'National Insurance Number',
                    description: 'How to get a National Insurance number',
                    link: 'https://www.gov.uk/apply-national-insurance-number',
                    source: 'UK Government',
                },
                {
                    title: 'Financial Support for Work',
                    description: 'Universal Credit and financial support for work',
                    link: 'https://www.gov.uk/universal-credit',
                    source: 'UK Government',
                },
                {
                    title: 'Find a Job',
                    description: 'Official job search website',
                    link: 'https://www.gov.uk/find-a-job',
                    source: 'UK Government',
                },
                {
                    title: 'Interview Help',
                    description: 'Guidance on how to prepare for interviews',
                    link: 'https://www.gov.uk/job-interview-tips',
                    source: 'UK Government',
                },
                {
                    title: 'Workers Rights',
                    description: 'Information about rights and workers rights in the UK',
                    link: 'https://www.gov.uk/employment-rights',
                    source: 'UK Government',
                },
            ],
        },
        education: {
            description: 'Schools, courses, and education in the UK.',
            resources: [
                {
                    title: 'Schools in the UK',
                    description: 'Information about schools',
                    link: 'https://www.gov.uk/find-school-in-england',
                    source: 'UK Government',
                },
                {
                    title: 'Colleges and Universities',
                    description: 'Information about higher education',
                    link: 'https://www.gov.uk/government/organisations/department-for-education',
                    source: 'UK Government',
                },
                {
                    title: 'School Registration',
                    description: 'How to register a child for school',
                    link: 'https://www.gov.uk/schools-admissions',
                    source: 'UK Government',
                },
                {
                    title: 'English Language Courses (ESOL)',
                    description: 'English language learning courses',
                    link: 'https://www.gov.uk/government/publications/esol-qualifications',
                    source: 'UK Government',
                },
                {
                    title: 'Financial Support for Education',
                    description: 'Financial support for studying',
                    link: 'https://www.gov.uk/student-finance',
                    source: 'UK Government',
                },
                {
                    title: 'Vocational Courses',
                    description: 'Vocational and technical courses',
                    link: 'https://www.gov.uk/further-education-courses',
                    source: 'UK Government',
                },
                {
                    title: 'Child Education',
                    description: 'Information about child education in the UK',
                    link: 'https://www.gov.uk/types-of-school',
                    source: 'UK Government',
                },
            ],
        },
        healthcare: {
            description: 'NHS registration, finding a doctor, and health services.',
            resources: [
                {
                    title: 'NHS Registration',
                    description: 'How to register with the NHS',
                    link: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
                    source: 'NHS',
                },
                {
                    title: 'Find a Doctor',
                    description: 'Find a nearby doctor',
                    link: 'https://www.nhs.uk/service-search/find-a-gp',
                    source: 'NHS',
                },
                {
                    title: 'NHS 111',
                    description: 'Non-urgent health help',
                    link: 'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-111/',
                    phone: '111',
                    source: 'NHS',
                },
                {
                    title: 'Prescription Access',
                    description: 'Information about prescription access through NHS',
                    link: 'https://www.nhs.uk/nhs-services/prescriptions-and-pharmacies/',
                    source: 'NHS',
                },
                {
                    title: 'Mental Health',
                    description: 'Mental health support',
                    link: 'https://www.nhs.uk/mental-health/',
                    source: 'NHS',
                },
                {
                    title: 'Child Health',
                    description: 'Child health services',
                    link: 'https://www.nhs.uk/conditions/baby/health/',
                    source: 'NHS',
                },
                {
                    title: 'Vaccinations',
                    description: 'Information about vaccinations in the UK',
                    link: 'https://www.nhs.uk/conditions/vaccinations/',
                    source: 'NHS',
                },
            ],
        },
        legal: {
            description: 'Legal aid, help for immigrants, and your rights.',
            resources: [
                {
                    title: 'Legal Aid',
                    description: 'Free legal aid',
                    link: 'https://www.gov.uk/legal-aid',
                    source: 'UK Government',
                },
                {
                    title: 'Immigrant Rights',
                    description: 'Information about your rights',
                    link: 'https://www.gov.uk/government/organisations/immigration-enforcement',
                    source: 'UK Government',
                },
                {
                    title: 'Citizens Advice - Legal Help',
                    description: 'Free legal help and guidance',
                    link: 'https://www.citizensadvice.org.uk/law-and-courts/',
                    source: 'Citizens Advice',
                },
                {
                    title: 'Finding a Lawyer',
                    description: 'How to find a lawyer',
                    link: 'https://www.gov.uk/find-legal-advice',
                    source: 'UK Government',
                },
                {
                    title: 'Legal Help for Immigrants',
                    description: 'Legal services for immigrants',
                    link: 'https://www.gov.uk/government/organisations/immigration-enforcement',
                    source: 'UK Government',
                },
                {
                    title: 'Human Rights',
                    description: 'Information about human rights in the UK',
                    link: 'https://www.equalityhumanrights.com/',
                    source: 'Equality and Human Rights Commission',
                },
            ],
        },
        financial: {
            description: 'Banking, financial support, and joining the financial system.',
            resources: [
                {
                    title: 'Opening a Bank Account',
                    description: 'How to open a bank account',
                    link: 'https://www.moneyhelper.org.uk/en/everyday-money/banking/how-to-open-a-bank-account',
                    source: 'Money Helper',
                },
                {
                    title: 'Financial Support',
                    description: 'Financial support for low-income individuals',
                    link: 'https://www.gov.uk/browse/benefits',
                    source: 'UK Government',
                },
                {
                    title: 'Universal Credit',
                    description: 'Main financial support',
                    link: 'https://www.gov.uk/universal-credit',
                    source: 'UK Government',
                },
                {
                    title: 'Child Benefit',
                    description: 'Financial support for children',
                    link: 'https://www.gov.uk/child-benefit',
                    source: 'UK Government',
                },
                {
                    title: 'Tax',
                    description: 'Information about tax in the UK',
                    link: 'https://www.gov.uk/tax-uk-income-live-abroad',
                    source: 'UK Government',
                },
                {
                    title: 'Opening a Bank Account Without ID',
                    description: 'Opening a bank account for people without ID',
                    link: 'https://www.moneyhelper.org.uk/en/everyday-money/banking/basic-bank-accounts',
                    source: 'Money Helper',
                },
                {
                    title: 'Housing Benefit',
                    description: 'Housing benefit and accommodation',
                    link: 'https://www.gov.uk/housing-benefit',
                    source: 'UK Government',
                },
            ],
        },
        culture: {
            description: 'Community centers, events, and cultural resources.',
            resources: [
                {
                    title: 'Community Centers',
                    description: 'Find community centers',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'UK Government',
                },
                {
                    title: 'Iraqi Community in the UK',
                    description: 'Find community and cultural centers',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'Local Councils',
                },
                {
                    title: 'Cultural Events',
                    description: 'Cultural events and festivals',
                    link: 'https://www.visitbritain.com/gb/en/events',
                    source: 'Visit Britain',
                },
                {
                    title: 'Kurdish Community',
                    description: 'Kurdish community centers in the UK',
                    link: 'https://www.gov.uk/find-local-council',
                    source: 'Community Organizations',
                },
            ],
        },
        emergency: {
            description: 'Emergency numbers, crisis support, and urgent help.',
            resources: [
                {
                    title: 'Emergency Number',
                    description: '999 for police, fire, or ambulance',
                    phone: '999',
                    source: 'Emergency Services',
                },
                {
                    title: 'Non-Emergency Number',
                    description: '101 for police (non-emergency)',
                    phone: '101',
                    source: 'Police Non-Emergency',
                },
                {
                    title: 'Urgent Health Help',
                    description: '111 for urgent health help',
                    phone: '111',
                    source: 'NHS 111',
                },
                {
                    title: 'Crisis Help',
                    description: 'Samaritans - Mental health support in crisis',
                    phone: '116 123',
                    link: 'https://www.samaritans.org/',
                    source: 'Samaritans',
                },
                {
                    title: 'Domestic Violence Help',
                    description: 'Refuge - Help for domestic violence victims',
                    phone: '0808 2000 247',
                    link: 'https://www.refuge.org.uk/',
                    source: 'Refuge',
                },
                {
                    title: 'Children Help',
                    description: 'Childline - Help for children',
                    phone: '0800 1111',
                    link: 'https://www.childline.org.uk/',
                    source: 'Childline',
                },
            ],
        },
    },
};

export function getCategoryContent(categoryId: string, language: Language): CategoryContent | undefined {
    // Check if categoryId exists in the static content
    if (categoryId in categoryContentData[language]) {
        return categoryContentData[language][categoryId as CategoryKey];
    }
    return undefined;
}
