window.ImageHoverReveal = (function() {
    'use strict';
    
    var instances = {};
    
    function init(containerId) {
        if (instances[containerId]) {
            return; // Already initialized
        }
        
        var container = document.getElementById(containerId);
        if (!container) {
            console.warn('ImageHoverReveal: Container not found:', containerId);
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
    
    function handleMouseMove(instance, e) {
        var rect = instance.container.getBoundingClientRect();
        instance.mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        instance.mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        
        if (instance.hovering) {
            instance.overlay.style.clipPath = 'circle(' + instance.currentRadius + '% at ' + instance.mouseX + '% ' + instance.mouseY + '%)';
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
    
    function animate(instance) {
        // Ultra-slow, buttery smooth easing
        var ease = instance.hovering ? 0.01 : 0.015;
        instance.currentRadius += (instance.targetRadius - instance.currentRadius) * ease;
        
        instance.overlay.style.clipPath = 'circle(' + instance.currentRadius + '% at ' + instance.mouseX + '% ' + instance.mouseY + '%)';
        
        if (instance.hovering || instance.currentRadius > 0.3) {
            instance.animationFrame = requestAnimationFrame(function() {
                animate(instance);
            });
        } else {
            instance.currentRadius = 0;
            instance.overlay.style.clipPath = 'circle(0% at ' + instance.mouseX + '% ' + instance.mouseY + '%)';
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
document.addEventListener('DOMContentLoaded', function() {
    var containers = document.querySelectorAll('.image-hover-container[id]');
    containers.forEach(function(container) {
        ImageHoverReveal.init(container.id);
    });
});