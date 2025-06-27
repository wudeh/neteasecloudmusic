import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // base:'/Flutter_web_deploy/', // 打包后访问空白需要添加这个属性 base:'./'，如果部署到静态托管网站需要加上仓库名
  resolve: {
    alias: {
   		 '@': resolve(__dirname, 'src'),
    },
  },
})
