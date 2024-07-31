import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import sass from 'sass'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), dts({insertTypesEntry: true})],
    css: {
        preprocessorOptions: {
            scss: {
                implementation: sass,
            },
        },
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'french-date-picker',
            formats: ['es','cjs', 'umd'],
            fileName: (format) => `lib.${format}.js`
        },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      }
    }
})
