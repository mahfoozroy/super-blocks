/**
 * Super Blocks - Frontend JavaScript
 * 
 * @package SuperBlocks
 */

(function() {
    'use strict';

    /**
     * Initialize Super Image blocks when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        initializeSuperImages();
    });

    /**
     * Initialize all Super Image blocks
     */
    function initializeSuperImages() {
        const superImages = document.querySelectorAll('.wp-block-super-blocks-super-image');
        
        superImages.forEach(function(block) {
            const blockId = block.id;
            const img = block.querySelector('.super-image-img');
            
            if (!img) return;

            // Initialize features based on classes
            if (block.classList.contains('has-lightbox')) {
                initializeLightbox(block);
            }
            
            if (block.classList.contains('has-scroll-effect')) {
                initializeScrollEffect(block);
            }
            
            if (block.classList.contains('has-magnify')) {
                initializeMagnify(block);
            }
        });
    }

    /**
     * Initialize Spotlight.js lightbox
     */
    function initializeLightbox(block) {
        const lightboxLink = block.querySelector('.super-image-lightbox');
        
        if (!lightboxLink || typeof Spotlight === 'undefined') {
            return;
        }

        // Get configuration from data attribute
        let config = {};
        try {
            const configData = lightboxLink.getAttribute('data-spotlight');
            if (configData) {
                config = JSON.parse(configData);
            }
        } catch (e) {
            console.warn('Super Blocks: Invalid Spotlight configuration', e);
        }

        // Initialize Spotlight
        lightboxLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            Spotlight.show([{
                src: this.href,
                title: this.getAttribute('title') || '',
                description: block.querySelector('.super-image-caption')?.textContent || ''
            }], config);
        });
    }

    /**
     * Initialize image scroll effect
     */
    function initializeScrollEffect(block) {
        const container = block.querySelector('.super-image-container');
        const img = block.querySelector('.super-image-img');
        
        if (!container || !img) return;

        const scrollSpeed = parseFloat(block.getAttribute('data-scroll-speed')) || 1;
        const isHorizontal = block.classList.contains('scroll-horizontal');
        const trigger = block.classList.contains('scroll-trigger-hover') ? 'hover' :
                       block.classList.contains('scroll-trigger-always') ? 'always' : 'scroll';

        // Set container overflow
        container.style.overflow = 'hidden';
        container.style.position = 'relative';

        // Set image size larger than container for scroll effect
        const scaleFactor = 1.2 + (scrollSpeed * 0.1);
        img.style.transition = 'transform 0.3s ease-out';
        img.style.transform = `scale(${scaleFactor})`;

        if (trigger === 'hover') {
            let animationId;
            
            container.addEventListener('mouseenter', function() {
                startScrollAnimation();
            });
            
            container.addEventListener('mouseleave', function() {
                stopScrollAnimation();
                img.style.transform = `scale(${scaleFactor})`;
            });
            
            function startScrollAnimation() {
                let start = null;
                
                function animate(timestamp) {
                    if (!start) start = timestamp;
                    const progress = (timestamp - start) * scrollSpeed * 0.001;
                    
                    if (isHorizontal) {
                        const translateX = Math.sin(progress) * 20;
                        img.style.transform = `scale(${scaleFactor}) translateX(${translateX}px)`;
                    } else {
                        const translateY = Math.sin(progress) * 20;
                        img.style.transform = `scale(${scaleFactor}) translateY(${translateY}px)`;
                    }
                    
                    animationId = requestAnimationFrame(animate);
                }
                
                animationId = requestAnimationFrame(animate);
            }
            
            function stopScrollAnimation() {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
            
        } else if (trigger === 'always') {
            startContinuousScroll();
        } else if (trigger === 'scroll') {
            initializeScrollTrigger();
        }

        function startContinuousScroll() {
            let start = null;
            
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = (timestamp - start) * scrollSpeed * 0.001;
                
                if (isHorizontal) {
                    const translateX = Math.sin(progress) * 15;
                    img.style.transform = `scale(${scaleFactor}) translateX(${translateX}px)`;
                } else {
                    const translateY = Math.sin(progress) * 15;
                    img.style.transform = `scale(${scaleFactor}) translateY(${translateY}px)`;
                }
                
                requestAnimationFrame(animate);
            }
            
            requestAnimationFrame(animate);
        }

        function initializeScrollTrigger() {
            let ticking = false;
            
            function updateScrollEffect() {
                const rect = container.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const elementCenter = rect.top + rect.height / 2;
                const viewportCenter = viewportHeight / 2;
                const distance = (elementCenter - viewportCenter) / viewportCenter;
                
                if (isHorizontal) {
                    const translateX = distance * 30 * scrollSpeed;
                    img.style.transform = `scale(${scaleFactor}) translateX(${translateX}px)`;
                } else {
                    const translateY = distance * 30 * scrollSpeed;
                    img.style.transform = `scale(${scaleFactor}) translateY(${translateY}px)`;
                }
                
                ticking = false;
            }
            
            function onScroll() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollEffect);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', onScroll, { passive: true });
            updateScrollEffect(); // Initial call
        }
    }

    /**
     * Initialize magnify effect
     */
    function initializeMagnify(block) {
        const container = block.querySelector('.super-image-container');
        const img = block.querySelector('.super-image-img');
        const lens = block.querySelector('.super-image-magnify-lens');
        const result = block.querySelector('.super-image-magnify-result');
        
        if (!container || !img || !lens || !result) return;

        const magnifyFactor = parseFloat(block.getAttribute('data-magnify-factor')) || 2;
        const offset = parseInt(block.getAttribute('data-magnify-offset')) || 10;

        // Setup lens
        lens.style.position = 'absolute';
        lens.style.border = '2px solid #fff';
        lens.style.borderRadius = '50%';
        lens.style.cursor = 'none';
        lens.style.width = '100px';
        lens.style.height = '100px';
        lens.style.display = 'none';
        lens.style.pointerEvents = 'none';
        lens.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

        // Setup result container
        result.style.position = 'absolute';
        result.style.border = '2px solid #fff';
        result.style.width = '200px';
        result.style.height = '200px';
        result.style.display = 'none';
        result.style.backgroundRepeat = 'no-repeat';
        result.style.backgroundImage = `url(${img.src})`;
        result.style.backgroundSize = `${img.width * magnifyFactor}px ${img.height * magnifyFactor}px`;
        result.style.boxShadow = '0 0 15px rgba(0,0,0,0.4)';
        result.style.borderRadius = '10px';
        result.style.zIndex = '1000';

        // Mouse events
        container.addEventListener('mouseenter', function() {
            lens.style.display = 'block';
            result.style.display = 'block';
        });

        container.addEventListener('mouseleave', function() {
            lens.style.display = 'none';
            result.style.display = 'none';
        });

        container.addEventListener('mousemove', function(e) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Position lens
            const lensX = x - 50; // Half of lens width
            const lensY = y - 50; // Half of lens height
            
            lens.style.left = Math.max(0, Math.min(lensX, rect.width - 100)) + 'px';
            lens.style.top = Math.max(0, Math.min(lensY, rect.height - 100)) + 'px';

            // Position result
            let resultX = e.clientX + offset;
            let resultY = e.clientY + offset;
            
            // Keep result within viewport
            if (resultX + 200 > window.innerWidth) {
                resultX = e.clientX - 200 - offset;
            }
            if (resultY + 200 > window.innerHeight) {
                resultY = e.clientY - 200 - offset;
            }
            
            result.style.left = resultX + 'px';
            result.style.top = resultY + 'px';
            result.style.position = 'fixed';

            // Calculate background position
            const bgX = -(x * magnifyFactor - 100);
            const bgY = -(y * magnifyFactor - 100);
            result.style.backgroundPosition = `${bgX}px ${bgY}px`;
        });
    }

    /**
     * Utility function to debounce events
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Handle responsive behavior
     */
    function handleResponsiveBehavior() {
        const superImages = document.querySelectorAll('.wp-block-super-blocks-super-image');
        
        superImages.forEach(function(block) {
            const img = block.querySelector('.super-image-img');
            if (!img) return;

            // Disable magnify on touch devices
            if ('ontouchstart' in window && block.classList.contains('has-magnify')) {
                const lens = block.querySelector('.super-image-magnify-lens');
                const result = block.querySelector('.super-image-magnify-result');
                
                if (lens) lens.style.display = 'none';
                if (result) result.style.display = 'none';
            }
        });
    }

    // Initialize responsive behavior
    window.addEventListener('resize', debounce(handleResponsiveBehavior, 250));
    handleResponsiveBehavior();

    // Reinitialize on dynamic content load (for AJAX themes)
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            let shouldReinit = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && 
                            (node.classList?.contains('wp-block-super-blocks-super-image') ||
                             node.querySelector?.('.wp-block-super-blocks-super-image'))) {
                            shouldReinit = true;
                        }
                    });
                }
            });
            
            if (shouldReinit) {
                setTimeout(initializeSuperImages, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();