const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The HTML for the image
const imageHtml = `
            <div class="cinematic-image-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                <img src="assets/images/cover.jpg" alt="Couple" class="parallax-img" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
                <div class="overlay-dark" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 2;"></div>
            </div>`;

// Insert the image into .opening
html = html.replace(
    /<section class="scene opening" id="opening">/,
    `<section class="scene opening" id="opening">` + imageHtml
);

// Make sure opening-content has a higher z-index
html = html.replace(
    /<div class="opening-content">/,
    `<div class="opening-content" style="position: relative; z-index: 3;">`
);

// Remove scene-01
html = html.replace(
    /<!-- SCENE 01: THE BEGINNING -->[\s\S]*?<section class="scene scene-01" id="scene01">[\s\S]*?<\/section>/,
    ''
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
