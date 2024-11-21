const fs = require('fs');
const path = require('path');

function preview() {
    const htmlPath = path.join(__dirname, '../preview-template/index.html');
    const ejsPath = path.join(__dirname, '../preview-template/index.ejs');
    if (fs.existsSync(ejsPath)) return;
    if (!fs.existsSync(htmlPath)) {
        return setTimeout(preview, 1000);
    }
    fs.renameSync(htmlPath, ejsPath);
}
preview();

function build() {
    const htmlPath = path.join(__dirname, '../build-templates/web-mobile/index.html');
    const ejsPath = path.join(__dirname, '../build-templates/web-mobile/index.ejs');
    if (fs.existsSync(ejsPath)) return;
    if (!fs.existsSync(htmlPath)) {
        return setTimeout(build, 1000);
    }
    fs.renameSync(htmlPath, ejsPath);
}
build();