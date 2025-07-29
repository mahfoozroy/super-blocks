import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { MediaUpload, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, PanelRow, TextControl, SelectControl, RangeControl, TextareaControl } from '@wordpress/components';

registerBlockType('super-blocks/sample-text', {
    title: __('Sample Text', 'super-blocks'),
    icon: 'editor-paragraph',
    category: 'widgets',
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: 'div',
        },
        textColor: {
            type: 'string',
            default: '#333333',
        },
    },
    edit: (props) => {
        const { attributes, setAttributes } = props;
        return (
            <div style={{ color: attributes.textColor }}>
                <RichText
                    tagName="div"
                    value={attributes.content}
                    onChange={(content) => setAttributes({ content })}
                    placeholder={__('Write something…', 'super-blocks')}
                />
            </div>
        );
    },
    save: (props) => {
        const { attributes } = props;
        return (
            <div style={{ color: attributes.textColor }}>
                <RichText.Content tagName="div" value={attributes.content} />
            </div>
        );
    },
});

registerBlockType('super-blocks/super-image', {
    title: __('Super Image', 'super-blocks'),
    icon: 'format-image',
    category: 'media',
    attributes: {
        imageId: { type: 'number' },
        imageUrl: { type: 'string' },
        imageAlt: { type: 'string', default: '' },
        imageCaption: { type: 'string', default: '' },
        imageWidth: { type: 'number' },
        imageHeight: { type: 'number' },
        alignment: { type: 'string', default: 'none' },
        width: { type: 'number', default: 100 },
        height: { type: 'number' },
        objectFit: { type: 'string', default: 'cover' },
        enableLightbox: { type: 'boolean', default: true },
        enableImageScroll: { type: 'boolean', default: false },
        enableMagnify: { type: 'boolean', default: false },
        spotlightTheme: { type: 'string', default: 'default' },
        spotlightAnimation: { type: 'string', default: 'slide' },
        enableAutoplay: { type: 'boolean', default: false },
        autoplaySpeed: { type: 'number', default: 3000 },
        enableInfinite: { type: 'boolean', default: true },
        enableSpinner: { type: 'boolean', default: true },
        enablePreload: { type: 'boolean', default: true },
        autohide: { type: 'string', default: 'off' },
        autofit: { type: 'string', default: 'contain' },
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
                play: false,
            },
        },
        scrollDirection: { type: 'string', default: 'horizontal' },
        scrollSpeed: { type: 'number', default: 1 },
        scrollTrigger: { type: 'string', default: 'hover' },
        magnifyFactor: { type: 'number', default: 2 },
        magnifyOffset: { type: 'number', default: 10 },
        customCSS: { type: 'string', default: '' },
    },
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const controls = attributes.showControls || {};
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Image Settings', 'super-blocks')} initialOpen={true}>
                        <ToggleControl
                            label={__('Enable Lightbox', 'super-blocks')}
                            checked={!!attributes.enableLightbox}
                            onChange={(val) => setAttributes({ enableLightbox: val })}
                        />
                        <ToggleControl
                            label={__('Enable Scroll Effect', 'super-blocks')}
                            checked={!!attributes.enableImageScroll}
                            onChange={(val) => setAttributes({ enableImageScroll: val })}
                        />
                        {attributes.enableImageScroll && (
                            <>
                                <SelectControl
                                    label={__('Scroll Direction', 'super-blocks')}
                                    value={attributes.scrollDirection}
                                    options={[
                                        { label: __('Horizontal', 'super-blocks'), value: 'horizontal' },
                                        { label: __('Vertical', 'super-blocks'), value: 'vertical' },
                                    ]}
                                    onChange={(val) => setAttributes({ scrollDirection: val })}
                                />
                                <RangeControl
                                    label={__('Scroll Speed', 'super-blocks')}
                                    value={attributes.scrollSpeed}
                                    min={1}
                                    max={10}
                                    onChange={(val) => setAttributes({ scrollSpeed: val })}
                                />
                                <SelectControl
                                    label={__('Scroll Trigger', 'super-blocks')}
                                    value={attributes.scrollTrigger}
                                    options={[
                                        { label: __('Hover', 'super-blocks'), value: 'hover' },
                                        { label: __('Always', 'super-blocks'), value: 'always' },
                                        { label: __('Scroll', 'super-blocks'), value: 'scroll' },
                                    ]}
                                    onChange={(val) => setAttributes({ scrollTrigger: val })}
                                />
                            </>
                        )}
                        <ToggleControl
                            label={__('Enable Magnify', 'super-blocks')}
                            checked={!!attributes.enableMagnify}
                            onChange={(val) => setAttributes({ enableMagnify: val })}
                        />
                        {attributes.enableMagnify && (
                            <>
                                <RangeControl
                                    label={__('Magnify Factor', 'super-blocks')}
                                    value={attributes.magnifyFactor}
                                    min={1}
                                    max={5}
                                    onChange={(val) => setAttributes({ magnifyFactor: val })}
                                />
                                <RangeControl
                                    label={__('Magnify Offset', 'super-blocks')}
                                    value={attributes.magnifyOffset}
                                    min={0}
                                    max={50}
                                    onChange={(val) => setAttributes({ magnifyOffset: val })}
                                />
                            </>
                        )}
                        <TextControl
                            label={__('Image Caption', 'super-blocks')}
                            value={attributes.imageCaption}
                            onChange={(val) => setAttributes({ imageCaption: val })}
                        />
                        <RangeControl
                            label={__('Width (%)', 'super-blocks')}
                            value={attributes.width}
                            min={10}
                            max={100}
                            onChange={(val) => setAttributes({ width: val })}
                        />
                        <TextControl
                            label={__('Height (px)', 'super-blocks')}
                            value={attributes.height || ''}
                            onChange={(val) => setAttributes({ height: parseInt(val) || undefined })}
                        />
                        <SelectControl
                            label={__('Object Fit', 'super-blocks')}
                            value={attributes.objectFit}
                            options={[
                                { label: __('Cover', 'super-blocks'), value: 'cover' },
                                { label: __('Contain', 'super-blocks'), value: 'contain' },
                                { label: __('Fill', 'super-blocks'), value: 'fill' },
                                { label: __('None', 'super-blocks'), value: 'none' },
                                { label: __('Scale Down', 'super-blocks'), value: 'scale-down' },
                            ]}
                            onChange={(val) => setAttributes({ objectFit: val })}
                        />
                        <TextareaControl
                            label={__('Custom CSS', 'super-blocks')}
                            value={attributes.customCSS}
                            onChange={(val) => setAttributes({ customCSS: val })}
                        />
                    </PanelBody>
                    <PanelBody title={__('Spotlight.js Options', 'super-blocks')} initialOpen={false}>
                        <SelectControl
                            label={__('Theme', 'super-blocks')}
                            value={attributes.spotlightTheme}
                            options={[
                                { label: __('Default', 'super-blocks'), value: 'default' },
                                { label: __('White', 'super-blocks'), value: 'white' },
                            ]}
                            onChange={(val) => setAttributes({ spotlightTheme: val })}
                        />
                        <SelectControl
                            label={__('Animation', 'super-blocks')}
                            value={attributes.spotlightAnimation}
                            options={[
                                { label: __('Slide', 'super-blocks'), value: 'slide' },
                                { label: __('Fade', 'super-blocks'), value: 'fade' },
                                { label: __('Scale', 'super-blocks'), value: 'scale' },
                            ]}
                            onChange={(val) => setAttributes({ spotlightAnimation: val })}
                        />
                        <ToggleControl
                            label={__('Autoplay', 'super-blocks')}
                            checked={!!attributes.enableAutoplay}
                            onChange={(val) => setAttributes({ enableAutoplay: val })}
                        />
                        {attributes.enableAutoplay && (
                            <RangeControl
                                label={__('Autoplay Speed (ms)', 'super-blocks')}
                                value={attributes.autoplaySpeed}
                                min={1000}
                                max={10000}
                                step={500}
                                onChange={(val) => setAttributes({ autoplaySpeed: val })}
                            />
                        )}
                        <ToggleControl
                            label={__('Infinite', 'super-blocks')}
                            checked={!!attributes.enableInfinite}
                            onChange={(val) => setAttributes({ enableInfinite: val })}
                        />
                        <ToggleControl
                            label={__('Show Spinner', 'super-blocks')}
                            checked={!!attributes.enableSpinner}
                            onChange={(val) => setAttributes({ enableSpinner: val })}
                        />
                        <ToggleControl
                            label={__('Preload', 'super-blocks')}
                            checked={!!attributes.enablePreload}
                            onChange={(val) => setAttributes({ enablePreload: val })}
                        />
                        <SelectControl
                            label={__('Autohide', 'super-blocks')}
                            value={attributes.autohide}
                            options={[
                                { label: __('Off', 'super-blocks'), value: 'off' },
                                { label: __('Controls', 'super-blocks'), value: 'controls' },
                                { label: __('All', 'super-blocks'), value: 'all' },
                            ]}
                            onChange={(val) => setAttributes({ autohide: val })}
                        />
                        <SelectControl
                            label={__('Autofit', 'super-blocks')}
                            value={attributes.autofit}
                            options={[
                                { label: __('Contain', 'super-blocks'), value: 'contain' },
                                { label: __('Cover', 'super-blocks'), value: 'cover' },
                            ]}
                            onChange={(val) => setAttributes({ autofit: val })}
                        />
                        <PanelRow>
                            <strong>{__('Controls', 'super-blocks')}</strong>
                        </PanelRow>
                        {Object.keys(controls).map((key) => (
                            <ToggleControl
                                key={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                checked={!!controls[key]}
                                onChange={(val) => setAttributes({ showControls: { ...controls, [key]: val } })}
                            />
                        ))}
                    </PanelBody>
                </InspectorControls>
                <div className="super-blocks-super-image-editor">
                    <MediaUpload
                        onSelect={(media) => setAttributes({ imageUrl: media.url, imageAlt: media.alt, imageId: media.id })}
                        allowedTypes={[ 'image' ]}
                        value={attributes.imageId}
                        render={({ open }) =>
                            attributes.imageUrl ? (
                                <div>
                                    <img src={attributes.imageUrl} alt={attributes.imageAlt} style={{ maxWidth: '100%' }} />
                                    <Button onClick={() => setAttributes({ imageUrl: '', imageAlt: '', imageId: undefined })} isLink isDestructive>
                                        {__('Remove Image', 'super-blocks')}
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={open} isPrimary>
                                    {__('Select Image', 'super-blocks')}
                                </Button>
                            )
                        }
                    />
                    {attributes.imageCaption && (
                        <div className="super-blocks-super-image-caption">
                            <em>{attributes.imageCaption}</em>
                        </div>
                    )}
                </div>
            </>
        );
    },
    save: (props) => {
        const { attributes } = props;
        if (!attributes.imageUrl) return null;
        const style = {
            width: attributes.width ? `${attributes.width}%` : undefined,
            height: attributes.height ? `${attributes.height}px` : undefined,
            objectFit: attributes.objectFit || undefined,
        };
        
        // Build Spotlight.js configuration
        const spotlightConfig = {
            theme: attributes.spotlightTheme,
            animation: attributes.spotlightAnimation,
            autoplay: attributes.enableAutoplay,
            infinite: attributes.enableInfinite,
            spinner: attributes.enableSpinner,
            preload: attributes.enablePreload,
            autohide: attributes.autohide,
            autofit: attributes.autofit,
            speed: attributes.enableAutoplay ? attributes.autoplaySpeed : undefined,
            control: Object.keys(attributes.showControls || {}).filter(key => attributes.showControls[key])
        };
        
        return (
            <figure className="super-blocks-super-image" style={style}>
                <img
                    src={attributes.imageUrl}
                    alt={attributes.imageAlt}
                    style={{ objectFit: attributes.objectFit || undefined }}
                    data-spotlight={attributes.enableLightbox ? 'on' : undefined}
                    data-spotlight-config={attributes.enableLightbox ? JSON.stringify(spotlightConfig) : undefined}
                    data-scroll-speed={attributes.enableImageScroll ? attributes.scrollSpeed : undefined}
                    data-scroll-direction={attributes.enableImageScroll ? attributes.scrollDirection : undefined}
                    data-scroll-trigger={attributes.enableImageScroll ? attributes.scrollTrigger : undefined}
                    data-magnify-factor={attributes.enableMagnify ? attributes.magnifyFactor : undefined}
                    data-magnify-offset={attributes.enableMagnify ? attributes.magnifyOffset : undefined}
                    className={[
                        attributes.enableImageScroll ? 'has-scroll-effect' : '',
                        attributes.enableImageScroll ? `scroll-${attributes.scrollDirection}` : '',
                        attributes.enableImageScroll ? `scroll-trigger-${attributes.scrollTrigger}` : '',
                        attributes.enableMagnify ? 'has-magnify' : '',
                    ].filter(Boolean).join(' ')}
                />
                {attributes.imageCaption && (
                    <figcaption className="super-blocks-super-image-caption">
                        {attributes.imageCaption}
                    </figcaption>
                )}
                {attributes.customCSS && (
                    <style>{attributes.customCSS}</style>
                )}
            </figure>
        );
    },
}); 