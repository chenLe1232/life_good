<script lang="ts" setup>
import { ref } from 'vue';
import Cocos from '../cocos/Cocos';
import { Component } from '../cocos/Component';
import { hideLoading, showLoading, showToast } from '../managers/UIManager';
import { useStoreUser } from '../stores/user';
import { Progress } from '../utils/Progress';

const user = useStoreUser();
const emit = defineEmits(['finish']);

const accountInput = ref<HTMLInputElement>();
const passwordInput = ref<HTMLInputElement>();

const loginSucc = ref(false);

const progress = new Progress(0);

const pageLogin = new class extends Component {
    async login() {
        if (accountInput.value.value === '' || passwordInput.value.value === '') {
            showToast({ message: '账号或密码不能为空', duration: 1000 });
            return;
        }
        // 登录
        showLoading();
        await user.login();
        hideLoading();
        showToast({ message: '登录成功', duration: 1000 });
        loginSucc.value = true;

        progress.slowStart();
        // 启动引擎
        if (!Cocos.inst.isBooted) {
            const { app, App } = await Cocos.inst.boot();
            // 等待系统Manager初始化完成
            app.once(App.EventType.EVENT_SYS_MANAGER_INITED, () => {
                // 监听UIManager的onShow事件，表示有页面显示了
                app.manager.ui.once('onShow', () => {
                    progress.fastFinish(() => {
                        showToast({ message: '启动成功', duration: 1000 });
                        emit('finish');
                    });
                })
            })
        }
    }
}
</script>

<template>
    <div class="vue-container">
        <img class="vue-bg"
            src="https://download.cocos.com/CocosPortal/image/846103b056904130851b530342136266/846103b056904130851b530342136266.jpg"
            alt="">
        <div v-if="!loginSucc" class="vue-content">
            <div class="vue-content-bg"></div>
            <div class="vue-account">
                <div class="vue-account-title">账号</div>
                <input ref="accountInput" class="vue-account-input" type="text" />
            </div>
            <div class="vue-password">
                <div class="vue-password-title">密码</div>
                <input ref="passwordInput" class="vue-password-input" type="text" />
            </div>
            <div class="vue-login-btn" @click="() => pageLogin.login()">
                <span>登录</span>
            </div>
        </div>
        <div class="vue-progress">
            <div :style="{ width: progress.value.value + '%', height: '100%', backgroundColor: '#fff' }"></div>
            <div class="vue-progress-title">{{ Math.floor(progress.value.value) }}%</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.vue-container {
    // 全屏
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;

    // 背景色
    background-color: #ffffff;
}

.vue-bg {
    // 居中
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100vh;
}

.vue-content {
    // 居中
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding-top: 80px;
    padding-bottom: 80px;

    width: 720px;

    .vue-content-bg {
        // 居中
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 100%;
        height: 100%;

        // 毛玻璃
        border-radius: 20px;
        background-color: #000000bf;
        filter: blur(4px);
    }

    // 账号输入
    .vue-account {
        position: relative;
        height: 120px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .vue-account-title {
            position: relative;
            font-size: 60px;
            color: #ffffff;
            // 禁止换行
            white-space: nowrap;
            margin-right: 30px;
        }

        .vue-account-input {
            position: relative;
            width: 450px;
            height: 120px;

            font-size: 60px;
        }
    }

    // 密码输入
    .vue-password {
        position: relative;
        height: 120px;

        margin-top: 80px;
        margin-bottom: 80px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .vue-password-title {
            position: relative;
            font-size: 60px;
            color: #ffffff;
            // 禁止换行
            white-space: nowrap;
            margin-right: 30px;
        }

        .vue-password-input {
            position: relative;
            width: 450px;
            height: 120px;

            font-size: 60px;
        }
    }

    // 登录按钮
    .vue-login-btn {
        position: relative;
        width: 300px;
        height: 120px;

        background-color: #fff;
        border: 1px solid #000000;
        border-radius: 5px;

        // 点击背景颜色改变
        &:active {
            background-color: #f0f0f0;
        }

        span {
            // 居中
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            font-weight: bold;
            color: #000000;
            font-size: 50px;
        }
    }
}


.vue-progress {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 100px;

    .vue-progress-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 30px;
    }
}
</style>