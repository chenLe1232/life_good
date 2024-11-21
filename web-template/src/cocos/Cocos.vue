<script setup lang="ts">
import { onMounted } from 'vue';
import Cocos from './Cocos.js';

const props = defineProps<{
    /**
     * 禁止滚动。
     * 如果传入true的话，canvas区域触摸或鼠标事件将不会响应页面滚动
     * 默认为false
     */
    noscroll?: boolean
}>()

onMounted(() => {
    if (import.meta.env.DEV) {
        // 兼容：预览热更新时Vue会将Cocos使用到的元素移除重建，导致Canvas黑屏
        Cocos.inst.env().then(({ cc }) => {
            const gameDiv = document.getElementById('GameDiv');
            if (gameDiv === cc.game.canvas.parentElement.parentElement) return;

            const parentElement = gameDiv.parentElement;
            const nextElement = gameDiv.nextElementSibling;
            gameDiv.remove();

            if (nextElement) {
                parentElement.insertBefore(cc.game.canvas.parentElement.parentElement, nextElement);
            } else {
                parentElement.appendChild(cc.game.canvas.parentElement.parentElement);
            }
        })
    }

    const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
    canvas.focus = function () {
        if (!props.noscroll) return;
        HTMLCanvasElement.prototype.focus.call(this);
    }
});
function handleTouch(event: Event) {
    const copy = new TouchEvent(event.type, event);
    copy.preventDefault = function () { }
    document.getElementById('GameCanvas').dispatchEvent(copy);
}
function handleMouse(event: Event) {
    const copy = new MouseEvent(event.type, event);
    copy.preventDefault = function () { }
    document.getElementById('GameCanvas').dispatchEvent(copy);
}
</script>

<template>
    <!-- 游戏画布 -->
    <div id="GameDiv" cc_exact_fit_screen="true">
        <div id="Cocos3dGameContainer">
            <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="99"></canvas>
            <div v-if="!noscroll" class="touch-div" oncontextmenu="event.preventDefault()" tabindex="100"
                @touchstart="handleTouch" @touchmove="handleTouch" @touchend="handleTouch" @touchcancel="handleTouch"
                @mousedown="handleMouse" @mousemove="handleMouse" @mouseup="handleMouse" @mousewheel="handleMouse"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.touch-div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>