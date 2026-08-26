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
    // Cap at 2x: a 3x phone would triple the fill cost every frame for no
    // visible gain on glyphs this small.
    function pixelRatio() {
        return Math.min(window.devicePixelRatio || 1, 2);
    }
    // The backing store must be sized in device pixels or the canvas renders at
    // 1x and is upscaled by the DPR, which is what made the matrix look soft on
    // phones. Setting width/height resets the transform, so re-apply the scale.
    function applyCanvasSize(cssWidth, cssHeight) {
        const ratio = pixelRatio();
        canvas.width = Math.round(cssWidth * ratio);
        canvas.height = Math.round(cssHeight * ratio);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
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
            applyCanvasSize(lockedWidth, lockedHeight);
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
    applyCanvasSize(lockedWidth, lockedHeight);
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
    let frameHandle = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function draw(currentTime) {
        // Throttle to ~30fps
        if (currentTime - lastTime < 33) {
            frameHandle = requestAnimationFrame(draw);
            return;
        }
        lastTime = currentTime;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
        ctx.fillRect(0, 0, lockedWidth, lockedHeight);
        ctx.font = 'bold ' + fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const opacity = Math.max(0.3, 1 - (y / lockedHeight) * 0.4);
            ctx.fillStyle = `rgba(0, 255, 100, ${opacity})`;
            ctx.fillText(text, x, y);
            if (y > lockedHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        frameHandle = requestAnimationFrame(draw);
    }
    function startDrawing() {
        if (frameHandle !== null || reducedMotion.matches) {
            return;
        }
        frameHandle = requestAnimationFrame(draw);
    }
    function stopDrawing() {
        if (frameHandle === null) {
            return;
        }
        cancelAnimationFrame(frameHandle);
        frameHandle = null;
    }
    reducedMotion.addEventListener('change', function () {
        if (reducedMotion.matches) {
            stopDrawing();
            return;
        }
        startDrawing();
    });
    startDrawing();
});
