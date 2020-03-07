import React, { Component } from 'react';
import api from '../../../utils/api';
import { Form,Col,Dropdown } from 'react-bootstrap';
class Modify extends Component {
    constructor(props) {
        super(props);
        this.role=["ROLE_ADMIN","ROLE_MC","ROLE_EDITOR","ROLE_DATAENTRY",""]
        let data = this.props.userInfo || {};
        this.state = {
            info: data
        }
        
    }
    componentDidMount(){
      if(this.props.onRef) {
        this.props.onRef(this);
      }
      console.log("props pass ",this.state.info);
    }

    componentWillUnmount() {
      if(this.props.onRef) {
        this.props.onRef(undefined)
      }
    }
  
    updateInfo=(event)=>{
        
        console.log("-----------data--------",this.state.info);
        this.props.closeModal();
    }

    handleInputChange = (event) =>{
      let fieldName = event.target.name;
      let fleldVal = event.target.value;
      this.setState({info: {...this.state.info, [fieldName]: fleldVal}})
    }
    render() {
        return (
            <Form>
                <Form.Row className='d-flex justify-content-around'>
                    <Form.Group as={Col} controlId="formGridUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                        name = "username"
                        value={this.state.info.username} 
                        onChange={(event)=>this.handleInputChange(event)} 
                        placeholder="Enter username"/>
                      
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                        name='password'
                        value={this.state.info.password}
                        onChange={(event)=>this.handleInputChange(event)}
                        placeholder="Password" />
                    </Form.Group>
                </Form.Row>
                <Form.Row className='d-flex justify-content-around'>
                <Form.Group controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    name='name'
                    value={this.state.info.name}
                    onChange={(event)=>this.handleInputChange(event)} 
                    placeholder="Name" />
                </Form.Group>

                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                    name='phoneNumber'
                    value={this.state.info.phoneNumber} 
                    placeholder="Enter Phone Number" />
                </Form.Group>
                </Form.Row>
                <Form.Group style={{ width: '100%' }}>
                <Form.Label>Loại tài khoản</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}
                    size="sm"
                  >
                    {this.state.info.role ? this.state.info.role : "Loại tài khoản"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: '20em', overflow: 'auto' }}>
                    {this.role.map((item, idx) =>
                      <Dropdown.Item
                        key={idx}
                        onClick={() => {
                          let info = {...this.state.info};
                          info.role = item;
                          this.setState({info});
                        }}
                      >
                        {item}
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form>
        )
    }

}
export default Modify;