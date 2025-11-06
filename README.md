# Drone Data Animation Plugin (Storyscaping Eksamen)

**Multimediedesigner studerende, Erhvervsakademi Aarhus**  
**2025**

Plugin'et viser en animeret datastrøm der flyder ned i en drone-illustration via canvas animation. Data-elementer (bogstaver, tal og polaroid-rammer) falder fra toppen i en 90-graders kegle og forsvinder gradvist når de når dronen.

---

## Hover Effekt & Animation Koncept

### Opbygning

- **Canvas-baseret animation**: Bruger HTML Canvas til at tegne animerede partikler
- **Tre elementtyper**: Flydende bogstaver/tal, roterende polaroid-rammer, og drone-illustration som et billede
- **90-graders kegle fra oven**: Alle elementer spawner i en kegle direkte over dronen
- **Fade-in og fade-out**: Elementer materialiserer gradvist (70% af rejsen) og fader ud når de når målet, som er midten af drone billedet.

---

## PHP — Del 1 (Setup og Registrering)

### Sikkerhed

```php
if (!defined('ABSPATH')) {
    exit;
}
```

Forhindrer direkte adgang til filen udenfor WordPress.

### Plugin Constants

```php
define('DRONE_ANIMATION_VERSION', '1.0.0');
define('DRONE_ANIMATION_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DRONE_ANIMATION_PLUGIN_URL', plugin_dir_url(__FILE__));
```

Definerer versionsnummer og stier til plugin-filer som konstanter. 

### Stylesheet og javascript Enqueue

```php
function drone_animation_enqueue_assets() {
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'drone_animation')) {
        wp_enqueue_style(
            'drone-animation-css',
            DRONE_ANIMATION_PLUGIN_URL . 'assets/css/drone-animation.css',
            array(),
            DRONE_ANIMATION_VERSION
        );
        
        wp_enqueue_script(
            'drone-animation-js',
            DRONE_ANIMATION_PLUGIN_URL . 'assets/js/drone-animation.js',
            array(),
            DRONE_ANIMATION_VERSION,
            true
        );
        
        wp_localize_script('drone-animation-js', 'droneAnimationData', array(
            'pluginUrl' => DRONE_ANIMATION_PLUGIN_URL
        ));
    }
}
```

wp_localize_script bliver anvendt for at forbedre performance, ved kun at indlæse vores plugin hvor shortcoden bliver anvendt.

---

## PHP — Del 2 (Shortcode & Output)

### Shortcode Attributer

```php
function drone_animation_shortcode($atts) {
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600px',
    ), $atts, 'drone_animation');
```

Sætter standardattributter for bredde og højde.

### ob_start() Output Buffering

```php
ob_start();
?>
<div class="drone-animation-container" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
    <canvas id="droneAnimationCanvas"></canvas>
    <img id="droneAnimationImage" src="<?php echo esc_url(DRONE_ANIMATION_PLUGIN_URL . 'assets/images/droneillustration.png'); ?>" alt="Drone">
</div>
<?php
return ob_get_clean();
```

`ob_start()` starter output buffering. HTML markup skrives i buffer og returneres samlet. Består af:
- Container med tilpasselig størrelse
- Canvas element til animation
- Drone illustration som PNG overlay

---

## CSS — Vigtigste Punkter

### Container Setup

```css
.drone-animation-container {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
    background: #ffffff;
}
```

Container styrer dimensioner og sætter hvid baggrund.

### Canvas Positionering

