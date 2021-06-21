import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import Moment from 'moment';

import ModalActivity from './ModalActivity'
import ModalActivityConfirmDelete from './ModalActivityConfirmDelete';

class TableActivity extends Component {

  render() {

    let activities = this.props.activities;

    activities = activities.map((activity) => 
      <Table.Row key={activity._id}>
        <Table.Cell>{ Moment(activity.createdAt).format('DD/MM/YY h:mma') }</Table.Cell>
        <Table.Cell>{activity.vehicle.makemodel}</Table.Cell>
        <Table.Cell>{activity.kilometrage ? activity.kilometrage.toLocaleString() : ''}</Table.Cell>
        <Table.Cell><pre>{activity.log}</pre></Table.Cell>
        <Table.Cell>
          <ModalActivity
              headerTitle='Edit Activity'
              buttonTriggerTitle='✍'
              buttonSubmitTitle='Save'
              buttonColor='grey'
              activityID={activity._id}
              onActivityUpdated={this.props.onActivityUpdated}
              server={this.props.server}
              socket={this.props.socket}
            />
          <ModalActivityConfirmDelete
            headerTitle='Delete Activity'
            buttonTriggerTitle='X'
            buttonColor='red'
            activity={activity}
            activityID={activity._id}
            onActivityDeleted={this.props.onActivityDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new activity appear on top of the list
    activities =  [...activities].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Vehicle</Table.HeaderCell>
            <Table.HeaderCell>KMs</Table.HeaderCell>
            <Table.HeaderCell>Work Log</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {activities}
        </Table.Body>
      </Table>
    );
  }
}

export default TableActivity;
