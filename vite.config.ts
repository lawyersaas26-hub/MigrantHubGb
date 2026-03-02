import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';

  return {
    server: {
      port: 4000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      cssCodeSplit: true, // Enable CSS code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'capacitor-vendor': ['@capacitor/core', '@capacitor/app', '@capacitor/browser'],
            'supabase-vendor': ['@supabase/supabase-js'],
          },
          // Optimize chunk size
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // Optimize build performance - use esbuild (faster than terser)
      minify: 'esbuild',
      // Remove console.logs in production via esbuild
      esbuild: {
        drop: isProduction ? ['console', 'debugger'] : [],
      },
      // Enable source maps only in development
      sourcemap: !isProduction,
      // Chunk size warning limit
      chunkSizeWarningLimit: 600,
      // Target modern browsers for smaller bundles
      target: 'es2015',
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: ['@capacitor/core'],
    },
    // Use '/' for both dev and production to ensure subroutes work on Vercel
    base: '/',
  };
});