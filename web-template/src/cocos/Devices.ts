export const devices = {
    "Default": { "name": "默认分辨率", "width": 750, "height": 1334, "ratio": 1 },
    // "FullScreen": { "name": "全屏" },
    // "__separator__": { "name": "__separator__" },
    // "iPhone SE": { "name": "iPhone SE", "width": 375, "height": 667, "ratio": 2 },
    // "iPhone XS Max": { "name": "iPhone XS Max", "width": 414, "height": 896, "ratio": 3 },
    // "iPhone XS": { "name": "iPhone XS", "width": 375, "height": 812, "ratio": 3 },
    // "iPhone XR": { "name": "iPhone XR", "width": 414, "height": 896, "ratio": 2 },
    // "iPhone 8 Plus": { "name": "iPhone 8 Plus", "width": 414, "height": 736, "ratio": 2.6 },
    // "iPhone 8": { "name": "iPhone 8", "width": 375, "height": 667, "ratio": 2 },
    // "Galaxy S9 Plus": { "name": "Galaxy S9 Plus", "width": 412, "height": 846, "ratio": 3.5 },
    // "Galaxy S9": { "name": "Galaxy S9", "width": 360, "height": 740, "ratio": 4 },
    // "Galaxy S7": { "name": "Galaxy S7", "width": 360, "height": 640, "ratio": 4 },
    // "Huawei P20 Lite": { "name": "Huawei P20 Lite", "width": 360, "height": 760, "ratio": 3 },
    // "Huawei P20 Pro": { "name": "Huawei P20 Pro", "width": 360, "height": 747, "ratio": 3 },
    // "Huawei P20": { "name": "Huawei P20", "width": 360, "height": 748, "ratio": 3 },
    // "Huawei P10": { "name": "Huawei P10", "width": 360, "height": 640, "ratio": 3 },
    // "Redmi Note 5": { "name": "Redmi Note 5", "width": 393, "height": 786, "ratio": 2.75 },
    // "Pixel 3 XL": { "name": "Pixel 3 XL", "width": 393, "height": 786, "ratio": 3.67 },
    // "Pixel 2 XL": { "name": "Pixel 2 XL", "width": 412, "height": 823, "ratio": 3.5 },
    // "Pixel 2": { "name": "Pixel 2", "width": 412, "height": 640, "ratio": 2.6 },
    // "Nexus 6P": { "name": "Nexus 6P", "width": 412, "height": 732, "ratio": 3.5 },
    // "LG K20": { "name": "LG K20", "width": 360, "height": 640, "ratio": 2 },
    // "LG K7": { "name": "LG K7", "width": 320, "height": 570, "ratio": 1.5 },
}


export const devicesHtml = `<ul>${Object.keys(devices).map(key => {
    if (key === '__separator__') {
        return '<li class="separator"></li>';
    }
    const device = devices[key];
    return `<li class="" data-device="${device.name}">${device.name} (${device.width}x${device.height})</li>`
}).join('\n')}</ul>`;