<?php
namespace SuperBlocks;

class BlockManager
{
    private $asset_manager;
    private $blocks = [];
    private $blocks_dir;

    public function __construct($asset_manager)
    {
        $this->asset_manager = $asset_manager;
        $this->blocks_dir = __DIR__ . '/Blocks/';
        $this->discoverBlocks();
    }

    private function discoverBlocks(): void
    {
        if (!is_dir($this->blocks_dir)) {
            return;
        }
        $block_files = glob($this->blocks_dir . '*.php');
        if (empty($block_files)) {
            return;
        }
        foreach ($block_files as $block_file) {
            $this->loadBlock($block_file);
        }
    }

    private function loadBlock(string $block_file): void
    {
        $filename = pathinfo($block_file, PATHINFO_FILENAME);
        $class_name = $this->filenameToClassName($filename);
        $full_class_name = "SuperBlocks\\Blocks\\{$class_name}";
        if (!class_exists($full_class_name)) {
            return;
        }
        if (!method_exists($full_class_name, 'register')) {
            error_log("Super Blocks: Block class {$full_class_name} must have a register() method");
            return;
        }
        try {
            $block_instance = new $full_class_name();
            $block_key = $this->filenameToBlockKey($filename);
            $this->blocks[$block_key] = $block_instance;
        } catch (\Exception $e) {
            error_log("Super Blocks: Failed to instantiate block {$full_class_name}: " . $e->getMessage());
        }
    }

    private function filenameToClassName(string $filename): string
    {
        $filename = preg_replace('/_block$/', '', $filename);
        $parts = explode('_', $filename);
        $class_name = '';
        foreach ($parts as $part) {
            $class_name .= ucfirst(strtolower($part));
        }
        if (!str_ends_with($class_name, 'Block')) {
            $class_name .= 'Block';
        }
        return $class_name;
    }

    private function filenameToBlockKey(string $filename): string
    {
        return strtolower(str_replace('_block', '', $filename));
    }

    public function registerBlocks(): void
    {
        foreach ($this->blocks as $block_instance) {
            $block_instance->register();
        }
    }
} 