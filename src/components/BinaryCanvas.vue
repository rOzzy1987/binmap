<template>
    <div
        class="binary-canvas"
        @wheel="mouseWheel"
        @click="setFocus"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
        <div class="focus" v-if="focus != -1" :style="focusStyle">
            <div></div>
        </div>
        <canvas :width="canvasWidth" :height="canvasHeight" ref="cnv"> </canvas>
    </div>
</template>

<script lang="ts">
import { BinaryRenderer } from '@/model/renderer-bitmap'
import { VisualizationSettings } from '@/model/vis-settings'
export default {
    props: {
        settings: { type: VisualizationSettings, required: true },
        binary: { type: Uint8Array, required: true },
        maxHeight: { type: Number, default: 800 },
        focus: { type: Number, default: -1 },
    },
    methods: {
        setFocus(e: MouseEvent) {
            if ((e.target as HTMLElement).tagName != 'CANVAS') return
            const z = this.settings.zoom
            const x = Math.floor(e.offsetX / z)
            const y = Math.floor(e.offsetY / z)
            const w = this.settings.width
            const s = this.settings.step
            const o = this.settings.offset + (x + y * w) * s
            this.$emit('update:focus', o)
        },
        async render() {
            const cnv = this.$refs['cnv'] as HTMLCanvasElement

            const ctx = cnv.getContext('2d')
            if (ctx == null) return

            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

            const data = BinaryRenderer.RenderBitmap(this.binary, this.settings, this.height)
            if (data != null) {
                const img = await window.createImageBitmap(data)

                ctx.imageSmoothingEnabled = false
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const actx = ctx as any
                actx.webkitImageSmoothingEnabled = false
                actx.mozImageSmoothingEnabled = false

                ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight)
            }
        },
        mouseWheel(e: WheelEvent) {
            function normalize(x: number): number {
                return x > 0 ? Math.ceil(x / 100) : Math.floor(x / 100)
            }

            const dx = normalize(e.deltaX != 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0)
            const dy = normalize(!e.shiftKey ? e.deltaY : 0) * Math.ceil(16 / this.settings.zoom)
            const d = (dx + dy * this.settings.width) * this.settings.step

            const o = Math.max(0, Math.min(this.settings.offset + d, this.binary.length))
            this.$emit('update:settings', { ...this.settings, ...{ offset: o } })
        },
    },
    mounted() {
        this.render()
    },
    computed: {
        width() {
            return this.settings.width
        },
        height() {
            return Math.floor(this.canvasHeight / this.settings.zoom)
        },
        canvasWidth() {
            return this.width * this.settings.zoom
        },
        canvasHeight() {
            const l = this.binary.length
            const z = this.settings.zoom
            const w = this.settings.width
            const s = this.settings.step
            const mh = this.maxHeight
            const ch = Math.ceil(l / (w * s)) * z
            return Math.min(ch, mh)
        },
        focusStyle() {
            const f = this.focus - this.settings.offset
            const step = this.settings.step
            const stride = this.settings.width * this.settings.step
            const zoom = this.settings.zoom
            return {
                top: Math.floor(f / stride) * zoom - 2 + 'px',
                left: ((f % stride) * zoom) / step - 2 + 'px',
                width: zoom + 4 + 'px',
                height: zoom + 4 + 'px',
            }
        },
    },
    watch: {
        settings: {
            handler: function () {
                this.render()
            },
            deep: true,
        },
    },
}
</script>

<style scoped>
.binary-canvas {
    position: relative;
    background: url('checker.svg');
}

.focus {
    position: absolute;
    border: 1px solid black;
}

.focus div {
    border: 1px solid white;
    width: 100%;
    height: 100%;
}
</style>
