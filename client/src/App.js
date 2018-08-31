import React, { Component } from 'react';
import L from 'leaflet';  
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'; 
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';
import './App.css'; 
import othersLocation from './othersLocation.svg';
import userLocation from './userLocation.svg';

//theres a problem with the seconnd map, I will write another comment there

var userIcon = L.icon({
  iconUrl: userLocation,
  iconSize: [50, 82],
  iconAnchor: [25, 82],
  popupAnchor: [25, -82],
});

var messageIcon = L.icon({
  iconUrl: othersLocation,
  iconSize: [50, 82],
  iconAnchor: [25, 82],
  popupAnchor: [-25, -100],
});


const API_URL = window.location.hostname === 'localhost' ?
 'http://localhost:5000/api/v1/messages' :
'https://chen-berlin-reccomendations.herokuapp.com/api/v1/messages';

class App extends Component {
  state = {
    location: {
      lat: 52.51325809999999,
      lng: 13.453464199999985,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: '',
      message: ''
    },
    sendingMessage: false,
    sentMessage: false,
    messages: []
  }

  componentDidMount() {
      fetch(API_URL)
      .then(res => res.json())
      .then(messages => {
        const haveSeenLocation = {}
        messages = messages.reduce((all, message) => {
          const key = `${message.longitude.toFixed(3)}${message.latitude.toFixed(3)}`;
          if (haveSeenLocation[key]) {
            haveSeenLocation[key].otherMessages = haveSeenLocation[key].otherMessages || [];
            haveSeenLocation[key].otherMessages.push(message)
          } else {
            haveSeenLocation[key] = message;
            all.push(message);
          }
          return all;
        }, []);
         this.setState({ messages })
      })


      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          location: {
            lng: position.coords.longitude,
            lat: position.coords.latitude
        },
        haveUsersLocation: true,
        zoom: 13,
      });
    }, () => {
      console.log('probelm with getting position');
      fetch ('https://ipapi.co/json')
        .then(res => res.json())
        .then(location => {
          this.setState({
            location: {
              lng: location.longitude,
              lat: location.latitude
          },
          haveUsersLocation: true,
          zoom: 13
        })
        });
    });
  }


  formIsvalid = () => {
    let { name, message } = this.state.userMessage;
      name = name.trim();
      message = message.trim();

      const validMessage = 
        name.length > 0 && name.length <= 500 &&
        message.length > 0 && message.length <= 500;
        

        return validMessage && this.state.haveUsersLocation ? true : false
    };

  formSubmitted = (event) => {
      event.preventDefault();
      if (this.formIsvalid()) {
        fetch(API_URL, {
          method: 'POST', 
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            name: this.state.userMessage.name,
            message: this.state.userMessage.message,
            latitude: this.state.location.lat,
            longitude: this.state.location.lng
          })
        }).then(res => res.json())
        .then(message => {
          console.log(message);
          setTimeout(() => {
            this.setState({ 
              sendingMessage: false,
              sentMessage: true
            });
          }, 2000);
          });
      }
  }

  valuechanged = (event) => {
    const { name, value } = event.target
    this.setState((prevState) => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }))
  }


  render() {
    const { name, message } = this.state.userMessage
    const position = [this.state.location.lat, this.state.location.lng]
    return (
      <div className="map">
      <Map className="map" center={position} zoom={this.state.zoom}>
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        this.state.haveUsersLocation ? 
       <Marker 
       position={position}
       icon={userIcon}>
     </Marker> :  ''
      }
      {this.state.messages.map(message => (
        <Marker
        key={message._id}
        position={[message.latitude, message.longitude]}
        icon={messageIcon}> 
        <Popup>
      <p><em>{message.name}:</em> {message.message}</p>          
      {message.otherMessages ? message.otherMessages.map(message => <p key={message._id}><em>{message.name}:</em> {message.message}</p>) : ''}
    
        </Popup>
      </Marker>
      ))}

     <h1>no user location</h1>
      }
    </Map>
     <Card body className="message-form">
     {
        !this.state.sendingMessage && !this.state.sentMessage && this.state.haveUsersLocation ?
        <div>
        <CardTitle>Welcome to Guest Map</CardTitle>
        <CardText>Leave a message with your location</CardText>
           <Form onSubmit={this.formSubmitted}>
           <FormGroup>
             <Label for="name">Name</Label>
             <Input 
               onChange={this.valuechanged}
               type="text" 
               name="name" 
               id="name" 
               placeholder="Enter your name" />
           </FormGroup>
           <FormGroup>
             <Label for="message">Message</Label>
             <Input
               onChange={this.valuechanged}
               type="textarea" 
               name="message" 
               id="message" 
               placeholder="Enter a message" />
           </FormGroup>
           <Button type="submit" color="info" disabled={!name.length || !message.length}>Send</Button>
         </Form>
          </div> :
         this.state.sendingMessage || !this.state.haveUsersLocation ? 
         <video autoPlay loop src="https://i.giphy.com/media/3o6UBgcIcU6NqkxChi/giphy.mp4"></video> :
          <CardText>Thanks for submitting a message</CardText>
        }
       
   </Card>
  </div>
    );
  }
}

export default App;
