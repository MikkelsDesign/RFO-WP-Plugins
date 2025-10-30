<?php
/**
 * Plugin Name: Scandinavian Network Visualization
 * Plugin URI: https://example.com/scandinavian-network
 * Description: An interactive network visualization showing how user images train AI models
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: scandinavian-network
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('SCANNET_VERSION', '1.0.0');
define('SCANNET_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SCANNET_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue plugin styles and scripts
 */
function scannet_enqueue_assets() {
    // Only enqueue on pages with the shortcode
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'scandinavian_network')) {
        // Enqueue Google Fonts
        wp_enqueue_style(
            'scannet-google-fonts',
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap',
            array(),
            null
        );
        
        // Enqueue plugin CSS
        wp_enqueue_style(
            'scannet-styles',
            SCANNET_PLUGIN_URL . 'assets/css/data-network.css',
            array(),
            SCANNET_VERSION
        );
        
        // Enqueue plugin JavaScript
        wp_enqueue_script(
            'scannet-script',
            SCANNET_PLUGIN_URL . 'assets/js/data-network.js',
            array(),
            SCANNET_VERSION,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'scannet_enqueue_assets');

/**
 * Shortcode function
 */
function scannet_render_network($atts) {
    // Parse shortcode attributes
    $atts = shortcode_atts(
        array(
            'title' => 'See how your images train our AI model',
            'height' => '100vh',
        ),
        $atts,
        'scandinavian_network'
    );
    
    // Start output buffering
    ob_start();
    ?>
    
    <div class="scannet-container" style="height: <?php echo esc_attr($atts['height']); ?>;">
        <div class="scannet-loader" id="scannetLoader"></div>
        <canvas id="scannetCanvas"></canvas>
        
        <div class="scannet-title-overlay" id="scannetTitleOverlay">
            <h1><?php echo esc_html($atts['title']); ?></h1>
        </div>

        <div class="scannet-tooltip" id="scannetTooltip">
            <strong id="scannetTooltipTitle"></strong>
            <span id="scannetTooltipDesc"></span>
        </div>
    </div>
    
    <?php
    // Return buffered content
    return ob_get_clean();
}
add_shortcode('scandinavian_network', 'scannet_render_network');

/**
 * Add settings link on plugin page
 */
function scannet_plugin_action_links($links) {
    $settings_link = '<a href="https://github.com/yourusername/scandinavian-network">Documentation</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'scannet_plugin_action_links');