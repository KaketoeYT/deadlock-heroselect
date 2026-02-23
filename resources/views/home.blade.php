<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hero Select</title>

    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/css/three.css'])
</head>
<body>

    <!-- Three.js canvas container -->
    <div id="scene-container"></div>

    <div class="scene-bg">
        <video id="background-video" autoplay muted loop>
            <source src="/resources/videos/roster_bg_loop.webm" type="video/webm">
        </video>
    </div>

    <!-- Hero specific background -->
    <div class="character-bg">
        <img id="hero-bg" src="/resources/images/backgrounds/abrams_bg_psd.png" alt="">
    </div>

    <!-- Hero Grid -->
    <div class="grid-wrapper">
        @foreach ($heroes as $hero)

        <img src="/resources/images/faces/{{ $hero->name }}_vertical_psd.png" alt="{{ $hero->name }}">

        @endforeach
    </div>

    <!-- hero information (name,abilities,etc) -->
    <div class="hero-info">
        <div class="hero-name">
            <?php require('resources/title/abrams_title.svg') ?>
        </div>
    </div>


    <!-- Scripts -->
     <!-- play rate of background video -->
    <script>
        const video = document.getElementById('background-video');
        video.playbackRate = 0.3;
    </script>

    <!-- hovering over a heroes icon replaces title with that heroes name -->
    <script>
        const heroIcons = document.querySelectorAll('.grid-wrapper img');

        const heroBackground = document.getElementById('hero-bg');
        const heroNameElement = document.querySelector('.hero-name');

        // Preload all hero models for faster switching (if available)
        const heroNames = Array.from(heroIcons).map(i => i.getAttribute('alt'));
        if (typeof window.preloadHeroModels === 'function') {
            window.preloadHeroModels(heroNames).catch(() => {});
        } else {
            window.addEventListener('load', () => {
                if (typeof window.preloadHeroModels === 'function') {
                    window.preloadHeroModels(heroNames).catch(() => {});
                }
            });
        }

        heroIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                const heroName = icon.getAttribute('alt');

                heroBackground.src = `/resources/images/backgrounds/${heroName}_bg_psd.png`;

                // Fetch and load the corresponding SVG file from resources/title
                fetch(`/resources/title/${heroName}_title.svg`)
                    .then(response => {
                        if (!response.ok) throw new Error('SVG not found');
                        return response.text();
                    })
                    .then(svgContent => {
                        heroNameElement.innerHTML = svgContent;
                    })
                    .catch(error => {
                        console.error('Error loading SVG:', error);
                        // Keep the old title if new one couldnt be loaded
                    });

                // Switch 3D model if the loader is available
                if (typeof window.loadHeroModel === 'function') {
                    try {
                        window.loadHeroModel(heroName);
                    } catch (err) {
                        console.error('Error switching 3D model:', err);
                    }
                }
            });
        });
    </script>
</body>
</html>
