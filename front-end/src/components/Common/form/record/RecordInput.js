import React from 'react';
import {FormControl, FormGroup, FormLabel} from "react-bootstrap";

export default class RecordInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    let props = this.props;
    return(
      <FormGroup>
        <FormLabel>{props.label}</FormLabel>
        <span style={{ color: "red", fontSize: '12px', fontStyle: 'italic' }}>
          {props.id==='input-notice'?'':' * '}{props.error?props.error:''}
        </span>
        <FormControl
          placeholder={props.label}
          value={props.value}
          onChange={props.onChange}
          as={props.id==="input-direction"?"textarea":undefined}
          rows={props.id==="input-direction"?"2":undefined}
          id={props.id}
        />
      </FormGroup>
    )
  }
}