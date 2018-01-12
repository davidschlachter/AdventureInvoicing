import React, { Component } from 'react';
import moment from 'moment';

var config = require('../config');

// Client ID and API key from the Developer Console
var CLIENT_ID = config.opt.CLIENT_ID;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";


export function loadCalendarApi() {

  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');

  /**
       *  On load, called to load the auth2 library and API client library.
       */
  function handleClientLoad() {
    window.gapi.load('client:auth2', initClient);
  }

  /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
  function initClient() {
    window.gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    });
  }

  /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'inline-block';
      listUpcomingEvents();
    } else {
      authorizeButton.style.display = 'inline-block';
      signoutButton.style.display = 'none';
    }
  }

  /**
       *  Sign in the user upon button click.
       */
  function handleAuthClick(event) {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  /**
       *  Sign out the user upon button click.
       */
  function handleSignoutClick(event) {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    // FOR TESTING PURPOSES: SHOWS EVENTS OF THE PAST AT THE BOTTOM :D
    //pre.appendChild(textContent);
  }

  /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
  function listUpcomingEvents() {
    window.gapi.client.calendar.events.list({
      'calendarId': config.opt.calendar_id,
      //'timeMax': (new Date()).toISOString(),
      //'timeMin': (new Date(new Date().getTime() - (60*60*24*7*1000))).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      appendPre('Previous events:');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + ' (' + when + ')')
        }
      } else {
        appendPre('No previous events found.');
      }
    });
  }

  setTimeout(handleClientLoad, 200);
}

export class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: null,
      timeMin: props.timeMin,
      timeMax: props.timeMax,
    };

    this.getEvents = this.getEvents.bind(this);
  }

  getEvents(emails, timeMin, timeMax) {
    window.gapi.client.calendar.events.list({
      'calendarId': config.opt.calendar_id,
      'timeMax': (timeMax || moment()).toISOString(),
      'timeMin': (timeMin || this.oneWeekAgo()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'orderBy': 'startTime',
      'q': emails.join(' ')
    }).then((response) => {
      let events = response.result.items.map((event) => {
        return {
          eventId: event.id,
          summary: event.summary,
          startTime: event.start.dateTime || event.start.date,
          endTime: event.end.dateTime || event.end.date,
          rate: 12.50
        };
      })
      
      if(this.props.onEventsLoaded)
        this.props.onEventsLoaded(events);

      this.setState({events: events});
    });
  }

  componentDidMount() {
    this.getEvents(this.props.emails, this.props.timeMin, this.props.timeMax);
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.state.timeMin != nextProps.timeMin || this.state.timeMax != nextProps.timeMax) {
      this.getEvents(nextProps.emails, nextProps.timeMin, nextProps.timeMax);
      this.setState({
        timeMin: nextProps.timeMin,
        timeMax: nextProps.timeMax,
      });
    }
  }

  oneWeekAgo() {
    return moment.subtract(7, days);
  } 

  render() {
    // If viewing/processing is being managed by something else
    if(this.props.dontDisplay)
      return null;
    
    if(this.state.events && this.state.events.length) 
      return (<div>
          {this.state.events.map((event) => {
            return <p key={event.eventId}>{event.summary} ({event.startTime} to {event.endTime})</p>;
          })}
        </div>);
    else 
      return <p>No events found in the last week</p>;
  }
}
