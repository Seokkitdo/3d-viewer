import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // 외부에서의 접근을 허용하려면 '0.0.0.0'으로 설정
    port: 5173, // 원하는 포트 번호로 변경
  },
  plugins: [svelte()],
});
