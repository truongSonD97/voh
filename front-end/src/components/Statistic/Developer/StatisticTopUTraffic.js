import React, { Component } from 'react';
import Calender from '../Calendar';
import Toast from '../../../utils/Toast';
import api from '../../../utils/api';
import AutoRecordInput from '../../Common/form/record/AutoRecordInput';
import { Table } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Container} from "@material-ui/core";
AOS.init();
const TOP = 10;

class TopUTraffic extends Component {
  handleDateChange = (key, value) => {
    let { Dates } = this.state;
    Dates[key] = value;
    this.setState({ Dates });
  }

  onChange = (id, newValue) => {
    console.log("new value change",newValue);
    if(id === 'reasons'){
      let inputReason = {...this.state.inputReason}
      inputReason.fullName = newValue;
      this.setState({inputReason})
    }
  };


  getSelect = (id, newValue) => {
    console.log("value select,", newValue);
    if(newValue){
      if (id === "reasons") {
        let inputReason = { ...this.state.inputReason };
        inputReason.fullName = newValue.name;
        inputReason.id = newValue.id;
        this.setState({ inputReason });
      }

    }
  }



  getStartEndDate = (date) => {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  }

  getTopRecord = () => {
    let dates = this.getStartEndDate(this.state.Dates);
    api.aggregateTopUTraffic(dates[0],dates[1],this.state.inputReason.id,"5cd8d57333ddd528925de304")
      .then(response =>{
        if(response.success){
          if(response.data.total === 0){
            if(this.toast){
              this.toast.showMessage("Không có bản tin");
            }
          }
          else {
            this.setState({TopRecord:response.data.list})
          }
        }
      })

  }
  getRecord = (key) => {
    if (this.state.inputReason.fullName.length) {
      this.getTopRecord();
    }
    else{
      if(this.toast){this.toast.showMessage("Vui lòng nhập nguyên nhân")}
    }

  }

  renderItemTable = (array) => {

    let arrayRender = []
    if (array.length < TOP) {
      arrayRender = array.map((item, idx) => <tr>
          <td>{idx + 1}</td>
          <td>{item.address.name + (item.address.direction ? " hướng " + item.address.direction : "")}</td>
          <td>{item.count}</td>
        </tr>
      )
    }
    else {
      for (let i = 0; i < TOP; i++) {
        arrayRender = <tr>
          <td>{i + 1}</td>
          <td>{array[i].address.name + (array[i].address.direction ? " hướng " + array[i].address.direction : "")}</td>
          <td>{array[i].size}</td>
        </tr>
      }
    }
    return arrayRender;
  };


  constructor(props) {
    super(props);
    this.startDefaultDate = new Date();
    this.startDefaultDate.setDate(this.startDefaultDate.getDate() - 7);
    this.endDefaultDate = new Date();
    this.state = {
      TopRecord: [],
      Dates: {
        StartDate: this.startDefaultDate,
        EndDate: this.endDefaultDate
      },
      reasons: [],
      inputReason: {
        fullName: "",
        id: ""
      },

    }
    this.canvasRef = React.createRef();
  };

  componentDidMount() {

    api.getReasons()
      .then(response => {
        if (response.success) {

          this.setState({
            reasons: response.data,
          })
        }

      })
      .catch(err => console.log(err))
  }
  render() {
    return (
      <div>
        <h3 className='pt-2'>TOP 10 ĐỊA ĐIỂM CÓ TÌNH TRẠNG ÙN TẮC NHIỀU NHẤT</h3>
        <Calender
          Dates={this.state.Dates}
          handleDateChange={(key, value) => { this.handleDateChange(key, value) }}
          getRecord={(key) => { this.getRecord(key) }}
        />

        <AutoRecordInput
          variant='standard'
          id={"reasons"}
          label={"Chọn nguyên nhân"}
          dataList={this.state.reasons}
          setIdList={this.getSelect}
          inputProps={this.state.inputReason.fullName}
          onChange={this.onChange}
          noLabel={true}
        />

        <Container maxWidth='xl' className='pt-3'>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>STT</th>
              <th>Địa điểm</th>
              <th>Số lượng</th>
            </tr>
            </thead>
            <tbody>
            {this.state.TopRecord.length ? this.renderItemTable(this.state.TopRecord) : null}
            </tbody>
          </Table>
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>
    )
  }

}
export default TopUTraffic;