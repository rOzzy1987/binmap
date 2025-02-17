import { PixelColor, type IPixelColor } from './pixel'

export abstract class PixelRenderer {
    public abstract render(data: Uint8Array, idx: number): IPixelColor
    public abstract get settings(): RendererSetting[]
    public abstract get skipBytes(): number
    public abstract get name(): string

    public abstract get description(): string
}

export class RendererSetting {
    public readonly type: 'color' | 'numeric' | 'string'
    public readonly name: string
    protected _value: number | string | object
    public readonly options: (number | string | object)[] = []
    public readonly toolTip: string | null = null

    public get value(): number | string | object {
        return this._value
    }
    public set value(v: number | string | object) {
        this._value = v
    }
    public get numValue(): number {
        return Number(this._value)
    }
    public set numValue(v: number) {
        this._value = v
    }
    public get strValue(): string {
        return '' + this._value
    }
    public set strValue(v: string) {
        this._value = v
    }
    public get colValue(): IPixelColor {
        return this._value as IPixelColor
    }
    public set colValue(v: IPixelColor) {
        this._value = v
    }

    public constructor(
        type: 'color' | 'numeric' | 'string',
        name: string,
        value: number | string | object,
        init: Partial<RendererSetting> = {},
    ) {
        this.type = type
        this.name = name
        this._value = value
        Object.assign(this, init)
    }
}

export class ClassifyByteRenderer extends PixelRenderer {
    public get description(): string {
        return 'Classifies bytes, then assigns specific colors to classes. Reads a single byte'
    }
    public get name(): string {
        return 'Byte classifier'
    }
    private _ctrlClr = new RendererSetting(
        'color',
        'Control bytes color',
        { r: 128, g: 0, b: 0 },
        { toolTip: 'Control bytes are bytes lower than 0x20 and 0x7F' },
    )
    private _prntClr = new RendererSetting(
        'color',
        'Printables color',
        { r: 223, g: 0, b: 0 },
        { toolTip: 'Anything that is not a letter, number, or control character' },
    )
    private _numClr = new RendererSetting(
        'color',
        'Numbers color',
        { r: 0, g: 32, b: 128 },
        { toolTip: 'Number characters 0-9' },
    )
    private _textClr = new RendererSetting(
        'color',
        'Latin alphabet color',
        {
            r: 64,
            g: 112,
            b: 255,
        },
        { toolTip: 'Latin alphabet a-z. No accents.' },
    )
    private _uppClr = new RendererSetting(
        'color',
        'Extended ASCII color',
        { r: 96, g: 191, b: 0 },
        { toolTip: 'Any byte above (and including) 0x80' },
    )

    public get settings(): RendererSetting[] {
        return [this._ctrlClr, this._prntClr, this._numClr, this._textClr, this._uppClr]
    }

    public get skipBytes() {
        return 1
    }

    public render(data: Uint8Array, idx: number): IPixelColor {
        const b = data[idx]
        if (b < 0x20) return this._ctrlClr.colValue
        if (b < 0x30) return this._prntClr.colValue
        if (b < 0x3a) return this._numClr.colValue
        if (b < 0x41) return this._prntClr.colValue
        if (b < 0x5b) return this._textClr.colValue
        if (b < 0x61) return this._prntClr.colValue
        if (b < 0x7b) return this._textClr.colValue
        if (b < 0x7f) return this._prntClr.colValue
        if (b < 0x80) return this._ctrlClr.colValue
        return this._uppClr.colValue
    }
}

export class RGBRenderer extends PixelRenderer {
    public get description(): string {
        return 'Creates RGB colors from 3 bytes'
    }
    public get name(): string {
        return 'RGB renderer'
    }
    protected _byteOrder = new RendererSetting('string', 'Byte order', 'RGB', {
        options: ['RGB', 'BGR', 'GRB', 'BRG', 'RBG', 'GBR'],
        toolTip: 'Sets which bytes are used for which color channel',
    })

    public get settings() {
        return [this._byteOrder]
    }

    public get skipBytes() {
        return 3
    }

    public render(data: Uint8Array, idx: number): IPixelColor {
        const b0 = data[idx]
        const b1 = data[++idx]
        const b2 = data[++idx]
        switch (this._byteOrder.strValue) {
            case 'BGR':
                return { r: b2, g: b1, b: b0 }
            case 'GRB':
                return { r: b1, g: b0, b: b2 }
            case 'BRG':
                return { r: b2, g: b0, b: b1 }
            case 'RBG':
                return { r: b0, g: b2, b: b1 }
            case 'GBR':
                return { r: b1, g: b2, b: b0 }
            default:
                return { r: b0, g: b1, b: b2 }
        }
    }
}

export class RGBARenderer extends PixelRenderer {
    public get description(): string {
        return 'Creates RGBA colors from 4 bytes'
    }
    public get name(): string {
        return 'RGBA renderer'
    }
    protected _byteOrder = new RendererSetting('string', 'Byte order', 'ARGB', {
        options: ['ARGB', 'BGRA', 'RGBA', 'ABGR'],
        toolTip: 'Sets which bytes are used for which color channel',
    })

    public get settings() {
        return [this._byteOrder]
    }

    public get skipBytes() {
        return 4
    }

