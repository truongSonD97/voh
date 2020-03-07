import React, {Component} from 'react';
import Calender from '../Calendar';
import Toast from '../../../utils/Toast';
import api from '../../../utils/api';
import AutoRecordInput from '../../Common/form/record/AutoRecordInput';
import {Line} from 'react-chartjs-2';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Container } from "@material-ui/core";

AOS.init();

const optionChart2DatePosition = {
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

class Statistic2DatePosition extends Component {

  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  handleDateChange = (key, value) => {
    let { Dates } = this.state;
    Dates[key] = value;
    this.setState({ Dates });
  };

  onChange = (id, newValue) => {
    if(id === 'reasons'){
      let inputReason = {...this.state.inputReason}
      inputReason.fullName = newValue;
      this.setState({inputReason})
    }
    if(id === "addresses"){
      let inputAddress = {...this.state.inputAddress};
      inputAddress.fullName = newValue
      this.setState({inputAddress});
    }
  };

  getSelect = (id, newValue) => {
    if(newValue){
      if (id === "reasons") {
        let inputReason = { ...this.state.inputReason };
        inputReason.fullName = newValue.name;
        inputReason.id = newValue.id;
        this.setState({ inputReason });
      }
      if (id === "addresses") {
        let inputAddress = { ...this.state.inputAddress }
        inputAddress.fullName = newValue.name + (newValue.direction ? " hướng " + newValue.direction : "");
        inputAddress.id = newValue.id;
        this.setState({ inputAddress })
      }
    }
  };

  getStartEndDate = (date) => {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  };

  getStartEndLastMonthDate = (date) => {
    let monthFromDate = date.StartDate.getMonth();
    let monthToDate = date.EndDate.getMonth();
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  };

  getRecord = (key) => {
    if (this.state.inputAddress.fullName.length) {
      this.getRecordAmong2Month();
    }
    else{
      if(this.toast){this.toast.showMessage("Vui lòng nhập vị trí")}
    }
  };

  getRecordAmong2Month = () => {
    let dates = this.getStartEndDate(this.state.Dates);
    let lastDate = this.getStartEndLastMonthDate(this.state.Dates);
    Promise.all([
      api.aggregateRecordByDateAndPosition(dates[0], dates[1],this.state.inputAddress.id),
      api.aggregateRecordByDateAndPosition(lastDate[0], lastDate[1],this.state.inputAddress.id)
    ])
      .then(response => {
        if (response[0].success && response[1].success) {
          if(response[0].data.list.length === 0 && response[1].data.list.length === 0){
            if(this.toast){
              this.toast.showMessage("Không có dữ liệu")
            }
          }
          else {
            let data2Month = [];
            data2Month.push(response[0].data.list);
            data2Month.push(response[1].data.list);
            this.setState({ Record2Month: data2Month });
          }
        }
        else {
          if (this.toast) {
            this.toast.showMessage('Kết nối bị lỗi,vui lòng thử lại sau');
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
      Record2Month: [[], []]

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
    this.data2Month = {
      labels: this.state.Record2Month[0].map((x) => x.day.split("-")[2].toString()),
      datasets: [
        {
          label: 'Current Month',
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
          data: this.state.Record2Month[0].map(x => x.count)
        },
        {
          label: 'Last Month',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(0,1,0,0.4)',
          borderColor: 'rgba(1,1,1,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(255,10,0,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(7,192,192,1)',
          pointHoverBorderColor: 'rgba(210,20,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.Record2Month[1].map(x => x.count)
        }
      ]
    }
  };

  render() {
    this.InitChart();
    return (
      <div>
        <h3 className='pt-2'>BIẾN THIÊN ÙN TẮC TẠI MỘT ĐỊA ĐIỂM TRONG 2 THÁNG LIÊN TIẾP</h3>
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
            data={this.data2Month}
            height={130}
            options={optionChart2DatePosition} />
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>
    )
  }

}
export default Statistic2DatePosition;