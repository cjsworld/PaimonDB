const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/',
    outputDir: '../release/wwwroot',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:12002',
                changeOrigin: true
            }
        }
    },
    configureWebpack: config => {
        // 扩展文件类型
        config.resolve.extensions = [
            '.tsx',
            '.ts',
            '.mjs',
            '.js',
            '.jsx',
            '.vue',
            '.json',
            '.wasm'
        ]
        // 添加ts加载rules
        config.module.rules.push({
            test: /\.tsx?$/i,
            use: [{
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            }],
            exclude: /node_modules/
        })
    },
    chainWebpack: config => {
        config.optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
                elementui: {
                    test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                    name: 'element-ui',
                    priority: 30,
                    enforce: true
                },
                vendor: {
                    test: /[\\/]node_modules[\\/].*/,
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        });
    }
})
