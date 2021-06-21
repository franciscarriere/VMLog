import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalVehicle from './ModalVehicle';
import ModalVehicleConfirmDelete from './ModalVehicleConfirmDelete';

class TableVehicle extends Component {

  render() {

    let vehicles = this.props.vehicles;

    vehicles = vehicles.map((vehicle) => 
      <Table.Row key={vehicle._id}>
        <Table.Cell>{vehicle.makemodel}</Table.Cell>
        <Table.Cell>{vehicle.year}</Table.Cell>
        <Table.Cell>{vehicle.vin}</Table.Cell>
        <Table.Cell>
          <ModalVehicle
              headerTitle='Edit Vehicle'
              buttonTriggerTitle='✍'
              buttonSubmitTitle='Save'
              buttonColor='grey'
              vehicleID={vehicle._id}
              onVehicleUpdated={this.props.onVehicleUpdated}
              server={this.props.server}
              socket={this.props.socket}
            />
          <ModalVehicleConfirmDelete
              headerTitle='Delete Vehicle'
              buttonTriggerTitle='X'
              buttonColor='red'
              vehicle={vehicle}
              onVehicleDeleted={this.props.onVehicleDeleted}
              server={this.props.server}
              socket={this.props.socket}
            />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new client appear on top of the list
    vehicles =  [...vehicles].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Make / Model</Table.HeaderCell>
            <Table.HeaderCell>Year</Table.HeaderCell>
            <Table.HeaderCell>VIN</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {vehicles}
        </Table.Body>
      </Table>
    );
  }
}

export default TableVehicle;
