import React  from 'react';
import CurrentRecords from "../Type/CurrentTable";
import Messages from "../../../Common/messages/Messages";

export default class ReadSolveTable extends React.Component {

  constructor(props) {
    super(props);
    let trafficState = localStorage.getItem('trafficState');
    let user = null;
    if(trafficState){
      user = JSON.parse(trafficState).user ;
    }
    this.state = {
      top: false,
      user
    }
  }
  render() {
    return (
      <div>
        <CurrentRecords user={this.state.user}/>
        <CurrentRecords status="solved" user={this.state.user}/>
        <Messages user={this.state.user}/>
      </div>
    )
  }
}