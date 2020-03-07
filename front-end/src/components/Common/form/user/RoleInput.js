import React from 'react';
import {Col, Dropdown, Form, FormGroup, FormLabel} from "react-bootstrap";

export default class RoleInput extends React.Component {
  roles = [
    { name: "Quản lý", 			    key: "ROLE_ADMIN" },
    { name: "Biên tập viên", 		key: "ROLE_EDITOR" },
    { name: "Nhập liệu viên", 	key: "ROLE_DATAENTRY" },
    { name: "MC", 					    key: "ROLE_MC" },
    { name: "Thư kí kiêm BTV",  key:"ROLE_DATAENTRY_EDITOR"}
  ];

  render(){
    let props = this.props;
    return(
      <FormGroup>
        <Form.Row>
          <Col md={5}>
            <FormLabel><strong>{props.label}</strong></FormLabel>
          </Col>
          <Col md={7}>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}
                size="sm"
              >
                {(props.value && props.value !=="") ?
                  this.roles.find(item => item['key'] === props.value).name:"Vai trò"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '20em', overflow: 'auto' }}>
                {this.roles.map((item, idx) =>
                  <Dropdown.Item
                    key={idx}
                    onClick={() => {props.handleChangeInput("role", item.key)}}
                  >
                    {item.name}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Row>
      </FormGroup>
    )
  }
}