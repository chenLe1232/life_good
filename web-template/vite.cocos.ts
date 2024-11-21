/**
 * 除index.html外的远程资源「根地址」需要以/结尾
 */
export const ResStaticHome = 'http://localhost:7456/web-mobile/web-mobile/';

// 项目端口号
const CocosPort = 7456;
const CocosHost = 'http://localhost:' + CocosPort;
const CocosWs = 'ws://localhost:' + CocosPort;

export const CocosProxy = {
    '/index.css': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/scripting.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/settings\.js.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/splash.*\.png.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/preview-app.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/socket\.io/socket\.io\.js.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/socket\.io.*': {
        target: CocosWs,
        ws: true,
        changeOrigin: true
    },
    '^/scene.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/assets.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/query-extname.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/plugins/.*': {
        target: CocosHost,
        changeOrigin: true
    },
    '^/engine_external.*': { //3.x
        target: CocosHost,
        changeOrigin: true
    },
};