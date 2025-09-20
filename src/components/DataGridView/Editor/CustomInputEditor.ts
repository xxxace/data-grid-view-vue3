import type EVirtTable from "e-virt-table"
import { EVirtTableEditor } from "../EVirtTableEditor"
import type Cell from "e-virt-table/dist/lib/Cell"
import { createApp, h } from "vue"
import CustomInput from "@/components/CustomInput/index.vue"

export default class CustomInputEditor extends EVirtTableEditor {
    constructor(table: EVirtTable) {
        super({
            name: 'custom-input',
            type: 'input',
            table
        })
    }

    createElement(cell: Cell) {
        const inputContainer = document.createElement('div')
        inputContainer.style.width = `${cell.width}px`
        inputContainer.style.height = `${cell.height}px`
        inputContainer.style.border = 'none'
        inputContainer.style.outline = 'none'

        const customInputApp = this.createVueApp(cell)
        customInputApp.mount(inputContainer)

        return inputContainer
    }

    onMounted(el: HTMLElement): void {
        const input = el.querySelector('input') as HTMLInputElement
        if (input) {
            let firstRender = false
            input.addEventListener('input', (e: Event) => {
                if (!firstRender) {
                    input.value = (e as InputEvent).data || ''
                    firstRender = true
                }
            })
            input.focus({ preventScroll: true })
        }
    }

    createVueApp(cell: Cell) {
        const editorCtx = this
        console.log(cell)
        return createApp({
            data() {
                return {
                    inputRef: null,
                    currentValue: cell.value
                };
            },
            render() {
                const refFunc = (el) => el && (this.inputRef = el)
                return h(CustomInput, {
                    ref: refFunc,
                    modelValue: this.currentValue,
                    onChange: (value: any) => {
                        this.currentValue = value
                        editorCtx.change(value)
                    }
                })
            }
        })
    }
}