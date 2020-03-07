import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import Toast from '../../../utils/Toast';
import { Box, Button } from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/Forward';
import SearchIcon from '@material-ui/icons/Search';
import './Calendar.css';
var moment = require('moment');
moment().format();

class Calender extends Component {

  constructor(props){
    super(props);
    let Dates = this.props.Dates || {} ;
    this.state = {
      Dates
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.Dates !== this.state.Dates){
      this.setState({Dates : nextProps.Dates});
    }
  }
  render(){
    return(
      <Box display="flex" justifyContent="flex-end">
        <Box>
          <DatePicker
            value={this.state.Dates["StartDate"]}
            dateFormat="dd-MM-yyyy"
            selected={this.state.Dates["StartDate"]}
            onChange={(value) => this.props.handleDateChange("StartDate", value)}
            className='pb-1 date-picker'
          />
          <i className="material-icons calendar-ic">date_range</i>
        </Box>
        <ForwardIcon fontSize="large" color="primary"/>
        <Box>
          <DatePicker
            value={this.state.Dates["EndDate"]}
            dateFormat="dd-MM-yyyy"
            selected={this.state.Dates["EndDate"]}
            onChange={(value) => this.props.handleDateChange("EndDate", value)}
            className='pb-1 date-picker'
          />
          <i className="material-icons calendar-ic">date_range</i>
        </Box>
        <Box p={1} className='p-0 ml-3'>
          <Button
            variant="contained"
            color="primary"
            size='small'
            endIcon={<SearchIcon/>}
            onClick={() => {
            if (moment(this.state.Dates.StartDate).isAfter(this.state.Dates.EndDate)){
              if(this.toast){
                this.toast.showMessage("Thời gian nhập không hợp lệ");
              }
            }
            else{
              if(this.props.getRecord){
                this.props.getRecord(this.props.defaultStatus)
              }
            }
          }}>
            Tra cứu
          </Button>
        </Box>
        <Toast ref={(ref) => this.toast = ref}/>
      </Box>
    )
  }
}
export default Calender;