-- Create resources table to store HTML content for each category item
-- This table supports multiple languages (Kurdish, Arabic, and potentially English)

CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'ku',
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500),
    html_content TEXT NOT NULL,
    description TEXT,
    external_link VARCHAR(1000),
    phone VARCHAR(50),
    email VARCHAR(255),
    source VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT resources_category_check CHECK (category_id IN (
        'immigration', 'housing', 'employment', 'education', 
        'healthcare', 'legal', 'financial', 'culture', 'emergency'
    )),
    CONSTRAINT resources_language_check CHECK (language IN ('ku', 'ar', 'en')),
    CONSTRAINT resources_slug_unique UNIQUE (category_id, language, slug)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_language ON resources(language);
CREATE INDEX IF NOT EXISTS idx_resources_category_language ON resources(category_id, language);
CREATE INDEX IF NOT EXISTS idx_resources_active ON resources(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_display_order ON resources(category_id, language, display_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can read active resources)
CREATE POLICY "Public can read active resources"
    ON resources
    FOR SELECT
    USING (is_active = true);

-- Create policy for authenticated users to insert (if you want admin users to insert)
CREATE POLICY "Authenticated users can insert resources"
    ON resources
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update (if you want admin users to update)
CREATE POLICY "Authenticated users can update resources"
    ON resources
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for authenticated users to delete (if you want admin users to delete)
CREATE POLICY "Authenticated users can delete resources"
    ON resources
    FOR DELETE
    TO authenticated
    USING (true);

-- Example insert statements for Healthcare category
-- Kurdish (ku) examples
INSERT INTO resources (category_id, language, title, slug, html_content, description, external_link, source, display_order) VALUES
(
    'healthcare',
    'ku',
    'چۆنیەتی ناساندن بە GP',
    'how-to-register-with-gp',
    '<div>
        <h2>چۆنیەتی ناساندن بە GP</h2>
        <p>ناساندن بە دکتۆری خێزانی (GP) یەکێک لە گرنگترین هەنگاوەکانە بۆ بەکارهێنانی خزمەتگوزاریە تەندروستیەکانی NHS.</p>
        <h3>هەنگاوەکان:</h3>
        <ol>
            <li>دۆزینەوەی GP نزیک</li>
            <li>تەواوکردنی فۆرمی ناساندن</li>
            <li>ناردنی بەڵگەنامە پێویستەکان</li>
            <li>چاوەڕوانی پشتڕاستکردنەوە</li>
        </ol>
        <p><strong>تێبینی:</strong> دەتوانیت لە ماڵپەڕی NHS دۆزینەوەی GP بکەیت.</p>
    </div>',
    'زانیاری دەربارەی چۆنیەتی ناساندن بە دکتۆری خێزانی',
    'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
    'NHS',
    1
),
(
    'healthcare',
    'ku',
    'دۆزینەوەی دکتۆر',
    'find-a-doctor',
    '<div>
        <h2>دۆزینەوەی دکتۆر</h2>
        <p>دۆزینەوەی GP یان دکتۆری خێزانی یارمەتیت دەدات لە بەکارهێنانی خزمەتگوزاریە تەندروستیەکان.</p>
        <h3>چۆن دۆزی بدەیتەوە:</h3>
        <ul>
            <li>سەردانی ماڵپەڕی NHS بکە</li>
            <li>ناونیشانی خۆت بنووسە</li>
            <li>لیستی GP ەکان ببینە</li>
            <li>GP یەکی هەڵبژێرە کە نزیکت بێت</li>
        </ul>
    </div>',
    'دۆزینەوەی دکتۆری نزیک',
    'https://www.nhs.uk/service-search/find-a-gp',
    'NHS',
    2
);

-- Arabic (ar) examples
INSERT INTO resources (category_id, language, title, slug, html_content, description, external_link, source, display_order) VALUES
(
    'healthcare',
    'ar',
    'كيفية التسجيل في GP',
    'how-to-register-with-gp',
    '<div>
        <h2>كيفية التسجيل في GP</h2>
        <p>التسجيل لدى طبيب العائلة (GP) هو أحد أهم الخطوات لاستخدام خدمات NHS الصحية.</p>
        <h3>الخطوات:</h3>
        <ol>
            <li>العثور على GP قريب</li>
            <li>ملء نموذج التسجيل</li>
            <li>إرسال المستندات المطلوبة</li>
            <li>انتظار التأكيد</li>
        </ol>
        <p><strong>ملاحظة:</strong> يمكنك العثور على GP من موقع NHS.</p>
    </div>',
    'معلومات حول كيفية التسجيل لدى طبيب العائلة',
    'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
    'NHS',
    1
),
(
    'healthcare',
    'ar',
    'العثور على طبيب',
    'find-a-doctor',
    '<div>
        <h2>العثور على طبيب</h2>
        <p>العثور على GP أو طبيب العائلة يساعدك في استخدام الخدمات الصحية.</p>
        <h3>كيف تجده:</h3>
        <ul>
            <li>قم بزيارة موقع NHS</li>
            <li>اكتب عنوانك</li>
            <li>شاهد قائمة GP</li>
            <li>اختر GP قريب منك</li>
        </ul>
    </div>',
    'العثور على طبيب قريب',
    'https://www.nhs.uk/service-search/find-a-gp',
    'NHS',
    2
);

-- Example insert statements for Housing category
-- Kurdish (ku) examples
INSERT INTO resources (category_id, language, title, slug, html_content, description, external_link, source, display_order) VALUES
(
    'housing',
    'ku',
    'یارمەتی کرێ (Housing Benefit)',
    'housing-benefit',
    '<div>
        <h2>یارمەتی کرێ (Housing Benefit)</h2>
        <p>Housing Benefit یارمەتییەکی دارایییە بۆ یارمەتی کردن لە پارەدانی کرێی خانوو.</p>
        <h3>کێ دەتوانێت داوای بکات:</h3>
        <ul>
            <li>کەسانی بەدەرهاتوو</li>
            <li>کەسانی بێکار</li>
            <li>کەسانی بە کرێژن</li>
        </ul>
        <h3>چۆن داوای بکەیت:</h3>
        <ol>
            <li>سەردانی کۆنسڵی ناوچەکەت بکە</li>
            <li>فۆرمی Housing Benefit پر بکە</li>
            <li>بەڵگەنامە پێویستەکان بنێرە</li>
        </ol>
    </div>',
    'یارمەتی کرێ بۆ کەسانی بەدەرهاتوو',
    'https://www.gov.uk/housing-benefit',
    'UK Government',
    1
),
(
    'housing',
    'ku',
    'باجی کۆنسڵ (Council Tax)',
    'council-tax',
    '<div>
        <h2>باجی کۆنسڵ (Council Tax)</h2>
        <p>Council Tax باجێکە کە بۆ خزمەتگوزاریەکانی کۆنسڵ دەدرێت.</p>
        <h3>ئەگەری کەمکردنەوە:</h3>
        <ul>
            <li>تەنهاژنان</li>
            <li>بێکاربوون</li>
            <li>کەمبوونی داهات</li>
        </ul>
    </div>',
    'زانیاری دەربارەی باجی کۆنسڵ',
    'https://www.gov.uk/council-tax',
    'UK Government',
    2
),
(
    'housing',
    'ku',
    'Universal Credit',
    'universal-credit',
    '<div>
        <h2>Universal Credit</h2>
        <p>Universal Credit یارمەتی داراییەکی گشتگیرە کە لەگەڵ یارمەتی کرێ دەگرێتەوە.</p>
        <h3>شامەڵدەکات:</h3>
        <ul>
            <li>یارمەتی کرێ</li>
            <li>یارمەتی بێکاری</li>
            <li>یارمەتی منداڵ</li>
        </ul>
    </div>',
    'یارمەتی کرێ لە ژێر Universal Credit',
    'https://www.gov.uk/universal-credit',
    'UK Government',
    3
);

-- Arabic (ar) examples for Housing
INSERT INTO resources (category_id, language, title, slug, html_content, description, external_link, source, display_order) VALUES
(
    'housing',
    'ar',
    'مساعدة الإيجار (Housing Benefit)',
    'housing-benefit',
    '<div>
        <h2>مساعدة الإيجار (Housing Benefit)</h2>
        <p>Housing Benefit هي مساعدة مالية لمساعدتك في دفع إيجار المنزل.</p>
        <h3>من يمكنه التقديم:</h3>
        <ul>
            <li>الأشخاص المحتاجين</li>
            <li>العاطلين عن العمل</li>
            <li>المستأجرين</li>
        </ul>
        <h3>كيفية التقديم:</h3>
        <ol>
            <li>قم بزيارة مجلس منطقتك</li>
            <li>املأ نموذج Housing Benefit</li>
            <li>أرسل المستندات المطلوبة</li>
        </ol>
    </div>',
    'مساعدة الإيجار للأشخاص المحتاجين',
    'https://www.gov.uk/housing-benefit',
    'UK Government',
    1
),
(
    'housing',
    'ar',
    'ضريبة المجلس (Council Tax)',
    'council-tax',
    '<div>
        <h2>ضريبة المجلس (Council Tax)</h2>
        <p>Council Tax هي ضريبة تدفع لخدمات المجلس.</p>
        <h3>إمكانية التخفيض:</h3>
        <ul>
            <li>العيش وحيداً</li>
            <li>البطالة</li>
            <li>انخفاض الدخل</li>
        </ul>
    </div>',
    'معلومات حول ضريبة المجلس',
    'https://www.gov.uk/council-tax',
    'UK Government',
    2
),
(
    'housing',
    'ar',
    'Universal Credit',
    'universal-credit',
    '<div>
        <h2>Universal Credit</h2>
        <p>Universal Credit هي مساعدة مالية شاملة تشمل مساعدة الإيجار.</p>
        <h3>يشمل:</h3>
        <ul>
            <li>مساعدة الإيجار</li>
            <li>مساعدة البطالة</li>
            <li>مساعدة الطفل</li>
        </ul>
    </div>',
    'مساعدة الإيجار تحت Universal Credit',
    'https://www.gov.uk/universal-credit',
    'UK Government',
    3
);

-- Create a view for easy querying of active resources by category and language
CREATE OR REPLACE VIEW resources_by_category AS
SELECT 
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
    created_at,
    updated_at
FROM resources
WHERE is_active = true
ORDER BY category_id, language, display_order, title;

-- Create a function to get resources by category and language
CREATE OR REPLACE FUNCTION get_resources_by_category(
    p_category_id VARCHAR(50),
    p_language VARCHAR(10) DEFAULT 'ku'
)
RETURNS TABLE (
    id UUID,
    category_id VARCHAR(50),
    language VARCHAR(10),
    title VARCHAR(500),
    slug VARCHAR(500),
    html_content TEXT,
    description TEXT,
    external_link VARCHAR(1000),
    phone VARCHAR(50),
    email VARCHAR(255),
    source VARCHAR(255),
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.category_id,
        r.language,
        r.title,
        r.slug,
        r.html_content,
        r.description,
        r.external_link,
        r.phone,
        r.email,
        r.source,
        r.display_order,
        r.created_at,
        r.updated_at
    FROM resources r
    WHERE r.category_id = p_category_id
        AND r.language = p_language
        AND r.is_active = true
    ORDER BY r.display_order, r.title;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

