# Drone Data Animation WordPress Plugin

A WordPress plugin that displays an animated data stream flowing into a drone illustration using canvas animation.

## Installation

1. Download the entire `drone-animation-plugin` folder
2. Upload it to your WordPress `/wp-content/plugins/` directory
3. **Important:** Add your drone image file named `droneillustration.png` to the `assets/images/` folder
4. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

Simply add the shortcode to any page or post:

```
[drone_animation]
```

### Shortcode Parameters

You can customize the animation container size:

```
[drone_animation width="100%" height="600px"]
```

**Parameters:**
- `width` - Container width (default: 100%)
- `height` - Container height (default: 600px)

### Examples

Full width with custom height:
```
[drone_animation height="800px"]
```

Fixed width centered container:
```
[drone_animation width="1200px" height="700px"]
```

## File Structure

```
drone-animation-plugin/
├── drone-animation.php          (Main plugin file)
├── assets/
│   ├── css/
│   │   └── drone-animation.css  (Styles)
│   ├── js/
│   │   └── drone-animation.js   (Animation logic)
│   └── images/
│       └── droneillustration.png (Drone image - YOU NEED TO ADD THIS)
└── README.md
```

## Required Files

**IMPORTANT:** You must add your `droneillustration.png` file to the `assets/images/` folder for the plugin to work correctly.

## Features

- Animated data characters (0, 1, {, }, <, >, etc.) flowing from top down
- Animated polaroid frames with rotation
- 90-degree cone effect from above the drone
- Smooth fade-in and fade-out effects
- Responsive design
- Color: #365786 (blue)
- Pure vanilla JavaScript (no jQuery dependency)

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Support

For support, please contact [your-email@example.com]

## License

GPL v2 or later
