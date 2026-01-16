// ==UserScript==
// @name         微信外部链接自动跳转_Debug版
// @namespace    http://tampermonkey.net/
// @version      1.0.0.debug
// @description  通过直接读取页面内的 cgiData 变量 ，精准获取目标 URL 并自动跳转。此版本包含详细的调试日志。
// @author       MoonIRL
// @match        *://weixin110.qq.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL  https://cdn.jsdelivr.net/gh/MoonIRL/tampermonkey@latest/weixin/WeChatLinkSkipperDebug.user.js
// @updateURL    https://cdn.jsdelivr.net/gh/MoonIRL/tampermonkey@latest/weixin/WeChatLinkSkipperDebug.user.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 日志 #1: 脚本启动 ---
    // 只要脚本被油猴加载，这条日志就会在第一时间打印。
    // 如果连这条都看不到，说明油猴扩展本身或脚本的 @match 规则有问题。
    console.log('[WeChat Skipper LOG] 脚本已启动并注入页面。');

    // --- 日志 #2: 设置事件监听 ---
    // 确认脚本已成功设置了等待页面加载的监听器。
    window.addEventListener('DOMContentLoaded', () => {
        // --- 日志 #3: 页面加载完成 ---
        // 这条日志出现，说明页面DOM已加载完毕，我们的核心逻辑即将开始。
        console.log('[WeChat Skipper LOG] DOMContentLoaded 事件触发，核心逻辑开始执行...');

        // --- 日志 #4: 检查 unsafeWindow ---
        // 这是访问页面全局变量的关键，必须首先确认它是否存在。
        if (typeof unsafeWindow === 'undefined') {
            console.error('[WeChat Skipper ERROR] 关键对象 "unsafeWindow" 未定义！脚本无法访问页面变量。请检查油猴设置或浏览器兼容性。');
            return;
        }
        console.log('[WeChat Skipper LOG] "unsafeWindow" 对象可用。');

        // --- 日志 #5: 检查 cgiData ---
        if (typeof unsafeWindow.cgiData === 'undefined' || unsafeWindow.cgiData === null) {
            console.error('[WeChat Skipper ERROR] 未能在页面中找到 "cgiData" 全局变量。目标页面结构可能已改变。');
            return;
        }
        // 使用 JSON.stringify 可以更完整地打印出对象内容，方便检查。
        console.log('[WeChat Skipper LOG] 成功找到 "cgiData" 变量，内容为:', JSON.stringify(unsafeWindow.cgiData, null, 2));
        const cgiData = unsafeWindow.cgiData;

        // --- 日志 #6: 提取原始 URL ---
        let rawUrl = (cgiData.btns && cgiData.btns[0] && cgiData.btns[0].url) || cgiData.url;
        if (!rawUrl) {
            console.error('[WeChat Skipper ERROR] 在 "cgiData" 对象中未找到有效的 "url" 或 "btns[0].url"。');
            return;
        }
        console.log('[WeChat Skipper LOG] 提取到原始 URL:', rawUrl);

        // --- 日志 #7: 净化 URL ---
        let cleanUrl = rawUrl.replace(/&#x2f;/g, '/');
        console.log('[WeChat Skipper LOG] 净化后的 URL:', cleanUrl);

        // --- 日志 #8: 最终验证与跳转 ---
        if (cleanUrl.startsWith('http' )) {
            console.log(`[WeChat Skipper LOG] URL 验证通过。准备在 1 秒后跳转至: ${cleanUrl}`);
            // 增加一个短暂的延时，确保我们有足够的时间在跳转前看到这条日志。
            setTimeout(() => {
                window.location.replace(cleanUrl);
            }, 1000);
        } else {
            console.error(`[WeChat Skipper ERROR] 净化后的 URL "${cleanUrl}" 不是有效的绝对地址 (非 http/https 开头 )，跳转取消。`);
        }
    });

    console.log('[WeChat Skipper LOG] "DOMContentLoaded" 事件监听器已成功设置。等待页面加载...');

})();
