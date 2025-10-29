<?php
/**
 * Plugin Name: Image Hover Reveal Effect
 * Plugin URI: https://yourwebsite.com
 * Description: A smooth radial reveal effect that transitions from photography to illustration on hover
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class ImageHoverReveal {
    
    private $plugin_url;
    
    public function __construct() {
        $this->plugin_url = plugin_dir_url(__FILE__);
        
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_shortcode('image_hover_reveal', array($this, 'shortcode'));
    }
    
    public function enqueue_assets() {
        wp_enqueue_style(
            'image-hover-reveal-css',
            $this->plugin_url . 'assets/css/image-hover-reveal.css',
            array(),
            '1.0.0'
        );
        
        wp_enqueue_script(
            'image-hover-reveal-js',
            $this->plugin_url . 'assets/js/image-hover-reveal.js',
            array(),
            '1.0.0',
            true
        );
    }
    
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'photo' => 'photo.jpg',
            'illustration' => 'illustration.png',
            'width' => '100%',
            'max_width' => '950px',
            'id' => ''
        ), $atts);
        
        $photo_url = $this->plugin_url . 'assets/images/' . $atts['photo'];
        $illustration_url = $this->plugin_url . 'assets/images/' . $atts['illustration'];
        
        $unique_id = !empty($atts['id']) ? $atts['id'] : 'hover-reveal-' . uniqid();
        
        ob_start();
        ?>
        <div class="image-hover-container" 
             id="<?php echo esc_attr($unique_id); ?>"
             style="width: <?php echo esc_attr($atts['width']); ?>; max-width: <?php echo esc_attr($atts['max_width']); ?>;">
            <div class="photo-base">
                <img src="<?php echo esc_url($photo_url); ?>" 
                     alt=""
                     loading="lazy">
            </div>
            
            <div class="illustration-overlay">
                <img src="<?php echo esc_url($illustration_url); ?>" 
                     alt=""
                     loading="lazy">
            </div>
        </div>
        
        <script>
        (function() {
            function initHover() {
                if (typeof ImageHoverReveal !== 'undefined') {
                    ImageHoverReveal.init('<?php echo esc_js($unique_id); ?>');
                } else {
                    setTimeout(initHover, 100);
                }
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initHover);
            } else {
                initHover();
            }
        })();
        </script>
        <?php
        return ob_get_clean();
    }
}

// Initialize the plugin
new ImageHoverReveal();