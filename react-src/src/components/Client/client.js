import React from 'react'
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';
import io from 'socket.io-client';

import Header from '../Header/Header';

import ModalActivity from '../Activity/ModalActivity';
import ModalClient from './ModalClient';
import ModalVehicle from '../Vehicle/ModalVehicle';

import TableVehicle from '../Vehicle/TableVehicle';
import TableActivity from '../Activity/TableActivity';

class Client extends React.Component {

    constructor() {
        super();

        this.server = process.env.REACT_APP_API_URL || '';
        this.socket = io.connect(this.server);
        
        this.state = {
            client: {},
            vehicles: [],
            activities: []
        }

        this.handleActivityAdded = this.handleActivityAdded.bind(this);
        this.handleActivityUpdated = this.handleActivityUpdated.bind(this);
        this.handleActivityDeleted = this.handleActivityDeleted.bind(this);
        this.handleClientUpdated = this.handleClientUpdated.bind(this);
        this.handleVehicleAdded = this.handleVehicleAdded.bind(this);
        this.handleVehicleUpdated = this.handleVehicleUpdated.bind(this);
        this.handleVehicleDeleted = this.handleVehicleDeleted.bind(this);

    }

    // Place socket.io code inside here
    componentDidMount() {
        let clientId = this.props.match.params.clientId
        this.fetchClient(clientId)
        this.fetchVehicles(clientId)
        this.fetchActivities(clientId)
    }

    fetchClient(clientID) {
        axios.get(`${this.server}/api/clients/${clientID}`)
        .then((response) => {
            this.setState({ client: response.data });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    fetchVehicles(clientID) {
        axios.get(`${this.server}/api/vehicles/client/${clientID}`)
        .then((response) => {
            this.setState({ vehicles: response.data });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    fetchActivities(clientID) {
        axios.get(`${this.server}/api/activities/client/${clientID}`)
        .then((response) => {
            this.setState({ activities: response.data });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleActivityAdded(activity) {
        let activities = this.state.activities.slice();
        activities.push(activity);
        this.setState({ activities: activities });
    }

    handleActivityUpdated(activity) {
        let activities = this.state.activities.slice();
        for (let i = 0, n = activities.length; i < n; i++) {
          if (activities[i]._id === activity._id) {
            activities[i].client = activity.client;
            activities[i].vehicle = activity.vehicle;
            activities[i].log = activity.log;
            activities[i].kilometrage = activity.kilometrage
            break; // Stop this loop, we found it!
          }
        }
        this.setState({ activities: activities });
    }

    handleActivityDeleted(activity) {
        let activities = this.state.activities.slice();
        activities = activities.filter(a => { return a._id !== activity._id; });
        this.setState({ activities: activities });
    }

    handleClientUpdated(client) {
        this.setState({ client: client })
    }

    handleVehicleAdded(vehicle) {
        let vehicles = this.state.vehicles.slice();
        vehicles.push(vehicle);
        this.setState({ vehicles: vehicles });
    }

    handleVehicleUpdated(vehicle) {
        let vehicles = this.state.vehicles.slice();
        for (let i = 0, n = vehicles.length; i < n; i++) {
          if (vehicles[i]._id === vehicle._id) {
            vehicles[i].makemodel = vehicle.makemodel;
            vehicles[i].year = vehicle.year;
            break; // Stop this loop, we found it!
          }
        }
        this.setState({ vehicles: vehicles });
    }

    handleVehicleDeleted(vehicle) {
        let vehicles = this.state.vehicles.slice();
        vehicles = vehicles.filter(v => { return v._id !== vehicle._id; });
        this.setState({ vehicles: vehicles });
    }

    render() {
        let client = this.state.client;
        let vehicles = this.state.vehicles;
        let activities = this.state.activities;

        return <div>
            <Header />
            <Container>
                
            <h2>Client Info</h2>
            <ModalClient
                headerTitle='Edit Client'
                buttonTriggerTitle='✍ Client'
                buttonSubmitTitle='Save'
                buttonColor='blue'
                clientID={this.props.match.params.clientId}
                onClientUpdated={this.handleClientUpdated}
                server={this.server}
                socket={this.socket}
            />
            <Table singleLine>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Phone</Table.HeaderCell>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                <Table.Row key={client._id}>
                    <Table.Cell>{client.name}</Table.Cell>
                    <Table.Cell>{client.email}</Table.Cell>
                    <Table.Cell>{client.phone}</Table.Cell>
                </Table.Row>
                </Table.Body>
            </Table>

            <h2>Vehicles</h2>
            <ModalVehicle
                headerTitle='Add Vehicle'
                buttonTriggerTitle='+ Vehicle'
                buttonSubmitTitle='Add'
                buttonColor='green'
                clientID={client._id}
                onVehicleAdded={this.handleVehicleAdded}
                server={this.server}
                socket={this.socket}
            />
            <TableVehicle
                onVehicleUpdated={this.handleVehicleUpdated}
                onVehicleDeleted={this.handleVehicleDeleted}
                vehicles={vehicles}
                server={this.server}
                socket={this.socket}
                />

            <h2>Activity Log</h2>
            <ModalActivity
                headerTitle='Log Work'
                buttonTriggerTitle='Log Work'
                buttonSubmitTitle='Submit'
                buttonColor='grey'
                clientID={client._id}
                onActivityAdded={this.handleActivityAdded}
                server={this.server}
                socket={this.socket} />
            <TableActivity
                onActivityDeleted={this.handleActivityDeleted}
                onActivityUpdated={this.handleActivityUpdated}
                handleActivityAdded={this.handleActivityAdded}
                activities={activities}
                server={this.server}
                socket={this.socket}
                />

            </Container>
        </div>
    }
}
export default Client