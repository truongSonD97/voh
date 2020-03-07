import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import Calender from "../Calendar";
import 'chartjs-plugin-datalabels';
import {Container} from "@material-ui/core";
import '../Statistic.css';

const optionForDoughnut = {
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

export default class ReasonStatistic extends React.Component {
  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  getArraycolor = (array) => {
    let arraycolor = [];
    for (let index in array) {
      if (arraycolor.length === 0) {
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
  constructor(props) {
    super(props);
    this.startDefaultDate = new Date();
    this.startDefaultDate.setDate(this.startDefaultDate.getDate() - 7);
    this.endDefaultDate= new Date();
    this.state = {
      RecordByReason: [],
      Dates: {
        StartDate: this.startDefaultDate,
        EndDate: this.endDefaultDate
      }
    };
    this.canvasRef = React.createRef();
  };

  componentDidMount() {
    this.getRecordByReason();
  }

  getStartEndDate = (date)=> {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate ,endDate];
  }

  getRecordByReason = (key) => {
    let dates = this.getStartEndDate(this.state.Dates);
    api.getRecordsByReason(dates[0], dates[1])
      .then((response) => {
        if (response.success) {
          
          let recordNotEmpty = response.data.list.filter((item) =>
            item.content !== null
          );
          if (recordNotEmpty.length) {
            // Chi hien thi Toast khi thong bao loi
            // if (this.toast) {
            //   this.toast.showMessage("Tải dữ liệu thành công");
            // }
            // console.log("record not Empty",recordNotEmpty);
            this.InitChart(recordNotEmpty);
            this.setState({
              RecordByReason: recordNotEmpty
            });
            
          }
          else {
            if (this.toast) {
              this.toast.showMessage("Không có bản tin nào");
            }
          }
        }
        else {
          if (this.toast) {
            this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
          }
        }
      });
  }
  handleDateChange = (key, value) => {
    let {Dates} = this.state;
    Dates[key] = value;
    this.setState({ Dates });
  }
  InitChart =(listReason) =>{
    this.data = {
      labels: listReason.map((x) => x.content ? x.content.name : ''),
      datasets: [{
        data: listReason.map((x) => x.content ? x.count : ''),
        backgroundColor:this.getArraycolor(listReason)
      }],
    }
  };

  render() {
    return (
      <div>
        <h3 className='pt-2'>THỐNG KÊ THEO NGUYÊN NHÂN</h3>
        <Calender
          Dates = {this.state.Dates}
          handleDateChange = {(key,value)=>{this.handleDateChange(key,value)}}
          getRecord={(key)=>{this.getRecordByReason(key)}}
        />
        <Container maxWidth='xl' className='pt-3'>
          <Doughnut
            data={this.data}
            options={optionForDoughnut}
            height={130}
            legend={{
            position: 'right',
            }}/>
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>
    );
  }
};