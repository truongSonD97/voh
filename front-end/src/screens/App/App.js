import React from 'react';
import Login from '../../components/Login/Login';
import Navigation from '../../components/Common/navbar/Navigation';
import Root from '../Root';
import { BrowserRouter as Router } from 'react-router-dom';
import api from '../../utils/api';
const messageLoginFail = 'Thông tin đăng nhập không chính xác';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleCurrentPageChange = this.handleCurrentPageChange.bind(this);
    let trafficState = localStorage.getItem('trafficState');
    let isLogin = false;
    let user = null;
    if (trafficState) {
      isLogin = JSON.parse(trafficState).isLogin;
      user = JSON.parse(trafficState).user;
    }
    this.state = {
      isLogin,
      user,
      isSubmit: true,
      messAfterSubmit :'',
      currentPage: 'home',
    }
  }
  handleCurrentPageChange(currentPage){
    this.setState({ currentPage })
  };

  componentDidMount() {
    document.title = "Kênh giao thông đô thị VOH"
  }

  logOut(mess) {
    localStorage.removeItem('trafficState');
    this.setState({ isLogin: false, user: null });
  }

  logIn(data, time_spinner) {
    // console.log("DATA PARAM",data, time_spinner);
    api.login(data).then(response => {
      if (response.success) {
        if (response.data) {
          localStorage.setItem('trafficState', JSON.stringify({ 'isLogin': true, 'user': response.data.user }));
          this.setState({ user: response.data.user });
        }
        clearTimeout( time_spinner);
        this.setState({ isLogin: true });

      }
      else {
        if(response.code !== -1){
          this.setState({messAfterSubmit:messageLoginFail});
          clearTimeout( time_spinner);
        }
        
      }
    })
  }

  render() {
    if (!this.state.isLogin) return (
      <div>
        <Login 
        message = {this.state.messAfterSubmit}
        onChange={(data,time_spinner) => this.logIn(data,time_spinner)} />
      </div>
    )
    else {
      return (
        <Router>
          <div className="main-contain">
            <Navigation
              onChange={(mess) => this.logOut(mess)}
              user={this.state.user}
              currentPage={this.state.currentPage}
            />
            <Root
              user={this.state.user}
              handleCurrentPageChange={this.handleCurrentPageChange}/>
          </div>
        </Router>
      );
    }
  }
}
