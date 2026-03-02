-- SQL to insert the formatted GP Registration content into Supabase
-- Copy the HTML content from formatted_gp_registration_content.html and paste it here

INSERT INTO resources (
  category_id,
  language,
  title,
  slug,
  html_content,
  description,
  external_link,
  source,
  display_order,
  is_active
) VALUES (
  'healthcare',
  'ku',
  'چۆنیەتی خۆتۆمارکردن لەگەڵ پزیشکی خێزان (GP)',
  'how-to-register-with-gp',
  '<div class="space-y-4">
  
  <!-- Title & Summary Card -->
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <h2 class="text-2xl font-bold text-slate-900 mb-2">
      چۆنیەتی خۆتۆمارکردن لەگەڵ پزیشکی خێزان (GP)
    </h2>
    <p class="text-sm text-slate-500 mb-4">
      <span class="inline-flex items-center gap-1">
        <span>🕒</span>
        <span>٢ هەفتە لەمەوبەر نوێکراوەتەوە</span>
      </span>
    </p>
    <div class="text-slate-700 leading-relaxed">
      <p>تۆ مافی ئەوەت هەیە کە بە خۆڕایی خۆت لەگەڵ نۆرینگەی پزیشکی گشتی (GP) تۆمار بکەیت. ئەمە ئەو پزیشکە سەرەکییەیە کە بۆ کێشە تەندروستییەکان سەردانی دەکەیت.</p>
    </div>
  </div>

  <!-- Quick Facts Card -->
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
      <span class="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
      بۆ کێیە؟
    </h3>
    <div class="space-y-3">
      <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
        <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
          👥
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900 mb-1">کێ؟</p>
          <p class="text-sm text-slate-700">هەموو کەسێک لە ئینگلتەرا (بە داواکارانی پەنابەریشەوە)</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
        <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
          🆔
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900 mb-1">بەڵگەنامە؟</p>
          <p class="text-sm text-slate-700"><strong class="text-indigo-700">هیچ شتێک پێویست نییە.</strong> پێویستت بە ناسنامە، بەڵگەی ناونیشان، یان ژمارەی NHS نییە.</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
        <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
          💰
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900 mb-1">نرخ؟</p>
          <p class="text-sm text-slate-700">خۆڕایی</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Step-by-Step Card -->
  <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-5 pb-0">
      <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span class="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
        چۆنیەتی ئەنجامدانی؟
      </h3>
    </div>
    <div class="divide-y divide-slate-100">
      
      <!-- Step 1 -->
      <details class="group" open>
        <summary class="flex items-center justify-between p-5 font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span class="text-slate-900">نۆرینگەیەکی GP بدۆزەرەوە</span>
          </div>
          <span class="text-slate-500 group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div class="px-5 pb-5 pt-0 text-slate-700 leading-relaxed">
          <p>ئامرازی ''Find a GP'' لە ماڵپەڕی NHS بەکاربهێنە بۆ دۆزینەوەی نۆرینگە لە نزیک کۆدی پۆستەی خۆت. زۆربەی خەڵک لە نزیک شوێنی نیشتەجێبوونیان خۆیان تۆمار دەکەن.</p>
        </div>
      </details>

      <!-- Step 2 -->
      <details class="group">
        <summary class="flex items-center justify-between p-5 font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span class="text-slate-900">فۆڕمی تۆمارکردن پڕ بکەرەوە</span>
          </div>
          <span class="text-slate-500 group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div class="px-5 pb-5 pt-0 text-slate-700 leading-relaxed">
          <p>زۆربەی نۆرینگەکان داوات لێدەکەن فۆرمێک بە ناوی ''GMS1'' پڕ بکەیتەوە. زۆرجار دەتوانیت ئەمە لە پێشوازی نۆرینگەکە یان ماڵپەڕەکەیان وەربگریت. هەروەها زۆر نۆرینگە ڕێگەت پێدەدەن ئۆنلاین خۆت تۆمار بکەیت.</p>
        </div>
      </details>

      <!-- Step 3 -->
      <details class="group">
        <summary class="flex items-center justify-between p-5 font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span class="text-slate-900">فۆڕمەکە پێشکەش بکە</span>
          </div>
          <span class="text-slate-500 group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div class="px-5 pb-5 pt-0 text-slate-700 leading-relaxed">
          <p>فۆڕمەکە بدەرەوە بە نۆرینگەکە. بە گشتی نزیکەی ٥ ڕۆژی پێدەچێت تا تۆمار دەکرێیت. ئەوان پەیوەندیت پێوە دەکەن بۆ دڵنیاکردنەوە.</p>
        </div>
      </details>
      
    </div>
  </div>

  <!-- Other Registration Methods -->
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
      <span class="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
      ڕێگاکانی تری تۆمارکردن
    </h3>
    <div class="space-y-3">
      <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
        <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-lg">
          ⏱️
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900 mb-1">وەک نەخۆشێکی کاتی</p>
          <p class="text-sm text-slate-700">دەتوانیت بە شێوەیەکی کاتی بۆ ماوەی ٣ مانگ خۆت تۆمار بکەیت. ئەمە بەسوودە ئەگەر سەردانی ناوچەیەک دەکەیت یان ناتەوێت پزیشکی GP سەرەکی خۆت بگۆڕیت.</p>
        </div>
      </div>
      
      <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
        <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-lg">
          👶
        </div>
        <div class="flex-1">
          <p class="font-semibold text-slate-900 mb-1">تۆمارکردنی منداڵ (خوار 16 ساڵ)</p>
          <p class="text-sm text-slate-700">منداڵان لەلایەن دایک/باوک یان سەرپەرشتیارەوە تۆمار دەکرێن. ڕەنگە داوای ناسنامەی لەدایکبوون یان ''پەرتووکی سوور'' (تۆماری تەندروستی منداڵ) لێبکرێت.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Important Info Card -->
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
      <span class="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
      زانیاری گرنگ
    </h3>
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-xl">
      <div class="flex gap-3">
        <div class="flex-shrink-0">
          <span class="text-2xl">ℹ️</span>
        </div>
        <div class="flex-1 text-slate-700 space-y-2">
          <ul class="list-disc list-outside space-y-2 pr-5" style="list-style-position: outside;">
            <li>ئەگەر ناونیشانی هەمیشەییت نییە، دەتوانیت ناونیشانێکی کاتی یان ناونیشانی نۆرینگەی GP خۆی بەکاربهێنیت.</li>
            <li>نۆرینگەیەک تەنها دەتوانێت تۆمارکردنت ڕەت بکاتەوە ئەگەر زۆر دوور بژیت یان لیستی نەخۆشەکانیان پڕ بووبێتەوە.</li>
            <li><strong class="text-slate-900">ناتوانن</strong> لەبەر ڕەگەزنامەکەت، دۆخی کۆچبەریت، یان نەبوونی بەڵگەنامە ڕەتت بکەنەوە.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- What if Refused Card -->
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
    <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
      <span class="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
      ئەگەر تۆمارکردنەکەم ڕەتکرایەوە چی بکەم؟
    </h3>
    <div class="text-slate-700 leading-relaxed space-y-3">
      <p>پێویستە نۆرینگەکە لە ماوەی ١٤ ڕۆژدا هۆکارەکەت بە نووسراو پێ بدات. ناتوانن لەبەر هۆکاری جیاکاری ڕەتت بکەنەوە.</p>
      <p>ئەگەر کێشەت بۆ دروست بوو، دەتوانیت پەیوەندی بکەیت بە:</p>
      <ul class="list-disc list-outside space-y-2 pr-5" style="list-style-position: outside;">
        <li>دەستەی چاودێری یەکگرتووی ناوخۆیی (ICB)</li>
        <li>Citizens Advice (ڕاوێژکاری هاوڵاتیان)</li>
        <li>Healthwatchی ناوخۆیی خۆت</li>
      </ul>
    </div>
  </div>

  <!-- Official Source Link Card -->
  <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 shadow-sm border border-indigo-100/50 text-center">
    <a href="https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/" 
       target="_blank" 
       rel="noopener noreferrer"
       class="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-800 font-semibold transition-colors">
      <span>سەرچاوە فەرمییەکە لە NHS.uk ببینە</span>
      <span class="text-lg">↗</span>
    </a>
  </div>

</div>

<style>
  /* Accordion styling for details/summary */
  details > summary {
    list-style: none;
  }
  details > summary::-webkit-details-marker {
    display: none;
  }
  details[open] summary span:last-child {
    transform: rotate(180deg);
  }
</style>',
  'زانیاری دەربارەی چۆنیەتی خۆتۆمارکردن لەگەڵ پزیشکی خێزانی (GP) لە بەریتانیا',
  'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/',
  'NHS',
  1,
  true
);

