window.ImageHoverReveal = (function() {
    'use strict';
    
    var instances = {};
    
    function init(containerId) {
        // Retry mechanism for containers that aren't ready yet
        var retryCount = 0;
        var maxRetries = 50;
        
        function attemptInit() {
            if (instances[containerId]) {
                return; // Already initialized
            }
            
            var container = document.getElementById(containerId);
            if (!container) {
                retryCount++;
                if (retryCount < maxRetries) {
                    setTimeout(attemptInit, 100);
                    return;
                }
                console.warn('ImageHoverReveal: Container not found after retries:', containerId);
                return;
            }
            
            var overlay = container.querySelector('.illustration-overlay');
            if (!overlay) {
                console.warn('ImageHoverReveal: Illustration overlay not found in container:', containerId);
                return;
            }
            
            var instance = {
                container: container,
                overlay: overlay,
                mouseX: 50,
                mouseY: 50,
                currentRadius: 0,
                targetRadius: 0,
                hovering: false,
                animationFrame: null
            };
            
            // Event listeners
            container.addEventListener('mousemove', function(e) {
                handleMouseMove(instance, e);
            });
            
            container.addEventListener('mouseenter', function(e) {
                handleMouseEnter(instance, e);
            });
            
            container.addEventListener('mouseleave', function() {
                handleMouseLeave(instance);
            });
            
            instances[containerId] = instance;
        }
        
        attemptInit();
    }
    
    function handleMouseMove(instance, e) {
        var rect = instance.container.getBoundingClientRect();
        instance.mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        instance.mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        
        if (instance.hovering) {
            updateClipPath(instance);
        }
    }
    
    function handleMouseEnter(instance, e) {
        instance.hovering = true;
        var rect = instance.container.getBoundingClientRect();
        instance.mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        instance.mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        instance.targetRadius = 130;
        animate(instance);
    }
    
    function handleMouseLeave(instance) {
        instance.hovering = false;
        instance.targetRadius = 0;
    }
    
    function updateClipPath(instance) {
        instance.overlay.style.clipPath = 'circle(' + instance.currentRadius + '% at ' + instance.mouseX + '% ' + instance.mouseY + '%)';
    }
    
    function animate(instance) {
        // Ultra-slow, buttery smooth easing
        var ease = instance.hovering ? 0.01 : 0.015;
        instance.currentRadius += (instance.targetRadius - instance.currentRadius) * ease;
        
        updateClipPath(instance);
        
        if (instance.hovering || instance.currentRadius > 0.3) {
            instance.animationFrame = requestAnimationFrame(function() {
                animate(instance);
            });
        } else {
            instance.currentRadius = 0;
            updateClipPath(instance);
            if (instance.animationFrame) {
                cancelAnimationFrame(instance.animationFrame);
                instance.animationFrame = null;
            }
        }
    }
    
    function destroy(containerId) {
        if (instances[containerId]) {
            var instance = instances[containerId];
            if (instance.animationFrame) {
                cancelAnimationFrame(instance.animationFrame);
            }
            delete instances[containerId];
        }
    }
    
    function destroyAll() {
        Object.keys(instances).forEach(function(id) {
            destroy(id);
        });
    }
    
    // Public API
    return {
        init: init,
        destroy: destroy,
        destroyAll: destroyAll
    };
})();

// Auto-initialize any containers found on page load
(function() {
    function autoInit() {
        var containers = document.querySelectorAll('.image-hover-container[id]');
        containers.forEach(function(container) {
            ImageHoverReveal.init(container.id);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }
})();