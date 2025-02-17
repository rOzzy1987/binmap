<template>
    <div class="mono is-family-monospace" @wheel="scrolled">
        <div class="row hdr">
            <span class="addr">
                <span v-if="focus != -1">0x{{ focus.toString(16).toUpperCase().padStart(8, '0') }}</span>
            </span>
            <span class="hex">
                <span class="col0">00</span>
                <span class="col1">01</span>
                <span class="col2">02</span>
                <span class="col3">03</span>
                <span class="col4">04</span>
                <span class="col5">05</span>
                <span class="col6">06</span>
                <span class="col7">07</span>
                <span class="col8">08</span>
                <span class="col9">09</span>
                <span class="col10">0A</span>
                <span class="col11">0B</span>
                <span class="col12">0C</span>
                <span class="col13">0D</span>
                <span class="col14">0E</span>
                <span class="col15">0F</span>
            </span>
        </div>
        <div class="row" v-for="(ro, i) in rowArr" :key="i">
            <span class="addr">0x{{ ro.toString(16).toUpperCase().padStart(8, '0') }}</span>
            <span class="hex has-text-weight-bold">
                <span v-for="i in Array(16).keys()" :key="ro + 'c' + i" :class="'col' + i">
                    <span :class="{ focused: ro + i == focus }" @click="setFocus(ro + i)">
                        {{
                            binary[ro + i]
                                ?.toString(16)
                                .toUpperCase()
                                .padStart(2, '0')
                                .substring(0, 2)
                        }}
                    </span>
                </span>
            </span>
            <span class="raw">
                <span v-for="i in Array(16).keys()" :key="ro + 'c' + i" :class="'col' + i">
                    {{
                        binary[ro + i] < 0x20 || binary[ro + i] == 0x7f ? '.' : String.fromCharCode(binary[ro + i]) }} </span>
                </span>
        </div>
    </div>
</template>

<script lang="ts">
import { VisualizationSettings } from '@/model/vis-settings'

export default {
    data() {
        return {
            offset: 0,
            wheelSteps: 4,
        }
    },
    props: {
        binary: { type: Uint8Array, required: true },
        settings: { type: VisualizationSettings, required: true },
        rows: { type: Number, default: 48 },
        focus: { type: Number, default: -1 },
    },
    computed: {
        rowArr(): number[] {
            const r = []
            let c = this.offset
            for (let i = 0; i < this.rows; i++) {
                r.push(c)
                c += 16
            }
            return r
        },
    },
    methods: {
        scrolled(e: WheelEvent) {
            this.offset +=
                (e.deltaY > 0 ? Math.ceil(e.deltaY / 100) : Math.floor(e.deltaY / 100)) *
                this.wheelSteps *
                16
            this.normalizeOffset()
        },
        normalizeOffset() {
            if (this.offset > Math.ceil(this.binary.length / 16) - this.rows)
                this.offset = Math.ceil(this.binary.length / 16) - this.rows
            if (this.offset < 0) this.offset = 0
        },
        setFocus(v: number) {
            this.$emit('update:focus', v)
        },
    },
    watch: {
        focus(nv: number) {
            if (nv == -1) return
            let o = Math.floor(nv / 16) * 16
            o -= this.rows * 8
            this.offset = o
            this.normalizeOffset()
        },
    },
}
</script>
<style>
.mono {
    white-space: pre;
}

.mono * {
    cursor: default !important;
}

.row {
    font-size: 12px;
    line-height: 16px;
    margin: 0;
    padding: 0;
}

.row:has(.focused),
.mono:has(.col0 .focused) .hex .col0,
.mono:has(.col1 .focused) .hex .col1,
.mono:has(.col2 .focused) .hex .col2,
.mono:has(.col3 .focused) .hex .col3,
.mono:has(.col4 .focused) .hex .col4,
.mono:has(.col5 .focused) .hex .col5,
.mono:has(.col6 .focused) .hex .col6,
.mono:has(.col7 .focused) .hex .col7,
.mono:has(.col8 .focused) .hex .col8,
.mono:has(.col9 .focused) .hex .col9,
.mono:has(.col10 .focused) .hex .col10,
.mono:has(.col11 .focused) .hex .col11,
.mono:has(.col12 .focused) .hex .col12,
.mono:has(.col13 .focused) .hex .col13,
.mono:has(.col14 .focused) .hex .col14,
.mono:has(.col15 .focused) .hex .col15 {
    background-color: #fdd;
}

.row:has(.col0 .focused) .col0,
.row:has(.col1 .focused) .col1,
.row:has(.col2 .focused) .col2,
.row:has(.col3 .focused) .col3,
.row:has(.col4 .focused) .col4,
.row:has(.col5 .focused) .col5,
.row:has(.col6 .focused) .col6,
.row:has(.col7 .focused) .col7,
.row:has(.col8 .focused) .col8,
.row:has(.col9 .focused) .col9,
.row:has(.col10 .focused) .col10,
.row:has(.col11 .focused) .col11,
.row:has(.col12 .focused) .col12,
.row:has(.col13 .focused) .col13,
.row:has(.col14 .focused) .col14,
.row:has(.col15 .focused) .col15 {
    background-color: #f88;
}

.row:hover,
.mono:has(.col0:hover) .hex .col0,
.mono:has(.col1:hover) .hex .col1,
.mono:has(.col2:hover) .hex .col2,
.mono:has(.col3:hover) .hex .col3,
.mono:has(.col4:hover) .hex .col4,
.mono:has(.col5:hover) .hex .col5,
.mono:has(.col6:hover) .hex .col6,
.mono:has(.col7:hover) .hex .col7,
.mono:has(.col8:hover) .hex .col8,
.mono:has(.col9:hover) .hex .col9,
.mono:has(.col10:hover) .hex .col10,
.mono:has(.col11:hover) .hex .col11,
.mono:has(.col12:hover) .hex .col12,
.mono:has(.col13:hover) .hex .col13,
.mono:has(.col14:hover) .hex .col14,
.mono:has(.col15:hover) .hex .col15 {
    background-color: #dfd;
}

.row:has(.col0:hover) .col0,
.row:has(.col1:hover) .col1,
.row:has(.col2:hover) .col2,
.row:has(.col3:hover) .col3,
.row:has(.col4:hover) .col4,
.row:has(.col5:hover) .col5,
.row:has(.col6:hover) .col6,
.row:has(.col7:hover) .col7,
.row:has(.col8:hover) .col8,
.row:has(.col9:hover) .col9,
.row:has(.col10:hover) .col10,
.row:has(.col11:hover) .col11,
.row:has(.col12:hover) .col12,
.row:has(.col13:hover) .col13,
.row:has(.col14:hover) .col14,
.row:has(.col15:hover) .col15 {
    background-color: #8f8;
}

.addr,
.hex,
.raw {
    margin: 0 12px;
}

.mono span {
    display: inline-block;
    height: 100%;
}

.hex>span {
    margin-right: 8px;
}

.hex span:nth-child(5),
.hex span:nth-child(9),
.hex span:nth-child(13) {
    margin-left: 8px;
}

.addr {
    width: 80px;
    text-align: right;
}

.hex {
    width: 360px;
    color: var(--binmap-accent);
}

.row.hdr {
    margin-bottom: 8px;
}

.row.hdr .hex,
.addr {
    color: var(--binmap-accent-dark);
}

.raw {
    color: var(--binmap-accent-light);
}
</style>
