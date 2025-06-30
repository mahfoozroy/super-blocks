/**
 * Super Blocks - Gutenberg Block Registration
 * 
 * @package SuperBlocks
 */

const { registerBlockType } = wp.blocks;
const { 
    InspectorControls, 
    MediaUpload, 
    MediaUploadCheck, 
    RichText, 
    BlockControls,
    AlignmentToolbar 
} = wp.blockEditor;
const { 
    PanelBody, 
    PanelRow, 
    Button, 
    ToggleControl, 
    SelectControl, 
    RangeControl,
    TextareaControl,
    CheckboxControl 
} = wp.components;
const { Fragment } = wp.element;
const { __ } = wp.i18n;

/**
 * Register Super Image Block
 */
registerBlockType('super-blocks/super-image', {
    title: __('Super Image', 'super-blocks'),
    description: __('Advanced image block with lightbox, scroll effects, and magnify functionality.', 'super-blocks'),
    icon: 'format-image',
    category: 'media',
    keywords: [
        __('image', 'super-blocks'),
        __('lightbox', 'super-blocks'),
        __('gallery', 'super-blocks'),
        __('magnify', 'super-blocks'),
        __('scroll', 'super-blocks')
    ],
    
    attributes: {
        // Image attributes
        imageId: { type: 'number' },
        imageUrl: { type: 'string' },
        imageAlt: { type: 'string', default: '' },
        imageCaption: { type: 'string', default: '' },
        imageWidth: { type: 'number' },
        imageHeight: { type: 'number' },
        
        // Layout attributes
        alignment: { type: 'string', default: 'none' },
        width: { type: 'number', default: 100 },
        height: { type: 'number' },
        objectFit: { type: 'string', default: 'cover' },
        
        // Feature toggles
        enableLightbox: { type: 'boolean', default: true },
        enableImageScroll: { type: 'boolean', default: false },
        enableMagnify: { type: 'boolean', default: false },
        
        // Spotlight.js options
        spotlightTheme: { type: 'string', default: 'default' },
        spotlightAnimation: { type: 'string', default: 'slide' },
        enableAutoplay: { type: 'boolean', default: false },
        autoplaySpeed: { type: 'number', default: 3000 },
        enableInfinite: { type: 'boolean', default: true },
        enableSpinner: { type: 'boolean', default: true },
        enablePreload: { type: 'boolean', default: true },
        autohide: { type: 'string', default: 'off' },
        autofit: { type: 'string', default: 'contain' },
        
        // Controls
        showControls: {
            type: 'object',
            default: {
                page: true,
                theme: false,
                fullscreen: true,
                autofit: false,
                zoom: true,
                close: true,
                download: false,
                play: false
            }
        },
        
        // Scroll effect options
        scrollDirection: { type: 'string', default: 'horizontal' },
        scrollSpeed: { type: 'number', default: 1 },
        scrollTrigger: { type: 'string', default: 'hover' },
        
        // Magnify options
        magnifyFactor: { type: 'number', default: 2 },
        magnifyOffset: { type: 'number', default: 10 },
        
        // Custom CSS
        customCSS: { type: 'string', default: '' }
    },

    edit: function(props) {
        const { attributes, setAttributes, className } = props;
        const {
            imageId,
            imageUrl,
            imageAlt,
            imageCaption,
            alignment,
            width,
            height,
            objectFit,
            enableLightbox,
            enableImageScroll,
            enableMagnify,
            spotlightTheme,
            spotlightAnimation,
            enableAutoplay,
            autoplaySpeed,
            enableInfinite,
            enableSpinner,
            enablePreload,
            autohide,
            autofit,
            showControls,
            scrollDirection,
            scrollSpeed,
            scrollTrigger,
            magnifyFactor,
            magnifyOffset,
            customCSS
        } = attributes;

        // Handle image selection
        const onSelectImage = (media) => {
            setAttributes({
                imageId: media.id,
                imageUrl: media.url,
                imageAlt: media.alt,
                imageWidth: media.width,
                imageHeight: media.height
            });
        };

        // Handle image removal
        const onRemoveImage = () => {
            setAttributes({
                imageId: null,
                imageUrl: '',
                imageAlt: '',
                imageWidth: null,
                imageHeight: null
            });
        };

        // Handle control toggle
        const onControlToggle = (control) => {
            const newControls = { ...showControls };
            newControls[control] = !newControls[control];
            setAttributes({ showControls: newControls });
        };

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={alignment}
                        onChange={(value) => setAttributes({ alignment: value })}
                    />
                </BlockControls>

                <InspectorControls>
                    {/* Image Settings */}
                    <PanelBody title={__('Image Settings', 'super-blocks')} initialOpen={true}>
                        <PanelRow>
                            <RangeControl
                                label={__('Width (%)', 'super-blocks')}
                                value={width}
                                onChange={(value) => setAttributes({ width: value })}
                                min={10}
                                max={100}
                            />
                        </PanelRow>
                        
                        {height && (
                            <PanelRow>
                                <RangeControl
                                    label={__('Height (px)', 'super-blocks')}
                                    value={height}
                                    onChange={(value) => setAttributes({ height: value })}
                                    min={100}
                                    max={1000}
                                />
                            </PanelRow>
                        )}
                        
                        <PanelRow>
                            <SelectControl
                                label={__('Object Fit', 'super-blocks')}
                                value={objectFit}
                                options={[
                                    { label: __('Cover', 'super-blocks'), value: 'cover' },
                                    { label: __('Contain', 'super-blocks'), value: 'contain' },
                                    { label: __('Fill', 'super-blocks'), value: 'fill' },
                                    { label: __('Scale Down', 'super-blocks'), value: 'scale-down' },
                                    { label: __('None', 'super-blocks'), value: 'none' }
                                ]}
                                onChange={(value) => setAttributes({ objectFit: value })}
                            />
                        </PanelRow>
                    </PanelBody>

                    {/* Feature Settings */}
                    <PanelBody title={__('Features', 'super-blocks')} initialOpen={false}>
                        <ToggleControl
                            label={__('Enable Lightbox', 'super-blocks')}
                            checked={enableLightbox}
                            onChange={(value) => setAttributes({ enableLightbox: value })}
                        />
                        
                        <ToggleControl
                            label={__('Enable Image Scroll Effect', 'super-blocks')}
                            checked={enableImageScroll}
                            onChange={(value) => setAttributes({ enableImageScroll: value })}
                        />
                        
                        <ToggleControl
                            label={__('Enable Magnify on Hover', 'super-blocks')}
                            checked={enableMagnify}
                            onChange={(value) => setAttributes({ enableMagnify: value })}
                        />
                    </PanelBody>

                    {/* Lightbox Settings */}
                    {enableLightbox && (
                        <PanelBody title={__('Lightbox Settings', 'super-blocks')} initialOpen={false}>
                            <SelectControl
                                label={__('Theme', 'super-blocks')}
                                value={spotlightTheme}
                                options={[
                                    { label: __('Default', 'super-blocks'), value: 'default' },
                                    { label: __('White', 'super-blocks'), value: 'white' }
                                ]}
                                onChange={(value) => setAttributes({ spotlightTheme: value })}
                            />
                            
                            <SelectControl
                                label={__('Animation', 'super-blocks')}
                                value={spotlightAnimation}
                                options={[
                                    { label: __('Slide', 'super-blocks'), value: 'slide' },
                                    { label: __('Fade', 'super-blocks'), value: 'fade' },
                                    { label: __('Scale', 'super-blocks'), value: 'scale' }
                                ]}
                                onChange={(value) => setAttributes({ spotlightAnimation: value })}
                            />
                            
                            <ToggleControl
                                label={__('Autoplay', 'super-blocks')}
                                checked={enableAutoplay}
                                onChange={(value) => setAttributes({ enableAutoplay: value })}
                            />
                            
                            {enableAutoplay && (
                                <RangeControl
                                    label={__('Autoplay Speed (ms)', 'super-blocks')}
                                    value={autoplaySpeed}
                                    onChange={(value) => setAttributes({ autoplaySpeed: value })}
                                    min={1000}
                                    max={10000}
                                    step={100}
                                />
                            )}
                            
                            <ToggleControl
                                label={__('Infinite Loop', 'super-blocks')}
                                checked={enableInfinite}
                                onChange={(value) => setAttributes({ enableInfinite: value })}
                            />
                            
                            <ToggleControl
                                label={__('Show Spinner', 'super-blocks')}
                                checked={enableSpinner}
                                onChange={(value) => setAttributes({ enableSpinner: value })}
                            />
                            
                            <ToggleControl
                                label={__('Preload Next Image', 'super-blocks')}
                                checked={enablePreload}
                                onChange={(value) => setAttributes({ enablePreload: value })}
                            />
                            
                            <SelectControl
                                label={__('Auto Hide Controls', 'super-blocks')}
                                value={autohide}
                                options={[
                                    { label: __('Off', 'super-blocks'), value: 'off' },
                                    { label: __('Controls Only', 'super-blocks'), value: 'controls' },
                                    { label: __('All', 'super-blocks'), value: 'all' }
                                ]}
                                onChange={(value) => setAttributes({ autohide: value })}
                            />
                            
                            <SelectControl
                                label={__('Auto Fit', 'super-blocks')}
                                value={autofit}
                                options={[
                                    { label: __('Contain', 'super-blocks'), value: 'contain' },
                                    { label: __('Cover', 'super-blocks'), value: 'cover' }
                                ]}
                                onChange={(value) => setAttributes({ autofit: value })}
                            />
                        </PanelBody>
                    )}

                    {/* Lightbox Controls */}
                    {enableLightbox && (
                        <PanelBody title={__('Lightbox Controls', 'super-blocks')} initialOpen={false}>
                            {Object.keys(showControls).map(control => (
                                <ToggleControl
                                    key={control}
                                    label={__(`Show ${control.charAt(0).toUpperCase() + control.slice(1)}`, 'super-blocks')}
                                    checked={showControls[control]}
                                    onChange={() => onControlToggle(control)}
                                />
                            ))}
                        </PanelBody>
                    )}

                    {/* Scroll Effect Settings */}
                    {enableImageScroll && (
                        <PanelBody title={__('Scroll Effect Settings', 'super-blocks')} initialOpen={false}>
                            <SelectControl
                                label={__('Scroll Direction', 'super-blocks')}
                                value={scrollDirection}
                                options={[
                                    { label: __('Horizontal', 'super-blocks'), value: 'horizontal' },
                                    { label: __('Vertical', 'super-blocks'), value: 'vertical' }
                                ]}
                                onChange={(value) => setAttributes({ scrollDirection: value })}
                            />
                            
                            <RangeControl
                                label={__('Scroll Speed', 'super-blocks')}
                                value={scrollSpeed}
                                onChange={(value) => setAttributes({ scrollSpeed: value })}
                                min={0.1}
                                max={5}
                                step={0.1}
                            />
                            
                            <SelectControl
                                label={__('Scroll Trigger', 'super-blocks')}
                                value={scrollTrigger}
                                options={[
                                    { label: __('On Hover', 'super-blocks'), value: 'hover' },
                                    { label: __('Always', 'super-blocks'), value: 'always' },
                                    { label: __('On Page Scroll', 'super-blocks'), value: 'scroll' }
                                ]}
                                onChange={(value) => setAttributes({ scrollTrigger: value })}
                            />
                        </PanelBody>
                    )}

                    {/* Magnify Settings */}
                    {enableMagnify && (
                        <PanelBody title={__('Magnify Settings', 'super-blocks')} initialOpen={false}>
                            <RangeControl
                                label={__('Magnification Factor', 'super-blocks')}
                                value={magnifyFactor}
                                onChange={(value) => setAttributes({ magnifyFactor: value })}
                                min={1.5}
                                max={5}
                                step={0.1}
                            />
                            
                            <RangeControl
                                label={__('Lens Offset', 'super-blocks')}
                                value={magnifyOffset}
                                onChange={(value) => setAttributes({ magnifyOffset: value })}
                                min={0}
                                max={50}
                            />
                        </PanelBody>
                    )}

                    {/* Custom CSS */}
                    <PanelBody title={__('Custom CSS', 'super-blocks')} initialOpen={false}>
                        <TextareaControl
                            label={__('Additional CSS', 'super-blocks')}
                            value={customCSS}
                            onChange={(value) => setAttributes({ customCSS: value })}
                            help={__('Add custom CSS for this block instance.', 'super-blocks')}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className={className}>
                    {!imageUrl ? (
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={imageId}
                                render={({ open }) => (
                                    <Button
                                        className="button button-large"
                                        onClick={open}
                                        isPrimary
                                    >
                                        {__('Upload Image', 'super-blocks')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    ) : (
                        <div className="super-image-preview">
                            <img
                                src={imageUrl}
                                alt={imageAlt}
                                style={{
                                    width: width + '%',
                                    height: height ? height + 'px' : 'auto',
                                    objectFit: objectFit
                                }}
                            />
                            
                            <div className="super-image-overlay">
                                <div className="super-image-features">
                                    {enableLightbox && <span className="feature-badge">Lightbox</span>}
                                    {enableImageScroll && <span className="feature-badge">Scroll</span>}
                                    {enableMagnify && <span className="feature-badge">Magnify</span>}
                                </div>
                                
                                <div className="super-image-actions">
                                    <MediaUploadCheck>
                                        <MediaUpload
                                            onSelect={onSelectImage}
                                            allowedTypes={['image']}
                                            value={imageId}
                                            render={({ open }) => (
                                                <Button
                                                    onClick={open}
                                                    isSecondary
                                                    isSmall
                                                >
                                                    {__('Replace', 'super-blocks')}
                                                </Button>
                                            )}
                                        />
                                    </MediaUploadCheck>
                                    
                                    <Button
                                        onClick={onRemoveImage}
                                        isDestructive
                                        isSmall
                                    >
                                        {__('Remove', 'super-blocks')}
                                    </Button>
                                </div>
                            </div>
                            
                            <RichText
                                tagName="figcaption"
                                className="super-image-caption"
                                placeholder={__('Write caption...', 'super-blocks')}
                                value={imageCaption}
                                onChange={(value) => setAttributes({ imageCaption: value })}
                                allowedFormats={['core/bold', 'core/italic', 'core/link']}
                            />
                        </div>
                    )}
                </div>
            </Fragment>
        );
    },

    save: function() {
        // Server-side rendering - return null
        return null;
    }
});