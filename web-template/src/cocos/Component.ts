import { getCurrentInstance, onActivated, onDeactivated, onMounted, onUnmounted } from 'vue';

class Timer {
    private _interval = 0;

    public _valid = true;
    public get valid() {
        return this._valid;
    }

    protected dt = 0;

    constructor(protected target: any = null, protected callback: Function, private repeat = -1, private delay = 0, private interval = 0) {
    }

    public delete(callback: Function) {
        this._valid = this.callback !== callback;
        return this._valid;
    }

    protected handleCallback() {
        this.callback.call(this.target);
    }

    public update(dt: number) {
        this.dt = dt;

        if (this.delay > 0) {
            this.delay -= dt;
            if (this.delay > 0) return true;
            this.delay = 0;
        }

        if (this._interval > 0) {
            this._interval -= dt;
            if (this._interval > 0) return true;
            this._interval = 0;
        }

        this.handleCallback();

        if (this.repeat > 0) {
            this.repeat--;
            this._interval = this.interval;
            return true;
        } else if (this.repeat < 0) {
            this._interval = this.interval;
            return true;
        } else {
            return false;
        }
    }
}

class DtTimer extends Timer {
    protected handleCallback() {
        this.callback.call(this.target, this.dt);
    }
}

class TimerManager {
    private timers: Timer[] = [];
    private timer: number = null;
    private time = 0;

    public add(timer: Timer) {
        this.timers.push(timer);
    }

    public remove(callback: Function) {
        this.timers = this.timers.filter((timer) => {
            return timer.delete(callback);
        });
    }

    public start() {
        if (this.timer !== null) return;
        this.time = Date.now();
        this.timer = setInterval(() => {
            const now = Date.now();
            this.update((now - this.time) / 1000);
            this.time = now;
        }) as any as number;
    }

    public stop() {
        if (this.timer === null) return;
        clearInterval(this.timer);
        this.timer = null;
    }

    public pause() {
        this.stop();
    }

    public resume() {
        this.start();
    }

    public clear() {
        this.stop();
        this.timers.length = 0;
    }

    private update(dt: number) {
        this.timers = this.timers.filter((timer) => {
            return timer._valid && timer.update(dt);
        });
    }
}

export abstract class Component {
    private _base_view_valid = false;
    private _base_view_active = false;
    private _base_system_timer_mgr = new TimerManager();
    private _base_custom_timer_mgr = new TimerManager();

    protected get valid() {
        return this._base_view_valid;
    }

    protected get active() {
        return this._base_view_active;
    }

    public refs: Record<string, HTMLElement> = {};

    private _base_init() {
        this._base_view_valid = true;
        this._base_view_active = true;
        this.refs = getCurrentInstance().refs as Record<string, HTMLElement>;

        if (this.start) {
            this._base_system_timer_mgr.add(new Timer(this, this.start, 0));
        }
        if (this.update) {
            this._base_system_timer_mgr.add(new DtTimer(this, this.update));
        }
        if (this.lateUpdate) {
            this._base_system_timer_mgr.add(new DtTimer(this, this.lateUpdate));
        }
        this._base_system_timer_mgr.start();
        this._base_custom_timer_mgr.start();

        this.onLoad();
        this.onEnable();
    }

    constructor() {
        onMounted(() => {
            this._base_init();
        });
        onActivated(() => {
            if (!this._base_view_valid) {
                this._base_init();
            } else if (!this._base_view_active) {
                this._base_view_active = true;
                this._base_system_timer_mgr.resume();
                this._base_custom_timer_mgr.resume();
                this.onEnable();
            }
        });
        onUnmounted(() => {
            this._base_view_valid = false;
            this._base_view_active = false;
            this._base_system_timer_mgr.clear();
            this._base_custom_timer_mgr.clear();
            this.onDisable();
            this.onDestroy();
        });
        onDeactivated(() => {
            if (this._base_view_valid && this._base_view_active) {
                this._base_view_active = false;
                this._base_custom_timer_mgr.pause();
                this._base_system_timer_mgr.pause();
                this.onDisable();
            }
        });
    }
    protected onLoad() { }
    protected onDestroy() { }
    protected onEnable() { }
    protected onDisable() { }

    protected scheduleOnce(callback: Function, delay = 0) {
        if (!callback) return;
        this._base_custom_timer_mgr.add(new Timer(this, callback, 0, delay));
    }

    protected schedule(callback: Function, interval = 0, repeat = -1, delay = 0): void {
        if (!callback) return;
        this._base_custom_timer_mgr.add(new Timer(this, callback, repeat, delay, interval));
    }

    protected unschedule(callback: Function): void {
        this._base_custom_timer_mgr.remove(callback);
    }
    protected unscheduleAllCallbacks(): void {
        this._base_custom_timer_mgr.clear();
    }

    protected start?(): void;
    protected update?(dt: number): void;
    protected lateUpdate?(dt: number): void;
}