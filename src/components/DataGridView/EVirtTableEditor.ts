import type EVirtTable from 'e-virt-table'
import type Cell from 'e-virt-table/dist/lib/Cell'

export type TableEditorConfig = {
  name: string
  type: string
  table: EVirtTable | null
}

export interface TableEditor {
  name: string
  type: string
  value: any
  table: EVirtTable | null
  cell: Cell | null

  bindEvents: () => void

  change: (e: any) => void

  createElement: (cell: Cell) => Promise<HTMLElement> | HTMLElement
  mount: () => void
  onMounted: (el: HTMLElement) => void
  destroy: () => Promise<void> | void
  beforeUnmount: () => void
  unmount: () => void

  setValue: (value: any) => void
}

export abstract class EVirtTableEditor implements TableEditor {
  name = ''
  type = ''
  value: any
  table: EVirtTable | null = null
  cell: Cell | null = null
  el: HTMLElement | null = null

  constructor(config: TableEditorConfig) {
    this.name = config.name
    this.type = config.type
    this.table = config.table

    this.bindEvents()

    this.cell = this.table!.ctx.focusCell || null
    this.mount()
  }

  bindEvents() {
    if (this.table) {
      const outsideMousedownHandler = async () => {
        console.log('outsideMousedown')
        this.table?.clearEditor()
      }
      const doneEditHandler = async () => {
        console.log('doneEdit')
        this.destroy()
        this.table?.off('doneEdit', doneEditHandler)
        this.table?.off('outsideMousedown', outsideMousedownHandler)
      }

      this.table.on('outsideMousedown', outsideMousedownHandler)
      this.table.on('doneEdit', doneEditHandler)

    } else {
      throw new Error('e-Virt-Table is not set')
    }
  }

  abstract createElement(cell: Cell): Promise<HTMLElement> | HTMLElement
  async mount() {
    if (!this.cell) return
    const eidtorElement = await this.createElement(this.cell)
    if (eidtorElement) {
      this.el = eidtorElement
      this.table!.ctx.editorElement.appendChild(eidtorElement)
      this.onMounted(eidtorElement)
    }
  }

  onMounted(el: HTMLElement) { }

  beforeUnmount() {
    return true
  }
  // 卸载组件
  unmount() {
    const { table, el } = this
    if (table && el) {
      table.ctx.editorElement.removeChild(el)
    }
  }

  async destroy() {
    if (await this.beforeUnmount()) {
      this.unmount()
    }
  }

  change(value: any) {
    this.setValue(value)
  }

  setValue(value: any) {
    const { table, cell } = this

    if (!table || !cell || !cell) {
      return;
    }

    const { rowKey, key } = cell;
    this.value = value
    table.ctx.setItemValueByEditor(rowKey, key, value);
  }
}
