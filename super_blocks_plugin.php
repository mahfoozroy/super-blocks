<?php
/**
 * Plugin Name: Super Blocks
 * Plugin URI: https://example.com/super-blocks
 * Description: Advanced Gutenberg blocks with enhanced image functionality including scroll, magnify, and lightbox features.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: super-blocks
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.2
 * Requires PHP: 7.3
 */

namespace SuperBlocks;

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('SUPER_BLOCKS_VERSION', '1.0.0');
define('SUPER_BLOCKS_PLUGIN_FILE', __FILE__);
define('SUPER_BLOCKS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SUPER_BLOCKS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('SUPER_BLOCKS_ASSETS_URL', SUPER_BLOCKS_PLUGIN_URL . 'assets/');

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'SuperBlocks\\';
    $base_dir = __DIR__ . '/src/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

/**
 * Main plugin class
 */
class SuperBlocksPlugin
{
    /**
     * Plugin instance
     *
     * @var SuperBlocksPlugin
     */
    private static $instance = null;

    /**
     * Block Manager instance
     *
     * @var BlockManager
     */
    private $block_manager;

    /**
     * Asset Manager instance
     *
     * @var AssetManager
     */
    private $asset_manager;

    /**
     * Get plugin instance
     *
     * @return SuperBlocksPlugin
     */
    public static function getInstance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor
     */
    private function __construct()
    {
        $this->init();
    }

    /**
     * Initialize plugin
     *
     * @return void
     */
    private function init(): void
    {
        // Initialize managers
        $this->asset_manager = new AssetManager();
        $this->block_manager = new BlockManager($this->asset_manager);

        // Hook into WordPress
        add_action('init', [$this, 'onInit']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        
        // Plugin lifecycle hooks
        register_activation_hook(SUPER_BLOCKS_PLUGIN_FILE, [$this, 'onActivation']);
        register_deactivation_hook(SUPER_BLOCKS_PLUGIN_FILE, [$this, 'onDeactivation']);
    }

    /**
     * Handle plugin initialization
     *
     * @return void
     */
    public function onInit(): void
    {
        // Load text domain
        load_plugin_textdomain('super-blocks', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Register blocks
        $this->block_manager->registerBlocks();
    }

    /**
     * Enqueue block editor assets
     *
     * @return void
     */
    public function enqueueBlockEditorAssets(): void
    {
        $this->asset_manager->enqueueEditorAssets();
    }

    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets(): void
    {
        $this->asset_manager->enqueueFrontendAssets();
    }

    /**
     * Handle plugin activation
     *
     * @return void
     */
    public function onActivation(): void
    {
        // Check PHP version
        if (version_compare(PHP_VERSION, '7.3', '<')) {
            deactivate_plugins(plugin_basename(__FILE__));
            wp_die(
                esc_html__('Super Blocks requires PHP 7.3 or higher.', 'super-blocks'),
                esc_html__('Plugin Activation Error', 'super-blocks'),
                ['response' => 200, 'back_link' => true]
            );
        }

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Handle plugin deactivation
     *
     * @return void
     */
    public function onDeactivation(): void
    {
        flush_rewrite_rules();
    }
}

/**
 * Asset Manager Class
 */
class AssetManager
{
    /**
     * Enqueue editor assets
     *
     * @return void
     */
    public function enqueueEditorAssets(): void
    {
        wp_enqueue_script(
            'super-blocks-editor',
            SUPER_BLOCKS_ASSETS_URL . 'js/blocks.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-api-fetch'],
            SUPER_BLOCKS_VERSION,
            true
        );

        wp_enqueue_style(
            'super-blocks-editor',
            SUPER_BLOCKS_ASSETS_URL . 'css/blocks-editor.css',
            ['wp-edit-blocks'],
            SUPER_BLOCKS_VERSION
        );

        // Localize script
        wp_localize_script('super-blocks-editor', 'superBlocksData', [
            'pluginUrl' => SUPER_BLOCKS_PLUGIN_URL,
            'assetsUrl' => SUPER_BLOCKS_ASSETS_URL,
            'nonce' => wp_create_nonce('super_blocks_nonce'),
            'restUrl' => rest_url('wp/v2/'),
        ]);
    }

    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueueFrontendAssets(): void
    {
        // Only enqueue if we have Super Blocks on the page
        if ($this->hasSupperBlocksContent()) {
            // Enqueue Spotlight.js library
            wp_enqueue_script(
                'spotlight-js',
                'https://cdn.jsdelivr.net/npm/spotlight.js@0.7.8/dist/spotlight.bundle.js',
                [],
                '0.7.8',
                true
            );

            wp_enqueue_style(
                'spotlight-css',
                'https://cdn.jsdelivr.net/npm/spotlight.js@0.7.8/dist/spotlight.min.css',
                [],
                '0.7.8'
            );

            // Our custom frontend JS
            wp_enqueue_script(
                'super-blocks-frontend',
                SUPER_BLOCKS_ASSETS_URL . 'js/frontend.js',
                ['spotlight-js'],
                SUPER_BLOCKS_VERSION,
                true
            );

            wp_enqueue_style(
                'super-blocks-frontend',
                SUPER_BLOCKS_ASSETS_URL . 'css/blocks-frontend.css',
                ['spotlight-css'],
                SUPER_BLOCKS_VERSION
            );
        }
    }

    /**
     * Check if page has Super Blocks content
     *
     * @return bool
     */
    private function hasSupperBlocksContent(): bool
    {
        global $post;
        
        if (!$post || !$post->post_content) {
            return false;
        }

        return strpos($post->post_content, 'wp:super-blocks/') !== false;
    }
}

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
     * Constructor
     *
     * @param AssetManager $asset_manager Asset manager instance
     */
    public function __construct(AssetManager $asset_manager)
    {
        $this->asset_manager = $asset_manager;
        $this->initializeBlocks();
    }

    /**
     * Initialize available blocks
     *
     * @return void
     */
    private function initializeBlocks(): void
    {
        $this->blocks = [
            'super-image' => new Blocks\SuperImageBlock(),
        ];
    }

    /**
     * Register all blocks
     *
     * @return void
     */
    public function registerBlocks(): void
    {
        foreach ($this->blocks as $block_name => $block_instance) {
            $block_instance->register();
        }
    }
}

// Initialize plugin
SuperBlocksPlugin::getInstance();

/*
 * =============================================================================
 * ADDITIONAL FILES STRUCTURE:
 * =============================================================================
 * 
 * /src/Blocks/SuperImageBlock.php - The Super Image Block class
 * /assets/js/blocks.js - Gutenberg block JavaScript
 * /assets/js/frontend.js - Frontend functionality
 * /assets/css/blocks-editor.css - Editor styles
 * /assets/css/blocks-frontend.css - Frontend styles
 * /languages/ - Translation files
 * 
 * =============================================================================
 */