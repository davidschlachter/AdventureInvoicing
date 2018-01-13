import React, { Component } from 'react';

import axios from 'axios';
import TimeAgo from 'react-timeago';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { EditableTable } from './EditableTable.jsx';
//import ReactDataGrid from 'react-data-grid';
//import {Toolbar} from 'react-data-grid-addons';
import { Events } from './CalendarFetcher';
import { EmailBoxes } from './Widgets.jsx';

// Import React Table
import ReactTable from 'react-table';
//import "react-table/react-table.css";

export class ViewClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: null, 
      events: [],
      editingEmails: false,
      tempEmails: null,
      fromDate: moment().subtract(7, "days"),
      toDate: moment(),
    };

    this.getClient = this.getClient.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.saveClient = this.saveClient.bind(this);
    this.handleEmailsChanged = this.handleEmailsChanged.bind(this);
    this.handleEmailsSaved = this.handleEmailsSaved.bind(this);
    this.handleEmailsCanceled = this.handleEmailsCanceled.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.removeEmail = this.removeEmail.bind(this);

    this.renderEditableExpense = this.renderEditableExpense.bind(this);
    this.renderEditablePayment = this.renderEditablePayment.bind(this);
    this.renderEventField = this.renderEventField.bind(this);
    this.handleAddExpense = this.handleAddExpense.bind(this);
    this.handleAddPayment = this.handleAddPayment.bind(this);
    this.handleDeleteExpense = this.handleDeleteExpense.bind(this);
    this.handleDeletePayment = this.handleDeletePayment.bind(this);
    this.handleEventsLoaded = this.handleEventsLoaded.bind(this);
    this.handleFromDateChanged = this.handleFromDateChanged.bind(this);
    this.handleToDateChanged = this.handleToDateChanged.bind(this);
    this._expenseColumns = [
      {
        accessor: 'date',
        Header: () => {return <strong>Date</strong>},
        maxWidth: 145,
        Cell: this.renderEditableExpense
      },
      {
        accessor: 'description',
        Header: () => {return <strong>Description</strong>},
        Cell: this.renderEditableExpense
      },
      {
        accessor: 'amount',
        Header: () => {return <strong>Amount</strong>},
        maxWidth: 140,
        style: {textAlign: 'right'},
        Cell: this.renderEditableExpense
      },
      {
        Header: () => {return <button onClick={this.handleAddExpense} style={{float: 'right', height: 21}}><strong>Add Expense</strong></button>},
        Cell: (cellInfo) => {return <button onClick={this.handleDeleteExpense} data-id={cellInfo.index} style={{float: 'right', width: 21, height: 21}}><strong data-id={cellInfo.index}>-</strong></button>},
        maxWidth: 115,
        resizable: false
      }
    ];

    this._paymentColumns = [
      {
        accessor: 'date',
        Header: () =>  {return <strong>Date</strong>},
        maxWidth: 145,
        Cell: this.renderEditablePayment
      },
      {
        accessor: 'type',
        Header: () =>  {return <strong>Payment Type</strong>},
        Cell: this.renderEditablePayment
      },
      {
        accessor: 'amount',
        Header: () =>  {return <strong>Amount</strong>},
        maxWidth: 140,
        style: {textAlign: 'right'},
        Cell: this.renderEditablePayment
      },
      {
        Header: () => {return <button onClick={this.handleAddPayment} style={{float: 'right', height: 21}}><strong>Add Payment</strong></button>},
        Cell: (cellInfo) => {return <button onClick={this.handleDeletePayment} data-id={cellInfo.index} style={{float: 'right', width: 21, height: 21}}><strong data-id={cellInfo.index}>-</strong></button>},
        maxWidth: 115,
        resizable: false
      }
    ];

    this._eventColumns = [
      {
        accessor: 'summary',
        Header: () =>  {return <strong></strong>},
        maxWidth: 145,
        Cell: this.renderEventField
      },
      {
        accessor: 'startTime',
        Header: () =>  {return <strong>Started</strong>},
        Cell: this.renderEventField
      },
      {
        accessor: 'endTime',
        Header: () =>  {return <strong>Ended</strong>},
        maxWidth: 140,
        style: {textAlign: 'right'},
        Cell: this.renderEventField
      },
      {
        accessor: 'rate',
        Header: () =>  {return <strong>Rate</strong>},
        maxWidth: 140,
        style: {textAlign: 'right'},
        Cell: this.renderEventField
      }
    ];
  }

  getClient(clientId) {
    axios.get(this.props.url + '/Client/' + clientId)
      .then(res => {
      this.setState({ client: res.data, tempEmails: res.data.emails.map((i) => {return i;}) });
    });
  }

  deleteClient(e) {
    e.preventDefault();
    if(window.prompt('Type "DELETE" (without the quotes) to delete this client. This action cannot be undone.') === "DELETE") {
      axios.delete(this.props.url + '/client/' + this.state.client._id);
      this.props.onChangePage('manageClients');
    }
  }

  saveClient() {
    axios.put(this.props.url + '/client/' + this.state.client._id, this.state.client).catch(err => {
      console.error(err);
    });
  }
  
  handleEmailsChanged(index, value) {
    let emails = this.state.tempEmails;
    emails[index] = value;
    this.setState({tempEmails: emails});
  }
  
  handleEmailsSaved() {
    let client = this.state.client;
    client.emails = this.state.tempEmails;
    this.setState({client: client, editingEmails: false});
    this.saveClient();
  }
  
  handleEmailsCanceled() {
    let emails = this.state.client.emails.map((i) => {return i;});
    this.setState({
      tempEmails: emails,
      editingEmails: false,
    });
    return false;
  }
  
  addEmail() {
    let newEmails = this.state.tempEmails;
    newEmails.push("");
    this.setState({tempEmails: newEmails});
  }
  
  removeEmail(index) {
    let newEmails = this.state.tempEmails;
    newEmails.splice(index, 1);
    this.setState({tempEmails: newEmails});
  }

  componentDidMount() {
    const clientId = this.props.clientId;
    this.getClient(clientId);
    //loadCalendarApi();
  }

  handleAddExpense() {
    const newExpense = {
      date: new Date(),
      description: '',
      amount: 0.0
    };

    let client = this.state.client;
    client.pendingExpenses.push(newExpense);
    this.setState({ client: client });

    this.saveClient();
  };

  handleAddPayment() {
    const newPayment = {
      date: new Date(),
      type: 'Cash',
      amount: 0.0
    };

    let client = this.state.client;
    client.pendingPayments.push(newPayment);
    this.setState({ client: client });

    this.saveClient();
  };

  handleDeleteExpense(e) {
    if(window.confirm('Are you sure you want to delete this expense?')) {
      let index = e.target.dataset.id;
      let client = this.state.client;
      client.pendingExpenses.splice(index, 1);
      this.setState({ client: client });

      this.saveClient();
    }
  }

  handleDeletePayment(e) {
    if(window.confirm('Are you sure you want to delete this payment?')) {
      let index = e.target.dataset.id;
      let client = this.state.client;
      client.pendingPayments.splice(index, 1);
      this.setState({ client: client });

      this.saveClient();
    }
  }
  
  handleFromDateChanged(date) {
    this.setState({
      fromDate: date
    });
  }
  
  handleToDateChanged(date) {
    this.setState({
      toDate: date
    });
  }

  handleEventsLoaded(events) {
    this.setState({events: events});
  }

  renderEditableExpense(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onFocus={e => {
          let value = (e.target.innerText || e.target.textContent);
          if(cellInfo.column.id === "amount") {
            value = value.replace('$', '').replace(/^\s+|\s+$/g, '').trim();
            e.target.innerHTML = value;
          }
        }}
        onBlur={e => {
          const client = this.state.client;
          let value = (e.target.innerText || e.target.textContent).trim();
          if (cellInfo.column.id === "amount") {
            value = parseFloat(value.replace('$', '').replace(/^\s+|\s+$/g, '').trim());
            e.target.innerHTML = this.moneyFormatter(value);
          } else if (cellInfo.column.id === "date") {
            value = new Date(value) || value;
            e.target.innerHTML = this.dateFormatter(value);
          }
          client.pendingExpenses[cellInfo.index][cellInfo.column.id] = value;
          this.setState({ client: client });

          this.saveClient();
          //this.forceUpdate();
        }}
        dangerouslySetInnerHTML={{
          __html: cellInfo.column.id === "date" ? this.dateFormatter(this.state.client.pendingExpenses[cellInfo.index][cellInfo.column.id]) 
          : cellInfo.column.id === "amount" ? this.moneyFormatter(this.state.client.pendingExpenses[cellInfo.index][cellInfo.column.id]) 
          : this.state.client.pendingExpenses[cellInfo.index][cellInfo.column.id]
        }}
        />
    );
  }

  renderEditablePayment(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onFocus={e => {
          let value = (e.target.innerText || e.target.textContent);
          if(cellInfo.column.id === "amount") {
            value = value.replace('$', '').replace(/^\s+|\s+$/g, '').trim();
            e.target.innerHTML = value;
          }
        }}
        onBlur={e => {
          const client = this.state.client;
          let value = (e.target.innerText || e.target.textContent).trim();
          if(cellInfo.column.id === "amount") {
            value = parseFloat(value.replace('$', '').replace(/^\s+|\s+$/g, '').trim());
            e.target.innerHTML = this.moneyFormatter(value);
          }
          client.pendingPayments[cellInfo.index][cellInfo.column.id] = value;
          this.setState({ client: client });

          this.saveClient();
        }}
        dangerouslySetInnerHTML={{
          __html: cellInfo.column.id === "date" ? this.dateFormatter(this.state.client.pendingPayments[cellInfo.index][cellInfo.column.id]) 
          : cellInfo.column.id === "amount" ? this.moneyFormatter(this.state.client.pendingPayments[cellInfo.index][cellInfo.column.id]) 
          : this.state.client.pendingPayments[cellInfo.index][cellInfo.column.id]
        }}
        />
    );
  }

  renderEventField(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        dangerouslySetInnerHTML={{
		__html: (typeof this.state !== 'undefined' && typeof this.state.events !== 'undefined' && this.state.events.length > 0) ? this.state.events[cellInfo.index][cellInfo.column.id] : "Loading"
        }}
        />
    );
  }

  dateFormatter(value) {
    const date = new Date(value);
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  moneyFormatter(value) {
    return '$' + parseFloat(value).toFixed(2);
  }

  render() {
    if(this.state.client == null)
      return <p>Loading client...</p>;

    const client = this.state.client;
    var i = 0;

    var lastInvoice = client.invoices.length == 0 ? "never" : <TimeAgo date={client.invoices[client.invoices.length - 1].date} />
    var displayEmails = this.state.editingEmails ? 
        <p>
          <EmailBoxes emails={this.state.tempEmails} onChange={this.handleEmailsChanged} removeEmail={this.removeEmail} />
          <label>&nbsp;</label><a onClick={ this.addEmail } href="#">Add email</a><br /><br />
          <a onClick={this.handleEmailsCanceled} href="#">Cancel</a>&nbsp;
          <button type="button" onClick={this.handleEmailsSaved}>Save</button>
        </p>
        : (
          <p>
            Emails: {client.emails.join(', ')}&nbsp;
            <a href="#" onClick={() => {this.setState({editingEmails: true})}}>Edit</a>
          </p>
        );
    
    var pendingBalance = (
      client.currentBalance +
      (client.pendingPayments.reduce((a, b) => {return {amount: a.amount + b.amount}}, {amount: 0.0})).amount -
      (client.pendingExpenses.reduce((a, b) => {return {amount: a.amount + b.amount}}, {amount: 0.0})).amount
    ).toFixed(2);

    return (
      <div className="panel panel-primary" key={ client._id } style={{padding: "1em 0", margin: 0}}>
        <a href="#" style={{float: "right", marginRight: "1em"}} data-id={client._id} data-value="delete" onClick={this.deleteClient}>Delete</a>
        <h2>{client.name}</h2>
        { displayEmails }
        <p>
          Current balance: ${(client.currentBalance || 0).toFixed(2)}, pending balance: ${pendingBalance}
        </p>
        <h3>Pending expenses</h3>
        <div>
          <EditableTable 
            columns={this._expenseColumns} 
            rows={client.pendingExpenses} 
            handleAdd={this.handleAddExpense} />
        </div>
        <h3>Pending payments</h3>
        <div>
          <EditableTable 
            columns={this._paymentColumns} 
            rows={client.pendingPayments} 
            handleAdd={this.handleAddPayment} />
        </div>
        <h3>Events between 
          <DatePicker
            selected={this.state.fromDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleFromDateChanged}
            maxDate={moment()}
            highlightDates={[moment().subtract(7, "days")]} />

        <DatePicker
            selected={this.state.toDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleToDateChanged}
            maxDate={moment()}
            highlightDates={[moment()]} />
        </h3>
        <Events emails={client.emails}
          dontDisplay={true}
          onEventsLoaded={this.handleEventsLoaded}
          timeMin={this.state.fromDate}
          timeMax={this.state.toDate} />
        <EditableTable
          columns={this._eventColumns}
          rows={this.state.events}
          />
        <p>
          Last invoice was {lastInvoice}
        </p>
        <pre>{ JSON.stringify(client.invoices, null, '\t') }</pre>
      </div>
    );
  }
}
