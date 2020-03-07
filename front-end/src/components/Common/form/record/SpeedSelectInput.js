import React from 'react';
import PropTypes from "prop-types";
import { FormControl, InputLabel, Select, MenuItem, Grid, TextField, FormHelperText } from "@material-ui/core";

class SpeedSelectInput extends React.Component {
  constructor(props) {
    super(props);
    let speedInput = this.props.speedInput ?  this.props.speedInput :"";
    let speeds = this.props.speeds ? this.props.speeds: [] ;
    
    this.state = {
      speedInput,
      speeds,
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.speeds && nextProps.speeds !== this.state.speeds){
      this.setState({speeds: nextProps.speeds});
    }
    if(nextProps.speedInput === "" || (nextProps.speedInput && nextProps.speedInput !== this.state.speedInput)){
      this.setState({ speedInput: nextProps.speedInput });
    }
  }

  render(){
    let state = this.state ;
    return(
      <Grid container spacing={1} className={"inputField"} id={"speedGrid"}>
        <Grid item xs={12} sm={8}>
          <FormControl
            fullWidth
            variant="outlined"
            error={!!this.props.error}
            helperText={this.props.error?this.props.error:''}
          >
            <InputLabel id={"speedLabel"}>Tình trạng giao thông *</InputLabel>
            <Select
              value={state.speedInput}
              onChange={event => this.props.handleChangeSpeed(event.target.value)}
              renderValue={value=>value.name}
            >
              <MenuItem value=""> </MenuItem>
              {state.speeds.map(item =>
                <MenuItem value={item} key={item.id} >
                  {item.name}
                </MenuItem>
              )}
            </Select>
            <FormHelperText>{this.props.error}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            variant="outlined"
            disabled
            label="Vận tốc dòng xe"
            value={state.speedInput ? state.speedInput.value + " km/h" : 0 + " km/h"}
          />
        </Grid>
      </Grid>
    )
  }
}

SpeedSelectInput.propTypes = {
  classes: PropTypes.object
};

export default (SpeedSelectInput) ;