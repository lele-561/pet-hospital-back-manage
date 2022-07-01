module.exports = {
    devServer: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                // target: 'http://127.0.0.1:4523/mock/931654',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
    },
    lintOnSave: false,
}