import { VisualizationSettings } from './vis-settings'

export class BinaryRenderer {
    static RenderBitmap(
        binary: Uint8Array,
        settings: VisualizationSettings,
        h: number,
    ): ImageData | null {
        const w = settings.width
        if (w == 0 || h == 0) return null
        const img = new ImageData(w, h)

        let srcIdx = settings.offset
        let idx = 0
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const c =
                    binary.length <= srcIdx + settings.pixelRenderer.skipBytes
                        ? { r: 0, g: 0, b: 0 }
                        : settings.pixelRenderer.render(binary, srcIdx)
                img.data[idx++] = c.r
                img.data[idx++] = c.g
                img.data[idx++] = c.b
                img.data[idx++] = c.a == null ? 255 : Math.round(c.a)
                srcIdx += settings.step
            }
        }
        return img
    }
}
