/**
 * Strip HTML tags from a string and return plain text
 */
export function stripHtml(html: string): string {
    if (!html) return '';
    
    // Create a temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get text content
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up extra whitespace
    return text.replace(/\s+/g, ' ').trim();
}

/**
 * Process HTML content to convert fixed buttons to regular buttons
 * This removes the "fixed bottom-0" positioning so buttons appear at the end of content
 * instead of always being visible
 */
export function processFixedButtons(html: string): string {
    if (!html) return '';
    
    let processed = html;
    
    // Method 1: Replace class attributes containing "fixed" and "bottom-0"
    // This handles: class="fixed bottom-0 left-0 right-0 ..."
    processed = processed.replace(
        /class="([^"]*)\bfixed\b([^"]*)\bbottom-0\b([^"]*)"/gi,
        (match, before, middle, after) => {
            // Remove 'fixed' and 'bottom-0' from the class string
            let classList = `${before}${middle}${after}`;
            classList = classList.replace(/\bfixed\b/gi, '');
            classList = classList.replace(/\bbottom-0\b/gi, '');
            classList = classList.replace(/\s+/g, ' ').trim();
            // Add our marker class
            if (classList) {
                classList = `${classList} scroll-to-bottom-button`;
            } else {
                classList = 'scroll-to-bottom-button';
            }
            return `class="${classList}"`;
        }
    );
    
    // Method 2: Handle cases where fixed and bottom-0 are separate
    processed = processed.replace(
        /class="([^"]*)\bfixed\b([^"]*)"/gi,
        (match, before, after) => {
            // Only process if it doesn't already have our marker class
            if (match.includes('scroll-to-bottom-button')) {
                return match;
            }
            let classList = `${before}${after}`;
            classList = classList.replace(/\bfixed\b/gi, '');
            classList = classList.replace(/\bbottom-0\b/gi, '');
            classList = classList.replace(/\s+/g, ' ').trim();
            if (classList) {
                classList = `${classList} scroll-to-bottom-button`;
            } else {
                classList = 'scroll-to-bottom-button';
            }
            return `class="${classList}"`;
        }
    );
    
    // Method 3: Handle fixed positioning in style attributes
    processed = processed.replace(
        /style="([^"]*position:\s*fixed[^"]*)"/gi,
        (match, styleContent) => {
            // Remove position: fixed and bottom: 0 from style
            let newStyle = styleContent.replace(/position:\s*fixed[^;]*;?/gi, '');
            newStyle = newStyle.replace(/bottom:\s*0[^;]*;?/gi, '');
            newStyle = newStyle.replace(/left:\s*0[^;]*;?/gi, '');
            newStyle = newStyle.replace(/right:\s*0[^;]*;?/gi, '');
            newStyle = newStyle.replace(/;\s*;/g, ';').trim();
            // Clean up trailing semicolons
            newStyle = newStyle.replace(/;+$/, '');
            if (newStyle && !newStyle.endsWith(';') && newStyle.length > 0) {
                newStyle = newStyle.trim();
            }
            return newStyle ? `style="${newStyle}"` : '';
        }
    );
    
    // Method 4: Remove z-index that's typically used with fixed elements
    processed = processed.replace(
        /z-\d+\s*/gi,
        ''
    );
    
    // Method 5: Remove white background classes from button containers
    // Remove bg-white, bg-white/50, bg-white/80, etc. from containers
    processed = processed.replace(
        /class="([^"]*)\bbg-white\b([^"]*)"/gi,
        (match, before, after) => {
            let classList = `${before}${after}`;
            // Remove bg-white and its variants
            classList = classList.replace(/\bbg-white\b/gi, '');
            classList = classList.replace(/\bbg-white\/\d+\b/gi, ''); // bg-white/50, bg-white/80, etc.
            classList = classList.replace(/\s+/g, ' ').trim();
            return classList ? `class="${classList}"` : '';
        }
    );
    
    // Method 6: Remove border and shadow classes that create card appearance
    // Remove border-t, border-b, shadow-lg, shadow-md, etc. from button containers
    processed = processed.replace(
        /class="([^"]*scroll-to-bottom-button[^"]*)"/gi,
        (match) => {
            let classList = match.replace(/class="([^"]*)"/gi, '$1');
            // Remove border classes
            classList = classList.replace(/\bborder-t\b/gi, '');
            classList = classList.replace(/\bborder-b\b/gi, '');
            classList = classList.replace(/\bborder\b/gi, '');
            classList = classList.replace(/\bborder-\w+\b/gi, ''); // border-gray-200, etc.
            // Remove shadow classes
            classList = classList.replace(/\bshadow-lg\b/gi, '');
            classList = classList.replace(/\bshadow-md\b/gi, '');
            classList = classList.replace(/\bshadow-sm\b/gi, '');
            classList = classList.replace(/\bshadow\b/gi, '');
            classList = classList.replace(/\s+/g, ' ').trim();
            return `class="${classList}"`;
        }
    );
    
    // Method 7: Remove white background from style attributes
    processed = processed.replace(
        /style="([^"]*background[^"]*white[^"]*)"/gi,
        (match, styleContent) => {
            // Remove background-color: white and background: white
            let newStyle = styleContent.replace(/background-color:\s*white[^;]*;?/gi, '');
            newStyle = newStyle.replace(/background:\s*white[^;]*;?/gi, '');
            newStyle = newStyle.replace(/;\s*;/g, ';').trim();
            newStyle = newStyle.replace(/;+$/, '');
            return newStyle ? `style="${newStyle}"` : '';
        }
    );
    
    // Method 8: Remove border and shadow from style attributes in button containers
    processed = processed.replace(
        /(<div[^>]*scroll-to-bottom-button[^>]*style=")([^"]*)"/gi,
        (match, prefix, styleContent) => {
            // Remove border and shadow styles
            let newStyle = styleContent.replace(/border[^;]*;?/gi, '');
            newStyle = newStyle.replace(/box-shadow[^;]*;?/gi, '');
            newStyle = newStyle.replace(/;\s*;/g, ';').trim();
            newStyle = newStyle.replace(/;+$/, '');
            return newStyle ? `${prefix}${newStyle}"` : prefix.replace(/style="/, '');
        }
    );
    
    // Method 9: Fix white text color in buttons - replace text-white with text-slate-900 for visibility
    processed = processed.replace(
        /class="([^"]*scroll-to-bottom-button[^"]*)"/gi,
        (match) => {
            let classList = match.replace(/class="([^"]*)"/gi, '$1');
            // Replace text-white with text-slate-900 for better visibility
            classList = classList.replace(/\btext-white\b/gi, 'text-slate-900');
            classList = classList.replace(/\btext-white\/\d+\b/gi, 'text-slate-900'); // text-white/50, etc.
            classList = classList.replace(/\s+/g, ' ').trim();
            return `class="${classList}"`;
        }
    );
    
    // Method 10: Fix white text in buttons and links within scroll-to-bottom-button containers
    processed = processed.replace(
        /(<(?:button|a)[^>]*class="[^"]*scroll-to-bottom-button[^"]*)"/gi,
        (match) => {
            let classList = match.replace(/class="([^"]*)"/gi, '$1');
            // Replace text-white with text-slate-900
            classList = classList.replace(/\btext-white\b/gi, 'text-slate-900');
            classList = classList.replace(/\btext-white\/\d+\b/gi, 'text-slate-900');
            classList = classList.replace(/\s+/g, ' ').trim();
            return match.replace(/class="[^"]*"/, `class="${classList}"`);
        }
    );
    
    // Method 11: Fix white text in any button or link - replace text-white with text-slate-900
    processed = processed.replace(
        /(<(?:button|a)[^>]*class="[^"]*)\btext-white\b([^"]*")/gi,
        (match, before, after) => {
            return `${before}text-slate-900${after}`;
        }
    );
    
    // Method 12: Fix white text variants (text-white/50, text-white/80, etc.)
    processed = processed.replace(
        /(<(?:button|a)[^>]*class="[^"]*)\btext-white\/\d+\b([^"]*")/gi,
        (match, before, after) => {
            return `${before}text-slate-900${after}`;
        }
    );
    
    // Method 13: Fix white text color in style attributes for buttons and links
    processed = processed.replace(
        /(<(?:button|a)[^>]*style=")([^"]*color:\s*white[^"]*)"/gi,
        (match, prefix, styleContent) => {
            let newStyle = styleContent.replace(/color:\s*white[^;]*;?/gi, 'color: rgb(15 23 42);'); // slate-900
            newStyle = newStyle.replace(/;\s*;/g, ';').trim();
            newStyle = newStyle.replace(/;+$/, '');
            return newStyle ? `${prefix}${newStyle}"` : `${prefix}"`;
        }
    );
    
    // Method 14: Fix white text in any element with text-white class within prose content
    processed = processed.replace(
        /(<[^>]*class="[^"]*)\btext-white\b([^"]*"[^>]*>)/gi,
        (match, before, after) => {
            // Only replace if it's a button, link, or span/div that might contain text
            if (match.includes('<button') || match.includes('<a') || match.includes('<span') || match.includes('<div') || match.includes('<p')) {
                return `${before}text-slate-900${after}`;
            }
            return match;
        }
    );
    
    // Method 15: Remove colored circular icon containers (like bg-cyan-100 rounded-full w-10 h-10)
    // Pattern: divs with rounded-full and background color classes that contain icons
    // This handles patterns like: <div class="flex-shrink-0 bg-cyan-100 text-cyan-600 rounded-full w-10 h-10 flex items-center justify-center">
    processed = processed.replace(
        /<div[^>]*class="[^"]*\brounded-full\b[^"]*\b(bg-\w+-\d+|bg-\w+)\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        (match) => {
            // Check if it contains an icon (i tag, svg, or icon class)
            if (match.includes('<i') || match.includes('<svg') || match.includes('ph ph-') || match.includes('icon') || match.includes('ph-')) {
                // Remove the entire div container
                return '';
            }
            return match;
        }
    );
    
    // Method 16: Remove flex-shrink-0 divs with rounded-full that contain icons
    // More specific pattern for icon containers
    processed = processed.replace(
        /<div[^>]*class="[^"]*\bflex-shrink-0\b[^"]*\brounded-full\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        (match) => {
            // Only remove if it contains an icon element
            if (match.includes('<i') || match.includes('<svg') || match.includes('ph ph-') || match.includes('ph-') || match.includes('icon')) {
                return '';
            }
            return match;
        }
    );
    
    // Method 17: Remove divs with specific icon container patterns (w-10 h-10 rounded-full with bg colors)
    // Pattern: <div class="... w-10 h-10 rounded-full bg-cyan-100 ...">
    processed = processed.replace(
        /<div[^>]*class="[^"]*\b(w-10|w-8|w-12)\s+(h-10|h-8|h-12)\s+rounded-full\b[^"]*\b(bg-\w+-\d+|bg-\w+)\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        (match) => {
            // Only remove if it contains an icon
            if (match.includes('<i') || match.includes('<svg') || match.includes('ph ph-') || match.includes('ph-') || match.includes('icon')) {
                return '';
            }
            return match;
        }
    );
    
    // Method 18: Remove icon containers with flex items-center justify-center pattern
    // Pattern: <div class="... rounded-full ... flex items-center justify-center">
    processed = processed.replace(
        /<div[^>]*class="[^"]*\brounded-full\b[^"]*\bflex\s+items-center\s+justify-center\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        (match) => {
            // Only remove if it contains an icon and has a background color
            if ((match.includes('<i') || match.includes('<svg') || match.includes('ph ph-') || match.includes('ph-') || match.includes('icon')) &&
                (match.includes('bg-') || match.includes('background'))) {
                return '';
            }
            return match;
        }
    );
    
    return processed;
}

