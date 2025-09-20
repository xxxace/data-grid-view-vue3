import type EVirtTable from "e-virt-table"
import { EVirtTableEditor } from "../EVirtTableEditor"
import type Cell from "e-virt-table/dist/lib/Cell"

export default class NumberInputEditor extends EVirtTableEditor {
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