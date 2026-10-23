import { getData } from './data.js';

document.readyState === 'complete' ? init() : window.onload = init;

let grid;
let refreshButtonInitialized = false;
let reqDocMaxCounts = {};
let noMqPageMessage = '対象マルQページなし';
// true: 初期表示を全閉, false: 初期表示を全展開
const INITIAL_GROUP_COLLAPSED = false;

function getGridElement() {
    return document.querySelector('#theGrid');
}

function getNoMqPageElement() {
    return document.querySelector('#no_mq_page_message');
}

function showNoMqPageMessage(message) {
    const messageElement = getNoMqPageElement();
    if (!messageElement) {
        return;
    }

    messageElement.textContent = message || noMqPageMessage;
    messageElement.classList.remove('is-hidden');
}

function hideNoMqPageMessage() {
    const messageElement = getNoMqPageElement();
    if (!messageElement) {
        return;
    }

    messageElement.classList.add('is-hidden');
}

function showGrid() {
    const gridElement = getGridElement();
    if (!gridElement) {
        return;
    }

    gridElement.classList.remove('is-hidden');
}

function hideGrid() {
    const gridElement = getGridElement();
    if (!gridElement) {
        return;
    }

    gridElement.classList.add('is-hidden');
}

function hasCurrentItemId() {
    const item = parent && parent.thisItem ? parent.thisItem : null;
    if (!item || typeof item.getID !== 'function') {
        return false;
    }

    const id = item.getID();
    return !!(id && String(id).trim());
}

function getEmptyGridData() {
    return {
        ItemData: [],
        ldThreeLines: [
            {
                header: '',
                cells: [{ binding: 'empty', width: 250, wordWrap: true }],
            },
        ],
        headerLayoutDefinition: [
            {
                cells: [{ header: '', binding: 'empty', width: 250, wordWrap: true, align: 'center' }],
            },
        ],
    };
}

function clearGridHost() {
    const gridElement = getGridElement();
    if (!gridElement) {
        return null;
    }

    if (grid && typeof grid.dispose === 'function') {
        grid.dispose();
        grid = null;
    }

    gridElement.innerHTML = '';
    return gridElement;
}

function renderNoMqPage(message) {
    clearGridHost();
    hideGrid();
    showNoMqPageMessage(message);
}

function renderEmptyGrid() {
    renderNoMqPage(noMqPageMessage);
}

function init() {
    setupRefreshButton();
    renderNoMqPage(noMqPageMessage);

    if (!hasCurrentItemId()) {
        return;
    }

    const appData = getData();
    if (!appData) {
        return;
    }

    if (appData.noMqPage) {
        noMqPageMessage = appData.emptyMessage || noMqPageMessage;
        renderNoMqPage(noMqPageMessage);
        return;
    }

    reqDocMaxCounts = appData.reqDocMaxCounts || {};

    hideNoMqPageMessage();
    showGrid();
    createGrid(appData);
}

function createGrid(appData) {
    const gridElement = clearGridHost();
    if (!gridElement) {
        return;
    }

    grid = new wijmo.grid.multirow.MultiRow('#theGrid', {
        itemsSource: appData.ItemData,
        layoutDefinition: appData.ldThreeLines,
        headerLayoutDefinition: appData.headerLayoutDefinition,
        headersVisibility: wijmo.grid.HeadersVisibility.Column,
        isReadOnly: true,
        groupHeaderFormat: '<b>{value}</b>',
    });

    // 左端の必要資料列を固定表示
    grid.frozenColumns = 1;

    new wijmo.grid.filter.FlexGridFilter(grid);
    setupCellStyle();
    setupGroupHeaderLabel();
    setupInitialRowVisibility();
    setupReqDocToggle();
    setupTooltip();
}

function setupGroupHeaderLabel() {
    grid.formatItem.addHandler((s, e) => {
        if (e.panel.cellType !== wijmo.grid.CellType.Cell || e.col !== 0) {
            return;
        }

        const row = s.rows[e.row];
        if (!(row instanceof wijmo.grid.GroupRow)) {
            return;
        }

        const group = row.dataItem;
        const reqDocName = group && group.name ? group.name : '';
        const maxCount = Number(reqDocMaxCounts[reqDocName] || 0);
        const marker = row.isCollapsed ? '[+]' : '[-]';
        e.cell.style.cursor = 'pointer';
        e.cell.title = 'クリックで折り畳み/展開';
        e.cell.innerHTML = '<b>' + marker + ' ' + wijmo.escapeHtml(reqDocName) + '（最大件数 ' + maxCount + '件）</b>';
    });
}

