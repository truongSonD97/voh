import React, { Component } from 'react';
import Calender from '../Calendar';
import Toast from '../../../utils/Toast';
import api from '../../../utils/api';
import AutoRecordInput from '../../Common/form/record/AutoRecordInput';
import { Line } from 'react-chartjs-2';
import { TrafficStatusTable } from '../../Common/constants/trafficStatusTable';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Container} from "@material-ui/core";
AOS.init();
const optionChartDatePosition = {
  elements: {
    line: {
      borderColor: "#000"
    }
  },
  plugins: {
    datalabels: {
      display: true,
      color: 'red'
    }
  }
};
const StatusTable = [...TrafficStatusTable];

class StatisticByDateInPosition extends Component {

  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getArraycolor = (array) => {
    let arraycolor = [];
    for (let index in array) {
      if (!arraycolor.length) {
        arraycolor.push(this.getRandomColor())
      }
      else {
        let color = this.getRandomColor();
        while (arraycolor.indexOf(color) >= 0) {
          color = this.getRandomColor();
        }
        arraycolor.push(color)
      }
    }
    return arraycolor

  }

  handleDateChange = (key, value) => {
    let { Dates } = this.state;
    Dates[key] = value;
    this.setState({ Dates });
  }



  onChange = (id, newValue) => {
    console.log("new value change",newValue);


    let inputAddress = {...this.state.inputAddress};
    inputAddress.fullName = newValue
    this.setState({inputAddress});


  };


  getSelect = (id, newValue) => {
    console.log("value select,", newValue);
    if(newValue){
      let inputAddress = { ...this.state.inputAddress }
      inputAddress.fullName = newValue.name + (newValue.direction ? " hướng " + newValue.direction : "");
      inputAddress.id = newValue.id;
      this.setState({ inputAddress })

    }
  }



  getStartEndDate = (date) => {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  }

  getStartEndLastMonthDate = (date) => {
    let monthFromDate = date.StartDate.getMonth();
    let monthToDate = date.EndDate.getMonth();
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  }




  getRecordLv1 = (arr) => {
    let dataChart = [];
    let sortarray = arr.filter(item => item.speed.value === StatusTable[0].value);
    let listAddress = this.getAllAddessfromRecord(sortarray);
    for (let item of listAddress) {
      let commonAddress = sortarray.filter(subitem => subitem.address.id === item.id);
      dataChart.push({ address: item, size: commonAddress.length });
    }
    return dataChart;
  }


  getRecord = (key) => {
    if (this.state.inputAddress.fullName.length) {
      this.getRecordByDate();
    }
    else{
      if(this.toast){this.toast.showMessage("Vui lòng nhập vị trí")}
    }
  };


  getRecordByDate = (key) => {
    let dates = this.getStartEndDate(this.state.Dates);
    api.aggregateRecordByDateAndPosition(dates[0],dates[1],this.state.inputAddress.id)
      .then(response =>{
        if(response.success){
          if(response.data.list.length === 0){
            if(this.toast){
              this.toast.showMessage("Không có bản tin nào");
            }
          }
          else {
            this.setState({RecordByDate:response.data.list})
          }
        }else {
          if (this.toast) {
            this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
          }
        }
      })
  }


  constructor(props) {
    super(props);
    this.startDefaultDate = new Date();
    this.startDefaultDate.setDate(this.startDefaultDate.getDate() - 7);
    this.endDefaultDate = new Date();
    this.state = {

      Dates: {
        StartDate: this.startDefaultDate,
        EndDate: this.endDefaultDate
      },
      address: [],
      inputAddress: {
        fullName: "",
        id: ""
      },

      RecordByDate: [],


    }
    this.canvasRef = React.createRef();
  };

  componentDidMount() {

    api.getAddresses()
      .then(response => {
        if (response.success) {
          this.setState({
            address: response.data
          })
        }

      })
      .catch(err => console.log(err))
  }
  InitChart = () =>{
    this.dataLine = {
      labels: this.state.RecordByDate.map((x) => x.day.toString()),
      datasets: [
        {
          label: 'Amount of UnTraffic',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.RecordByDate.map(x => x.count)
        },

      ]
    };
  }
  render() {
    this.InitChart();
    return (
      <div>
        <h3 className='pt-2'>BIỂU ĐỒ BIẾN THIÊN ÙN TẮC GIAO THÔNG TẠI MỘT ĐỊA ĐIỂM</h3>
        <Calender
          Dates={this.state.Dates}
          handleDateChange={(key, value) => { this.handleDateChange(key, value) }}
          getRecord={(key) => { this.getRecord(key) }}
        />

        <AutoRecordInput
          variant='standard'
          id={"addresses"}
          label={"Chọn địa điểm"}
          dataList={this.state.address}
          setIdList={this.getSelect}
          inputProps={this.state.inputAddress.fullName}
          onChange={this.onChange}
          noLabel={true}
        />

        <Container maxWidth='xl' className='pt-3'>
          <Line
            data={this.dataLine}
            height={130}
            options={optionChartDatePosition} />
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>

    )
  }

}
export default StatisticByDateInPosition;