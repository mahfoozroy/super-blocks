<?php
/**
 * Super Image Block Class
 *
 * @package SuperBlocks
 */

namespace SuperBlocks\Blocks;

/**
 * Super Image Block
 */
class SuperImageBlock
{
    /**
     * Block name
     *
     * @var string
     */
    private $block_name = 'super-blocks/super-image';

    /**
     * Register the block
     *
     * @return void
     */
    public function register(): void
    {
        register_block_type($this->block_name, [
            'attributes' => $this->getAttributes(),
            'render_callback' => [$this, 'render'],
            'editor_script' => 'super-blocks-editor',
            'editor_style' => 'super-blocks-editor',
            'style' => 'super-blocks-frontend',
        ]);
    }

    /**
     * Get block attributes
     *
     * @return array
     */
    private function getAttributes(): array
    {
        return [
            // Image attributes
            'imageId' => [
                'type' => 'number',
            ],
            'imageUrl' => [
                'type' => 'string',
            ],
            'imageAlt' => [
                'type' => 'string',
                'default' => '',
            ],
            'imageCaption' => [
                'type' => 'string',
                'default' => '',
            ],
            'imageWidth' => [
                'type' => 'number',
            ],
            'imageHeight' => [
                'type' => 'number',
            ],
            
            // Layout attributes
            'alignment' => [
                'type' => 'string',
                'default' => 'none',
            ],
            'width' => [
                'type' => 'number',
                'default' => 100,
            ],
            'height' => [
                'type' => 'number',
            ],
            'objectFit' => [
                'type' => 'string',
                'default' => 'cover',
            ],
            
            // Feature toggles
            'enableLightbox' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'enableImageScroll' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'enableMagnify' => [
                'type' => 'boolean',
                'default' => false,
            ],
            
            // Spotlight.js options
            'spotlightTheme' => [
                'type' => 'string',
                'default' => 'default', // 'default' or 'white'
            ],
            'spotlightAnimation' => [
                'type' => 'string',
                'default' => 'slide', // 'slide', 'fade', 'scale'
            ],
            'enableAutoplay' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'autoplaySpeed' => [
                'type' => 'number',
                'default' => 3000,
            ],
            'enableInfinite' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'enableSpinner' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'enablePreload' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'autohide' => [
                'type' => 'string',
                'default' => 'off', // 'off', 'controls', 'all'
            ],
            'autofit' => [
                'type' => 'string',
                'default' => 'contain', // 'contain', 'cover'
            ],
            
            // Controls
            'showControls' => [
                'type' => 'object',
                'default' => [
                    'page' => true,
                    'theme' => false,
                    'fullscreen' => true,
                    'autofit' => false,
                    'zoom' => true,
                    'close' => true,
                    'download' => false,
                    'play' => false,
                ],
            ],
            
            // Scroll effect options
            'scrollDirection' => [
                'type' => 'string',
                'default' => 'horizontal', // 'horizontal', 'vertical'
            ],
            'scrollSpeed' => [
                'type' => 'number',
                'default' => 1,
            ],
            'scrollTrigger' => [
                'type' => 'string',
                'default' => 'hover', // 'hover', 'always', 'scroll'
            ],
            
            // Magnify options
            'magnifyFactor' => [
                'type' => 'number',
                'default' => 2,
            ],
            'magnifyOffset' => [
                'type' => 'number',
                'default' => 10,
            ],
            
            // Custom CSS
            'customCSS' => [
                'type' => 'string',
                'default' => '',
            ],
        ];
    }

    /**
     * Render the block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string
     */
    public function render(array $attributes, string $content = ''): string
    {
        // Return empty if no image
        if (empty($attributes['imageUrl'])) {
            return '';
        }

        $image_id = $attributes['imageId'] ?? 0;
        $image_url = esc_url($attributes['imageUrl']);
        $image_alt = esc_attr($attributes['imageAlt'] ?? '');
        $image_caption = $attributes['imageCaption'] ?? '';
        
        // Generate unique ID for this block instance
        $block_id = 'super-image-' . wp_generate_uuid4();
        
        // Build CSS classes
        $css_classes = $this->buildCssClasses($attributes);
        
        // Build inline styles
        $inline_styles = $this->buildInlineStyles($attributes);
        
        // Build data attributes for JavaScript
        $data_attributes = $this->buildDataAttributes($attributes);
        
        // Start output buffering
        ob_start();
        ?>
        <figure class="<?php echo esc_attr($css_classes); ?>" 
                id="<?php echo esc_attr($block_id); ?>"
                style="<?php echo esc_attr($inline_styles); ?>"
                <?php echo $data_attributes; ?>>
            
            <?php if ($attributes['enableLightbox']): ?>
                <a href="<?php echo $image_url; ?>" 
                   class="super-image-lightbox"
                   data-spotlight="<?php echo esc_attr($this->getSpotlightConfig($attributes)); ?>">
            <?php endif; ?>
            
            <div class="super-image-container">
                <img src="<?php echo $image_url; ?>" 
                     alt="<?php echo $image_alt; ?>"
                     class="super-image-img"
                     loading="lazy"
                     <?php if ($image_id): ?>data-id="<?php echo intval($image_id); ?>"<?php endif; ?> />
                
                <?php if ($attributes['enableMagnify']): ?>
                    <div class="super-image-magnify-lens"></div>
                    <div class="super-image-magnify-result"></div>
                <?php endif; ?>
            </div>
            
            <?php if ($attributes['enableLightbox']): ?>
                </a>
            <?php endif; ?>
            
            <?php if (!empty($image_caption)): ?>
                <figcaption class="super-image-caption">
                    <?php echo wp_kses_post($image_caption); ?>
                </figcaption>
            <?php endif; ?>
            
        </figure>
        
        <?php if (!empty($attributes['customCSS'])): ?>
            <style>
                #<?php echo esc_attr($block_id); ?> {
                    <?php echo wp_strip_all_tags($attributes['customCSS']); ?>
                }
            </style>
        <?php endif; ?>
        
