/** @jsx React.DOM */
var contacts = [];

var PhoneBook = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {contacts:[], filterText: ''};
  },
  loadContactsFromServer: function() {
    this.firebaseRef = new Firebase("https://react-phonebook.firebaseio.com/contacts/");
    var contacts = [];
    this.firebaseRef.on("child_added", function(data){
      contacts.push(data.val());
      this.setState({
        contacts: contacts
      });
    }.bind(this));
  },
  handleContactSubmit: function(contact){
    console.log('contact: ', contact);
    this.firebaseRefs["contacts"].push(contact);
  },

  componentDidMount: function() {
    this.bindAsArray(new Firebase("https://react-phonebook.firebaseio.com/contacts/"), "contacts");
  },

  onFilterContacts: function(query) {
    this.setState({ filterText: query });
  },

  render: function() {
    return (
      <div className="phoneBook">
        <h3>Add New</h3>
        <ContactForm onContactSubmit={this.handleContactSubmit} />
        <h2>List of Contacts</h2>
        <ContactSearch filterText={this.state.filterText} filterContacts={this.onFilterContacts} />
        <ContactList contacts={this.state.contacts} filter={this.state.filterText} />
      </div>
    );
  }
});

var Contact = React.createClass({
  render: function() {
    return (
      <div className="contact">
        <h3 className="contactName">{this.props.name}</h3>
        <p className="contactNumber">{this.props.number}</p>
      </div>
    );
  }
});

var ContactList = React.createClass({
  render: function() {
    var query = this.props.filter;
    var contactEntries = this.props.contacts
    .filter(function(contact) {
      return contact.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
    .map(function(person) {
    return (
        <Contact name={person.name} number={person.number} />
      );
    });
    return (
      <div className="contactList">
        {contactEntries}
      </div>
    );
  }
});

var ContactSearch = React.createClass({
  handleFilter: function() {
    var query = this.refs.search.getDOMNode().value;
    this.props.filterContacts(query);
  },
  render: function() {
    return (
      <input ref="search" type="search" name="searchContact" placeholder="Search" value={this.props.filterText} onChange={this.handleFilter} />
    );
  }
});

var ContactForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var name = this.refs.name.getDOMNode().value.trim();
    var number = this.refs.number.getDOMNode().value.trim();

    if(!name || !number) {
      return false;
    }
    this.props.onContactSubmit({name: name, number: number});
    this.refs.name.getDOMNode().value = '';
    this.refs.number.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
      <form className="contactForm" onSubmit={this.handleSubmit}>
        <fieldset>
          <label>Name: </label>
          <input id="contactName" type="text" name="name" placeholder="Name" ref="name" />
          <label>Phone Number: </label>
          <input id="contactNumber" type="tel" name="phone" placeholder="xxx-xxx-xxxx" ref="number" />
        </fieldset>
        <input className="button--primary" type="submit" value="Save" />
      </form>
    );
  }
});

React.renderComponent(
  <PhoneBook contacts={contacts}/>,
  document.getElementById('content')
);