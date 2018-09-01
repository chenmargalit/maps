import React from 'react';
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';


export default (props) => {
    return (
        <Card body className="message-form">
     {
        !props.sendingMessage && !props.sentMessage && props.haveUsersLocation ?
        <div>
        <CardTitle>Welcome to Guest Map</CardTitle>
        <CardText>Leave a message with your location</CardText>
           <Form onSubmit={props.formSubmitted}>
           <FormGroup>
             <Label for="name">Name</Label>
             <Input
               onChange={props.valuechanged}
               type="text" 
               name="name" 
               id="name" 
               placeholder="Enter your name" />
           </FormGroup>
           <FormGroup>
             <Label for="message">Message</Label>
             <Input
               onChange={props.valuechanged}
               type="textarea" 
               name="message" 
               id="message" 
               placeholder="Enter a message" />
           </FormGroup>
           <Button type="submit" color="info" disabled={props.formIsValid}>Send</Button>
         </Form>
          </div> :
         props.sendingMessage || !props.haveUsersLocation ? 
         <video autoPlay loop src="https://i.giphy.com/media/3o6UBgcIcU6NqkxChi/giphy.mp4"></video> :
          <CardText>Thanks for submitting a message</CardText>
        }
       
   </Card>
    );
};