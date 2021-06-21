import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormActivity from './FormActivity';

class ModalClient extends Component {

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
          <FormActivity
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            activityID={this.props.activityID}
            clientID={this.props.clientID}
            vehicleID={this.props.vehicleID}
            onActivityAdded={this.props.onActivityAdded}
            onActivityUpdated={this.props.onActivityUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalClient;
