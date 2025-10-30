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
            // Get device pixel ratio for high DPI displays
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            
            // Set display size (css pixels)
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            // Set actual size in memory (scaled for DPI)
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            
            // Scale context to match DPI
            ctx.scale(dpr, dpr);
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
            constructor(x, y, data, id, orbitCenter, layer) {
                this.x = x;
                this.y = y;
                this.data = data;
                this.id = id;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.hovered = false;
                this.isInteractive = data.category === "interactive";
                this.layer = layer; // Depth layer for visual effect
                this.orbitCenter = orbitCenter;
                
                // Calculate orbit radius based on distance from center (stays within bounds)
                const dx = x - orbitCenter.x;
                const dy = y - orbitCenter.y;
                this.orbitRadius = Math.sqrt(dx * dx + dy * dy);
                
                this.orbitAngle = Math.atan2(y - orbitCenter.y, x - orbitCenter.x);
                // More varied and visible orbit speeds
                this.orbitSpeed = (Math.random() - 0.5) * 0.0015 + (this.isInteractive ? 0.0008 : 0.0004);
                
                // Add some wobble for organic movement (reduced)
                this.wobbleOffset = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.0008 + Math.random() * 0.001;
                this.wobbleAmount = 8 + Math.random() * 12;
                
                this.connected = [];
                
                // Add magnetic attraction properties (reduced)
                this.attractionStrength = 0.0001;
                this.repulsionStrength = 0.3;
                this.minDistance = 60;
            }

            update() {
                // Orbital movement with wobble
                this.orbitAngle += this.orbitSpeed;
                this.wobbleOffset += this.wobbleSpeed;
                
                const wobbleX = Math.cos(this.wobbleOffset) * this.wobbleAmount;
                const wobbleY = Math.sin(this.wobbleOffset * 1.3) * this.wobbleAmount;
                
                const targetX = this.orbitCenter.x + 
                    Math.cos(this.orbitAngle) * this.orbitRadius + wobbleX;
                const targetY = this.orbitCenter.y + 
                    Math.sin(this.orbitAngle) * this.orbitRadius + wobbleY;

                // Stronger pull toward target
                this.vx += (targetX - this.x) * 0.008;
                this.vy += (targetY - this.y) * 0.008;

                // Magnetic interactions with other nodes
                nodes.forEach(other => {
                    if (other !== this) {
                        const dx = other.x - this.x;
                        const dy = other.y - this.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Repulsion when too close
                        if (distance < this.minDistance && distance > 0) {
                            const force = (this.minDistance - distance) * this.repulsionStrength;
                            this.vx -= (dx / distance) * force;
                            this.vy -= (dy / distance) * force;
                        }
                        // Gentle attraction at medium distances
                        else if (distance < 250 && distance > this.minDistance) {
                            const force = this.attractionStrength;
                            this.vx += (dx / distance) * force * distance * 0.1;
                            this.vy += (dy / distance) * force * distance * 0.1;
                        }
                    }
                });

                // Apply velocity with less damping for more movement
                this.vx *= 0.92;
                this.vy *= 0.92;
                this.x += this.vx;
                this.y += this.vy;

                // Get actual canvas dimensions
                const rect = canvas.parentElement.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                
                // Strong boundary containment - prevent going off screen
                const margin = 50;
                
                // Hard clamp to keep nodes visible
                if (this.x < margin) {
                    this.x = margin;
                    this.vx = Math.abs(this.vx) * 0.5;
                }
                if (this.x > width - margin) {
                    this.x = width - margin;
                    this.vx = -Math.abs(this.vx) * 0.5;
                }
                if (this.y < margin) {
                    this.y = margin;
                    this.vy = Math.abs(this.vy) * 0.5;
                }
                if (this.y > height - margin) {
                    this.y = height - margin;
                    this.vy = -Math.abs(this.vy) * 0.5;
                }
            }

            draw() {
                if (!this.isInteractive) return;

                // Larger base sizes
                const baseRadius = 12 + this.layer * 2;
                const hoverRadius = 22 + this.layer * 2;
                const radius = this.hovered ? hoverRadius : baseRadius;
                
                // Layer-based opacity for depth
                const layerOpacity = 0.7 + (this.layer * 0.1);
                
                // Draw node with depth shadow
                ctx.save();
                
                // Depth shadow
                if (!this.hovered) {
                    ctx.shadowBlur = 10 + this.layer * 5;
                    ctx.shadowColor = `rgba(39, 56, 109, ${0.3 * layerOpacity})`;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                }
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                
                if (this.hovered) {
                    // Gradient for hovered state
                    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, hoverRadius);
                    gradient.addColorStop(0, 'rgba(39, 56, 109, 1)');
                    gradient.addColorStop(0.6, 'rgba(39, 56, 109, 0.8)');
                    gradient.addColorStop(1, 'rgba(39, 56, 109, 0.3)');
                    ctx.fillStyle = gradient;
                    
                    // Stronger glow for hover
                    ctx.shadowBlur = 30;
                    ctx.shadowColor = 'rgba(39, 56, 109, 0.8)';
                } else {
                    // Layer-based gradient
                    const gradient = ctx.createRadialGradient(
                        this.x - radius * 0.3, 
                        this.y - radius * 0.3, 
                        0, 
                        this.x, 
                        this.y, 
                        radius
                    );
                    gradient.addColorStop(0, `rgba(39, 56, 109, ${layerOpacity})`);
                    gradient.addColorStop(1, `rgba(39, 56, 109, ${layerOpacity * 0.6})`);
                    ctx.fillStyle = gradient;
                }
                
                ctx.fill();
                
                // Inner highlight for depth
                if (!this.hovered) {
                    ctx.shadowBlur = 0;
                    ctx.beginPath();
                    ctx.arc(this.x - radius * 0.3, this.y - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * layerOpacity})`;
                    ctx.fill();
                }
                
                ctx.restore();

                // Animated pulse ring for hovered node
                if (this.hovered) {
                    const time = Date.now() / 400;
                    const pulseRadius = hoverRadius + 10 + Math.sin(time) * 6;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(39, 56, 109, ${0.4 + Math.sin(time) * 0.2})`;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                    
                    // Secondary pulse
                    const pulseRadius2 = hoverRadius + 18 + Math.sin(time + 1) * 4;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, pulseRadius2, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(39, 56, 109, ${0.2 + Math.sin(time + 1) * 0.1})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            isHovered(mx, my) {
                if (!this.isInteractive) return false;
                const dx = mx - this.x;
                const dy = my - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < 22;
            }
        }

        // Create node array
        const nodes = [];
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const orbitCenter = { x: centerX, y: centerY };
        
        // Calculate safe radius based on viewport size
        const maxRadius = Math.min(rect.width, rect.height) * 0.35;

        // Create interactive data nodes in multiple layers with better spacing
        dataPoints.forEach((data, index) => {
            const angle = (index / dataPoints.length) * Math.PI * 2;
            // Layer assignment (0, 1, or 2) for depth
            const layer = index % 3;
            // Constrain radius to safe viewport area
            const baseRadius = maxRadius * 0.7 + (layer * maxRadius * 0.1);
            const radiusVariation = (Math.random() - 0.5) * maxRadius * 0.15;
            const radius = baseRadius + radiusVariation;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            nodes.push(new Node(x, y, data, index, orbitCenter, layer));
        });

        // Create helper nodes with better distribution
        helperNodes.forEach((data, index) => {
            const angle = Math.random() * Math.PI * 2;
            const layer = Math.floor(Math.random() * 3);
            // More varied radius for depth but constrained to viewport
            const radius = maxRadius * 0.3 + Math.random() * maxRadius * 0.7;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            nodes.push(new Node(x, y, data, index + dataPoints.length, orbitCenter, layer));
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
            // Larger max distance for more spread out network
            const maxDistance = 280;
            
            nodes.forEach(node => {
                node.connected = [];
            });
            
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[j].x - nodes[i].x;
                    const dy = nodes[j].y - nodes[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Only connect if within range and not too many connections
                    if (distance < maxDistance && nodes[i].connected.length < 6 && nodes[j].connected.length < 6) {
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
                        
                        // Layer-based depth effect
                        const avgLayer = (node.layer + connectedNode.layer) / 2;
                        const depthOpacity = 0.6 + (avgLayer * 0.15);
                        
                        // Base opacity based on distance with depth
                        let opacity = (1 - distance / 280) * 0.2 * depthOpacity;
                        let lineWidth = 0.8 + (avgLayer * 0.3);
                        
                        // Highlight connections involving hovered nodes
                        if (node.hovered || connectedNode.hovered) {
                            opacity = (1 - distance / 280) * 0.85;
                            lineWidth = 3 + (avgLayer * 0.5);
                        }
                        // Highlight connections between interactive nodes
                        else if (node.isInteractive && connectedNode.isInteractive) {
                            opacity = (1 - distance / 280) * 0.35 * depthOpacity;
                            lineWidth = 1.5 + (avgLayer * 0.3);
                        }

                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(connectedNode.x, connectedNode.y);
                        
                        // Color with depth variation
                        const color = (node.hovered || connectedNode.hovered) ? 
                            '39, 56, 109' : '52, 73, 94';
                        ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                        ctx.lineWidth = lineWidth;
                        ctx.stroke();

                        // Draw data flow particles on hovered connections
                        if (node.hovered || connectedNode.hovered) {
                            const particleCount = 3;
                            for (let p = 0; p < particleCount; p++) {
                                const progress = ((Date.now() / 1200 + p / particleCount) % 1);
                                const px = node.x + dx * progress;
                                const py = node.y + dy * progress;
                                
                                // Particle size based on depth
                                const particleSize = 3 + avgLayer * 0.5;
                                
                                ctx.beginPath();
                                ctx.arc(px, py, particleSize, 0, Math.PI * 2);
                                const particleOpacity = 0.9 * (1 - Math.abs(progress - 0.5) * 1.5);
                                ctx.fillStyle = `rgba(39, 56, 109, ${particleOpacity})`;
                                ctx.fill();
                                
                                // Particle glow
                                ctx.shadowBlur = 8;
                                ctx.shadowColor = 'rgba(39, 56, 109, 0.5)';
                                ctx.fill();
                                ctx.shadowBlur = 0;
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
            // Get container dimensions for drawing
            const rect = container.getBoundingClientRect();
            
            // Clear with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, rect.width, rect.height);

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
            const oldRect = { width: canvas.width / (window.devicePixelRatio || 1), height: canvas.height / (window.devicePixelRatio || 1) };
            
            resizeCanvas();
            
            // Update orbit center on resize
            const rect = container.getBoundingClientRect();
            const newCenterX = rect.width / 2;
            const newCenterY = rect.height / 2;
            
            // Scale node positions proportionally
            const scaleX = rect.width / oldRect.width;
            const scaleY = rect.height / oldRect.height;
            const scale = Math.min(scaleX, scaleY); // Use minimum to prevent overflow
            
            nodes.forEach(node => {
                // Scale position relative to old center
                const oldCenterX = oldRect.width / 2;
                const oldCenterY = oldRect.height / 2;
                const relX = (node.x - oldCenterX) * scale;
                const relY = (node.y - oldCenterY) * scale;
                
                node.x = newCenterX + relX;
                node.y = newCenterY + relY;
                node.orbitCenter = { x: newCenterX, y: newCenterY };
                node.orbitRadius = Math.sqrt(relX * relX + relY * relY);
            });
            
            buildConnections();
        });
    }
})();