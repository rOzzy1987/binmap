export interface IPixelColor {
    r: number
    g: number
    b: number
    a?: number
}

export class PixelColor implements IPixelColor {
    r: number
    g: number
    b: number
    a?: number

    public constructor(init: Partial<PixelColor> = {}) {
        Object.assign(this, init)
    }

    public toString() {
        return `[${this.r.toFixed(0).padStart(3, ' ')},${this.g.toFixed(0).padStart(3, ' ')},${this.b.toFixed(0).padStart(3, ' ')}]`
    }

    static fromHSL(h: number, s: number, l: number): IPixelColor {
        return this.hsl2rgb(h, s, l)
    }

    static equals(
        c1: IPixelColor,
        c2: IPixelColor,
        compareAlpha: boolean = false,
        tolerance: number = 8,
    ): boolean {
        if (c1 == null && c2 == null) return true
        if (c1 == null || c2 == null) return false
        function cmp(a, b, t = tolerance) {
            return Math.abs(a - b) < t
        }
        return (
            cmp(c1.r, c2.r) &&
            cmp(c1.g, c2.g) &&
            cmp(c1.b, c2.b) &&
            (!compareAlpha || cmp(c1.a, c2.a, 0.05))
        )
    }

    private static add(c1: IPixelColor, c2: IPixelColor) {
        return new PixelColor({ r: c1.r + c2.r, g: c1.g + c2.g, b: c1.b + c2.b })
    }
    private static neg(c: IPixelColor) {
        return new PixelColor({ r: -c.r, g: -c.g, b: -c.b })
    }
    private static mul(c: IPixelColor, n: number) {
        return new PixelColor({
            r: Math.round(c.r * n),
            g: Math.round(c.g * n),
            b: Math.round(c.b * n),
        })
    }

    static lerp(c1: IPixelColor, c2: IPixelColor, n: number) {
        return this.add(c1, this.mul(this.add(c2, this.neg(c1)), n))
    }

    static equalsHue(c1: IPixelColor, c2: IPixelColor, tolerance: number = 1 / 16): boolean {
        const h1 = this.toHSL(c1).h
        const h2 = this.toHSL(c2).h
        const res = Math.abs(h1 - h2) < tolerance
        return res
    }

    static toHSL(c: IPixelColor): { h: number; s: number; l: number } {
        return this.rgb2hsl(c)
    }

    static toCssString(c: IPixelColor) {
        return c.a == null ? `rgb(${c.r}, ${c.g}, ${c.b})` : `rgba(${c.r},${c.g},${c.b},${c.a})`
    }

    /*
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns HSL in the set [0, 1].
     */
    private static rgb2hsl(c: IPixelColor) {
        let r = c.r,
            g = c.g,
            b = c.b,
            h = 0,
            s = 0,
            l = 0

        r /= 255
        g /= 255
        b /= 255
        const min = Math.min(r, g, b),
            max = Math.max(r, g, b)

        h = s = l = (max + min) / 2

        if (max == min) {
            h = s = 0 // achromatic
        } else {
            const d = max - min
            s = d / (1 - Math.abs(2 * l - 1))
            // s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            if (max == r) {
                h = (g - b) / d + (g < b ? 6 : 0)
            } else if (max == g) {
                h = (b - r) / d + 2
            } else if (max == b) {
                h = (r - g) / d + 4
            }

            h /= 6
        }

        return { h, s, l }
    }

    private static hsl2rgb(h: number, s: number, l: number): IPixelColor {
        let r = 0,
            g = 0,
            b = 0
        if (0 == s) {
            r = g = b = l // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            r = this.hue2rgb(p, q, h + 1 / 3) * 255
            g = this.hue2rgb(p, q, h) * 255
            b = this.hue2rgb(p, q, h - 1 / 3) * 255
        }

        return { r, g, b }
    }
    private static hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

        return p
    }
}
