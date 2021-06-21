import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormClient from './FormClient';

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
          <FormClient
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            clientID={this.props.clientID}
            onClientAdded={this.props.onClientAdded}
            onClientUpdated={this.props.onClientUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalClient;
