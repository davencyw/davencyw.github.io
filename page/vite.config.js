import { defineConfig } from 'vite'


  export default defineConfig({
    base: '/', // Set to root for custom domain
    assetsInclude: ['**/projects/**/*.html', '**/projects/**/*.png'], // Include all necessary files under projects/
  })