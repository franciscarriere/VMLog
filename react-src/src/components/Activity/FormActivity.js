import React, { Component } from 'react';
import { Message, Button, Form, Select, TextArea } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';
import AttachmentInput from '../Attachments/AttachmentInput';

class FormActivity extends Component {

  constructor(props) {
    super(props);

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);
    
    this.state = {
      client: '',
      vehicle: '',
      kilometrage: 0,
      log: '',

      clientOptions: [],
      isLoadingClient: false,

      vehicleOptions: [],
      isLoadingVehicle: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClientSelect = this.handleClientSelect.bind(this);
    this.handleVehicleSelect = this.handleVehicleSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if client id is provided

    if (this.props.activityID) {
      axios.get(`${this.server}/api/activities/${this.props.activityID}`)
      .then((response) => {
        this.setState({
          client: response.data.client,
          vehicle: response.data.vehicle._id,
          kilometrage: response.data.kilometrage,
          log: response.data.log,
        }, () => {
          this.fetchClient();
          this.fetchVehiclesForClient();
        });        
      })
      .catch((err) => {
        console.log(err);
      });
    } else if (this.props.clientID) {
      this.setState({client: this.props.clientID }, () => { 
        this.fetchClient() 
        if(this.props.vehicleID) {
          this.setState({ vehicle: this.props.vehicleID }, () => { this.fetchVehiclesForClient() })
        }else {
          this.fetchVehiclesForClient();
        }
      })
    } else {
      this.fetchClients();
    }
  }

  fetchClient() {
    this.setState({ isLoadingClient: true })
    axios.get(`${this.server}/api/clients/${this.state.client}`)
    .then((response) => {
      this.setState({ clientOptions: [response.data], isLoadingClient: false });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ clientOptions: [], isLoadingClient: false })
    });
  }

  fetchClients() {
    this.setState({ isLoadingClient: true })
    axios.get(`${this.server}/api/clients/`)
    .then((response) => {
      this.setState({ clientOptions: response.data, isLoadingClient: false });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ clientOptions: [], isLoadingClient: false })
    });
  }

  fetchVehiclesForClient() {
    this.setState({ isLoadingVehicle: true })
    axios.get(`${this.server}/api/vehicles/client/${this.state.client}`)
    .then((response) => {
      this.setState({ vehicleOptions: response.data, isLoadingVehicle: false });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ vehicleOptions: [], isLoadingVehicle: false })
    });
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleClientSelect(e, data) {
    this.setState({ client: data.value, vehicle:undefined, vehicleOptions: [] }, () => {
      this.fetchVehiclesForClient();
    });
  }

  handleVehicleSelect(e, data) {
    this.setState({ vehicle: data.value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const activity = {
      client: this.state.client,
      vehicle: this.state.vehicle,
      kilometrage: this.state.kilometrage,
      log: this.state.log
    }

    // Acknowledge that if the activity id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.activityID ? 'put' : 'post';
    const params = this.props.activityID ? this.props.activityID : '';

    axios({
      method: method,
      responseType: 'json',
      url: `${this.server}/api/activities/${params}`,
      data: activity
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      if (!this.props.activityID) {
        this.setState({
          client: '',
          vehicle: '',
          kilometrage: 0,
          log: '',
        });
        this.props.onActivityAdded(response.data.result);
        this.socket.emit('add', response.data.result);
      }
      else {
        this.props.onActivityUpdated(response.data.result);
        this.socket.emit('update', response.data.result);
      }
      
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.data) {
          this.setState({
            formClassName: 'warning',
            formErrorMessage: err.response.data.msg
          });
        }
      }
      else {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Something went wrong. ' + err
        });
      }
    });
  }

  render() {

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    var clientOptions = []
    this.state.clientOptions.forEach((client) => {
      clientOptions.push({
        key: client._id,
        value: client._id,
        text: client.name
      })
    });

    var vehicleOptions = []
    this.state.vehicleOptions.forEach((vehicle) => {
      vehicleOptions.push({
        key: vehicle._id,
        value: vehicle._id,
        text: vehicle.makemodel
      })
    });


    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Select
          label='Client'
          name='client'
          required
          disabled={this.state.isLoadingClient || this.props.clientID || this.props.activityID}
          loading={this.state.isLoadingClient}
          options={clientOptions}
          value={this.state.client}
          onChange={this.handleClientSelect}
        />
        <Form.Select
          label='Vehicle'
          name='vehicle'
          disabled={this.state.isLoadingVehicle || this.props.vehicleID}
          loading={this.state.isLoadingVehicle}
          options={vehicleOptions}
          value={this.state.vehicle}
          onChange={this.handleVehicleSelect}
        />
        <Form.Input
            label='Kilometrage'
            type='number'
            placeholder='0'
            name='kilometrage'
            value={this.state.kilometrage}
            onChange={this.handleInputChange}
          />
        <Form.TextArea
          label='Work Log'
          placeholder='Describe work performed'
          name='log'
          rows={4}
          required
          value={this.state.log}
          onChange={this.handleInputChange}
        />
        <AttachmentInput
          label='Attachments'
          name='attachments'
        />
        
        <Message
          success
          color='green'
          header='Work log created!'
          content={formSuccessMessage}
        />
        <Message
          warning
          color='yellow'
          header='Uh Oh!'
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormActivity;
