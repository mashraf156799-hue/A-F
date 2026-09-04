const fs = require('fs');

// 1. Fix index.html
let html = fs.readFileSync('index.html', 'utf8');
// Remove position: relative from opening-content
html = html.replace(
    /<div class="opening-content" style="position: relative; z-index: 3;">/,
    `<div class="opening-content" style="z-index: 3; margin-top: 45vh;">`
);
fs.writeFileSync('index.html', html, 'utf8');

// 2. Fix style.css
let css = fs.readFileSync('style.css', 'utf8');
// Remove blur
css = css.replace(
    /filter: blur\(10px\);/g,
    'filter: blur(0px);'
);
// Fix scroll-indicator (ensure it's not relative to opening-content)
css = css.replace(
    /\.scroll-indicator \{[\s\S]*?\}/,
    `.scroll-indicator {
    position: absolute;
    bottom: 5vh;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    z-index: 10;
}`
);
fs.writeFileSync('style.css', css, 'utf8');

// 3. Fix script.js for Scene-02 animation
let js = fs.readFileSync('script.js', 'utf8');
js = js.replace(
    /let progress = -rect\.top \/ \(rect\.height - windowHeight\);/g,
    'let progress = (-rect.top + (windowHeight * 0.3)) / (rect.height - windowHeight);'
);
js = js.replace(
    /let closeProgress = Math\.min\(1, progress \* 4\);/g,
    'let closeProgress = Math.min(1, Math.max(0, progress * 2));'
);
fs.writeFileSync('script.js', js, 'utf8');

console.log('Fixed everything');
