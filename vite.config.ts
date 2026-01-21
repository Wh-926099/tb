import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // GitHub Pages base 路径配置
    // 如果设置了 GITHUB_REPOSITORY 环境变量，使用仓库名作为 base
    // 否则使用环境变量 BASE_PATH，如果都没有则默认为 '/'
    const base = env.BASE_PATH || (env.GITHUB_REPOSITORY ? `/${env.GITHUB_REPOSITORY.split('/')[1]}/` : '/');
    
    return {
      base,
      server: {
        port: 3000,
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
      }
    };
});
