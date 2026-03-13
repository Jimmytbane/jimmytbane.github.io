"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const canvasEl = document.getElementById('matrix-canvas');
    if (!canvasEl) {
        console.error('Matrix canvas not found');
        return;
    }
    const canvas = canvasEl;
    const ctxEl = canvas.getContext('2d');
    if (!ctxEl) {
        console.error('Could not get canvas context');
        return;
    }
    const ctx = ctxEl;
    const matrix = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const chars = matrix.split('');
    const fontSize = 14;
    function getInitialViewportHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight);
    }
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = [];
    let lockedHeight = getInitialViewportHeight();
    let lockedWidth = window.innerWidth;
    function resizeCanvas() {
        const newWidth = window.innerWidth;
        const newHeight = getInitialViewportHeight();
        const newColumns = Math.floor(newWidth / fontSize);
        const widthDiff = Math.abs(lockedWidth - newWidth);
        const heightDiff = Math.abs(lockedHeight - newHeight);
        // Only resize on significant changes (ignore address bar show/hide)
        if (widthDiff > 50 || heightDiff > 200) {
            const oldColumns = columns;
            lockedWidth = newWidth;
            lockedHeight = newHeight;
            canvas.width = lockedWidth;
            canvas.height = lockedHeight;
            columns = newColumns;
            if (newColumns !== oldColumns) {
                const newDrops = [];
                for (let x = 0; x < newColumns; x++) {
                    newDrops[x] = x < oldColumns ? drops[x] : Math.random() * -100;
                }
                drops = newDrops;
            }
        }
    }
    canvas.width = lockedWidth;
    canvas.height = lockedHeight;
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100;
    }
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 250);
    }
    // Use visualViewport on iOS to avoid address bar resize noise
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', function () { }, { passive: true });
    }
    else {
        window.addEventListener('resize', handleResize);
    }
    let lastTime = 0;
    function draw(currentTime) {
        // Throttle to ~30fps
        if (currentTime - lastTime < 33) {
            requestAnimationFrame(draw);
            return;
        }
        lastTime = currentTime;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold ' + fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const opacity = Math.max(0.3, 1 - (y / canvas.height) * 0.4);
            ctx.fillStyle = `rgba(0, 255, 100, ${opacity})`;
            ctx.fillText(text, x, y);
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
});
