import { App, app } from '../../../assets/app/app';
import { devices, devicesHtml } from './Devices';
export type ICC = typeof import('cc');

class Cocos {
    private static _inst: Cocos;
    static get inst() {
        if (!this._inst) {
            this._inst = new Cocos();
        }
        return this._inst;
    }

    private constructor() { }

    /**调用boot成功后才可访问 */
    cc: ICC;
    /**调用boot成功后才可访问 */
    app: typeof app;
    /**调用boot成功后才可访问 */
    App: typeof App;

    private _preheat: Promise<ICC> = null;
    /**
     * 预热引擎
     * - 由于Cocos引擎的初始化机制问题，在预览阶段无法返回cc实例
     */
    async preheat(): Promise<ICC> {
        // 环境异常
        if (!window.System) {
            return Promise.reject(new Error('没有Cocos运行环境'));
        }

        if (this._preheat) {
            return this._preheat;
        }

        // 预览模式
        if (window.cocosPreview) {
            const viewSelectEl = document.getElementById('view-select');
            viewSelectEl.querySelector('.options').innerHTML = devicesHtml;
            return this._preheat = Promise.resolve(null);
        }

        // 正式模式
        return this._preheat = System.import('cc').then((cc: ICC) => {
            // 设置画布
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            const bcr = canvas.parentElement!.getBoundingClientRect();
            canvas.width = bcr.width;
            canvas.height = bcr.height;
            return cc;
        }).then((cc) => {
            // 引擎配置
            cc.assetManager.downloader.maxConcurrency = 100;
            cc.assetManager.downloader.maxRequestsPerFrame = 100;
            return cc;
        }).then(async (cc) => {
            // 初始化引擎
            await cc.game.init({
                debugMode: false ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
                settingsPath: window.cocosSettingURL,
                exactFitScreen: true,
                overrideSettings: {
                    profiling: {
                        showFPS: false
                    },
                    assets: {
                        // 设置远程bundle地址
                        server: window.resStaticHome,
                    },
                }
            });
            return cc;
        })
    }

    get isBooted(): boolean {
        return !!this._boot;
    }

    private _onBooted: { resolve: Function, reject: Function }[] = [];
    private onBooted(result: boolean) {
        if (result) {
            this._onBooted.forEach(call => {
                call.resolve(this);
            });
        } else {
            this._onBooted.forEach(call => {
                call.reject();
            });
        }
        this._onBooted.length = 0;
    }

    private _boot: Promise<{ cc: ICC, app: typeof app, App: typeof App }>;
    async boot(): Promise<{ cc: ICC, app: typeof app, App: typeof App }> {
        // 环境异常
        if (!window.System) {
            this.onBooted(false);
            return Promise.reject(new Error('没有Cocos运行环境'));
        }

        if (this._boot) {
            return this._boot;
        }

        // 预览模式
        if (window.cocosPreview) {
            return this._boot = Promise.resolve().then(() => {
                return this.preheat();
            }).then(() => {
                return System.import('/preview-app/index.js')
            }).then((mod) => {
                return mod.bootstrap({
                    engineBaseUrl: '/scripting/engine',
                    settings: window['_CCSettings'],
                    devices: devices
                })
            }).then(() => {
                this.cc = window['cc'];
                this.App = this.cc.js.getClassById('App') as any;
                this.app = this.App.inst;
                this.onBooted(true);
                return this;
            }).catch((res: any) => {
                this.onBooted(false);
                return Promise.reject(res);
            });
        }

        // 正式模式
        return this._boot = Promise.resolve().then(() => {
            return this.preheat();
        }).then((cc) => {
            // 运行引擎
            return new Promise<ICC>(resolve => {
                cc.game.run(() => resolve(cc));
            })
        }).then((cc) => {
            this.cc = cc;
            this.App = this.cc.js.getClassById('App') as any;
            this.app = this.App.inst;
            this.onBooted(true);
            return this;
        }).catch(res => {
            this.onBooted(false);
            return Promise.reject(res);
        });
    }

    /**
     * 获取环境信息，调用boot成功后才可访问
     * @returns 
     */
    async env(): Promise<{ cc: ICC, app: typeof app, App: typeof App }> {
        return new Promise((resolve, reject) => {
            if (this._boot) {
                return resolve(this._boot);
            }
            this._onBooted.push({ resolve, reject });
        })
    }
}

export default Cocos;