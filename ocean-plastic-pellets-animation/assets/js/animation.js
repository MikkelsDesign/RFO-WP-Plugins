(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('oceanPlasticAnimation');
        const pelletsContainer = document.getElementById('pelletsContainer');
        
        if (!container || !pelletsContainer) {
            return;
        }
        
        // Color palette
        const pelletColors = ['#fdfbfd', '#ebe0cc', '#b3d1d6', '#98c6e2', '#2b3869'];
        
        // Pellets array
        let pellets = [];
        
        // Mouse position
        let mousePos = { x: -1000, y: -1000 };
        
        // Initialize pellets
        function initPellets() {
            const numPellets = 30;
            
            for (let i = 0; i < numPellets; i++) {
                const pellet = {
                    id: i,
                    x: Math.random() * 100,
                    y: 40 + Math.random() * 55,
                    size: 6 + Math.random() * 10,
                    vx: (Math.random() - 0.5) * 0.02,
                    vy: (Math.random() - 0.5) * 0.01,
                    mass: 0.5 + Math.random() * 0.5,
                    color: pelletColors[Math.floor(Math.random() * pelletColors.length)],
                    element: null
                };
                
                // Create DOM element
                const pelletEl = document.createElement('div');
                pelletEl.className = 'pellet';
                pelletEl.style.width = pellet.size + 'px';
                pelletEl.style.height = pellet.size + 'px';
                pelletEl.style.backgroundColor = pellet.color;
                pelletEl.style.left = pellet.x + '%';
                pelletEl.style.top = pellet.y + '%';
                
                pelletsContainer.appendChild(pelletEl);
                pellet.element = pelletEl;
                
                pellets.push(pellet);
            }
        }
        
        // Update mouse position
        function handleMouseMove(e) {
            const rect = container.getBoundingClientRect();
            mousePos.x = ((e.clientX - rect.left) / rect.width) * 100;
            mousePos.y = ((e.clientY - rect.top) / rect.height) * 100;
        }
        
        // Animation loop
        function animate() {
            pellets.forEach(function(pellet) {
                // Calculate distance from mouse
                const dx = mousePos.x - pellet.x;
                const dy = mousePos.y - pellet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Cursor repulsion
                const repulsionRadius = 8;
                if (distance < repulsionRadius && distance > 0) {
                    const force = (repulsionRadius - distance) / repulsionRadius;
                    const angle = Math.atan2(dy, dx);
                    pellet.vx -= Math.cos(angle) * force * 0.1;
                    pellet.vy -= Math.sin(angle) * force * 0.1;
                }
                
                // Natural drift
                pellet.vx += (Math.random() - 0.5) * 0.002;
                pellet.vy += (Math.random() - 0.5) * 0.001;
                
                // Friction/damping
                pellet.vx *= 0.98;
                pellet.vy *= 0.98;
                
                // Apply velocity
                pellet.x += pellet.vx;
                pellet.y += pellet.vy;
                
                // Boundary constraints
                if (pellet.x < 0) {
                    pellet.x = 0;
                    pellet.vx = Math.abs(pellet.vx) * 0.5;
                }
                if (pellet.x > 100) {
                    pellet.x = 100;
                    pellet.vx = -Math.abs(pellet.vx) * 0.5;
                }
                if (pellet.y < 40) {
                    pellet.y = 40;
                    pellet.vy = Math.abs(pellet.vy) * 0.5;
                }
                if (pellet.y > 95) {
                    pellet.y = 95;
                    pellet.vy = -Math.abs(pellet.vy) * 0.5;
                }
                
                // Update element position
                if (pellet.element) {
                    pellet.element.style.left = pellet.x + '%';
                    pellet.element.style.top = pellet.y + '%';
                }
            });
            
            requestAnimationFrame(animate);
        }
        
        // Initialize
        initPellets();
        window.addEventListener('mousemove', handleMouseMove);
        animate();
    });
})();
