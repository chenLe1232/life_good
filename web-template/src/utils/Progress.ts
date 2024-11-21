import { ref } from "vue";

export class Progress {
    value = ref(0);

    private started = false;
    private finished = false;
    private onFinish: () => any;

    constructor(value: number = 0) {
        this.value.value = value;
    }

    slowStart() {
        this.finished = false;
        if (this.started) return;
        this.started = true;
        this.update();
    }

    fastFinish(onFinish?: () => any) {
        this.onFinish = onFinish;
        this.finished = true;
        if (this.started) return;
        this.started = true;
        this.update();
    }

    private update() {
        const max = this.finished ? 100 : 99;
        this.value.value = Math.min(this.value.value + (this.finished ? 5 : 0.5), max);
        if (this.value.value >= 100) {
            if (this.finished && this.onFinish) this.onFinish();
            return;
        }
        const delay = this.finished ? 1 : 50;
        setTimeout(() => this.update(), delay);
    }
}