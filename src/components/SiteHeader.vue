<template>
    <header class="binmap-nav has-text-white">
        <div class="container">
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <div>
                            <p class="title is-uppercase">
                                <span class="has-text-primary">Bin</span
                                ><span class="has-text-white">Map</span>
                            </p>
                            <p class="heading">Binary file visualizer</p>
                        </div>
                    </div>
                </div>
                <div class="level-right" v-if="file == null && !dragging">
                    <div class="level-item">
                        <div class="has-text-right has-text-weight-light">
                            <p class="">upload file</p>
                            <p class="is-size-7">or drag & drop here</p>
                        </div>
                    </div>
                    <div class="level-item">
                        <ToolTip
                            >The file will only be used locally, it will not leave your
                            browser.</ToolTip
                        >
                    </div>
                    <div class="level-item">
                        <button
                            class="button has-icon is-primary"
                            title="Upload binary"
                            @click="uploadClicked"
                        >
                            <i class="fas fa-upload"></i>
                        </button>

                        <input
                            type="file"
                            id="file-upload"
                            hidden
                            @change="fileSelected"
                            ref="fileInput"
                        />
                    </div>
                </div>
                <div class="level-right" v-if="file == null && dragging">
                    <div class="level-item">
                        <div class="drop-zone" @drop="drop">
                            <span>Drop here</span>
                        </div>
                    </div>
                </div>
                <div class="level-right" v-if="file !== null">
                    <div class="level-item">
                        <div class="has-text-right has-text-weight-light">
                            <p class="">{{ file.name }}</p>
                            <p class="is-size-7">
                                {{
                                    file.size > 1024
                                        ? file.size > 1024 * 1024
                                            ? (file.size / (1024 * 1024)).toFixed(1) + ' Mb'
                                            : (file.size / 1024).toFixed(1) + ' kb'
                                        : file.size + ' b'
                                }}
                            </p>
                        </div>
                    </div>
                    <div class="level-item">
                        <button class="button has-icon is-danger is-dark" @click="closeClicked">
                            <i class="fas fa-close"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script lang="ts">
import { BinaryFile } from '../model/file'
import ToolTip from './ToolTip.vue'
export default {
    data() {
        return {
            dragging: false,
        }
    },
    props: {
        file: { type: BinaryFile, required: false },
    },
    mounted() {
        //  @dragenter="prevent" @dragleave="dragLeave" @dragover="dragOver"
        window.addEventListener('dragenter', this.prevent)
        window.addEventListener('dragleave', this.dragLeave)
        window.addEventListener('dragover', this.dragOver)
        window.addEventListener('drop', this.prevent)
    },
    methods: {
        closeClicked() {
            this.fileComp = null
        },
        uploadClicked() {
            ;(this.$refs.fileInput as HTMLInputElement).click()
        },
        fileSelected() {
            const files = (this.$refs.fileInput as HTMLInputElement)?.files
            if (files.length == 0) return
            this.loadFile(files[0])
        },
        prevent(ev: UIEvent) {
            ev.preventDefault()
            ev.stopPropagation()
        },
        dragOver(ev: UIEvent) {
            this.prevent(ev)
            this.dragging = true
        },
        dragLeave(ev: UIEvent) {
            this.prevent(ev)
            this.dragging = false
        },
        drop(ev: DragEvent) {
            this.prevent(ev)
            this.dragging = false
            console.log(ev)

            if (ev.dataTransfer?.items) {
                const item = ev.dataTransfer.items[0]
                const file = item.getAsFile()
                if (file == null) return
                this.loadFile(file)
            } else if (ev.dataTransfer?.files) {
                const file = ev.dataTransfer.files[0]
                this.loadFile(file)
            }
        },
        loadFile(file: File) {
            const reader = new FileReader()
            reader.onloadend = (e: ProgressEvent<FileReader>) => {
                const f = new BinaryFile()
                const buf = e.target?.result as ArrayBuffer
                f.bytes = new Uint8Array(buf, 0, buf.byteLength)
                f.name = file.name
                f.size = f.bytes.length
                this.fileComp = f
            }
            reader.readAsArrayBuffer(file)
        },
    },
    computed: {
        fileComp: {
            get(): BinaryFile | null {
                return this.file
            },
            set(v: BinaryFile | null) {
                this.$emit('update:file', v)
            },
        },
        draggingComp: {
            get(): boolean {
                return this.dragging
            },
            set(v: boolean) {
                this.$emit('update:dragging', v)
            },
        },
    },
    components: { ToolTip },
}
</script>

<style scoped>
.binmap-nav {
    padding: 1rem;
    background-color: #021;
}

.drop-zone {
    border: 2px dashed var(--binmap-accent);
    border-radius: 12px;
    padding: 12px;
    width: 250px;
    text-align: center;
}

.drop-zone * {
    opacity: 0.3;
}
</style>
