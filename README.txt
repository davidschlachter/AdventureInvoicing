Adventurous invoicer 0.5 (free)

Quick start:
  mongod.exe from db folder
in separate windows:
  npm start
  node bin\www (or node bin/www)

To fetch events from calendar, you'll 
need to update the calendar id in 
CalendarFetcher.js and log in via the
button in the upper-right of the app

Stuff that isn't quite finished:
- Settings Page
  For selecting the calendar mostly,
  as well as other misc. settings

- Upcoming events on the client page
  Events should already show up in the
  table, but the table doesn't have the
  right columns; among other things,
  start and end date should be replaced
  by date and start/end time and total
  time. I have design pictures but they
  basically mirror the specs you gave

- Emailing the invoice
  Google api should allow it, basically
  the pending components on the client 
  page need to be combined into an
  editable message, that can then be
  sent and then saved. Data model is
  designed to be stretchy, so it doesn't
  have to be saved a certain way in the
  database (the previous invoices
  section will have to be completed to
  match however they're saved though)

- Date selectors for prev. events
  Start date should automatically be the
  date of last invoice + 1 if a previous
  invoice exists.


Note: the url of the webapp must be specified in index.jsx
