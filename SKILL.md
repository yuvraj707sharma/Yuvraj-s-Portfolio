---
name: html-in-canvas
description: Guidance for implementing, reviewing, debugging, or explaining code that uses the emerging HTML-in-Canvas proposal from the WICG explainer. Use when working with canvas elements that opt into the `layoutsubtree` attribute, `drawElementImage()`, the canvas `paint` event, `requestPaint()`, `captureElementImage()`, `ElementImage`, `getElementTransform()`, or the WebGL/WebGPU equivalents `texElementImage2D` and `copyElementImageToTexture`.
---

# HTML-in-Canvas

## Overview

Implement HTML-in-Canvas features against the current WICG explainer, not against assumptions from ordinary canvas APIs. Treat the explainer as the source of truth and re-open `https://wicg.github.io/html-in-canvas/` whenever compatibility, event timing, or edge-case behavior matters because the proposal is still evolving.

Read `references/spec-notes.md` before making changes. Use the notes for the normal workflow, then verify subtle details against the live explainer when needed.

## Workflow

1. Confirm the feature is experimental in the target environment.
2. Add or preserve a fallback path for browsers without the proposal APIs.
3. Keep the DOM structure valid for the proposal before writing drawing code.
4. Draw in `paint`-driven code and synchronize the DOM transform with the drawn location.
5. Resize the canvas grid in device pixels to avoid blur.
6. Verify constraints around snapshots, privacy, and direct-child requirements.

## Implementation Rules

- Opt in with `<canvas layoutsubtree>`. Without that attribute, do not assume descendants can be laid out or drawn.
- Draw only direct children of the canvas. If an element is nested deeper, restructure the DOM or wrap the subtree in a direct child.
- Refuse to rely on `display: none` elements; they do not generate boxes and are not valid draw sources.
- Prefer `canvas.onpaint` or a `paint` event listener for rendering that must affect the current frame. Outside that event, `drawElementImage()` uses the previous snapshot.
- Expect `drawElementImage()` to throw before the first snapshot exists. Avoid calling it too early in initialization.
- Apply the returned transform to `element.style.transform` or compute it with `getElementTransform()` so hit testing, accessibility, and DOM position stay aligned with the drawn content.
- Remember that CSS transforms on the source element are ignored for drawing even though they still affect DOM behavior.
- Clear or reset the 2D context before repainting when the scene should be redrawn from scratch.
- Resize `canvas.width` and `canvas.height` from a `ResizeObserver` using `device-pixel-content-box` when available so the canvas grid matches device pixels.
- Use `requestPaint()` when the scene needs another `paint` callback even though no child invalidation occurred.

## Task Patterns

### 2D Canvas

- Use `ctx.drawElementImage(element, dx, dy, ...)` inside `paint` for same-frame rendering.
- Keep a minimal direct-child DOM subtree inside the canvas and style that subtree like ordinary HTML.
- Update the element's CSS transform from the returned `DOMMatrix`.

### OffscreenCanvas and Workers

- Capture snapshots on the main thread with `canvas.captureElementImage(element)` during `paint`.
- Transfer the `ElementImage` to the worker, draw it onto an `OffscreenCanvas`, and send the resulting transform back to the main thread when the DOM position must stay synchronized.
- Close `ElementImage` objects when the lifetime is over if resource cleanup matters.

### WebGL and WebGPU

- Use `texElementImage2D` for WebGL and `copyElementImageToTexture` for WebGPU when the task is about texturing or effects in 3D pipelines.
- Re-check the explainer before asserting exact signatures or support status because those APIs are the most likely to shift.

## Fallback and Review Guidance

- Feature-detect before use. For example, verify `canvas.layoutSubtree !== undefined`, `'drawElementImage' in ctx`, or `'requestPaint' in canvas` instead of assuming support.
- If the user asks for production-ready code, keep a fallback DOM or conventional canvas rendering path.
- If a bug report mentions stale frames, missing updates, or mismatched hit testing, inspect `paint` timing, first-snapshot timing, and transform synchronization first.
- If a bug report mentions invisible content, check that the source is a direct child, not `display: none`, and that the code actually draws it into the canvas.
- If a bug report mentions blurry output, inspect canvas intrinsic size versus CSS size before changing layout code.

## Reference Map

- `references/spec-notes.md`: distilled notes from the explainer, including primitives, timing, privacy limits, and a minimal implementation pattern.
- Live explainer: `https://wicg.github.io/html-in-canvas/`. Re-open it for exact wording, browser-status claims, and edge cases because the proposal is a living document.
