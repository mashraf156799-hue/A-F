const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const scrollInd = `                <div class="scroll-indicator fade-in-up delay-4">
                    <p>SCROLL TO ENTER</p>
                    <div class="scroll-line"></div>
                </div>`;

// Remove it from inside opening-content
html = html.replace(scrollInd, '');

// Add it just before closing section
html = html.replace(
    /<\/section>\s*<!-- SCENE 02: TWO STORIES -->/,
    scrollInd + '\n        </section>\n\n        <!-- SCENE 02: TWO STORIES -->'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('done');
