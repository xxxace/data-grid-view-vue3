import type { ConfigType } from 'e-virt-table'

const editTable: Partial<ConfigType> & { [key: string]: any } = {
  DISABLED: true,
  BORDER_RADIUS: 0,
  BODY_TEXT_COLOR: '#191919',
  HEADER_TEXT_COLOR: '#404040',
  CELL_HEIGHT: 28,
  CELL_PADDING: 4,
  CELL_FOOTER_HEIGHT: 24,
  CHECKBOX_COLOR: 'rgb(11,104,255)',
  CHECKBOX_UNCHECK_COLOR: 'rgb(160, 160, 160)',
  COLUMNS_VERTICAL_ALIGN: 'bottom',
  RESIZE_ROW_MIN_HEIGHT: 24,
  RESIZE_COLUMN_MIN_WIDTH: 28,
  ENABLE_CONTEXT_MENU: true,
  ENABLE_SELECTOR: true,
  ENABLE_PASTER: false,
  ENABLE_HISTORY: false,
  HEADER_BG_COLOR: '#edf0f4',
  BORDER_COLOR: '#ced1d8',
  HEADER_FONT: `bold 13px normal Arial`,
  BODY_FONT: `13px normal Arial`,
  HIGHLIGHT_HOVER_ROW: true,
  HIGHLIGHT_SELECTED_ROW: true,
  ENABLE_RESIZE_ROW: false,
  EDIT_BG_COLOR: '#FFFFFF',
  HIGHLIGHT_HOVER_ROW_COLOR: 'rgba(186,203,231,0.3)',
  HIGHLIGHT_SELECTED_ROW_COLOR: 'rgba(22,119,255,0.2)',
  SCROLLER_SIZE: 14,
  overflowTooltipHeaderShow: true
}

export default {
  editTable,
}
