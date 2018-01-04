import React, { Component } from 'react';
import { EmailBoxes } from './Widgets.jsx';
import axios from 'axios';
//import ClientSchema from '../models/Client.js';

export class AddClientForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      emails: [""]
    };

    this.handleNameChanged = this.handleNameChanged.bind(this);
    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.removeEmail = this.removeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleNameChanged(e) {
    this.setState({ name: e.target.value });
  }

  handleEmailChanged(i, email) {
    let newEmails = this.state.emails;
    newEmails[i] = email.trim();
    this.setState({ emails: newEmails });
  }

  addEmail(e) {
    let newEmails = this.state.emails;
    newEmails.push("");
    this.setState({emails: newEmails});
  }

  removeEmail(index) {
    let newEmails = this.state.emails;
    newEmails.splice(index, 1);
    this.setState({emails: newEmails});
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleSave(e) {
    let name = this.state.name.trim();
    let emails = this.state.emails;

    if (!name || !emails) {
      return;
    }

    let client = {
      name: name,
      emails: emails,
      currentBalance: 0.0,
      invoices: [],
      pendingExpenses: [],
      pendingPayments: []
    };

    //TODO: forward to viewing the client :)
    axios.post(this.props.url + '/new', client).catch(err => {
      console.error(err);
    }).then(res => {
      let client = res.data;
      this.props.onClientSelected(client._id);
    });
    //        this.props.onSave({ name: name, emails: emails });

    this.setState({name: '', emails: ['']});
  }

  handleCancel(e) {
    this.setState({name: '', emails: ['']});
  }

  render() {
    return (
      <div>
        <h2>Add a new client</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="clientName">Name</label><input type="text" id="clientName" value={this.state.name} onChange={this.handleNameChanged} />
          <EmailBoxes emails={this.state.emails} onChange={this.handleEmailChanged} removeEmail={this.removeEmail} />
          <label>&nbsp;</label><a onClick={ this.addEmail } href="#">Add email</a><br /><br />
          <label>
            <button type="cancel" style={{fontSize: 'small'}} onClick={ this.handleCancel }>Cancel</button>
          </label>
          <button type="submit" onClick={ this.handleSave }>Save Client</button>
        </form>
      </div>
    );
  }
}