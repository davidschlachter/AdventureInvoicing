import React, { Component } from 'react';

export class EmailBoxes extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.removeEmail = this.removeEmail.bind(this);
    }

    handleChange(e) {
        this.props.onChange(e.target.dataset.indexNumber, e.target.value);
    }
    
    removeEmail(e) {
        //if(this.props.emails[e.target.index] === "" || window.confirm('Remove this email address?')) {
            this.props.removeEmail(e.target.dataset.indexNumber);
        //}
    }

  render() {
      const invisibleX = (i) => {
          return i == 0 ? <div /> : <button onClick={this.removeEmail} data-index-number={i} type="button">x</button>;
      };
      
      const emailBoxes = this.props.emails.map((email, i) => {
          return (
            <div id={"email_" + (i + 1)} key={"email_" + (i + 1)}>
                <label htmlFor={"email_" + (i + 1)}>Email {i + 1}</label><input type="text" id={"email_" + (i + 1)} value={email} data-index-number={i} onChange={ this.handleChange } />
                  {invisibleX(i)}
            </div>
          );
      });
      
      return (
        <div>
            { emailBoxes }
        </div>
      );
  }
}