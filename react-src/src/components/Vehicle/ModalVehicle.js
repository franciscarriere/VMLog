import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormVehicle from './FormVehicle';

class ModalVehicle extends Component {

  render() {
    return (
      <Modal
        trigger={<Button color={this.props.buttonColor}>{this.props.buttonTriggerTitle}</Button>}
        dimmer='inverted'
        size='tiny'
        closeIcon='close'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <FormVehicle
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            clientID={this.props.clientID}
            vehicleID={this.props.vehicleID}
            onVehicleAdded={this.props.onVehicleAdded}
            onVehicleUpdated={this.props.onVehicleUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalVehicle;
