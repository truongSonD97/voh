import React from 'react';
import {districtList} from "../../constants/districts";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import {Grid, TextField, Checkbox } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default class DistrictsInput extends React.Component {
  constructor(props) {
    super(props);
    let district = props.district ? props.district : [];
    this.state = {
      district
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.district && nextProps.district !== this.state.district){
      this.setState({district:nextProps.district});
    }
  }

  render(){
    let props = this.props;
    return(
      <Grid container spacing={1} direction={"row"}  alignItems="flex-end" justify={"flex-start"}
            className={"inputField"}>
        <Grid item  xs={12}  id={"districtGrid"}>
          <Autocomplete
            id={"autoDistrictInput"}
            multiple
            options={districtList}
            disableCloseOnSelect
            onChange={(event,value) => {
              let district = value.length > 3? [value.pop()] :value;
              this.setState({district});
              this.props.handleChangeInput(district, "district");
            }}
            value = {this.state.district}
            getOptionLabel={option => option.name}
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={selected}
                />
                {option.name}
              </React.Fragment>
            )}
            renderInput={params => (
              <TextField
                {...params}
                id={"districtInput"}
                variant="outlined"
                label="Quận *"
                fullWidth
                error={!!props.error}
                helperText={props.error?props.error:''}
              />
            )}
          />
        </Grid>
      </Grid>
    )
  }
}