import {
  Tabulator
} from 'tabulator-tables'
export function addRangeHack(table: Tabulator) {
  const rangeLayoutCover = function () {
    var _vDomTop = this.table.rowManager.renderer.vDomTop,
      _vDomBottom = this.table.rowManager.renderer.vDomBottom,
      _vDomLeft = this.table.columnManager.renderer.leftCol,
      _vDomRight = this.table.columnManager.renderer.rightCol,
      forzenLeftColumns = this.table.modules.frozenColumns.leftColumns,
      forzenLeft = forzenLeftColumns.length,
      frozenRightColumns = this.table.modules.frozenColumns.rightColumns,
      frozenRight = frozenRightColumns.length,
      top,
      bottom,
      left,
      right,
      topLeftCell,
      bottomRightCell,
      topLeftCellEl,
      bottomRightCellEl,
      topLeftRowEl,
      bottomRightRowEl


    if (forzenLeft > 0 && forzenLeftColumns[0].isRowHeader === true) {
      forzenLeft -= 1
    }

    if (this.table.options.renderHorizontal === 'virtual' && this.rangeManager.rowHeader) {
      _vDomRight += 1
    }

    if (_vDomTop == null) {
      _vDomTop = 0
    }

    if (_vDomBottom == null) {
      _vDomBottom = Infinity
    }

    if (_vDomLeft == null) {
      _vDomLeft = 0
    }

    if (_vDomRight == null) {
      _vDomRight = Infinity
    }

    if (this.overlaps(_vDomLeft, _vDomTop, _vDomRight, _vDomBottom)) {
      top = Math.max(this.top, _vDomTop)
      bottom = Math.min(this.bottom, _vDomBottom)
      left = Math.max(this.left, _vDomLeft)
      right = Math.min(this.right, _vDomRight + forzenLeft + frozenRight)
      topLeftCell = this.rangeManager.getCell(top, left)
      bottomRightCell = this.rangeManager.getCell(bottom, right)
      topLeftCellEl = topLeftCell.getElement()
      bottomRightCellEl = bottomRightCell.getElement()
      topLeftRowEl = topLeftCell.row.getElement()
      bottomRightRowEl = bottomRightCell.row.getElement()

      this.element.classList.add('tabulator-range-active')
      // this.element.classList.toggle("tabulator-range-active", this === this.rangeManager.activeRange);

      var frozenWidth = 0
      this.rangeManager.getTableColumns().forEach((column) => {
        const occupied = this.occupiesColumn(column)
        if (occupied && column.definition.frozen) {
          frozenWidth += column.width
        }
      })

      if (frozenWidth === 0) {
        this.rangeManager.overlay.style.zIndex = 10
      } else {
        this.rangeManager.overlay.style.zIndex = 11
      }

      if (this.table.rtl) {
        var rangeWidth = Math.max(
          topLeftCellEl.offsetLeft + topLeftCellEl.offsetWidth - bottomRightCellEl.offsetLeft,
          frozenWidth,
        )
        this.element.style.right =
          topLeftRowEl.offsetWidth - topLeftCellEl.offsetLeft - topLeftCellEl.offsetWidth + 'px'
        this.element.style.width = rangeWidth + 'px'
      } else {
        var rangeWidth = Math.max(
          bottomRightCellEl.offsetLeft + bottomRightCellEl.offsetWidth - topLeftCellEl.offsetLeft,
          frozenWidth,
        )

        this.element.style.left = topLeftRowEl.offsetLeft + topLeftCellEl.offsetLeft + 'px'
        this.element.style.width = rangeWidth + 'px'
      }

      this.element.style.top = topLeftRowEl.offsetTop + 'px'
      this.element.style.height =
        bottomRightRowEl.offsetTop + bottomRightRowEl.offsetHeight - topLeftRowEl.offsetTop + 'px'
    }
  }

  const _updateMinMax = function _updateMinMax() {
    this.top = Math.min(this.start.row, this.end.row);
    this.bottom = Math.max(this.start.row, this.end.row);
    console.log('_updateMinMax', this.start.col, this.end.col)
    this.left = Math.min(this.start.col, this.end.col);
    console.log('_updateMinMax', this.left)
    this.right = Math.max(this.start.col, this.end.col);

    if (this.initialized) {
      this.dispatchExternal("rangeChanged", this.getComponent());
    } else {
      if (this.initializing.start && this.initializing.end) {
        this.initialized = true;
        this.dispatchExternal("rangeAdded", this.getComponent());
      }
    }
  }

  const overlaps = function (left, top, right, bottom) {
    console.log('overlaps1', left, top, right, bottom)
    console.log('overlaps2', this.left, this.top, this.right, this.bottom)
    if ((this.left > right || left > this.right) || (this.top > bottom || top > this.bottom)) {
      return false;
    }

    return true;
  }

  const addRangeOrigin = table.modules.selectRange.addRange
  const addRangeCover = function addRange(start, end) {
    const res = addRangeOrigin.call(this, start, end)
    this.ranges.forEach((range) => {
      range.layout = rangeLayoutCover
      range._updateMinMax = _updateMinMax
      range.overlaps = overlaps
    })
    return res
  }

  const layoutRanges = function () {
    var activeCell, activeCellEl, activeRowEl;

    if (!this.table.initialized) {
      return;
    }

    activeCell = this.getActiveCell();

    if (!activeCell) {
      return;
    }

    activeCellEl = activeCell.getElement();
    activeRowEl = activeCell.row.getElement();

    if (this.table.rtl) {
      this.activeRangeCellElement.style.right = activeRowEl.offsetWidth - activeCellEl.offsetLeft - activeCellEl.offsetWidth + "px";
    } else {
      this.activeRangeCellElement.style.left = activeRowEl.offsetLeft + activeCellEl.offsetLeft + "px";
    }

    this.activeRangeCellElement.style.top = activeRowEl.offsetTop + "px";
    this.activeRangeCellElement.style.width = activeCellEl.offsetWidth + "px";
    this.activeRangeCellElement.style.height = activeRowEl.offsetHeight + "px";

    console.log('layoutRanges')
    this.ranges.forEach((range) => range.layout());

    this.overlay.style.visibility = "visible";
  }

  table.modules.selectRange.layoutRanges = layoutRanges
  table.modules.selectRange.addRange = addRangeCover
}
