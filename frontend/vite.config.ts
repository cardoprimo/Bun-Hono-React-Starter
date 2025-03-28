import path from 'node:path';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	envPrefix: 'PUBLIC_',
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dir, './src'),
			'@server': path.resolve(import.meta.dir, '../server'),
			'@convex': path.resolve(import.meta.dir, '../convex'),
			'@shared': path.resolve(import.meta.dir, '../shared'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:3000',
				changeOrigin: true,
			},
		},
	},
});
