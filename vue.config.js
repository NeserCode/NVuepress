const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  outputDir: 'docs',
  // 线上地址，需要修改
  // publicPath: process.env.NODE_ENV === 'production' ? '/BLOG/' : '/',
  transpileDependencies: true,
})