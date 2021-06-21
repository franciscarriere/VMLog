import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

class FormVehicle extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      client: '',
      makemodel: '',
      year: undefined,
      vin: undefined,
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({client: this.props.clientID})
    
    // Fill in the form with the appropriate data if client id is provided
    if (this.props.vehicleID) {
      axios.get(`${this.props.server}/api/vehicles/${this.props.vehicleID}`)
      .then((response) => {
        this.setState({
          client: response.data.client,
          makemodel: response.data.makemodel,
          year: response.data.year,
          vin: response.data.vin
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    this.setState({ gender: data.value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const vehicle = {
      client: this.state.client,
      makemodel: this.state.makemodel,
      year: this.state.year,
      vin: this.state.vin
    }

    // Acknowledge that if the vehicle id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.vehicleID ? 'put' : 'post';
    const params = this.props.vehicleID ? this.props.vehicleID : '';

    axios({
      method: method,
      responseType: 'json',
      url: `${this.props.server}/api/vehicles/${params}`,
      data: vehicle
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      if (!this.props.vehicleID) {
        this.setState({
          client: this.props.clientID,
          makemodel: '',
          year: 0,
          vin: ''
        });
        this.props.onVehicleAdded(response.data.result);
        this.props.socket.emit('add', response.data.result);
      }
      else {
        this.props.onVehicleUpdated(response.data.result);
        this.props.socket.emit('update', response.data.result);
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

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label='Make / Model'
          type='text'
          placeholder='Mazda CX-9'
          name='makemodel'
          maxLength='60'
          required
          value={this.state.makemodel}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label='Year'
          type='number'
          placeholder='2009'
          name='year'
          required
          value={this.state.year}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label='VIN (Vehicle Identification Number)'
          type='text'
          placeholder=''
          name='vin'
          value={this.state.vin}
          onChange={this.handleInputChange}
        />

        <Message
          success
          color='green'
          header='Vehicle created!'
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

export default FormVehicle;