        <?php
        return ob_get_clean();
    }

    /**
     * Build CSS classes for the block
     *
     * @param array $attributes Block attributes
     * @return string
     */
    private function buildCssClasses(array $attributes): string
    {
        $classes = ['wp-block-super-blocks-super-image'];
        
        // Alignment
        if (!empty($attributes['alignment']) && $attributes['alignment'] !== 'none') {
            $classes[] = 'align' . $attributes['alignment'];
        }
        
        // Features
        if ($attributes['enableLightbox']) {
            $classes[] = 'has-lightbox';
        }
        
        if ($attributes['enableImageScroll']) {
            $classes[] = 'has-scroll-effect';
            $classes[] = 'scroll-' . $attributes['scrollDirection'];
            $classes[] = 'scroll-trigger-' . $attributes['scrollTrigger'];
        }
        
        if ($attributes['enableMagnify']) {
            $classes[] = 'has-magnify';
        }
        
        return implode(' ', $classes);
    }

    /**
     * Build inline styles for the block
     *
     * @param array $attributes Block attributes
     * @return string
     */
    private function buildInlineStyles(array $attributes): string
    {
        $styles = [];
        
        // Width
        if (!empty($attributes['width'])) {
            $styles[] = 'width: ' . intval($attributes['width']) . '%';
        }
        
        // Height
        if (!empty($attributes['height'])) {
            $styles[] = 'height: ' . intval($attributes['height']) . 'px';
        }
        
        // Object fit
        if (!empty($attributes['objectFit'])) {
            $styles[] = 'object-fit: ' . esc_attr($attributes['objectFit']);
        }
        
        return implode('; ', $styles);
    }

    /**
     * Build data attributes for JavaScript functionality
     *
     * @param array $attributes Block attributes
     * @return string
     */
    private function buildDataAttributes(array $attributes): string
    {
        $data_attrs = [];
        
        // Scroll options
        if ($attributes['enableImageScroll']) {
            $data_attrs[] = 'data-scroll-speed="' . esc_attr($attributes['scrollSpeed']) . '"';
        }
        
        // Magnify options
        if ($attributes['enableMagnify']) {
            $data_attrs[] = 'data-magnify-factor="' . esc_attr($attributes['magnifyFactor']) . '"';
            $data_attrs[] = 'data-magnify-offset="' . esc_attr($attributes['magnifyOffset']) . '"';
        }
        
        return implode(' ', $data_attrs);
    }

    /**
     * Get Spotlight.js configuration
     *
     * @param array $attributes Block attributes
     * @return string JSON configuration
     */
    private function getSpotlightConfig(array $attributes): string
    {
        $config = [
            'theme' => $attributes['spotlightTheme'],
            'animation' => $attributes['spotlightAnimation'],
            'autoplay' => $attributes['enableAutoplay'],
            'infinite' => $attributes['enableInfinite'],
            'spinner' => $attributes['enableSpinner'],
            'preload' => $attributes['enablePreload'],
            'autohide' => $attributes['autohide'],
            'autofit' => $attributes['autofit'],
        ];
        
        // Add autoplay speed if enabled
        if ($attributes['enableAutoplay']) {
            $config['speed'] = intval($attributes['autoplaySpeed']);
        }
        
        // Add controls
        $controls = [];
        foreach ($attributes['showControls'] as $control => $enabled) {
            if ($enabled) {
                $controls[] = $control;
            }
        }
        $config['control'] = $controls;
        
        return wp_json_encode($config);
    }
}

/*
 * =============================================================================
 * USAGE EXAMPLE:
 * =============================================================================
 * 
 * This block can be used in Gutenberg with all these features:
 * 
 * 1. Basic image display with responsive sizing
 * 2. Lightbox functionality with full Spotlight.js options:
 *    - Multiple themes (default, white)
 *    - Animations (slide, fade, scale)
 *    - Autoplay with custom speed
 *    - Infinite scrolling
 *    - Custom controls (zoom, fullscreen, download, etc.)
 *    - Auto-hide options
 *    - Auto-fit options
 * 
 * 3. Image scroll effects:
 *    - Horizontal/vertical scrolling
 *    - Triggered by hover, always, or scroll
 *    - Customizable speed
 * 
 * 4. Image magnify functionality:
 *    - Adjustable magnification factor
 *    - Customizable lens offset
 * 
 * 5. Advanced styling:
 *    - Alignment options
 *    - Custom dimensions
 *    - Object-fit options
 *    - Custom CSS injection
 * 
 * =============================================================================
 */