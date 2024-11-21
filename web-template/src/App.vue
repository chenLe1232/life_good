<script setup lang="ts">
import { ref } from 'vue';
import Cocos from './cocos/Cocos';
import CocosVue from './cocos/Cocos.vue';
import { Component } from './cocos/Component';
import { hideLoading } from './managers/UIManager';
import PageLogin from './view/PageLogin.vue';

const finished = ref(false);

const app = new class extends Component {
    protected onLoad(): void {
        hideLoading();
        // 预热引擎
        Cocos.inst.preheat().then(cc => {
            if (!cc) return;
            // 预加载场景
            cc.assetManager.loadBundle('main', (err, bundle) => {
                if (err || !bundle) return;
                bundle.preloadScene('main');
            });
            // 预加载框架Bundle
            ['app-admin', 'app-model', 'app-controller', 'app-manager'].forEach(bundleName => {
                const projectBundles = cc.settings.querySettings(cc.Settings.Category.ASSETS, 'projectBundles') as string[];
                if (projectBundles.indexOf(bundleName) === -1) return
                cc.assetManager.preloadAny({ url: bundleName }, { ext: 'bundle' });
            })
            // 预加载业务Bundle
            cc.assetManager.loadBundle('page-home-res', (err, bundle) => {
                if (err || !bundle) return;
                bundle.preloadDir('/', cc.Asset);
                cc.assetManager.loadBundle('page-home', (err, bundle) => {
                    if (err || !bundle) return;
                    bundle.preloadDir('/', cc.Asset);
                });
            })
            cc.assetManager.loadBundle('paper-home-index-res', (err, bundle) => {
                if (err || !bundle) return;
                bundle.preloadDir('/', cc.Asset);
                cc.assetManager.loadBundle('paper-home-index', (err, bundle) => {
                    if (err || !bundle) return;
                    bundle.preloadDir('/', cc.Asset);
                });
            })
            cc.assetManager.loadBundle('app-sound', (err, bundle) => {
                if (err || !bundle) return;
                bundle.preloadDir('music/home', cc.AudioClip);
            })
        })
    }

    onFinish(): void {
        finished.value = true;
    }
}
</script>

<template>
    <CocosVue noscroll />
    <PageLogin @finish="() => app.onFinish()" v-if="!finished" />
</template>

<style lang="scss" scoped></style>