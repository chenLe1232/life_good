/// <reference types="vite/client" />
/// <reference types="systemjs" />
/// <reference types="../game-env.d.ts" />
/// <reference types="../temp/declarations/cc.custom-macro" />
/// <reference types="../temp/declarations/cc" />
/// <reference types="../temp/declarations/jsb" />
/// <reference types="../temp/declarations/cc.env" />

declare interface Window {
    Firebug: {
        chrome: {
            isInitialized: boolean
        }
    }
    System: typeof System;
    /**web静态CDN地址 */
    resStaticHome: string;
    /**是否是Cocos预览 */
    cocosPreview: boolean;
    /**配置文件地址 */
    cocosSettingURL: string;
}