Adventurous Invoicer

Quick start:

Copy config.js.sample to config.js and specify database url (with authentication if required), paths, Google Calendar API key and calendar ID.

In Invoices folder:

- run `npm install`
- run `npm run-script build`
- start the app with `npm start` or `node bin/www`

The app will listen on port 8311 by default.

To fetch events from the calendar, you'll need to update the calendar id in `config.js` and log in via the button in the upper-right of the app ('Authorize').

Stuff that isn't quite finished:

- Emailing the invoice Google api should allow it, basically the pending components on the client page need to be combined into an editable message, that can then be sent and then saved. Data model is designed to be stretchy, so it doesn't have to be saved a certain way in the database (the previous invoices section will have to be completed to match however they're saved though)

- Date selectors for prev. events Start date should automatically be the date of last invoice + 1 if a previous invoice exists.
