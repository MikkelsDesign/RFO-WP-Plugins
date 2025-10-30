/**
 * Scandinavian Network Visualization
 * Interactive canvas-based network showing how user images train AI models
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNetwork);
    } else {
        initNetwork();
    }
    
    function initNetwork() {
        const canvas = document.getElementById('scannetCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const tooltip = document.getElementById('scannetTooltip');
        const container = canvas.parentElement;
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Hide loader after short delay
        setTimeout(() => {
            const loader = document.getElementById('scannetLoader');
            if (loader) {
                loader.style.display = 'none';
            }
        }, 1000);

        // Interactive data points - user-centric training aspects
        const dataPoints = [
            {
                title: "Time of Day",
                description: "Your photos taken at different times teach the AI to recognize pellets in morning light, midday sun, and evening shadows.",
                category: "interactive"
            },
            {
                title: "Weather Conditions",
                description: "Images captured in sun, rain, fog, or clouds help the AI learn to detect pellets under any weather.",
                category: "interactive"
            },
            {
                title: "Seasons",
                description: "Photos across spring, summer, fall, and winter train the model to handle seasonal changes in beach conditions.",
                category: "interactive"
            },
            {
                title: "Camera Angles",
                description: "Your varied perspectives - overhead, close-up, or distant - teach the AI spatial recognition from any viewpoint.",
                category: "interactive"
            },
            {
                title: "Zoom Levels",
                description: "From macro close-ups to wide shots, your images train the AI to spot pellets at every scale and distance.",
                category: "interactive"
            },
            {
                title: "Beach Environments",
                description: "Sand, rocks, seaweed, shells - your diverse beach backgrounds improve detection accuracy in any terrain.",
                category: "interactive"
            },
            {
                title: "Lighting Variations",
                description: "Bright, dim, backlit, or shadowed - each photo you take expands the AI's ability to see in different light.",
                category: "interactive"
            },
            {
                title: "Pellet Colors",
                description: "White, transparent, colored pellets in your images teach the AI to recognize all plastic types.",
                category: "interactive"
            },
            {
                title: "Geographic Diversity",
                description: "Photos from different locations help the AI work globally across various coastal conditions.",
                category: "interactive"
            },
            {
                title: "Image Metadata",
                description: "Your photo's GPS, timestamp, and device info provide context that enhances training precision.",
                category: "interactive"
            },
            {
                title: "Background Clutter",
                description: "Shells, sand patterns, debris - your real-world scenes train the AI to distinguish pellets from distractions.",
                category: "interactive"
            },
            {
                title: "Confirmation Data",
                description: "When you verify AI detections, you directly improve the model's accuracy and confidence.",
                category: "interactive"
            }
        ];

        // Helper nodes for more connections (invisible, non-interactive)
        const helperNodes = [];
        for (let i = 0; i < 25; i++) {
            helperNodes.push({
                title: "helper",
                category: "helper"
            });
        }

        // Node class
        class Node {
            constructor(x, y, data, id, orbitCenter) {
                this.x = x;
                this.y = y;
                this.data = data;
                this.id = id;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.hovered = false;
                this.isInteractive = data.category === "interactive";
                this.orbitCenter = orbitCenter;
                this.orbitRadius = this.isInteractive ? 200 : 80 + Math.random() * 220;
                this.orbitAngle = Math.atan2(y - orbitCenter.y, x - orbitCenter.x);
                this.orbitSpeed = (Math.random() - 0.5) * 0.0005;
                this.connected = [];
            }

            update() {
                // Gentle orbital movement
                this.orbitAngle += this.orbitSpeed;
                const targetX = this.orbitCenter.x + Math.cos(this.orbitAngle) * this.orbitRadius;
                const targetY = this.orbitCenter.y + Math.sin(this.orbitAngle) * this.orbitRadius;

                // Smoothly move toward orbit position
                this.vx += (targetX - this.x) * 0.002;
                this.vy += (targetY - this.y) * 0.002;

                // Apply velocity with damping
                this.vx *= 0.95;
                this.vy *= 0.95;
                this.x += this.vx;
                this.y += this.vy;

                // Keep within canvas bounds with soft bounce
                const margin = 30;
                if (this.x < margin || this.x > canvas.width - margin) {
                    this.vx *= -0.5;
                    this.x = Math.max(margin, Math.min(canvas.width - margin, this.x));
                }
                if (this.y < margin || this.y > canvas.height - margin) {
                    this.vy *= -0.5;
                    this.y = Math.max(margin, Math.min(canvas.height - margin, this.y));
                }
            }

            draw() {
                if (!this.isInteractive) return;

                const baseRadius = 8;
                const hoverRadius = 14;
                const radius = this.hovered ? hoverRadius : baseRadius;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                
                if (this.hovered) {
                    // Gradient for hovered state
                    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, hoverRadius);
                    gradient.addColorStop(0, 'rgba(39, 56, 109, 1)');
                    gradient.addColorStop(1, 'rgba(39, 56, 109, 0.6)');
                    ctx.fillStyle = gradient;
                    
                    // Outer glow ring
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = 'rgba(39, 56, 109, 0.5)';
                } else {
                    ctx.fillStyle = 'rgba(39, 56, 109, 0.8)';
                    ctx.shadowBlur = 0;
                }
                
                ctx.fill();
                ctx.shadowBlur = 0;

                // Pulse effect for hovered node
                if (this.hovered) {
                    const pulseRadius = hoverRadius + 8 + Math.sin(Date.now() / 300) * 4;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(39, 56, 109, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }

            isHovered(mx, my) {
                if (!this.isInteractive) return false;
                const dx = mx - this.x;
                const dy = my - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < 14;
            }
        }

        // Create node array
        const nodes = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const orbitCenter = { x: centerX, y: centerY };

        // Create interactive data nodes
        dataPoints.forEach((data, index) => {
            const angle = (index / dataPoints.length) * Math.PI * 2;
            const radius = 200;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            nodes.push(new Node(x, y, data, index, orbitCenter));
        });

        // Create helper nodes for network density
        helperNodes.forEach((data, index) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = 80 + Math.random() * 220;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            nodes.push(new Node(x, y, data, index + dataPoints.length, orbitCenter));
        });

        // Mouse tracking
        let mouseX = -1000;
        let mouseY = -1000;
        let hoveredNode = null;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            // Check hover state
            let foundHover = false;
            for (let node of nodes) {
                node.hovered = false;
                if (!foundHover && node.isHovered(mouseX, mouseY)) {
                    node.hovered = true;
                    hoveredNode = node;
                    foundHover = true;
                }
            }

            if (!foundHover) {
                hoveredNode = null;
            }

            // Update tooltip
            if (hoveredNode) {
                tooltip.classList.add('active');
                document.getElementById('scannetTooltipTitle').textContent = hoveredNode.data.title;
                document.getElementById('scannetTooltipDesc').textContent = hoveredNode.data.description;
                
                // Position tooltip
                const offset = 25;
                let tooltipX = e.clientX + offset;
                let tooltipY = e.clientY + offset;
                
                // Prevent overflow
                const tooltipRect = tooltip.getBoundingClientRect();
                if (tooltipX + tooltipRect.width > window.innerWidth - 20) {
                    tooltipX = e.clientX - tooltipRect.width - offset;
                }
                if (tooltipY + tooltipRect.height > window.innerHeight - 20) {
                    tooltipY = e.clientY - tooltipRect.height - offset;
                }
                
                tooltip.style.left = tooltipX + 'px';
                tooltip.style.top = tooltipY + 'px';
            } else {
                tooltip.classList.remove('active');
            }
        });

        canvas.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
            hoveredNode = null;
            nodes.forEach(node => node.hovered = false);
            tooltip.classList.remove('active');
        });

        // Build connection graph after nodes are created
        function buildConnections() {
            const maxDistance = 220;
            
            nodes.forEach(node => {
                node.connected = [];
            });
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x;
                    const dy = nodes[j].y - nodes[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        nodes[i].connected.push(nodes[j]);
                        nodes[j].connected.push(nodes[i]);
                    }
                }
            }
        }

        // Draw visible connection network
        function drawConnections() {
            nodes.forEach(node => {
                node.connected.forEach(connectedNode => {
                    // Only draw each connection once
                    if (nodes.indexOf(node) < nodes.indexOf(connectedNode)) {
                        const dx = connectedNode.x - node.x;
                        const dy = connectedNode.y - node.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Base opacity based on distance
                        let opacity = (1 - distance / 220) * 0.25;
                        let lineWidth = 1;
                        
                        // Highlight connections involving hovered nodes
                        if (node.hovered || connectedNode.hovered) {
                            opacity = (1 - distance / 220) * 0.7;
                            lineWidth = 2.5;
                        }
                        // Highlight connections between interactive nodes
                        else if (node.isInteractive && connectedNode.isInteractive) {
                            opacity = (1 - distance / 220) * 0.35;
                            lineWidth = 1.5;
                        }

                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(connectedNode.x, connectedNode.y);
                        
                        // Color: #27386d for hovered, dark gray otherwise
                        const color = (node.hovered || connectedNode.hovered) ? 
                            '39, 56, 109' : '52, 73, 94';
                        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                        ctx.lineWidth = lineWidth;
                        ctx.stroke();

                        // Draw data flow particles on hovered connections
                        if (node.hovered || connectedNode.hovered) {
                            const particleCount = 2;
                            for (let p = 0; p < particleCount; p++) {
                                const progress = ((Date.now() / 1500 + p / particleCount) % 1);
                                const px = node.x + dx * progress;
                                const py = node.y + dy * progress;
                                
                                ctx.beginPath();
                                ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                                ctx.fillStyle = `rgba(39, 56, 109, ${0.8 * (1 - Math.abs(progress - 0.5) * 2)})`;
                                ctx.fill();
                            }
                        }
                    }
                });
            });
        }

        // Build initial connections
        buildConnections();
        
        // Rebuild connections periodically as nodes move
        setInterval(buildConnections, 2000);

        // Animation loop
        function animate() {
            // Clear with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw connections first (behind nodes)
            drawConnections();

            // Update and draw all nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Fade out title after a moment
        setTimeout(() => {
            const titleOverlay = document.getElementById('scannetTitleOverlay');
            if (titleOverlay) {
                titleOverlay.style.transition = 'opacity 1s ease-out';
                titleOverlay.style.opacity = '0.15';
            }
        }, 3000);

        // Bring back title on mouse move near center
        let titleFaded = false;
        canvas.addEventListener('mousemove', (e) => {
            const titleOverlay = document.getElementById('scannetTitleOverlay');
            if (!titleOverlay) return;
            
            const rect = canvas.getBoundingClientRect();
            const distanceFromCenter = Math.sqrt(
                Math.pow((e.clientX - rect.left) - canvas.width / 2, 2) + 
                Math.pow((e.clientY - rect.top) - canvas.height / 2, 2)
            );
            
            if (distanceFromCenter < 200) {
                titleOverlay.style.opacity = '0.3';
            } else if (titleFaded) {
                titleOverlay.style.opacity = '0.15';
            }
        });

        // Canvas responsiveness
        window.addEventListener('resize', () => {
            resizeCanvas();
            // Update orbit center on resize
            const newCenterX = canvas.width / 2;
            const newCenterY = canvas.height / 2;
            nodes.forEach(node => {
                node.orbitCenter = { x: newCenterX, y: newCenterY };
            });
        });
    }
})();