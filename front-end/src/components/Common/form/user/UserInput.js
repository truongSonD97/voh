import React from 'react';
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

export default class UserInput extends React.Component {
  
  render(){
    let props = this.props;
    return(
      <FormGroup>
        <FormLabel><strong>{props.label}</strong></FormLabel>
        <FormControl
          required
          placeholder={`${props.label.toLowerCase()} ...`}
          value={props.value}
          type={props.type?props.type:undefined}
          onChange={props.onChange}
        />
      </FormGroup>
    )
  }
}