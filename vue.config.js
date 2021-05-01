const tsImportPluginFactory = require("ts-import-plugin");
const { merge } = require("webpack-merge");
const path = require("path");

module.exports = {
  // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  chainWebpack(config) {
    // 配置VantUI按需引入
    // config.module
    //   .rule("ts")
    //   .use("ts-loader")
    //   .tap((options) => {
    //     options = merge(options, {
    //       transpileOnly: true,
    //       getCustomTransformers: () => ({
    //         before: [
    //           tsImportPluginFactory({
    //             libraryName: "vant",
    //             libraryDirectory: "es",
    //             style: true,
    //           }),
    //         ],
    //       }),
    //       compilerOptions: {
    //         module: "es2015",
    //       },
    //     });
    //     return options;
    //   });
    config.resolve.alias
      .set("img", path.join(__dirname, "public/img"))
      .set("@", path.join(__dirname, "src"));
  },
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "https://netease-cloud-music-api-jet.vercel.app/", // 访问的后台地址
  //       changeOrigin: true,
  //       pathRewrite: {
  //         // 重写地址 你的接口地址是'http://10.10.1.10/login' 你请求得时候地址只需要写'/api/login'
  //         "/api": "",
  //       },
  //     },
  //   },
  // },
};
