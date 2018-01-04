import React, {Component} from 'react';

export class EditableTable extends Component {
  render() {
    this.handleAdd = this.props.handleAdd;
    this.columns = this.props.columns;
    this.rows = this.props.rows;

    return (<div className="ReactTable">
        <div className="rt-table">
          <div className="rt-thead -header" style={{minWidth: 400}}>
            <div className="rt-tr">
            {this.columns.map(col => {
              return <div className=" rt-resizable-header rt-th" style={{flex: '100 0 auto', width: 100, maxWidth: col.maxWidth}} key={col.accessor}>
                <div className="rt-resizable-header-content">{col.Header()}</div>
                <div className="rt-resizer"></div>
              </div>
            })}
            </div>
          </div>
          <div className="rt-tbody" style={{minWidth: 400}}>
            { this.rows.map((expense, rowIndex) => {
              return <div className="rt-tr-group" key={rowIndex}>
                <div className="rt-tr -odd">
                  {this.columns.map(col => {
                    return <div className="rt-td" 
                             style={{flex: '100 0 auto', width: 100, maxWidth: col.maxWidth, textAlign: col.accessor == 'date' || col.accessor == 'amount' ? 'right' : 'left'}} 
                             key={col.accessor}>
                      {col.Cell({column: {id: col.accessor}, index: rowIndex})}
                    </div>
                  })}
                </div>
              </div>
            }) }
          </div>
        </div>
      </div>);
  }
}