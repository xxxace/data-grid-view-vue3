import type EVirtTable from "e-virt-table";
import { EVirtTableEditor } from "../EVirtTableEditor";
import type Cell from "e-virt-table/dist/lib/Cell";

export default class SelectEditor extends EVirtTableEditor {
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