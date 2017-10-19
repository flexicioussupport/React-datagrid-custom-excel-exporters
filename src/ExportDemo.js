import React from 'react';
import { ReactDataGrid, ReactDataGridColumn, CsvExporter, DocExporter } from 'flexicious-react-datagrid'
import { CssStyles, ApiStyles } from 'flexicious-react-datagrid-styles'

import SheetJsExporter from './exporters/SheetJsExporter';

export default class ExportDemo extends React.Component {

  constructor() {
    super();

    this.state = {
      data: [
        { label: "Company B", state: "PA", rank: "11.1" },
        { label: "Company C", state: "CT", rank: "-111" },
        { label: "Company D", state: "NY", rank: "2.34" },
        { label: "Company E", state: "NJ", rank: "22.2" }
      ]
    }
  }

  componentDidMount() {
    this.grid.excelOptions.exporters = [
      new CsvExporter(), 
      new DocExporter(), 
      new SheetJsExporter()
    ];
  }

  render() {
    return (
      <div>
        <ReactDataGrid ref={(grid) => { this.grid = grid }} styles={ApiStyles.getThemeStyles('officeblue')} horizontalScrollPolicy={"off"} width={"100%"}
          enablePrint enablePreferencePersistence enableExport forcePagerRow pageSize="50" enableFilters
          editable dataProvider={this.state.data} cellTextColorFunction={(cell) => 0x000000}>
          <ReactDataGridColumn dataField="label" headerText="Label" filterControl="TextInput" filterOperation="Contains" />
          <ReactDataGridColumn dataField="state" headerText="State" filterControl="TextInput" filterOperation="Contains" />
          <ReactDataGridColumn dataField="rank" headerText="Rank" filterControl="TextInput" filterOperation="Contains" />
        </ReactDataGrid>
      </div>
    );
  }
}