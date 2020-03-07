import React, { Component } from 'react';
import Calender from '../Calendar';
import Toast from '../../../utils/Toast';
import api from '../../../utils/api';
import AutoRecordInput from '../../Common/form/record/AutoRecordInput';
import { Doughnut } from 'react-chartjs-2';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Container} from "@material-ui/core";
AOS.init();

const optionChartResonByDatePosition = {
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
        var total = meta.total;
        var currentValue = dataset.data[tooltipItem.index];
        var percentage = parseFloat((currentValue / total * 100).toFixed(1));
        return currentValue + ' (' + percentage + '%)';
      },
      title: function (tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      }
    }
  },
  plugins: {
    datalabels: {
      display: true,
      color: 'white'
    }
  }
};

class StatisticReasonByDatePosition extends Component {
  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  getArrayColor = (array) => {
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
  };

  handleDateChange = (key, value) => {
    let { Dates } = this.state;
    Dates[key] = value;
    this.setState({ Dates });
  };

  onChange = (id, newValue) => {
    console.log("new value change", newValue);
    if (id === "addresses") {
      let inputAddress = { ...this.state.inputAddress };
      inputAddress.fullName = newValue;
      this.setState({ inputAddress });
    }
  };

  getSelect = (id, newValue) => {
    console.log("value select,", newValue);
    if (newValue) {
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
  }

  getRecord = (key) => {
    if (this.state.inputAddress.fullName.length) {
      this.aggregateReasonByDatePosition();

    }
    else {
      if (this.toast) { this.toast.showMessage("Vui lòng nhập vị trí") };
    }
  };

  aggregateReasonByDatePosition = (key) => {
    let dates = this.getStartEndDate(this.state.Dates);
    api.aggregateReasonByDateAnPosition(dates[0], dates[1], this.state.inputAddress.id)
      .then((response) => {
        if (response.success) {
          if(response.data.list.length === 0){
            if(this.toast){
              this.toast.showMessage("Không có bản tin nào");
            }
          }
          else {
            let data = response.data.list;
            this.InitChart(data);
            this.setState({ ReasonAggregate: data });
          }
        }
        else {
          if (this.toast) {
            this.toast.showMessage('Kết nối reason bị lỗi,vui lòng thử lại sau');
          }
        }
      });
  };

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
      ReasonAggregate: [],
    };
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

  InitChart = (listData) => {
    this.dataAggregateByReason = {
      labels: listData.map((x) => x.reason ? x.reason.name : ''),
      datasets: [{
        data: listData.map((x) => x.reason ? x.count : ''),
        backgroundColor: this.getArrayColor(listData)
      }],
    }
  };

  render() {
    return (
      <div>
        <h3 className='pt-2'>BIỂU ĐỒ TỶ LỆ CÁC NGUYÊN NHÂN ÙN TẮC GIAO THÔNG TẠI MỘT VỊ TRÍ</h3>
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
          <Doughnut
            data={this.dataAggregateByReason}
            height={130}
            legend={{ position: 'right' }}
            options={optionChartResonByDatePosition} />
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>
    )
  }
}
export default StatisticReasonByDatePosition;