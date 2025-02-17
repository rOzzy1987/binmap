import {
    ClassifyByteRenderer,
    ExtremeRenderer,
    GrayscaleRenderer,
    HeatmapRenderer,
    PixelRenderer,
    RGBARenderer,
    RGBRenderer,
} from './renderer-pixel'

export class VisualizationSettings {
    width: number = 128
    offset: number = 0
    step: number = 1
    zoom: number = 4
    pixelRenderer: PixelRenderer
    availableRenderers: PixelRenderer[]

    public constructor() {
        this.availableRenderers = [
            new RGBRenderer(),
            new RGBARenderer(),
            new GrayscaleRenderer(),
            new ClassifyByteRenderer(),
            new ExtremeRenderer(),
            new HeatmapRenderer(),
        ]
        this.pixelRenderer = this.availableRenderers[5]
    }
}
