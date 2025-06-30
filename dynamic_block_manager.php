<?php
/**
 * Block Manager Class
 */
class BlockManager
{
    /**
     * Asset Manager instance
     *
     * @var AssetManager
     */
    private $asset_manager;

    /**
     * Registered blocks
     *
     * @var array
     */
    private $blocks = [];

    /**
     * Blocks directory path
     *
     * @var string
     */
    private $blocks_dir;

    /**
     * Constructor
     *
     * @param AssetManager $asset_manager Asset manager instance
     */
    public function __construct(AssetManager $asset_manager)
    {
        $this->asset_manager = $asset_manager;
        $this->blocks_dir = SUPER_BLOCKS_PLUGIN_DIR . 'src/Blocks/';
        $this->discoverBlocks();
    }

    /**
     * Discover and initialize available blocks from directory
     *
     * @return void
     */
    private function discoverBlocks(): void
    {
        // Check if blocks directory exists
        if (!is_dir($this->blocks_dir)) {
            return;
        }

        // Get all PHP files in the blocks directory
        $block_files = glob($this->blocks_dir . '*.php');
        
        if (empty($block_files)) {
            return;
        }

        foreach ($block_files as $block_file) {
            $this->loadBlock($block_file);
        }
    }

    /**
     * Load a block from file
     *
     * @param string $block_file Path to block file
     * @return void
     */
    private function loadBlock(string $block_file): void
    {
        // Get filename without extension
        $filename = pathinfo($block_file, PATHINFO_FILENAME);
        
        // Convert filename to class name (PascalCase)
        $class_name = $this->filenameToClassName($filename);
        $full_class_name = "SuperBlocks\\Blocks\\{$class_name}";
        
        // Check if class exists
        if (!class_exists($full_class_name)) {
            return;
        }

        // Check if class has required methods
        if (!method_exists($full_class_name, 'register')) {
            error_log("Super Blocks: Block class {$full_class_name} must have a register() method");
            return;
        }

        try {
            // Create instance and add to blocks array
            $block_instance = new $full_class_name();
            
            // Generate block key from filename
            $block_key = $this->filenameToBlockKey($filename);
            $this->blocks[$block_key] = $block_instance;
            
        } catch (Exception $e) {
            error_log("Super Blocks: Failed to instantiate block {$full_class_name}: " . $e->getMessage());
        }
    }

    /**
     * Convert filename to class name
     * Example: super_image_block.php -> SuperImageBlock
     *
     * @param string $filename Filename without extension
     * @return string Class name
     */
    private function filenameToClassName(string $filename): string
    {
        // Remove common suffixes
        $filename = preg_replace('/_block$/', '', $filename);
        
        // Convert snake_case to PascalCase
        $parts = explode('_', $filename);
        $class_name = '';
        
        foreach ($parts as $part) {
            $class_name .= ucfirst(strtolower($part));
        }
        
        // Add Block suffix if not present
        if (!str_ends_with($class_name, 'Block')) {
            $class_name .= 'Block';
        }
        
        return $class_name;
    }

    /**
     * Convert filename to block key
     * Example: super_image_block.php -> super-image
     *
     * @param string $filename Filename without extension
     * @return string Block key
     */
    private function filenameToBlockKey(string $filename): string
    {
        // Remove _block suffix and convert underscores to hyphens
        $key = preg_replace('/_block$/', '', $filename);
        return str_replace('_', '-', $key);
    }

    /**
     * Register all discovered blocks
     *
     * @return void
     */
    public function registerBlocks(): void
    {
        if (empty($this->blocks)) {
            error_log('Super Blocks: No blocks found to register');
            return;
        }

        foreach ($this->blocks as $block_name => $block_instance) {
            try {
                $block_instance->register();
            } catch (Exception $e) {
                error_log("Super Blocks: Failed to register block {$block_name}: " . $e->getMessage());
            }
        }
    }

    /**
     * Get all registered blocks
     *
     * @return array
     */
    public function getBlocks(): array
    {
        return $this->blocks;
    }

    /**
     * Get a specific block instance
     *
     * @param string $block_name Block name/key
     * @return mixed|null Block instance or null if not found
     */
    public function getBlock(string $block_name)
    {
        return $this->blocks[$block_name] ?? null;
    }

    /**
     * Check if a block is registered
     *
     * @param string $block_name Block name/key
     * @return bool
     */
    public function hasBlock(string $block_name): bool
    {
        return isset($this->blocks[$block_name]);
    }
}