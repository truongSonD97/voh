import React from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


class AutoRecordInput extends React.Component {
  constructor(props) {
    super(props);
    let property = this.props.property ? this.props.property : 'name';
    this.state = {
      property
    }
  }

  onSuggestionSelected = (event, value) => {
    let id = this.props.id;
    console.log("======value suggest",value);
    this.props.onChange(id, value ? value[this.state.property] : null);
    if (this.props.handleRelativeInput && value !== null) {
      let relativeInput = (id === 'direction' || id === 'phoneNumber') ? "name" : this.props.relativeInput;
      this.props.handleRelativeInput(value ? value[relativeInput] : null, this.props.relativeInput);
    }
    this.props.setIdList(id, value);
  };

  createFilterOptions = options => {
    let input = this.props.inputProps?this.props.inputProps.trim():"";
    input = this.stripDiacritics(input.toLowerCase());
    let result =  options.filter(option => {
      let candidate = this.getCandidate(option, this.props.id, this.state.property);
      candidate = this.stripDiacritics(candidate.toLowerCase());
      return candidate.indexOf(input) > -1;
    });
    return result.slice(0, 15);
  };

  getCandidate = (option, id, property) => {
    if (id === "addresses" || id === "direction") {
      return option.name + (option.direction !== null && option.direction !== '' ? ' hướng ' + option.direction : '');
    } else {
      return option[property];
    }
  };

  stripDiacritics(string) {
    return typeof string.normalize !== 'undefined'
      ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : string;
  }

  render() {
    let props = this.props;
    return (
      <Autocomplete
        freeSolo
        id={props.id+"-input"}
        value={props.inputProps}
        options={props.dataList}
        onChange={(event,value) => this.onSuggestionSelected(event, value)}
        filterOptions={this.createFilterOptions}
        getOptionLabel={x=>typeof(x)==="object"?this.getCandidate(x, this.props.id, this.state.property):x}
        renderInput={params => (
          <TextField
            {...params}
            onClick={()=>{
              if(props.multiline && props.input) {
                let value = props.inputProps;    
                let newValue = value.substr(-1) === " " ? value.substr(0, value.length - 1) : value + " ";
                props.onChange(props.id, newValue);
              }
            }}
            variant={ this.props.variant?this.props.variant:"outlined" }
            label={props.label}
            fullWidth
            error={!!props.error}
            helperText={props.error?props.error:''}
            onChange={(event) => {
              props.onChange(props.id,event.target.value)
              }}
            multiline={props.multiline?props.multiline:undefined}
            rows={props.multiline?2:undefined}
            rowsMax={props.multiline?2:undefined}
            placeholder={this.props.id==="reasons"?"Chưa rõ nguyên nhân":undefined}
            InputLabelProps={{
              shrink: this.props.id==="reasons"?true:undefined
            }}
          />
        )}
      />
    )
  }
}

 export default AutoRecordInput