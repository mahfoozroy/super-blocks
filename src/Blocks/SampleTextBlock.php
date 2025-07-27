<?php
namespace SuperBlocks\Blocks;

class SampleTextBlock
{
    private $block_name = 'super-blocks/sample-text';

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

    private function getAttributes(): array
    {
        return [
            'content' => [
                'type' => 'string',
                'default' => 'Hello, this is a sample text block!'
            ],
            'textColor' => [
                'type' => 'string',
                'default' => '#333333'
            ]
        ];
    }

    public function render(array $attributes, string $content = ''): string
    {
        $text = esc_html($attributes['content'] ?? '');
        $color = esc_attr($attributes['textColor'] ?? '#333333');
        return '<div class="super-blocks-sample-text" style="color:' . $color . '">' . $text . '</div>';
    }
} 