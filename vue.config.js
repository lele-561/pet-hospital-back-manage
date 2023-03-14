module.exports = {
    devServer: {
        port: 8090,
        host: '0.0.0.0',
        // 跨域1
        // proxy: "http://localhost:8080"
        // proxy: "http://127.0.0.1:4523/mock/1428114"
        // 跨域2
        proxy: {
            '/api': {
                // target: 'http://localhost:8080/',            // 后端url
                target: 'http://127.0.0.1:4523/mock/1428114',   // mock用
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
    },
    lintOnSave: false,
    publicPath: "./"
}