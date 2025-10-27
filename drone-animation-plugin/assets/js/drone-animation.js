(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDroneAnimation);
    } else {
        initDroneAnimation();
    }
    
    function initDroneAnimation() {
        const canvas = document.getElementById('droneAnimationCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Floating data icons/symbols
        class DataIcon {
            constructor() {
                this.symbols = ['0', '1', '{', '}', '<', '>', '/', '\\', '|', '-', '+', '*', '#'];
                this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                this.resetDelay = Math.random() * 2000;
                this.lastResetTime = Date.now() + this.resetDelay;
                this.reset();
            }
            
            reset() {
                // 90-degree cone from directly above
                const coneAngle = Math.PI / 4;
                const angle = (Math.random() - 0.5) * coneAngle * 2;
                const distance = Math.random() * 400 + 400;
                
                const horizontalOffset = Math.tan(angle) * distance;
                const rotationAngle = Math.random() * Math.PI * 2;
                
                this.startX = centerX + Math.cos(rotationAngle) * horizontalOffset;
                this.startY = centerY - distance;
                this.x = this.startX;
                this.y = this.startY;
                
                // Stop 40px higher than center
                this.targetX = centerX + (Math.random() - 0.5) * 80;
                this.targetY = centerY - 40 + (Math.random() - 0.5) * 40;
                
                this.speed = Math.random() * 0.4 + 0.2;
                this.size = Math.random() * 10 + 12;
                this.baseOpacity = 1;
                
                // Calculate total journey distance and make fade cover most of it
                const totalDistance = Math.sqrt(
                    Math.pow(this.targetX - this.startX, 2) + 
                    Math.pow(this.targetY - this.startY, 2)
                );
                this.fadeDistance = totalDistance * 0.7;
            }
            
            update() {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 15) {
                    this.reset();
                } else {
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                }
            }
            
            draw() {
                // Calculate fade-in based on distance traveled from start
                const distanceTraveled = this.y - this.startY;
                const fadeProgress = Math.min(Math.max(distanceTraveled / this.fadeDistance, 0), 1);
                
                // Smooth easing function for more gradual fade
                const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
                const currentOpacity = this.baseOpacity * easedProgress;
                
                // Calculate fade-out as approaching target
                const distanceToTarget = Math.sqrt(
                    Math.pow(this.targetX - this.x, 2) + 
                    Math.pow(this.targetY - this.y, 2)
                );
                const fadeOutDistance = 80;
                const fadeOutProgress = Math.min(distanceToTarget / fadeOutDistance, 1);
                
                // Combine fade-in and fade-out
                const finalOpacity = currentOpacity * fadeOutProgress;
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.font = this.size + 'px "Courier New", monospace';
                ctx.fillStyle = 'rgba(54, 87, 134, ' + finalOpacity + ')';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, 0, 0);
                ctx.restore();
            }
        }
        
        // Hand-drawn Polaroid photos
        class Polaroid {
            constructor() {
                this.resetDelay = Math.random() * 2000;
                this.lastResetTime = Date.now() + this.resetDelay;
                this.reset();
            }
            
            reset() {
                // 90-degree cone from directly above
                const coneAngle = Math.PI / 4;
                const angle = (Math.random() - 0.5) * coneAngle * 2;
                const distance = Math.random() * 400 + 400;
                
                const horizontalOffset = Math.tan(angle) * distance;
                const rotationAngle = Math.random() * Math.PI * 2;
                
                this.startX = centerX + Math.cos(rotationAngle) * horizontalOffset;
                this.startY = centerY - distance;
                this.x = this.startX;
                this.y = this.startY;
                
                // Stop 40px higher than center
                this.targetX = centerX + (Math.random() - 0.5) * 100;
                this.targetY = centerY - 40 + (Math.random() - 0.5) * 50;
                
                this.speed = Math.random() * 0.3 + 0.15;
                this.width = Math.random() * 10 + 15;
                this.height = this.width * 1.2;
                this.baseOpacity = 1;
                
                // Calculate total journey distance and make fade cover most of it
                const totalDistance = Math.sqrt(
                    Math.pow(this.targetX - this.startX, 2) + 
                    Math.pow(this.targetY - this.startY, 2)
                );
                this.fadeDistance = totalDistance * 0.7;
                
                // Rotation
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;
                
                // Hand-drawn wobble
                this.wobbleOffset = Math.random() * Math.PI * 2;
            }
            
            update() {
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 15) {
                    this.reset();
                } else {
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                    this.rotation += this.rotationSpeed;
                }
            }
            
            draw() {
                // Calculate fade-in
                const distanceTraveled = this.y - this.startY;
                const fadeProgress = Math.min(Math.max(distanceTraveled / this.fadeDistance, 0), 1);
                
                // Smooth easing function for more gradual fade
                const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
                const currentOpacity = this.baseOpacity * easedProgress;
                
                // Calculate fade-out as approaching target
                const distanceToTarget = Math.sqrt(
                    Math.pow(this.targetX - this.x, 2) + 
                    Math.pow(this.targetY - this.y, 2)
                );
                const fadeOutDistance = 80;
                const fadeOutProgress = Math.min(distanceToTarget / fadeOutDistance, 1);
                
                // Combine fade-in and fade-out
                const finalOpacity = currentOpacity * fadeOutProgress;
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                // Draw hand-drawn polaroid with slight imperfections
                const borderWidth = this.width * 0.12;
                const bottomBorder = this.height * 0.25;
                
                // Outer blue border with hand-drawn effect
                ctx.strokeStyle = 'rgba(54, 87, 134, ' + finalOpacity + ')';
                ctx.fillStyle = 'rgba(54, 87, 134, ' + (finalOpacity * 0.3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                
                // Draw slightly wobbly rectangle for hand-drawn effect
                const wobble = 1;
                ctx.moveTo(-this.width/2 + Math.random() * wobble, -this.height/2 + Math.random() * wobble);
                ctx.lineTo(this.width/2 + Math.random() * wobble, -this.height/2 + Math.random() * wobble);
                ctx.lineTo(this.width/2 + Math.random() * wobble, this.height/2 + Math.random() * wobble);
                ctx.lineTo(-this.width/2 + Math.random() * wobble, this.height/2 + Math.random() * wobble);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // White inner area
                ctx.fillStyle = 'rgba(255, 255, 255, ' + finalOpacity + ')';
                ctx.fillRect(
                    -this.width/2 + borderWidth,
                    -this.height/2 + borderWidth,
                    this.width - borderWidth * 2,
                    this.height - borderWidth - bottomBorder
                );
                
                ctx.restore();
            }
        }
        
        // Create icons
        const icons = [];
        for (let i = 0; i < 50; i++) {
            icons.push(new DataIcon());
        }
        
        // Create polaroids
        const polaroids = [];
        for (let i = 0; i < 15; i++) {
            polaroids.push(new Polaroid());
        }
        
        // Animation loop
        function animate() {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw polaroids behind icons
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
        
        animate();
    }
})();
