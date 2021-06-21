import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalClient from './ModalClient';
import ModalClientConfirmDelete from './ModalClientConfirmDelete';

class TableClient extends Component {

  render() {

    let clients = this.props.clients;

    clients = clients.map((client) => 
      <Table.Row key={client._id}>
        <Table.Cell><a href={"/client/" + client._id}>{client.name}</a></Table.Cell>
        <Table.Cell>{client.email}</Table.Cell>
        <Table.Cell>{client.phone}</Table.Cell>
        <Table.Cell>
          <ModalClient
            headerTitle='Edit Client'
            buttonTriggerTitle='✍'
            buttonSubmitTitle='Save'
            buttonColor='grey'
            clientID={client._id}
            onClientUpdated={this.props.onClientUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
          <ModalClientConfirmDelete
            headerTitle='Delete Client'
            buttonTriggerTitle='X'
            buttonColor='red'
            client={client}
            onClientDeleted={this.props.onClientDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new client appear on top of the list
    clients =  [...clients].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {clients}
        </Table.Body>
      </Table>
    );
  }
}

export default TableClient;