function setupInitialRowVisibility() {
    const applyInitialVisibility = () => {
        if (!grid || !grid.rows) {
            return;
        }

        for (let i = 0; i < grid.rows.length; i++) {
            const row = grid.rows[i];
            const dataItem = row && row.dataItem ? row.dataItem : null;
            if (row instanceof wijmo.grid.GroupRow) {
                row.isCollapsed = INITIAL_GROUP_COLLAPSED;
                continue;
            }

            if (dataItem && dataItem.__isPlaceholder) {
                row.visible = false;
            } else {
                row.visible = true;
            }
        }
    };

    grid.loadedRows.addHandler(() => {
        applyInitialVisibility();
    });

    applyInitialVisibility();
}

function setupReqDocToggle() {
    grid.hostElement.addEventListener('click', (e) => {
        const ht = grid.hitTest(e);
        if (!ht || ht.cellType !== wijmo.grid.CellType.Cell) {
            return;
        }

        const row = grid.rows[ht.row];
        if (!(row instanceof wijmo.grid.GroupRow)) {
            return;
        }

        if (ht.col !== 0) {
            return;
        }

        row.isCollapsed = !row.isCollapsed;
        grid.invalidate();
    });
}

function setupCellStyle() {
    grid.formatItem.addHandler((s, e) => {
        if (e.panel.cellType !== wijmo.grid.CellType.Cell) {
            return;
        }

        const cell = e.cell;
        cell.style.backgroundColor = '';
        cell.style.fontWeight = '';
    });
}

function setupTooltip() {
    const tip = new wijmo.Tooltip();
    let rng = null;

    grid.hostElement.addEventListener('mousemove', (e) => {
        const ht = grid.hitTest(e.pageX, e.pageY);
        if (!ht.range || ht.range.equals(rng) || ht.cellType !== wijmo.grid.CellType.Cell) {
            return;
        }

        rng = ht.range;
        const cellElement = document.elementFromPoint(e.clientX, e.clientY);
        const cellBounds = grid.getCellBoundingRect(ht.row, ht.col);
        const data = wijmo.escapeHtml(grid.getCellData(rng.row, rng.col, true));

        if (cellElement && cellElement.className.indexOf('wj-cell') > -1) {
            tip.show(grid.hostElement, data, cellBounds);
        }
    });

    grid.hostElement.addEventListener('mouseout', () => {
        tip.hide();
        rng = null;
    });
}

function isIvEditing() {
    const item = parent && parent.thisItem ? parent.thisItem : null;
    if (!item) {
        return false;
    }

    if (typeof item.getLockStatus === 'function') {
        const lockStatus = item.getLockStatus();
        return lockStatus === 1 || lockStatus === '1';
    }

    if (typeof item.isLocked === 'function') {
        return !!item.isLocked();
    }

    return false;
}

function refreshGrid() {
    if (!hasCurrentItemId()) {
        renderNoMqPage(noMqPageMessage);
        return;
    }

    const appData = getData();
    if (!appData) {
        renderNoMqPage(noMqPageMessage);
        return;
    }

    if (appData.noMqPage) {
        noMqPageMessage = appData.emptyMessage || noMqPageMessage;
        renderNoMqPage(noMqPageMessage);
        return;
    }

    reqDocMaxCounts = appData.reqDocMaxCounts || {};
    hideNoMqPageMessage();
    showGrid();

    if (!grid) {
        createGrid(appData);
        return;
    }

    grid.layoutDefinition = appData.ldThreeLines;
    grid.headerLayoutDefinition = appData.headerLayoutDefinition;
    grid.itemsSource = appData.ItemData;
    grid.invalidate();
}

function setupRefreshButton() {
    const refreshButton = document.querySelector('#refresh_grid');
    if (!refreshButton || refreshButtonInitialized) {
        return;
    }

    refreshButtonInitialized = true;

    const updateEnabled = () => {
        refreshButton.disabled = isIvEditing() || !hasCurrentItemId();
    };

    refreshButton.addEventListener('click', refreshGrid);
    updateEnabled();
    setInterval(updateEnabled, 1000);
}
