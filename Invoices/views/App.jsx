import React, { Component } from 'react';
import { AddClientForm } from './AddClientForm.jsx';
import { ClientList } from './ClientList.jsx';
import { ViewClient } from './ViewClient.jsx';
import { loadCalendarApi } from './CalendarFetcher';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "manageClients",
      client: null
    };

    this.changePage = this.changePage.bind(this);
    this.handleClientSelected = this.handleClientSelected.bind(this);
  }
  
  componentDidMount() {
    loadCalendarApi();
  }

  changePage(page) {
    this.setState({ page : page });
  }

  handleClientSelected(clientId) {
    this.setState({
      page: "viewClient",
      clientId: clientId
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>
            <a href="./" style={{textDecoration: "none", color: "#FFF"}}>
              <img src="./images/logo.svg" className="App-logo" alt="logo" />
              Adventurous invoices
            </a>
          </h1>
          <NavBar onClick={this.changePage} />
        </div>
        <PageChooser 
          dbUrl={this.props.url}
          pollInterval={this.props.pollInterval}
          page={this.state.page} 
          clientId={this.state.clientId}
          onClientSelected={this.handleClientSelected}
          onChangePage={this.changePage} />
      </div>
    );
  }
}

export default App;

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e.target.dataset.value);
  }

  render() {
    return (
      <nav style={{textAlign: 'left'}}>
        <a href="#" data-value="manageClients" onClick={ this.handleClick } style={{textDecoration: "none", color: "#FFF"}}>Clients</a>
        <button id="authorize-button" style={{display: "none", float: 'right'}}>Authorize</button>
        <button id="signout-button" style={{display: "none", float: 'right'}}>Sign Out</button>
      </nav>
    );
  }
}

class PageChooser extends Component {
  render() {
    switch(this.props.page) {
      case 'manageClients':
        return (<div>
            <div style={{display: "inline-block", verticalAlign: "top", marginRight: "3em"}}>
              <AddClientForm 
                url={this.props.dbUrl}
                onClientSelected={this.props.onClientSelected} />
            </div>
            <div style={{display: "inline-block", verticalAlign: "top"}}>
              <ClientList 
                url={this.props.dbUrl} 
                pollInterval={this.props.pollInterval}
                onClientSelected={this.props.onClientSelected}/>
            </div>
          </div>);
        break;
      case 'viewClient':
        return <ViewClient url={this.props.dbUrl}
                 clientId={this.props.clientId}
                 onChangePage={this.props.onChangePage} />
        break;
      default:
        return <div>Choose another, I suppose?</div>
    }
  }
}
