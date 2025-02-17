<template>
    <input type="text" class="input" v-model="valueComp" @wheel="scrolled" />
</template>
<script lang="ts">
export default {
    props: {
        modelValue: { type: Number, required: true },
        wheelSteps: { type: Number, default: 1 },
        ctrlSteps: { type: Number, default: 1 },
        altSteps: { type: Number, default: 1 },
        min: { type: Number, default: 0 },
        max: { type: Number },
    },
    methods: {
        scrolled(e: WheelEvent) {
            e.preventDefault()
            const v = e.deltaY > 0 ? Math.ceil(e.deltaY / 100) : Math.floor(e.deltaY / 100)
            const m = e.ctrlKey ? this.ctrlSteps : e.altKey ? this.altSteps : this.wheelSteps
            this.valueComp -= v * m
            return false
        },
    },
    computed: {
        valueComp: {
            get(): number {
                return this.modelValue
            },
            set(v: string) {
                let nv = Number(v)
                if (Number.isNaN(nv)) this.$emit('update:modelValue', this.value)
                nv = Math.round(nv)
                if (this.max > 0 && nv > this.max) nv = this.max
                if (nv < this.min) nv = this.min
                this.$emit('update:modelValue', nv)
            },
        },
    },
}
</script>
