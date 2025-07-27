<?php
/**
 * Plugin Name: Super Blocks
 * Plugin URI: https://roymahfooz.com/super-blocks
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

if (!defined('ABSPATH')) {
    exit;
}

define('SUPER_BLOCKS_VERSION', '1.0.0');
define('SUPER_BLOCKS_PLUGIN_FILE', __FILE__);
define('SUPER_BLOCKS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('SUPER_BLOCKS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('SUPER_BLOCKS_ASSETS_URL', SUPER_BLOCKS_PLUGIN_URL . 'assets/');

// Autoloader for SuperBlocks and SuperBlocks\Blocks classes
spl_autoload_register(function ($class) {
    $prefixes = [
        'SuperBlocks\\Blocks\\' => __DIR__ . '/src/Blocks/',
        'SuperBlocks\\' => __DIR__ . '/src/',
    ];
    foreach ($prefixes as $prefix => $base_dir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) === 0) {
            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
            if (file_exists($file)) {
                require $file;
                return;
            }
        }
    }
});

class AssetManager
{
    public function enqueueEditorAssets(): void
    {
        $asset_file = include SUPER_BLOCKS_PLUGIN_DIR . 'assets/js/blocks.asset.php';
        wp_enqueue_script(
            'super-blocks-editor',
            SUPER_BLOCKS_ASSETS_URL . 'js/blocks.js',
            $asset_file['dependencies'],
            $asset_file['version'],
            true
        );
        wp_enqueue_style(
            'super-blocks-editor',
            SUPER_BLOCKS_ASSETS_URL . 'css/blocks-editor.css',
            ['wp-edit-blocks'],
            SUPER_BLOCKS_VERSION
        );
        wp_localize_script('super-blocks-editor', 'superBlocksData', [
            'pluginUrl' => SUPER_BLOCKS_PLUGIN_URL,
            'assetsUrl' => SUPER_BLOCKS_ASSETS_URL,
            'nonce' => wp_create_nonce('super_blocks_nonce'),
            'restUrl' => rest_url('wp/v2/'),
        ]);
    }
    public function enqueueFrontendAssets(): void
    {
        if ($this->hasSuperBlocksContent()) {
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
    private function hasSuperBlocksContent(): bool
    {
        global $post;
        if (!$post || !$post->post_content) {
            return false;
        }
        return strpos($post->post_content, 'wp:super-blocks/') !== false;
    }
}

class SuperBlocksPlugin
{
    private static $instance = null;
    private $block_manager;
    private $asset_manager;
    public static function getInstance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    private function __construct()
    {
        $this->init();
    }
    private function init(): void
    {
        $this->asset_manager = new AssetManager();
        $this->block_manager = new BlockManager($this->asset_manager);
        add_action('init', [$this, 'onInit']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        register_activation_hook(SUPER_BLOCKS_PLUGIN_FILE, [$this, 'onActivation']);
        register_deactivation_hook(SUPER_BLOCKS_PLUGIN_FILE, [$this, 'onDeactivation']);
    }
    public function onInit(): void
    {
        load_plugin_textdomain('super-blocks', false, dirname(plugin_basename(__FILE__)) . '/languages');
        $this->block_manager->registerBlocks();
    }
    public function enqueueBlockEditorAssets(): void
    {
        $this->asset_manager->enqueueEditorAssets();
    }
    public function enqueueFrontendAssets(): void
    {
        $this->asset_manager->enqueueFrontendAssets();
    }
    public function onActivation(): void
    {
        if (version_compare(PHP_VERSION, '7.3', '<')) {
            deactivate_plugins(plugin_basename(__FILE__));
            wp_die(
                esc_html__('Super Blocks requires PHP 7.3 or higher.', 'super-blocks'),
                esc_html__('Plugin Activation Error', 'super-blocks'),
                ['response' => 200, 'back_link' => true]
            );
        }
        flush_rewrite_rules();
    }
    public function onDeactivation(): void
    {
        flush_rewrite_rules();
    }
}

SuperBlocksPlugin::getInstance(); 