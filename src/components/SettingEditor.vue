<template>
    <div>
        <p class="has-text-weight-light help setting-section-title"><span>General</span></p>
        <div class="block">
            <div class="field">
                <label class="label is-small">
                    Image width
                    <ToolTip
                        >Use mouse scroll wheel to increase/decrease. Use <i class="key">Ctrl</i> or
                        <i class="key">Alt</i> to use different steps
                    </ToolTip>
                </label>
                <div class="control">
                    <NumericField
                        v-model="widthComp"
                        :min="1"
                        :max="8192"
                        :wheel-steps="8"
                        :alt-steps="32"
                        class="is-small"
                    />
                </div>
            </div>
        </div>
        <div class="block">
            <div class="field">
                <label class="label is-small"
                    >Byte offset
                    <ToolTip>Number of bytes skipped before rendering the image</ToolTip>
                </label>
                <div class="control">
                    <NumericField
                        v-model="offsetComp"
                        :min="0"
                        :wheel-steps="settings.step"
                        :alt-steps="settings.width * settings.step"
                        class="is-small"
                    />
                </div>
            </div>
        </div>
        <div class="block">
            <div class="field">
                <label class="label is-small"
                    >Step
                    <ToolTip>Number of bytes stepped forward after rendering a pixel</ToolTip>
                </label>
                <div class="control">
                    <NumericField v-model="stepComp" :min="1" :max="8" class="is-small" />
                </div>
            </div>
        </div>
        <div class="block">
            <div class="field">
                <label class="label is-small">Zoom</label>
                <div class="control">
                    <NumericField v-model="zoomComp" :min="1" :max="8" class="is-small" />
                </div>
            </div>
        </div>
        <p class="has-text-weight-light help setting-section-title"><span>Rendering</span></p>
        <div class="block">
            <div class="field">
                <label class="label is-small">Renderer</label>
                <div class="control">
                    <div class="select is-small">
                        <select v-model="rendererComp">
                            <option
                                v-for="(e, i) in settings.availableRenderers"
                                :key="i"
                                :value="e"
                            >
                                {{ e.name }}
                            </option>
                        </select>
                    </div>
                    <p class="help">{{ rendererComp.description }}</p>
                </div>
            </div>
        </div>
        <p class="has-text-weight-light help setting-section-title">
            <span>{{ rendererComp.name }}</span>
        </p>
        <div class="block">
            <div class="field" v-for="(s, i) in rendererComp.settings" :key="i">
                <label class="label is-small"
                    >{{ s.name }}
                    <ToolTip v-if="s.toolTip != null">{{ s.toolTip }}</ToolTip>
                </label>
                <div class="control">
                    <div class="select is-small" v-if="s.options?.length > 0">
                        <select v-model="s.value">
                            <option v-for="(o, io) in s.options" :key="`${i}${io}`" :value="o">
                                {{ o }}
                            </option>
                        </select>
                    </div>
                    <NumericField
                        v-else-if="s.type == 'numeric'"
                        v-model="s.numValue"
                        class="is-small"
                    />
                    <ColorField
                        v-else-if="s.type == 'color'"
                        v-model="s.colValue"
                        class="is-small"
                    />
                    <input
                        v-else-if="s.type == 'string'"
                        type="text"
                        class="input is-small"
                        v-model="s.strValue"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { VisualizationSettings } from '@/model/vis-settings'
import NumericField from './NumericField.vue'
import ColorField from './ColorField.vue'
import ToolTip from './ToolTip.vue'
import { PixelRenderer } from '@/model/renderer-pixel'

export default {
    props: {
        settings: { type: VisualizationSettings },
    },
    watch: {
        'settings.pixelRenderer': {
            handler(nv: PixelRenderer) {
                this.stepComp = nv.skipBytes
            },
        },
    },
    computed: {
        widthComp: {
            get(): number {
                return this.settings.width
            },
            set(v: number) {
                this.$emit('update:settings', { ...this.settings, ...{ width: v } })
            },
        },
        offsetComp: {
            get(): number {
                return this.settings.offset
            },
            set(v: number) {
                this.$emit('update:settings', { ...this.settings, ...{ offset: v } })
            },
        },
        stepComp: {
            get(): number {
                return this.settings.step
            },
            set(v: number) {
                this.$emit('update:settings', { ...this.settings, ...{ step: v } })
            },
        },
        zoomComp: {
            get(): number {
                return this.settings.zoom
            },
            set(v: number) {
                this.$emit('update:settings', { ...this.settings, ...{ zoom: v } })
            },
        },
        rendererComp: {
            get(): PixelRenderer {
                return this.settings.pixelRenderer
            },
            set(v: PixelRenderer) {
                this.$emit('update:settings', { ...this.settings, ...{ pixelRenderer: v } })
            },
        },
    },
    components: { NumericField, ColorField, ToolTip },
}
</script>

<style scoped>
.setting-section-title {
    margin: calc(var(--bulma-help-size) / 2) 0;
    height: 0;
    text-align: right;
    border-bottom: var(--bulma-hr-height) solid var(--bulma-hr-background-color);
}

.select,
select {
    width: 100%;
}

.help {
    text-wrap: wrap;
    text-wrap-mode: wrap;
    max-width: 200px;
}
</style>
