<template>
    <div class="color-picker">
        <div class="scales">
            <div class="colors">
                <div
                    v-for="(c, i) in hues"
                    :key="i"
                    :style="{ 'background-color': toCssString(c) }"
                    :class="{ active: equalsHue(hue, c, 1 / 100) }"
                    @click="setHue(c)"
                ></div>
            </div>
            <div class="colors">
                <div
                    v-for="(c, i) in colors"
                    :key="i"
                    :style="{ 'background-color': toCssString(c) }"
                    :class="{ active: equals(modelValue, c) }"
                    @click="colorComp = c"
                ></div>
            </div>
        </div>
        <div class="display" :style="{ 'background-color': toCssString(modelValue) }"></div>
    </div>
</template>

<script lang="ts">
import { IPixelColor, PixelColor } from '@/model/pixel'

export default {
    data() {
        const hues: IPixelColor[] = []
        let hue = PixelColor.fromHSL(0, 1, 0.5)
        for (let i = 0; i < 16; i++) {
            const c = PixelColor.fromHSL(i / 16, 1, 0.5)
            hues.push(c)
            if (this.equalsHue(this.modelValue, c)) hue = c
        }
        return {
            hues,
            hue,
        }
    },
    props: {
        modelValue: { type: PixelColor },
    },
    computed: {
        colorComp: {
            get(): IPixelColor {
                return this.modelValue
            },
            set(v: IPixelColor) {
                this.$emit('update:modelValue', v)
            },
        },
        colors(): IPixelColor[] {
            const r = []
            const h = PixelColor.toHSL(this.hue).h
            for (let i = 0; i < 16; i++) {
                r.push(PixelColor.fromHSL(h, 1, i / 15))
            }
            return r
        },
    },
    methods: {
        toCssString(c: IPixelColor) {
            return PixelColor.toCssString(c)
        },
        equals(c1: IPixelColor, c2: IPixelColor) {
            return PixelColor.equals(c1, c2)
        },
        equalsHue(c1: IPixelColor, c2: IPixelColor, tolerance: number = 1 / 18) {
            return PixelColor.equalsHue(c1, c2, tolerance)
        },
        setHue(c: IPixelColor) {
            this.hue = c
            this.colorComp = c
        },
    },
}
</script>
<style scoped>
.color-picker,
.colors {
    display: flex;
    flex-direction: row;
}

.display {
    height: 2em;
    width: 2em;
    border: 2px solid rgba(0, 0, 0, 0.5);
}

.colors div {
    display: inline-block;
    height: 1em;
    width: 0.6em;
    border: 0 solid rgba(0, 0, 0, 0.5);
}

.colors div.active {
    border-width: 1px;
    margin: 1px;
    height: calc(1em - 2px);
    width: calc(0.6em - 2px);
}
</style>
