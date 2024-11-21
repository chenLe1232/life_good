<template>
    <transition>
        <div class="toast-container" v-show="state.showNotice">
            <div class="toast-msg">{{ message }}</div>
        </div>
    </transition>
</template>
  
<script setup lang="ts">
import { onMounted, reactive } from "vue";

defineProps(["message"]);

const state = reactive({
    showNotice: false,
});

onMounted(() => {
    state.showNotice = true;
});
</script>
  
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.toast-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 30px 20px 30px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;

    .toast-msg {
        font-family: PingFangSC-Regular;
        font-size: 28px;
        line-height: 38px;
        color: #ffffff;
        font-weight: 400;
        text-align: center;
        white-space: pre;
    }
}
</style>