```css
#droneAnimationCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

Canvas fylder hele containeren og ligger bag dronen.

### Drone Image Overlay

```css
#droneAnimationImage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: auto;
    z-index: 10;
    pointer-events: none;
}
```

Drone centreres og ligger over canvas med `z-index: 10`.

### Responsive Design

---

## JavaScript — Arkitektur og Funktioner

### Initialisering

```javascript
function initDroneAnimation() {
    const canvas = document.getElementById('droneAnimationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
```

Canvas tilpasses containerens størrelse og opdateres ved resize.

---

## Particle Classes (Objekt-Orienteret Design)

### DataIcon Class — Flydende Bogstaver/Tal

| Funktion | Forklaring |
|----------|------------|
| `constructor()` | Vælger tilfældigt symbol (0,1,{,},<,>,/,\,etc.) og kalder reset() |
| `reset()` | Spawner element i 90° kegle fra toppen, beregner fade-distance |
| `update()` | Flytter elementet mod målet, tjekker afstand og resetter ved ankomst |
| `draw()` | Tegner bogstav/tal med fade-in (70% af rejse) og fade-out (sidste 80px) |

**Matematisk spawn (90-graders kegle):**
```javascript
const coneAngle = Math.PI / 4; // 45° fra vertikal = 90° kegle
const angle = (Math.random() - 0.5) * coneAngle * 2;
const distance = Math.random() * 400 + 400;
const horizontalOffset = Math.tan(angle) * distance;
const rotationAngle = Math.random() * Math.PI * 2;

this.startX = centerX + Math.cos(rotationAngle) * horizontalOffset;
this.startY = centerY - distance; // Over dronen
```

**Fade-in algoritme:**
```javascript
const distanceTraveled = this.y - this.startY;
const fadeProgress = Math.min(Math.max(distanceTraveled / this.fadeDistance, 0), 1);
const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress); // Smoothstep
const currentOpacity = this.baseOpacity * easedProgress;
```

**Fade-out algoritme:**
```javascript
const distanceToTarget = Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2));
const fadeOutDistance = 80;
const fadeOutProgress = Math.min(distanceToTarget / fadeOutDistance, 1);
const finalOpacity = currentOpacity * fadeOutProgress;
```

### Polaroid Class — Roterende Foto-Rammer

| Funktion | Forklaring |
|----------|------------|
| `constructor()` | Initialiserer polaroid-ramme og kalder reset() |
| `reset()` | Spawner i kegle, sætter størrelse (mellem 15-25px), rotation og fade-distance |
| `update()` | Bevæger mod mål og roterer kontinuerligt |
| `draw()` | Tegner hand-drawn polaroid med wobble-effekt, fade-in og fade-out |

**Polaroid struktur:**
- Ydre blå ramme (rgba(54, 87, 134)) med 30% opacity fill
- Indre hvid firkant (foto-område)
- Bredere bund (25% af højde) for klassisk polaroid-look

---

## Animation Loop

```javascript
function animate() {
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    polaroids.forEach(function(polaroid) {
        polaroid.update();
        polaroid.draw();
    });
    
    icons.forEach(function(icon) {
        icon.update();
        icon.draw();
    });
    
    requestAnimationFrame(animate);
}
```

**Tegne-rækkefølge:**
1. Hvid baggrund (clear canvas)
2. Polaroids (tegnes først, bag)
3. Data icons (tegnes sidst, foran)
4. Request next frame

---

## Farvepalette

| Element | Farve | RGB |
|---------|-------|-----|
| Baggrund | Hvid | `#ffffff` |
| Data & Polaroids | Blå | `#365786` (54, 87, 134) |
| Polaroid fill | Blå 30% | `rgba(54, 87, 134, 0.3)` |
| Polaroid indre | Hvid | `rgba(255, 255, 255, opacity)` |

---

## Performance Optimering

### Particle Count

- **50 Data Icons**: Bogstaver og tal
- **15 Polaroids**: Foto-rammer

Antal er balanceret for smooth animation uden at overbelaste CPU.

### Fade Distance Beregning

```javascript
const totalDistance = Math.sqrt(
    Math.pow(this.targetX - this.startX, 2) + 
    Math.pow(this.targetY - this.startY, 2)
);
this.fadeDistance = totalDistance * 0.7; // 70% af rejsen
```

Fade-in distance er proportionel til hver partikels rejse.

---

## Shortcode Brug

### Basis (standard størrelse)

```
[drone_animation]
```

### Med tilpasset størrelse

```
[drone_animation width="100%" height="800px"]
```

### Fuld bredde, høj container

```
[drone_animation width="1200px" height="700px"]
```

---

## Fil Struktur

```
drone-animation-plugin/
├── drone-animation.php                   (Main plugin fil)
├── assets/
│   ├── css/
│   │   └── drone-animation.css          (Styles + responsive)
│   ├── js/
│   │   └── drone-animation.js           (Animation logic)
│   └── images/
│       └── droneillustration.png        (Drone billede)
└── README.md                             (Denne fil)
```

---


## AI Note

AI har været brugt som sparringspartner igennem udviklingen af dette plugin. Jeg har anvendt AI til at strukturere koden, få hjælp til matematiske beregninger (trigonometri for kegle-effekt), validere løsningsmuligheder og til at få tekniske forslag til canvas-optimering. Designbeslutninger, koncept, visuel retning, fade-algoritmer og den endelige kodeimplementering er udført, vurderet og manuelt tilpasset af mig selv. AI har derfor fungeret som et støtteværktøj og ikke som en automatisk generator af løsningen.

---

## Support

For support, kontakt [din-email@example.com]

## Licens

GPL v2 or later
