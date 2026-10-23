export class HierarchicalFlexGridSearch extends wijmo.grid.search.FlexGridSearch {
  // set this property to true, if you want to hide the extra rows
  // otherwise, all the rows in the hierarchy will be visible in search results
  hideExtraRow = false;

    // inputElementは、検索欄に入力されたテキストです
  constructor(element, options) {
    super(element, options);

    // to show only those rows which contains serched string
    if (this.hideExtraRow) {
      this.hideExtraRows();

      this.grid.loadingRows.addHandler((s, e) => {
          if (this.inputElement.value) {
          s.beginUpdate();
        }
      })
      this.grid.loadedRows.addHandler((s, e) => {
        if (this.inputElement.value) {
          this.updateVisibleRows();
          setTimeout(() => {
            s.endUpdate();
          }, 50)
        }
      })
    }
  }

  heirarchicalFilter(item) {
    let item2 = this.searchHeirarchy(item, this.grid.childItemsPath);
    return item2;
  }

  _filter(item) {
    return this.heirarchicalFilter(item);
  }

  // to search heirarchical data
  searchHeirarchy(item, childsPath) {
    // retrun item if search value found on first level
    for (const property in item) {
        if (item[property]) {
            let value = item[property].toString().toLowerCase();
            if (value.includes(this.text.toLowerCase())) {
                return item; 
            }
        }
    }

    // to go deeper for searching
    // if(item.length > 0)
    if (childsPath.length && item[childsPath[0]]) {
      for (let i = 0; i < item[childsPath[0]].length; i++) {
        let value = this.searchHeirarchy(
          item[childsPath[0]][i],
          childsPath.slice(1)
        );
        if (value) return value;
      }
    }
    return null;
  }

  //to hide extra rows
  hideExtraRows() {
    this.inputElement.addEventListener(
      'input',
      this.updateVisibleRows.bind(this)
    );
  }

  updateVisibleRows(e) {
    setTimeout(() => {
      this.grid.rows.forEach((row) => {
        let dataFound = false;
        let item = row.dataItem;
        let columns = this.grid.columns;
        //check each row data item for searched data
        for (let col = 0; col < columns.length; col++) {
          let data = item[columns[col].binding];
          if (data != '' && data != null) {
            if (
              data.toString().toLowerCase().includes(this.text.toLowerCase())
            ) {
              dataFound = true;
              break;
            }
          }
        }
        row.visible = dataFound;
      });
    }); // try increasing timeout if not working properly
  }
}
