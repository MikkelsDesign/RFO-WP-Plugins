<?php
/**
 * Plugin Name: Ocean Plastic Pellets Animation
 * Plugin URI: https://example.com/ocean-plastic-pellets
 * Description: An interactive ocean wave animation with floating plastic pellets and EU statistics. Use shortcode [ocean_plastic_animation]
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ocean-plastic-pellets
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class OceanPlasticPelletsAnimation {
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register shortcode
        add_shortcode('ocean_plastic_animation', array($this, 'render_animation'));
        
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
    }
    
    /**
     * Enqueue plugin assets
     */
    public function enqueue_assets() {
        // Only enqueue if shortcode is present on the page
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'ocean_plastic_animation')) {
            // Enqueue CSS
            wp_enqueue_style(
                'ocean-plastic-animation-css',
                plugins_url('assets/css/style.css', __FILE__),
                array(),
                '1.0.0'
            );
            
            // Enqueue JavaScript
            wp_enqueue_script(
                'ocean-plastic-animation-js',
                plugins_url('assets/js/animation.js', __FILE__),
                array(),
                '1.0.0',
                true
            );
            
            // Enqueue Google Fonts
            wp_enqueue_style(
                'ocean-plastic-google-fonts',
                'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap',
                array(),
                null
            );
        }
    }
    
    /**
     * Render the animation shortcode
     */
    public function render_animation($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(array(
            'height' => '500px',
        ), $atts, 'ocean_plastic_animation');
        
        ob_start();
        ?>
        <div class="ocean-plastic-wrapper">
            <div class="ocean-plastic-container" style="height: <?php echo esc_attr($atts['height']); ?>;">
                <div class="ocean-plastic-animation" id="oceanPlasticAnimation">
                    <!-- Ocean Wave SVG -->
                    <svg class="ocean-wave" viewBox="0 0 1000 400" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color: #7dd3e8; stop-opacity: 1;" />
                                <stop offset="100%" style="stop-color: #5db8d1; stop-opacity: 1;" />
                            </linearGradient>
                        </defs>
                        <path class="wave-path" fill="url(#oceanGradient)" d="M0,150 Q250,120 500,150 T1000,150 L1000,400 L0,400 Z" />
                    </svg>
                    
                    <!-- Pellets Container -->
                    <div class="pellets-container" id="pelletsContainer"></div>
                    
                    <!-- Fact Box -->
                    <div class="fact-box-wrapper">
                        <div class="fact-box-inner">
                            <div class="fact-box">
                                <h3 class="fact-box-title">The Pellet Problem</h3>
                                <p class="fact-box-text">
                                    Between 52,000 and 184,000 tonnes of plastic pellets are released into the environment each year due to mishandling throughout the entire supply chain. These tiny particles represent the third-largest source of microplastic pollution in the oceans. 
                                </p>
                                <p class="fact-box-source">
                                    Source: EU Commission, October 2023
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

// Initialize the plugin
new OceanPlasticPelletsAnimation();
