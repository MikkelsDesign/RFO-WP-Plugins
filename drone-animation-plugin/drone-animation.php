<?php
/**
 * Plugin Name: Drone Data Animation
 * Plugin URI: https://yoursite.com
 * Description: Animated data stream flowing into a drone illustration
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yoursite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DRONE_ANIMATION_VERSION', '1.0.0');
define('DRONE_ANIMATION_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DRONE_ANIMATION_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue plugin styles and scripts
 */
function drone_animation_enqueue_assets() {
    // Only enqueue on pages that have the shortcode
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
        
        // Pass plugin URL to JavaScript
        wp_localize_script('drone-animation-js', 'droneAnimationData', array(
            'pluginUrl' => DRONE_ANIMATION_PLUGIN_URL
        ));
    }
}
add_action('wp_enqueue_scripts', 'drone_animation_enqueue_assets');

/**
 * Shortcode to display the drone animation
 * Usage: [drone_animation]
 */
function drone_animation_shortcode($atts) {
    // Extract shortcode attributes with defaults
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '600px',
    ), $atts, 'drone_animation');
    
    // Start output buffering
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

/**
 * Add settings link on plugin page
 */
function drone_animation_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=drone-animation-settings">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'drone_animation_settings_link');
