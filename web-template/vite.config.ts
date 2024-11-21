import vue from '@vitejs/plugin-vue';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import postCssPxToRem from 'postcss-pxtorem';
import { IndexHtmlTransformContext, defineConfig } from 'vite';
import { ViteEjsPlugin as ejs } from 'vite-plugin-ejs';
import { CocosProxy, ResStaticHome } from './vite.cocos';

// https://vitejs.dev/config/
export default defineConfig((env) => {
  if (env.mode === 'preview') {
    console.log('预览模版');
  } else {
    console.log('构建模版');
  }

  const assetsDir = 'vue';
  const root = env.mode === 'preview' ? process.cwd() : './template/build';
  const plugins = env.mode === 'preview' ? [ejs(), vue(), preview()] : [ejs(), vue(), build()];
  const outDir = path.join(__dirname, env.mode === 'preview' ? '../preview-template' : '../build-templates/web-mobile');

  if (env.command === 'build') {
    fs.removeSync(outDir);
  }

  return {
    root: root,
    plugins: plugins,
    server: {
      proxy: CocosProxy,
      host: '0.0.0.0',
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome61',
      minify: true,
      outDir: outDir,
      assetsDir: assetsDir,
    },
    experimental: {
      renderBuiltUrl(importer, { hostType }) {
        if (hostType === 'html') {
          return importer;
        }
        // css中的图片(如果使用了base标签，不需要进行这一步)
        // if (hostType === 'css') {
        //   const index = importer.indexOf(`${assetsDir}/`);
        //   if (index === -1) {
        //     return importer;
        //   }
        //   return importer.slice(index + 4);
        // }
        return {
          runtime: `window.resStaticHome + ${JSON.stringify(importer)}`
        };
      }
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 750 / 10, // 1rem的大小，设计分辨率的1/10
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          })
        ]
      }
    }
  };
});

const previewTemplate = `
  <!-- 环境配置 -->
  <script type="text/javascript" charset="utf-8">
    window.cocosPreview = true;
    // 静态地址
    if (!window.resStaticHome) {
      window.resStaticHome = "/";
    }
    // 配置文件地址
    if (!window.cocosSettingURL) {
      window.cocosSettingURL = window.resStaticHome + 'src/settings.json';
    }
  </script>
`;
function preview() {
  return {
    name: 'vite:preview-template',
    transformIndexHtml(htmlText: string, ctx: IndexHtmlTransformContext) {
      // 构建
      const $ = cheerio.load(htmlText);
      $('script[type=module]').attr({ async: '' });
      $('body').append($('script[type=module]').remove());
      $('head').append(previewTemplate);

      htmlText = $.html();
      htmlText = htmlText.replace(/async=""/g, 'async');

      return htmlText;
    }
  };
}

const buildTemplate = `
  <!-- 静态资源地址(以/结尾) -->
  <base href="${ResStaticHome}">

  <!-- 环境配置 -->
  <script type="text/javascript" charset="utf-8">
    window.cocosPreview = false;
    // 静态地址
    if (!window.resStaticHome) {
      window.resStaticHome = "${ResStaticHome ? ResStaticHome : '/'}";
    }
    // 配置文件地址
    if (!window.cocosSettingURL) {
      window.cocosSettingURL = window.resStaticHome + 'src/settings.json';
    }
  </script>
`;
function build() {
  return {
    name: 'vite:build-template',
    transformIndexHtml(htmlText: string, ctx: IndexHtmlTransformContext) {
      // 构建
      const $ = cheerio.load(htmlText);
      $('script[type=module]').attr({ async: '', 'no-inline': '' });
      $('link[rel=stylesheet]').attr({ 'no-inline': '' });
      $('body').append($('script[type=module]').remove());
      $('head').append(buildTemplate);

      htmlText = $.html();
      htmlText = htmlText.replace(/async=""/g, 'async');
      htmlText = htmlText.replace(/no-inline=""/g, 'no-inline');

      return htmlText;
    }
  };
}