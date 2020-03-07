import React, {Component} from 'react';
import {Col, Row} from "react-bootstrap";

export default class MessagesItems extends Component {
  render() {
    let current_user = JSON.parse(localStorage.getItem('trafficState')).user;
    let one_message = null;
    if(this.props.message.userName.username === current_user.username){
      one_message =
        <div className="outgoing_msg mt-2">
          <div className="sent_msg">
            <span className="time_date">
              {this.props.message.time.substr(0,5) +' '+this.props.message.date}
            </span>
            <p> {this.props.message.message}</p>
           </div>
        </div>
    }else{
      const letter = this.props.message.userName.name.charAt(0);
      const user_color = this.props.message.userName.username.substr(-1) +
        this.props.message.userName.id.substr(-3) +
        letter + this.props.message.userName.phoneNumber.substr(-1) ;
      one_message =
        <div className="incoming_msg mt-2">
          <Row className={'m-0 d-flex incoming_msg_title'}>
            <strong className="mr-auto">{this.props.message.userName.name}</strong>
            <span className="time_date">{this.props.message.time.substr(0,5) +' '+ this.props.message.date}</span>
          </Row>
          <Row className={'m-0'}>
            <Col sm={1} className={'p-0'}>
              <div className="incoming_msg_img">
                <img src={`http://placehold.it/50/${user_color}/fff&text=${letter}`} alt="Avatar" />
              </div>
            </Col>
            <Col sm={11} className={'p-0'}>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>{this.props.message.message}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
    }
    return (
        <div className={'one_msg'}>{one_message}</div>
    )

  }
}