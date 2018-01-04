import React, { Component } from 'react';

import axios from 'axios';
import TimeAgo from 'react-timeago';
 
export class ClientList extends Component {
    constructor(props) {
        super(props);
        
        this.state = { clients: [] };
        this.loadClientsFromServer = this.loadClientsFromServer.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.viewClient = this.viewClient.bind(this);
    }
    
    loadClientsFromServer() {
        axios.get(this.props.url + '/Clients')
            .then(res => {
                this.setState({ clients: res.data });
            });
    }
    
    deleteClient(e) {
        e.preventDefault();
        if(window.prompt('Type "DELETE" (without the quotes) to delete this client. This action cannot be undone.') === "DELETE") {
            axios.delete(this.props.url + '/client/' + e.target.dataset.id);
        }
    }
    
    viewClient(e) {
        this.props.onClientSelected(e.target.dataset.id);
    }
    
    
    componentDidMount() {
        this.loadClientsFromServer();
        this.interval = setInterval(this.loadClientsFromServer, this.props.pollInterval);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    render() {
        let clientNodes = this.state.clients.map((client, i) => {
            var borderTop = i == 0 ? "none" : "1px dashed #000";
            var lastInvoice = client.invoices.length == 0 ? "never" : <TimeAgo date={client.invoices[client.invoices.length - 1].date} />
            
            return (
                <p className="panel panel-primary" key={ client._id } style={{padding: "1em 0", margin: 0, maxWidth: "40em", borderTop: borderTop}}>
                    <a href="#" style={{float: "right", marginLeft: "1em"}} data-id={client._id} data-value="delete" onClick={this.deleteClient}>Delete</a>
                    <a href="#" data-id={client._id} data-value="view" onClick={this.viewClient}>{client.name}</a> ({client.emails.join(', ')}) <br />
                    Current balance is ${(client.currentBalance || 0).toFixed(2)}, last invoice was {lastInvoice}
                </p>
            )
        })
        return (
 
            <div className="panel panel-success">
                <h2> All Clients </h2>
                { clientNodes }
            </div>
        )
    }
}