    public render(data: Uint8Array, idx: number): IPixelColor {
        const b0 = data[idx]
        const b1 = data[++idx]
        const b2 = data[++idx]
        const b3 = data[++idx]
        switch (this._byteOrder.strValue) {
            case 'BGRA':
                return { r: b2, g: b1, b: b0, a: b3 }
            case 'RGBA':
                return { r: b0, g: b1, b: b2, a: b3 }
            case 'ABGR':
                return { r: b3, g: b2, b: b1, a: b0 }
            default:
                return { r: b1, g: b2, b: b3, a: b0 }
        }
    }
}

export class GrayscaleRenderer extends PixelRenderer {
    public get description(): string {
        return 'Creates a gray color from 1 byte'
    }
    public get name(): string {
        return 'Grayscale renderer'
    }

    public get settings() {
        return []
    }

    public get skipBytes() {
        return 1
    }

    public render(data: Uint8Array, idx: number): IPixelColor {
        const b0 = data[idx]
        return { r: b0, g: b0, b: b0 }
    }
}
export class ExtremeRenderer extends PixelRenderer {
    public get description(): string {
        return 'Marks extremities with specified colors'
    }

    private _defClr = new RendererSetting(
        'color',
        'Default color',
        { r: 0, g: 0, b: 0 },
        { toolTip: 'Color for all bytes not fitting other categories' },
    )
    private _minClr = new RendererSetting(
        'color',
        '0x00 color',
        { r: 255, g: 0, b: 0 },
        { toolTip: 'Color of bytes with 0x00 value' },
    )
    private _maxClr = new RendererSetting(
        'color',
        '0xFF color',
        { r: 0, g: 255, b: 0 },
        { toolTip: 'Color of bytes with 0xFF value' },
    )
    private _lowClr = new RendererSetting(
        'color',
        'Low color',
        { r: 64, g: 0, b: 0 },
        { toolTip: "Color of bytes lower than 'low threshold'" },
    )
    private _higClr = new RendererSetting(
        'color',
        'High color',
        { r: 0, g: 64, b: 0 },
        { toolTip: "Color of bytes higher than 'high threshold'" },
    )
    private _lowThr = new RendererSetting('numeric', 'Low threshold', 16)
    private _higThr = new RendererSetting('numeric', 'High threshold', 240)
    public get name(): string {
        return 'Extremes renderer'
    }

    public get settings() {
        return [
            this._minClr,
            this._maxClr,
            this._lowThr,
            this._lowClr,
            this._higThr,
            this._higClr,
            this._defClr,
        ]
    }

    public get skipBytes() {
        return 1
    }

    public render(data: Uint8Array, idx: number): IPixelColor {
        const b = data[idx]
        if (b == 0) return this._minClr.colValue
        if (b == 255) return this._maxClr.colValue
        if (b < this._lowThr.numValue) return this._lowClr.colValue
        if (b > this._higThr.numValue) return this._higClr.colValue
        return this._defClr.colValue
    }
}

export class HeatmapRenderer extends PixelRenderer {
    public get description(): string {
        return "Displays a 'heat map' of the file (Fancy Grayscale renderer)"
    }

    private _c0 = new RendererSetting('color', 'Color 1', { r: 0, g: 0, b: 64 })
    private _c1 = new RendererSetting('color', 'Color 2', { r: 0, g: 0, b: 192 })
    private _c2 = new RendererSetting('color', 'Color 3', { r: 255, g: 0, b: 0 })
    private _c3 = new RendererSetting('color', 'Color 4', { r: 255, g: 192, b: 0 })
    private _c4 = new RendererSetting('color', 'Color 5', { r: 255, g: 255, b: 255 })
    private _t1 = new RendererSetting('numeric', 'Threshold 1', 32, {
        toolTip: "Indicates the place of 'Color 2' on the gradient scale",
    })
    private _t2 = new RendererSetting('numeric', 'Threshold 2', 160, {
        toolTip: "Indicates the place of 'Color 3' on the gradient scale",
    })
    private _t3 = new RendererSetting('numeric', 'Threshold 3', 224, {
        toolTip: "Indicates the place of 'Color 4' on the gradient scale",
    })
    public get name(): string {
        return 'Heatmap renderer'
    }

    public get settings() {
        return [this._c0, this._c1, this._c2, this._c3, this._c4, this._t1, this._t2, this._t3]
    }

    public get skipBytes() {
        return 1
    }

    public render(data: Uint8Array, idx: number): IPixelColor {
        const b = data[idx]
        if (b < this._t1.numValue) {
            return PixelColor.lerp(this._c0.colValue, this._c1.colValue, b / this._t1.numValue)
        }
        if (b < this._t2.numValue) {
            return PixelColor.lerp(
                this._c1.colValue,
                this._c2.colValue,
                (b - this._t1.numValue) / (this._t2.numValue - this._t1.numValue),
            )
        }
        if (b < this._t3.numValue) {
            return PixelColor.lerp(
                this._c2.colValue,
                this._c3.colValue,
                (b - this._t2.numValue) / (this._t3.numValue - this._t2.numValue),
            )
        }

        return PixelColor.lerp(
            this._c3.colValue,
            this._c4.colValue,
            (b - this._t3.numValue) / (255 - this._t3.numValue),
        )
    }
}
