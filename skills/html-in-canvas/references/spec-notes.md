# HTML-in-Canvas Spec Notes

Source of truth: `https://wicg.github.io/html-in-canvas/`

Use this file as the quick reference. Re-open the live explainer when exact compatibility or API wording matters because the proposal is still a living document.

## Core Primitives

- `layoutsubtree` on `<canvas>` opts descendants into layout and hit testing. Child content is not visible until you explicitly draw it into the canvas.
- `drawElementImage()` draws a direct canvas child into a 2D context and returns a `DOMMatrix` transform that can be applied back to the DOM element.
- `paint` fires when canvas children change. Drawing work performed there affects the current frame; DOM mutations made there do not appear until the next frame.
- `requestPaint()` schedules a one-off `paint` callback even when children did not change.
- `captureElementImage()` creates a transferable `ElementImage` snapshot for worker and `OffscreenCanvas` workflows.
- `getElementTransform()` derives the CSS transform needed to keep DOM and drawn positions aligned.
- WebGL and WebGPU variants exist as `texElementImage2D` and `copyElementImageToTexture`.

## Constraints and Gotchas

- The drawable source must be a direct child of the canvas in the most recent rendering update.
- The source must generate boxes. Do not use `display: none`.
- CSS transforms on the source element are ignored when drawing, but still affect hit testing and accessibility, so transform synchronization matters.
- Overflow is clipped to the element border box.
- Calling `drawElementImage()` before the first snapshot exists throws.
- Calling `drawElementImage()` outside `paint` uses the previous frame snapshot.

## Minimal 2D Pattern

```html
<canvas id="canvas" style="width: 400px; height: 200px;" layoutsubtree>
  <form id="formElement">
    <label for="name">name:</label>
    <input id="name" />
  </form>
</canvas>
<script>
  const canvas = document.getElementById("canvas");
  const formElement = document.getElementById("formElement");
  const ctx = canvas.getContext("2d");

  canvas.onpaint = () => {
    ctx.reset();
    const transform = ctx.drawElementImage(formElement, 100, 0);
    formElement.style.transform = transform.toString();
  };

  const observer = new ResizeObserver(([entry]) => {
    const size = entry.devicePixelContentBoxSize?.[0];
    if (!size) return;
    canvas.width = size.inlineSize;
    canvas.height = size.blockSize;
  });

  observer.observe(canvas, { box: "device-pixel-content-box" });
<\/script>
```

## Worker Pattern

- Capture `ElementImage` during `paint` on the main thread.
- Transfer it to a worker that owns an `OffscreenCanvas`.
- Draw with `drawElementImage()` in the worker.
- Send the resulting transform back to the main thread and apply it to the original DOM element.
- Call `requestPaint()` after size changes or when another frame is needed without child invalidation.

## Privacy and Security Limits

- Do not expect cross-origin pixels to become readable.
- Do not rely on visited-link state, system theme details, spelling markers, or pending autofill state appearing in snapshots.
- Same-origin content may render, but cross-origin embedded content and URL-based resources are restricted.

## Review Checklist

- Check for a guarded fallback path.
- Check that `layoutsubtree` is present on the canvas.
- Check that drawn elements are direct children.
- Check that canvas intrinsic size tracks device pixels.
- Check that `paint` is used for current-frame updates.
- Check that returned transforms are applied back to the DOM.
