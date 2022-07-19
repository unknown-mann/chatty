import React from 'react';
import SockJsClient from 'react-stomp';
import { ACCESS_TOKEN } from '../constants';

export default class SocketClass extends React.Component {
    
  sendMessage = () => {
    this.clientRef.sendMessage('/app/message/1', JSON.stringify({ name: "Druid" }));
  }

  render() {
    return (
      <div>
        <SockJsClient url='https://chatty-back.herokuapp.com/ws' topics={['/user/therock434619@gmail.com/msg/1']} headers={{ "Authorization": "Bearer " + localStorage.getItem(ACCESS_TOKEN) }}
          onMessage={(msg) => { console.log(msg); }}
          ref={(client) => { this.clientRef = client }} />
        <button onClick={() => this.sendMessage()}>Send</button>
      </div>
    );
  }
}