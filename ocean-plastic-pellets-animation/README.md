# Ocean Plastic Pellets Animation - WordPress Plugin

An interactive ocean wave animation with floating plastic pellets and EU statistics about plastic pollution.

## Features

- Beautiful animated ocean wave
- Interactive plastic pellets that respond to cursor movement
- EU Commission statistics (October 2023)
- Fully responsive design
- Clean, modern aesthetic with custom color palette
- Uses Montserrat and Helvetica fonts

## Installation

1. Download the plugin folder `ocean-plastic-pellets-animation`
2. Upload to your WordPress site's `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

Simply add the shortcode to any page or post:

```
[ocean_plastic_animation]
```

### Shortcode Parameters

You can customize the height of the animation:

```
[ocean_plastic_animation height="80vh"]
```

Default height is `100vh` (full viewport height).

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technical Details

### Files Structure
```
ocean-plastic-pellets-animation/
├── ocean-plastic-pellets-animation.php (Main plugin file)
├── assets/
│   ├── css/
│   │   └── style.css (Styles)
│   └── js/
│       └── animation.js (Animation logic)
└── README.md
```

### Features
- Physics-based pellet movement
- Cursor avoidance with collision detection
- Responsive breakpoints for mobile, tablet, and desktop
- Smooth CSS animations
- Optimized performance

## Credits

Based on EU Commission data (October 2023) regarding plastic pellet pollution.

## License

GPL v2 or later

## Version

1.0.0

## Support

For issues or questions, please contact the plugin author.
