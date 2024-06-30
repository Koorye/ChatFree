// vite.config.js
 
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
 
export default defineConfig({
	plugins: [uni()],
	server: {
		proxy: {
			'/spark': {
				target: 'http://spark-api-open.xf-yun.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/spark/, '')
			},
			'/wenxin': {
				target: 'https://aip.baidubce.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/wenxin/, '')
			}
		}
	}
});