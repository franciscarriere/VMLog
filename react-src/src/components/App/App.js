import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import Header from '../Header/Header';
import TableClient from '../Client/TableClient';
import ModalClient from '../Client/ModalClient';
import ModalActivity from '../Activity/ModalActivity';

class App extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);

    this.state = {
      clients: [],
      online: 0
    }

    this.fetchClients = this.fetchClients.bind(this);
    this.handleClientAdded = this.handleClientAdded.bind(this);
    this.handleClientUpdated = this.handleClientUpdated.bind(this);
    this.handleClientDeleted = this.handleClientDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this.fetchClients();
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handleClientAdded(data));
    this.socket.on('update', data => this.handleClientUpdated(data));
    this.socket.on('delete', data => this.handleClientDeleted(data));
  }

  // Fetch data from the back-end
  fetchClients() {
    axios.get(`${this.server}/api/clients/`)
    .then((response) => {
      this.setState({ clients: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleClientAdded(client) {
    let clients = this.state.clients.slice();
    clients.push(client);
    this.setState({ clients: clients });
  }

  handleClientUpdated(client) {
    let clients = this.state.clients.slice();
    for (let i = 0, n = clients.length; i < n; i++) {
      if (clients[i]._id === client._id) {
        clients[i].name = client.name;
        clients[i].email = client.email;
        clients[i].age = client.age;
        clients[i].gender = client.gender;
        break; // Stop this loop, we found it!
      }
    }
    this.setState({ clients: clients });
  }

  handleClientDeleted(client) {
    let clients = this.state.clients.slice();
    clients = clients.filter(c => { return c._id !== client._id; });
    this.setState({ clients: clients });
  }

  handleActivityAdded(activity) {
    
  }

  render() {

    let online = this.state.online;
    let verb = (online <= 1) ? 'is' : 'are'; // linking verb, if you'd prefer
    let noun = (online <= 1) ? 'person' : 'people';

    return (
      <div>
        <Header/>
        <Container>
        <h2>Quick Actions</h2>
        <ModalActivity
            headerTitle='Log Work'
            buttonTriggerTitle='Log Work'
            buttonSubmitTitle='Submit'
            buttonColor='grey'
            onActivityAdded={this.handleActivityAdded}
            server={this.server}
            socket={this.socket}
          />
        <h2>Clients</h2>
          <ModalClient
            headerTitle='Add Client'
            buttonTriggerTitle='+ Client'
            buttonSubmitTitle='Add'
            buttonColor='green'
            onClientAdded={this.handleClientAdded}
            server={this.server}
            socket={this.socket}
          />
          <TableClient
            onClientUpdated={this.handleClientUpdated}
            onClientDeleted={this.handleClientDeleted}
            clients={this.state.clients}
            server={this.server}
            socket={this.socket}
          />
        </Container>
        <br/>
      </div>
    );
  }
}

export default App;
