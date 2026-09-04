const fs = require('fs');

// ============ FIX index.html ============
let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace the overlay-dark with a gradient overlay (clear top 2/3, blurred bottom 1/3)
html = html.replace(
    '<div class="overlay-dark" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.2); z-index: 2;"></div>',
    '<div class="overlay-dark" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%); z-index: 2;"></div>'
);

// 2. Add a CSS class to the opening section for fade-in transition
html = html.replace(
    '<section class="scene opening" id="opening">',
    '<section class="scene opening opening-hidden" id="opening">'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html');

// ============ FIX style.css ============
let css = fs.readFileSync('style.css', 'utf8');

// 1. Reduce scene-07 height
css = css.replace(
    'height: 250vh; /* Reduced from 400vh */',
    'height: 180vh;'
);

// 2. Remove min-height from .scene so sections don't create black gaps
// Add specific override for scene-02
css = css.replace(
    '.scene-02 {\n    height: 150vh;\n    display: block;',
    '.scene-02 {\n    height: 120vh;\n    display: block;\n    min-height: auto;'
);

// 3. Add opening fade-in transition CSS
css += `
/* Opening fade-in after gate opens */
.opening-hidden .cinematic-image-container {
    opacity: 0;
    transform: scale(1.05);
    transition: opacity 1.5s ease-out, transform 2s ease-out;
}
.opening-hidden .opening-content {
    opacity: 0;
    transition: opacity 1.2s ease-out 0.5s;
}
.opening.opening-visible .cinematic-image-container {
    opacity: 1;
    transform: scale(1);
}
.opening.opening-visible .opening-content {
    opacity: 1;
}
`;

fs.writeFileSync('style.css', css, 'utf8');
console.log('Fixed style.css');

// ============ FIX script.js ============
let js = fs.readFileSync('script.js', 'utf8');

// 1. Add fade-in transition when gate opens
js = js.replace(
    "gate.classList.add('opened');",
    `gate.classList.add('opened');
              // Trigger smooth fade-in of background image
              const openingSection = document.getElementById('opening');
              if (openingSection) {
                  setTimeout(() => {
                      openingSection.classList.add('opening-visible');
                  }, 300);
              }`
);

// 2. Update the scene-07 progress mapping to be faster with shorter section
js = js.replace(
    "let mappedProgress = (progress - 0.2) / 0.6;",
    "let mappedProgress = (progress - 0.1) / 0.5;"
);

fs.writeFileSync('script.js', js, 'utf8');
console.log('Fixed script.js');

console.log('All fixes applied!');
