import React, { Component } from 'react';
import L from 'leaflet';  
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'; 
import './App.css'; 
import othersLocation from './othersLocation.svg';
import userLocation from './userLocation.svg';
import {getMessages, getLocation, sendMessage} from './Api';
import MessageCard from './MessageCard';


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
     getMessages()
     .then(messages => {
      this.setState({ 
        messages
      })
     });
    

     getLocation()
      .then(location => {
        this.setState({
          location,
        haveUsersLocation: true,
        zoom: 13,
      });
      })
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
        this.setState({
          sendingMessage: true
        });
        const message = {
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude: this.state.location.lat,
          longitude: this.state.location.lng
        };
        sendMessage(message)
        .then(result => {
          setTimeout(() => {
            this.setState({ 
              sendingMessage: false,
              sentMessage: true
            });
          }, 2000);
        })
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
     <MessageCard 
     sendingMessage={this.state.sendingMessage}
     sentMessage={this.state.sentMessage}
     haveUsersLocation={this.state.haveUsersLocation}
     formSubmitted={this.formSubmitted}
     valuechanged={this.valuechanged}
     formIsvalid={this.formIsvalid}
     />
  </div>
    );
  }
}

export default App;
