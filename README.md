Super Blocks plugin directory structure:

/src/Blocks/SuperImageBlock.php      <-- main block class
/assets/js/blocks.js                 <-- Gutenberg block JS (was gutenberg_blocks.js)
/assets/js/frontend.js               <-- Frontend JS (was frontend_js.js)
/assets/css/blocks-editor.css        <-- Editor CSS (was super_blocks_css.css)
/assets/css/blocks-frontend.css      <-- Frontend CSS (copy or split as needed)
/languages/                          <-- translation files

All PHP classes should use PSR-4 namespaces and be placed in /src/Blocks/.