const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove .scene-content from .scene-01
html = html.replace(
    /<section class="scene scene-01"[^>]*>[\s\S]*?<\/section>/,
    `<section class="scene scene-01" id="scene01">
            <div class="cinematic-image-container">
                <img src="assets/images/cover.jpg" alt="Couple" class="parallax-img" loading="lazy">
                <div class="overlay-dark"></div>
            </div>
        </section>`
);

// 2. Fix meeting point in scene 02
html = html.replace(
    /<div class="meeting-point">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,
    `<div class="meeting-point">
                    <h2 class="one-story"><span class="lang-en">ONE STORY</span><span class="lang-ar">حكاية واحدة</span></h2>
                    <p class="arabic-text"><span class="lang-ar">حكاية بدأت بين شخصين...</span><span class="lang-en">A story started with two...</span></p>
                </div>
            </div>
        </section>`
);

// 3. Remove venue block from scene 04 and add countdown
html = html.replace(
    /<section class="scene scene-04"[^>]*>[\s\S]*?<\/section>/,
    `<!-- SCENE 04: THE WEDDING & COUNTDOWN -->
        <section class="scene scene-04" id="scene04">
            <div class="editorial-layout" style="text-align: center; align-items: center; display: flex; flex-direction: column;">
                <div class="info-block reveal-text delay-1" style="align-items: center; margin: 0 auto 40px auto; width: 100%;">
                    <p class="day" id="domInfoDay"></p>
                    <p class="date" id="domInfoDate"></p>
                </div>
                
                <div class="countdown-wrapper reveal-up delay-2" style="width: 100%;">
                    <div class="countdown-container" style="justify-content: center;">
                        <div class="countdown-item"><span class="number" id="cdDays">00</span><span class="label">DAYS</span></div>
                        <div class="countdown-item"><span class="number" id="cdHours">00</span><span class="label">HOURS</span></div>
                        <div class="countdown-item"><span class="number" id="cdMins">00</span><span class="label">MINUTES</span></div>
                        <div class="countdown-item"><span class="number" id="cdSecs">00</span><span class="label">SECONDS</span></div>
                    </div>
                    <div id="cdDone" style="display: none; text-align: center;">
                        <h2 class="one-story"><span class="lang-en">TODAY IS THE DAY</span><span class="lang-ar">اليوم الموعود</span></h2>
                    </div>
                </div>
            </div>
        </section>`
);

// 4. Remove scene 06 completely
html = html.replace(
    /<!-- SCENE 06: COUNTDOWN -->[\s\S]*?<section class="scene scene-06" id="scene06">[\s\S]*?<\/section>/,
    ''
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
