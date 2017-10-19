import React from 'react';
import { Exporter, UIUtils } from 'flexicious-react-datagrid';
import XLSX from 'xlsx';
import {saveAs} from 'file-saver';

export default class SheetJsExporter extends Exporter {

    constructor() {
        super();

        /**
         * object representing the columns
         */
        this.columns = [];

        /**
         * object representing the data
         */
        this.data = [];
    }

    getClassNames() {
        return ["SheetJsExporter", "Exporter"];
    }

    writeHeader(grid) {

        this.buildHeader(grid);
        return "";

    };
    /**
     * @private
     * @param grid
     * @return
     *
     */
    buildHeader(grid) {

        var colIndex = 0;

        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!this.isIncludedInExport(col))
                continue;
            this.columns.push(Exporter.getColumnHeader(col, colIndex));
            colIndex++;
        }

    };
    uploadForEcho(body, exportOptions) {

        var new_ws = XLSX.utils.aoa_to_sheet([this.columns, ...this.data]);
        
        /* build workbook */
        var new_wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_wb, new_ws, 'SheetJS');

        /* write file and trigger a download */
        var wbout = XLSX.write(new_wb, {bookType:'xlsx', bookSST:true, type:'binary'});
        var fname =  exportOptions.exportFileName + "." + this.getExtension();
        try {
            saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), fname);
        } catch(e) { if(typeof console != 'undefined') console.log(e, wbout); }

        this.columns = [];
        this.data = [];

        UIUtils.removePopUp(exportOptions.exportOptionsView);
    };

    s2ab = (s) => {
		var b = new ArrayBuffer(s.length), v = new Uint8Array(b);
		for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i) & 0xFF;
		return b;
	}

    /**
     * Writes an individual record in csv format
     * @param grid
     * @param record
     * @return
     *
     */
    writeRecord(grid, record) {

        var colIndex = 0;

        var item = [];
        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!this.isIncludedInExport(col))
                continue;
            var value = col.itemToLabel(record);
            item.push(isNaN(value) ? value : Number(value));
        }
        this.data.push(item);
        return "";

    };


    /**
     * Writes the footer in CSV format
     * @param grid
     * @param dataProvider
     */
    writeFooter(grid, dataProvider) {

        return "";

    };

    /**
     * Extension of the download file.
     * @return
     *
     */
    getExtension() {
        return "xlsx";
    };
    /**
     * Returns the content type so MS Excel launches
     * when the exporter is run.
     * @return
     *
     */
    getContentType() {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    };
    /**
     * Name of the exporter
     * @return
     *
     */
    getName() {
        return "Excel Custom";
    };

}