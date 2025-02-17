<template>
    <SiteHeader v-model:file="file" />
    <main class="block">
        <DraggableDiv v-if="file !== null" title="Settings" style="right: 20px">
            <SettingEditor v-model:settings="settings" />
        </DraggableDiv>
        <div class="work-area" v-if="file !== null">
            <div class="work-area box">
                <div>
                    <BinaryCanvas
                        v-model:binary="file.bytes"
                        v-model:settings="settings"
                        v-model:focus="focus"
                    />
                    <!-- Bitmap -->
                </div>
                <div>
                    <SourceViewer
                        :binary="file.bytes"
                        v-model:settings="settings"
                        v-model:focus="focus"
                    />
                    <!-- Source -->
                </div>
            </div>
        </div>
        <div class="container is-size-7" v-if="file !== null">
            <div class="box">
                <p class="block">
                    Click on the image to highlight the pixel in the hex viewer. <br />
                    Click on the hex viewer to highlight the byte on the image. <br />
                    Grab the settings panel by the header and move it where comfortable. <br />
                    Use <i class="key">mouse scroll</i> or <i class="key">Shift + scroll</i> to
                    scroll within the image or hex viewer
                </p>
            </div>
        </div>
    </main>
    <SiteFooter />
</template>

<script lang="ts">
import DraggableDiv from './components/DraggableDiv.vue'
import SettingEditor from './components/SettingEditor.vue'
import SourceViewer from './components/SourceViewer.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import { BinaryFile } from './model/file'
import { VisualizationSettings } from './model/vis-settings'
import BinaryCanvas from './components/BinaryCanvas.vue'

export default {
    data: function () {
        // const file: BinaryFile | null = null;
        const settings: VisualizationSettings = new VisualizationSettings()

        const rndBinary = new Uint8Array(10002)
        for (let i = 0; i < 10002; i++) {
            if (i < 256) rndBinary[i] = i
            else rndBinary[i] = Math.floor(Math.random() * 256)
        }
        const file = new BinaryFile()
        file.bytes = rndBinary
        file.name = 'random.bin'
        file.size = rndBinary.byteLength

        return {
            file,
            settings,
            focus: -1,
        }
    },
    watch: {
        file() {
            this.settings.offset = 0
        },
    },

    components: {
        SiteHeader,
        SiteFooter,
        DraggableDiv,
        SettingEditor,
        SourceViewer,
        BinaryCanvas,
    },
}
</script>
<style scoped>
.work-area {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
    padding: 24px;
    justify-content: center;
    align-items: start;
}
</style>
