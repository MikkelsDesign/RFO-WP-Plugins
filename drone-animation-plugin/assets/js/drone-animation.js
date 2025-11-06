// Hele koden kører i sit eget rum, så den ikke påvirker andet på siden
(function() {
    'use strict';
    
    // Venter på at siden er færdig med at indlæse, før vi starter animationen
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDroneAnimation);
    } else {
        initDroneAnimation();
    }
    
    function initDroneAnimation() {
        // Finder de elementer på siden vi skal bruge
        const canvas = document.getElementById('droneAnimationCanvas');
        const droneImage = document.getElementById('droneAnimationImage');
        if (!canvas || !droneImage) return;
        
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        
        // Finder midtpunktet af dronen dynamisk - beregner hver gang så det virker ved resize
        function getCenterX() {
            const rect = droneImage.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            return rect.left - canvasRect.left + rect.width / 2;
        }
        
        function getCenterY() {
            const rect = droneImage.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            return rect.top - canvasRect.top + rect.height / 2;
        }
        
        // Sørger for at canvas fylder hele containeren
        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // DataIcon: Svævende tekst-symboler som 0, 1, {, } osv. der flyver ind mod dronen
        class DataIcon {
            constructor() {
                // Liste over mulige symboler der kan vises
                this.symbols = ['0', '1', '{', '}', '<', '>', '/', '\\', '|', '-', '+', '*', '#'];
                this.symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                this.resetDelay = Math.random() * 2000;
                this.lastResetTime = Date.now() + this.resetDelay;
                this.reset();
            }
            
            reset() {
                // Finder hvor dronen er lige nu
                const centerX = getCenterX();
                const centerY = getCenterY();
                
                // Laver en 90-graders kegle oven over dronen, så data kommer fra alle retninger
                const coneAngle = Math.PI / 4;
                const angle = (Math.random() - 0.5) * coneAngle * 2;
                const distance = Math.random() * 400 + 400;
                
                const horizontalOffset = Math.tan(angle) * distance;
                const rotationAngle = Math.random() * Math.PI * 2;
                
                // Startposition: Langt væk oven over dronen
                this.startX = centerX + Math.cos(rotationAngle) * horizontalOffset;
                this.startY = centerY - distance;
                this.x = this.startX;
                this.y = this.startY;
                
                // Slutposition: Stopper 40px over dronens centrum
                this.targetX = centerX + (Math.random() - 0.5) * 80;
                this.targetY = centerY - 40 + (Math.random() - 0.5) * 40;
                
                // Tilfældig hastighed og størrelse for variation
                this.speed = Math.random() * 0.4 + 0.2;
                this.size = Math.random() * 10 + 12;
                this.baseOpacity = 1;
                
                // Beregner hvor lang ruten er, og fade-effekten dækker det meste af vejen
                const totalDistance = Math.sqrt(
                    Math.pow(this.targetX - this.startX, 2) + 
                    Math.pow(this.targetY - this.startY, 2)
                );
                this.fadeDistance = totalDistance * 0.7;
            }
            
            update() {
                // Beregner retning og afstand til målet
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Når vi er tæt på målet, starter vi forfra
                if (distance < 15) {
                    this.reset();
                } else {
                    // Bevæger ikonet mod målet
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                }
            }
            
            draw() {
                // Fade-in: Symbolet bliver gradvist synligt mens det bevæger sig
                const distanceTraveled = this.y - this.startY;
                const fadeProgress = Math.min(Math.max(distanceTraveled / this.fadeDistance, 0), 1);
                
                // Glat overgang med easing-funktion
                const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
                const currentOpacity = this.baseOpacity * easedProgress;
                
                // Fade-out: Symbolet forsvinder når det nærmer sig dronen
                const distanceToTarget = Math.sqrt(
                    Math.pow(this.targetX - this.x, 2) + 
                    Math.pow(this.targetY - this.y, 2)
                );
                const fadeOutDistance = 80;
                const fadeOutProgress = Math.min(distanceToTarget / fadeOutDistance, 1);
                
                // Kombinerer fade-in og fade-out for flydende effekt
                const finalOpacity = currentOpacity * fadeOutProgress;
                
                // Tegner symbolet på canvas
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
        
        // Polaroid: Små håndtegnede polaroid-billeder der flyver rundt som data
        class Polaroid {
            constructor() {
                this.resetDelay = Math.random() * 2000;
                this.lastResetTime = Date.now() + this.resetDelay;
                this.reset();
            }
            
            reset() {
                // Finder hvor dronen er lige nu
                const centerX = getCenterX();
                const centerY = getCenterY();
                
                // Laver en 90-graders kegle oven over dronen
                const coneAngle = Math.PI / 4;
                const angle = (Math.random() - 0.5) * coneAngle * 2;
                const distance = Math.random() * 400 + 400;
                
                const horizontalOffset = Math.tan(angle) * distance;
                const rotationAngle = Math.random() * Math.PI * 2;
                
                // Startposition: Langt væk oven over dronen
                this.startX = centerX + Math.cos(rotationAngle) * horizontalOffset;
                this.startY = centerY - distance;
                this.x = this.startX;
                this.y = this.startY;
                
                // Slutposition: Stopper 40px over dronens centrum
                this.targetX = centerX + (Math.random() - 0.5) * 100;
                this.targetY = centerY - 40 + (Math.random() - 0.5) * 50;
                
                // Lidt langsommere end data-ikonerne for variation
                this.speed = Math.random() * 0.3 + 0.15;
                this.width = Math.random() * 10 + 15;
                this.height = this.width * 1.2; // Polaroids er lidt højere end brede
                this.baseOpacity = 1;
                
                // Beregner fade-distance ligesom ved data-ikoner
                const totalDistance = Math.sqrt(
                    Math.pow(this.targetX - this.startX, 2) + 
                    Math.pow(this.targetY - this.startY, 2)
                );
                this.fadeDistance = totalDistance * 0.7;
                
                // Rotation gør at polaroids drejer mens de flyver
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;
                
                // Wobble offset for håndtegnet effekt
                this.wobbleOffset = Math.random() * Math.PI * 2;
            }
            
            update() {
                // Beregner retning og afstand til målet
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Når vi er tæt på målet, starter vi forfra
                if (distance < 15) {
                    this.reset();
                } else {
                    // Bevæger polaroidet mod målet og drejer det
                    this.x += (dx / distance) * this.speed;
                    this.y += (dy / distance) * this.speed;
                    this.rotation += this.rotationSpeed;
                }
            }
            
            draw() {
                // Fade-in ligesom data-ikonerne
                const distanceTraveled = this.y - this.startY;
                const fadeProgress = Math.min(Math.max(distanceTraveled / this.fadeDistance, 0), 1);
                
                // Glat overgang med easing-funktion
                const easedProgress = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
                const currentOpacity = this.baseOpacity * easedProgress;
                
                // Fade-out når polaroidet nærmer sig dronen
                const distanceToTarget = Math.sqrt(
                    Math.pow(this.targetX - this.x, 2) + 
                    Math.pow(this.targetY - this.y, 2)
                );
                const fadeOutDistance = 80;
                const fadeOutProgress = Math.min(distanceToTarget / fadeOutDistance, 1);
                
                // Kombinerer fade-in og fade-out
                const finalOpacity = currentOpacity * fadeOutProgress;
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                // Tegner et polaroid med lidt ujævne kanter for håndtegnet look
                const borderWidth = this.width * 0.12;
                const bottomBorder = this.height * 0.25;
                
                // Den blå kant rundt om polaroidet med håndtegnet effekt
                ctx.strokeStyle = 'rgba(54, 87, 134, ' + finalOpacity + ')';
                ctx.fillStyle = 'rgba(54, 87, 134, ' + (finalOpacity * 0.3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                
                // Tegner et lidt ujævnt rektangel for at se håndtegnet ud
                const wobble = 1;
                ctx.moveTo(-this.width/2 + Math.random() * wobble, -this.height/2 + Math.random() * wobble);
                ctx.lineTo(this.width/2 + Math.random() * wobble, -this.height/2 + Math.random() * wobble);
                ctx.lineTo(this.width/2 + Math.random() * wobble, this.height/2 + Math.random() * wobble);
                ctx.lineTo(-this.width/2 + Math.random() * wobble, this.height/2 + Math.random() * wobble);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Det hvide område inde i polaroidet (hvor billedet ville være)
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
        
        // Laver 50 data-ikoner med det samme
        const icons = [];
        for (let i = 0; i < 50; i++) {
            icons.push(new DataIcon());
        }
        
        // Laver 15 polaroids med det samme
        const polaroids = [];
        for (let i = 0; i < 15; i++) {
            polaroids.push(new Polaroid());
        }
        
        // Animations-loop der kører hele tiden og opdaterer skærmen
        function animate() {
            // Rydder canvas ved at male hele baggrunden hvid
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Tegner polaroids først, så de ligger bagved data-ikonerne
            polaroids.forEach(function(polaroid) {
                polaroid.update();
                polaroid.draw();
            });
            
            // Tegner data-ikoner ovenpå
            icons.forEach(function(icon) {
                icon.update();
                icon.draw();
            });
            
            // Beder browseren om at kalde animate igen ved næste frame (giver flydende animation)
            requestAnimationFrame(animate);
        }
        
        // Starter animationen med det samme
        animate();
    }
})();
