<template>
    <div class="draggable">
        <div class="message panel is-primary" :style="css" :class="{ closed: closed }">
            <p
                class="message-header has-text-white"
                :class="{ grabbed: grabbed, closed: closed }"
                @mousedown="mouseDown"
            >
                {{ title }}
                <button
                    class="button is-rounded has-icon is-small is-primary"
                    @click="closed = !closed"
                >
                    <span class="icon has-text-white">
                        <i class="fa fa-caret-up"></i>
                    </span>
                </button>
            </p>
            <div class="message-body">
                <slot v-if="!closed"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
interface IPos {
    x: number
    y: number
}

export default {
    data() {
        const mousePos: IPos | null = null
        const pos: IPos = { x: 0, y: 0 }
        const el: HTMLElement = null!
        return {
            pos,
            mousePos,
            grabbed: false,
            closed: false,
            el,
        }
    },
    props: {
        title: { type: String, required: false },
    },
    mounted() {
        this.el = this.$refs.element as HTMLElement
        document.addEventListener('mouseup', (e) => this.mouseUp(e))
        document.addEventListener('mousemove', (e) => this.mouseMove(e))
    },
    methods: {
        mouseDown(e: MouseEvent) {
            e.preventDefault()
            // get the mouse cursor position at startup:
            this.grabbed = true
            this.mousePos = { x: e.clientX, y: e.clientY }
        },

        mouseMove(e: MouseEvent) {
            e.preventDefault()

            if (this.mousePos === null) return

            // calculate the new cursor position:
            const delta = { x: e.clientX - this.mousePos.x, y: e.clientY - this.mousePos.y }
            this.pos.x += delta.x
            this.pos.y += delta.y
            this.mousePos = { x: e.clientX, y: e.clientY }
        },
        mouseUp() {
            this.grabbed = false
            this.mousePos = null
        },
    },
    computed: {
        css() {
            return {
                left: this.pos.x + 'px',
                top: this.pos.y + 'px',
            }
        },
    },
}
</script>

<style scoped>
.draggable {
    position: absolute;
    height: 0;
    z-index: 100;
}

.draggable .panel {
    position: relative;
}

.message-header {
    cursor: grab;
    min-width: 250px;
}

.message-header.grabbed {
    cursor: grabbing;
}

.message-header button .icon {
    transform: rotate(0deg);
}

.message-header.closed button .icon {
    transform: rotate(180deg);
}
</style>
