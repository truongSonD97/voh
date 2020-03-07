import React, { Component } from 'react';
import './Messages.css';
import Index from './messagesItems/MessagesItems';
import firebase from '../../../utils/firebase';
import {Accordion, Button, Card ,Row } from "react-bootstrap";
import SmsIcon from '@material-ui/icons/Sms';
import Tooltip from '@material-ui/core/Tooltip';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.switchIsOpenChat = this.switchIsOpenChat.bind(this);
    
    let userName = this.props.user ? this.props.user : '';
    this.state = {
      userName,
      message: '',
      list: [],
      isFirstOpenChat: true,
      isPushNotification:false,
      userRead:[]
    };
    this.messageRef = firebase.database().ref().child('messages');
    this.userReadRef = firebase.database().ref().child("userRead");

    

    setTimeout(this.listenMessages,1000);

    setTimeout(this.listenListUserRead,1000);
  }

  handleChange(event) {
    this.setState({message: event.target.value});
    
  }

  handleSend() {
    var today = new Date();
    var date = today.getDate()+'-'+ (today.getMonth()+1) +'-'+ today.getFullYear()  ;
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (this.state.message) {
      var newItem = {
        userName: this.state.userName,
        message: this.state.message,
        date: date,
        time : time
      };
      this.messageRef.push(newItem);
      let newUserReads = [this.state.userName.id]
      this.userReadRef.set(newUserReads );
      this.setState({ message: '' });
    }
  }
  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handleSend();
    this.scrollToBottom();
  }

  updateUserRead = () =>{
    let currentUserReads = this.state.userRead;
    if(currentUserReads.indexOf(this.state.userName.id)<0){
      currentUserReads.push(this.state.userName.id);
      this.userReadRef.set(currentUserReads);
      this.setState({userRead:currentUserReads});
    }
  };

  listenListUserRead = () =>{
    this.userReadRef.on("value",(snapshot) => {
        let currentList = snapshot.val() ? snapshot.val() : [];
        if(currentList.indexOf(this.state.userName.id) < 0){
          this.setState({isPushNotification:true})
        }
        this.setState({userRead:currentList});
    })
  };

  listenMessages =() =>{
    let list = [];
    this.messageRef
      .limitToLast(20)
      .on('child_added',(dataSnapshot)=>{
          list = [dataSnapshot.val()].concat(list);
          this.setState({list});
          
      });    
  };

  switchIsOpenChat(){
    let isFirstOpenChat = this.state.isFirstOpenChat;
    if(isFirstOpenChat) {
      setTimeout(this.scrollToBottom, 500);
      isFirstOpenChat = false;
      this.setState({isFirstOpenChat});
    }
    else {
      this.scrollToBottom();
    }
  }

  scrollToBottom(){
    let objDiv = document.getElementById("msg_history") ;
    if(objDiv){
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  render() {
    return (
      <Accordion id='chat-box'>
        <Card>
          <Card.Header id='chat-header'>
            <Accordion.Toggle as={Button} eventKey="0" onClick={this.switchIsOpenChat}>
              <Row className={'m-0 d-flex'}>
                <strong className="mr-auto"><QuestionAnswerIcon/> Nhóm Chat</strong>
                {this.state.isPushNotification ?
                  <Tooltip title="Có tin nhắn mới">
                    <SmsIcon id='unread-ic'/>
                  </Tooltip>
                : ""
                }
              </Row>
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className='p-0'>
              <div className="messages">
                <div className="msg_history pb-2" id={"msg_history"}>
                  <div className="inner-msg_history" id={"inner-msg_history"}>
                    { this.state.list.map((item, index) => {
                       return  <Index key={index} message={item}/>
                      }
                    )}
                  </div>
                </div>
                <div className="type_msg">
                  <div className="input_msg_write">
                    <input
                        type="text"
                        className="write_msg"
                        placeholder="Nhập tin nhắn"
                        onFocus={()=>{
                          if(this.state.isPushNotification){
                            this.setState({isPushNotification:false});
                            this.updateUserRead();

                          }
                        }}
                        value={this.state.message}
                        onChange={this.handleChange.bind(this)}
                        onClick={()=>{
                          if(this.state.isPushNotification){
                            this.setState({isPushNotification:false})
                            this.updateUserRead();
                          }
                        }}
                        checked={()=>{
                          if(this.state.isPushNotification){
                            this.setState({isPushNotification:false})
                          }
                        }}
                        onKeyPress={this.handleKeyPress.bind(this)}/>
                    <button
                        className="msg_send_btn"
                        onClick={this.handleSend.bind(this)}>
                      <i className="fa fa-paper-plane-o"/>
                    </button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}