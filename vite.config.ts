import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import https from 'https'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
    nodePolyfills(),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/txbit': {
        target: 'https://api.txbit.io/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/txbit/, ''),
      },
      '/swft': {
        target: 'https://www.swftc.info/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/swft/, ''),
      },
      '/mexc': {
        target: 'https://chain-app.fenus.xyz/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/mexc/, ''),
      },
      '/binance': {
        target: 'https://chain-app.fenus.xyz/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/binance/, ''),
      },
      '/coinw': {
        target: 'https://chain-app.fenus.xyz/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/coinw/, ''),
      },
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [
  //       NodeModulesPolyfills(),
  //       GlobalsPolyfills({
  //         process: true,
  //         buffer: true,
  //       }),
  //     ],
  //     define: {
  //       global: 'globalThis',
  //     },
  //   },
  // },
})
