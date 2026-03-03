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

    <!-- Hero Grid -->
    <div class="grid-wrapper">
        @foreach ($heroes as $hero)
            <img 
                src="/resources/images/faces/{{ $hero->name }}_vertical_psd.png" 
                alt="{{ $hero->name }}"
            >
        @endforeach
    </div>

    <!-- hero information (name,abilities,etc) -->
    <div class="hero-info">
        <div class="hero-name">
            @foreach ($heroes as $hero)
                <div class="hero-title" data-hero="{{ $hero->name }}">
                    <?php require("resources/title/{$hero->name}_title.svg"); ?>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Hero specific background -->
    <div class="character-bg">
        @foreach ($heroes as $hero)
            <img 
                class="hero-bg-image"
                data-hero="{{ $hero->name }}"
                src="/resources/images/backgrounds/{{ $hero->name }}_bg_psd.png"
                alt="{{ $hero->name }}"
            >
        @endforeach
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
        const bgImages = document.querySelectorAll('.hero-bg-image');
        const heroTitles = document.querySelectorAll('.hero-title');

        let currentHero = null;
        let hoverTimer = null;

        function showHero(heroName) {

            if (currentHero === heroName) return;

            // Remove active from everything
            bgImages.forEach(bg => bg.classList.remove('active'));
            heroTitles.forEach(title => title.classList.remove('active'));

            // Activate selected hero
            const activeBg = document.querySelector(`.hero-bg-image[data-hero="${heroName}"]`);
            const activeTitle = document.querySelector(`.hero-title[data-hero="${heroName}"]`);

            if (activeBg) activeBg.classList.add('active');
            if (activeTitle) activeTitle.classList.add('active');

            // Switch 3D model
            if (typeof window.loadHeroModel === 'function') {
                window.loadHeroModel(heroName);
            }

            currentHero = heroName;
        }

        heroIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                const heroName = icon.getAttribute('alt');

                // Start 0.25s delay
                hoverTimer = setTimeout(() => {
                    showHero(heroName);
                }, 250);
            });

            icon.addEventListener('mouseleave', () => {
                // Cancel if user leaves before the delay is up
                clearTimeout(hoverTimer);
            });
        });

        // Show first hero on load
        window.addEventListener('DOMContentLoaded', () => {
            if (heroIcons.length > 0) {
                showHero(heroIcons[0].getAttribute('alt'));
            }
        });
    </script>
</body>
</html>
