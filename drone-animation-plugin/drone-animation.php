<?php
/**
 * Plugin Name: Drone Data Animation
 * Plugin URI: https://rfo.mikkelsdesign.dk
 * Description: Animeret strøm af data der flyder ind i en drone illustration
 * Version: 1.2.1
 * Author: Mikkel Andersen
 * Author URI: https://mikkelsdesign.dk
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Sikrer at filen kun kan tilgås gennem WordPress, ikke direkte
if (!defined('ABSPATH')) {
    exit;
}

// Definerer konstanter som bruges gennem hele plugin'et
define('DRONE_ANIMATION_VERSION', '1.0.0');
define('DRONE_ANIMATION_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DRONE_ANIMATION_PLUGIN_URL', plugin_dir_url(__FILE__));

// Indlæser CSS og JavaScript filer når de skal bruges
function drone_animation_enqueue_assets() {
    // Tjekker om siden bruger drone animationen, så vi kun indlæser filer når det er nødvendigt
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
        
        // Sender plugin URL'en videre til JavaScript, så den kan finde billeder og andre filer
        wp_localize_script('drone-animation-js', 'droneAnimationData', array(
            'pluginUrl' => DRONE_ANIMATION_PLUGIN_URL
        ));
    }
}
add_action('wp_enqueue_scripts', 'drone_animation_enqueue_assets');

// Shortcode som viser drone animationen på siden
// Brug: [drone_animation] i din side eller indlæg
function drone_animation_shortcode($atts) {
    // Henter indstillinger fra shortcoden og bruger standardværdier hvis der ikke er angivet noget
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600px',
    ), $atts, 'drone_animation');
    
    // Starter output buffering så vi kan returnere HTML som tekst
    ob_start();
    ?>
    
    <div class="drone-animation-container" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
        <canvas id="droneAnimationCanvas"></canvas>
        <img id="droneAnimationImage" src="<?php echo esc_url(DRONE_ANIMATION_PLUGIN_URL . 'assets/images/doneillustrationstor.png'); ?>" alt="Drone">
    </div>
    
    <?php
    return ob_get_clean();
}
add_shortcode('drone_animation', 'drone_animation_shortcode');
