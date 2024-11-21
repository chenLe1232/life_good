import { createVNode, render } from 'vue';

import Toast from './ToastLayer.vue';

export function showToast(options: { duration?: number, message: string }) {
    const { duration = 2500, message } = options;

    const mountNode = document.createElement('div');
    const hideNotice = () => {
        let laterTime = 2500;
        if (
            duration &&
            Object.prototype.toString.call(duration) === '[object Number]'
        ) {
            laterTime = duration;
        }
        setTimeout(() => {
            document.body.removeChild(mountNode);
        }, laterTime);
    };

    const app = createVNode(Toast, {
        message,
    });

    render(app, mountNode);

    document.body.appendChild(mountNode);

    hideNotice();
}

export function showLoading() {
    document.getElementById('def-loading').style.visibility = '';
}

export function hideLoading() {
    document.getElementById('def-loading').style.visibility = 'hidden';
}