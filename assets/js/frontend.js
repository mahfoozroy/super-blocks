// Super Blocks Frontend JS

document.addEventListener('DOMContentLoaded', function () {
    // Spotlight.js: initialize on all images with data-spotlight
    if (window.Spotlight) {
        document.querySelectorAll('.super-blocks-super-image img[data-spotlight="on"]').forEach(function(img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get Spotlight.js configuration
                let config = {};
                try {
                    const configData = img.getAttribute('data-spotlight-config');
                    if (configData) {
                        config = JSON.parse(configData);
                    }
                } catch (e) {
                    console.warn('Super Blocks: Invalid Spotlight configuration', e);
                }
                
                Spotlight.show([{
                    src: img.src,
                    title: img.alt || '',
                    description: img.closest('figure')?.querySelector('.super-blocks-super-image-caption')?.textContent || ''
                }], config);
            });
        });
    }

    // Scroll effect for images
    document.querySelectorAll('.super-blocks-super-image img[data-scroll-speed]').forEach(function(img) {
        const speed = parseFloat(img.getAttribute('data-scroll-speed')) || 1;
        const direction = img.getAttribute('data-scroll-direction') || 'horizontal';
        const trigger = img.getAttribute('data-scroll-trigger') || 'hover';
        let scrollInterval = null;

        function startScroll() {
            if (scrollInterval) return;
            scrollInterval = setInterval(() => {
                if (direction === 'vertical') {
                    img.scrollTop += speed;
                } else {
                    img.scrollLeft += speed;
                }
            }, 16);
        }
        function stopScroll() {
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
        }
        if (trigger === 'always') {
            startScroll();
        } else if (trigger === 'hover') {
            img.addEventListener('mouseenter', startScroll);
            img.addEventListener('mouseleave', stopScroll);
        }
    });

    // Magnify effect for images
    document.querySelectorAll('.super-blocks-super-image img[data-magnify-factor]').forEach(function(img) {
        const factor = parseFloat(img.getAttribute('data-magnify-factor')) || 2;
        const offset = parseInt(img.getAttribute('data-magnify-offset')) || 10;
        let lens, result;

        img.addEventListener('mouseenter', function(e) {
            lens = document.createElement('div');
            lens.className = 'super-image-magnify-lens';
            result = document.createElement('div');
            result.className = 'super-image-magnify-result';
            result.style.backgroundImage = `url('${img.src}')`;
            result.style.backgroundRepeat = 'no-repeat';
            result.style.backgroundSize = `${img.width * factor}px ${img.height * factor}px`;
            img.parentNode.appendChild(lens);
            img.parentNode.appendChild(result);
            moveMagnifier(e);
            img.addEventListener('mousemove', moveMagnifier);
            lens.addEventListener('mousemove', moveMagnifier);
        });
        img.addEventListener('mouseleave', function() {
            if (lens) lens.remove();
            if (result) result.remove();
            img.removeEventListener('mousemove', moveMagnifier);
        });
        function moveMagnifier(e) {
            e.preventDefault();
            const pos = getCursorPos(e);
            let x = pos.x - (lens.offsetWidth / 2);
            let y = pos.y - (lens.offsetHeight / 2);
            if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
            if (x < 0) x = 0;
            if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;
            if (y < 0) y = 0;
            lens.style.left = x + 'px';
            lens.style.top = y + 'px';
            result.style.backgroundPosition = `-${x * factor - offset}px -${y * factor - offset}px`;
        }
        function getCursorPos(e) {
            const a = img.getBoundingClientRect();
            let x = e.pageX - a.left - window.pageXOffset;
            let y = e.pageY - a.top - window.pageYOffset;
            return { x, y };
        }
    });
}); 