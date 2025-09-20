import type EVirtTable from 'e-virt-table'
import { EVirtTableEditor } from './EVirtTableEditor'
import type Cell from 'e-virt-table/dist/lib/Cell'
import { h, createApp, ref, onMounted } from 'vue'
import CustomInput from "@/components/CustomInput/index.vue";

export class NumberInputEditor extends EVirtTableEditor {
    constructor(table: EVirtTable) {
        super({
            name: 'original-input',
            type: 'input',
            table
        })
    }

    createElement(cell: Cell) {
        const inputEditor = document.createElement('input')
        inputEditor.classList.add('e-virt-table-editor-input')
        inputEditor.type = 'number'
        inputEditor.value = cell.value
        inputEditor.style.width = `${cell.width}px`
        inputEditor.style.height = `${cell.height}px`
        inputEditor.style.border = 'none'
        inputEditor.style.outline = 'none'
        inputEditor.style.textAlign = 'right'

        if (cell.editorProps) {
            for (const [key, value] of Object.entries(cell.editorProps)) {
                inputEditor.setAttribute(key, value as unknown as any)
            }
        }

        return inputEditor
    }

    onMounted(el: HTMLInputElement) {
        let firstRender = false
        el.addEventListener('input', (e: Event) => {
            if (!firstRender) {
                el.value = (e as InputEvent).data || ''
                firstRender = true
            }
        })
        el.addEventListener('change', (e: Event) => {
            this.change((e.target as HTMLInputElement).value)
        })
        el.focus({ preventScroll: true })
    }
}

// 实现一个SelectEditor
export class SelectEditor extends EVirtTableEditor {
    constructor(table: EVirtTable) {
        super({
            name: 'original-input',
            type: 'input',
            table
        })
    }

    createElement(cell: Cell) {
        const selectEditor = document.createElement('select')
        selectEditor.setAttribute('type', 'text');
        selectEditor.classList.add('e-virt-table-editor-select')
        selectEditor.style.width = `${cell.width}px`
        selectEditor.style.height = `${cell.height}px`
        selectEditor.style.border = 'none'
        selectEditor.style.outline = 'none'

        if (cell.editorProps) {
            for (const [key, value] of Object.entries(cell.editorProps)) {
                if (key === 'options') {
                    const options = value as Array<{ label: string, value: string }>
                    options.forEach(option => {
                        const optionElement = document.createElement('option')
                        optionElement.value = option.value
                        optionElement.text = option.label
                        if (option.value === cell.value) {
                            optionElement.selected = true
                        }
                        selectEditor.appendChild(optionElement)
                    })
                    continue
                }
                selectEditor.setAttribute(key, value as unknown as any)
            }
        }
        return selectEditor
    }
    onMounted(el: HTMLSelectElement) {
        el.focus();

        el.addEventListener('change', (e: Event) => {
            this.change((e.target as HTMLSelectElement).value)
        })
    }
}

export class CustomInputEditor extends EVirtTableEditor {
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