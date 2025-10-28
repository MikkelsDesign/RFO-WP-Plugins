<?php
/**
 * Plugin Name: Phone Hover Animation
 * Plugin URI: https://yoursite.com
 * Description: Animated phone that rises on hover to reveal text below
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
define('PHONE_ANIMATION_VERSION', '1.0.0');
define('PHONE_ANIMATION_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PHONE_ANIMATION_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue plugin styles
 */
function phone_animation_enqueue_assets() {
    // Only enqueue on pages that have the shortcode
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'phone_animation')) {
        wp_enqueue_style(
            'phone-animation-css',
            PHONE_ANIMATION_PLUGIN_URL . 'assets/css/phone-animation.css',
            array(),
            PHONE_ANIMATION_VERSION
        );
    }
}
add_action('wp_enqueue_scripts', 'phone_animation_enqueue_assets');

/**
 * Shortcode to display the phone animation
 * Usage: [phone_animation link="https://yourapp.com" title="Download Our App" subtitle="Experience the future"]
 */
function phone_animation_shortcode($atts) {
    // Extract shortcode attributes with defaults
    $atts = shortcode_atts(array(
        'link' => '#',
        'title' => 'Capture Plastic Waste',
        'subtitle' => '',
        'phone_image' => '',
    ), $atts, 'phone_animation');
    
    // Determine phone image source
    if (!empty($atts['phone_image'])) {
        // Use custom image URL from shortcode
        $phone_src = esc_url($atts['phone_image']);
    } else {
        // Use bundled default image
        $phone_src = esc_url(PHONE_ANIMATION_PLUGIN_URL . 'assets/images/iphoneRFOT.png');
    }
    
    // Start output buffering
    ob_start();
    ?>
    
    <div class="phone-animation-wrapper">
        <div class="phone-container">
            <div class="text-wrapper">
                <div class="hidden-text">
                    <h3><?php echo esc_html($atts['title']); ?></h3>
                    <p><?php echo esc_html($atts['subtitle']); ?></p>
                </div>
            </div>
            <div class="phone-wrapper">
                <a href="<?php echo esc_url($atts['link']); ?>" class="phone-link">
                    <img src="<?php echo $phone_src; ?>" alt="Phone" class="phone-image">
                </a>
            </div>
        </div>
    </div>
    
    <?php
    return ob_get_clean();
}
add_shortcode('phone_animation', 'phone_animation_shortcode');

/**
 * Add settings link on plugin page
 */
function phone_animation_settings_link($links) {
    $settings_link = '<a href="options-general.php?page=phone-animation-settings">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'phone_animation_settings_link');
