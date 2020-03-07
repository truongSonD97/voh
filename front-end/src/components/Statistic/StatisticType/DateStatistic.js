import React from 'react';
import { Line } from 'react-chartjs-2';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import PageTitle from '../../Common/PageTitle/PageTitle';
import Calender from "../Calendar";
import {Container} from "@material-ui/core";

const optionChartDateStatictis = {
  plugins: {
    datalabels: {
       display: true,
       color: 'red'
    }
 },
  elements:{
    line:{
      borderColor: "#000"
    }
  }
}
export default class DateStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.startDefaultDate = new Date();
    this.endDefaultDate = new Date();
    this.startDefaultDate.setDate(this.startDefaultDate.getDate() - 7);

    this.state = {
      RecordByDate: [],
      Dates: {
        StartDate: this.startDefaultDate,
        EndDate: this.endDefaultDate
      },
    }
  }

  handleDateChange = (dateName, dateValue) => {
    let { Dates } = this.state;
    Dates[dateName] = dateValue;
    this.setState({ Dates });
  };

  getStartEndDate = (date)=> {
		let monthFromDate = date.StartDate.getMonth() + 1;
		let monthToDate = date.EndDate.getMonth() + 1;
		let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
		let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
		return [startDate ,endDate];
  };
    
  getRecordByDate = (key) => {
    let dates = this.getStartEndDate(this.state.Dates);
    api.getRecordsByDate(dates[0],dates[1])
      .then((response) => {
        if (response.success) {
          console.log("GET RECORD BY DATE", response.data.list);
          if(response.data.list.length < 0) {
            if(this.toast){
              this.toast.showMessage("Không có bản tin nào");
            }
          }
          else {
            this.setState({
              RecordByDate: response.data.list
            })
          }
        }
        else {
          if(this.toast){
            this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
          }
        }
      })
      .catch((err) => {
        console.log('erro fetch', err);
      })
  }

  componentDidMount() {
    this.getRecordByDate();
  }

  render() {
    this.data = {
      labels: this.state.RecordByDate.map((x) => x.content.toString()),
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
        }
      ]
    };

    return (
      <div>
        <h3 className='pt-2'>THỐNG KÊ THEO THỜI GIAN</h3>
        <Calender
          Dates={this.state.Dates}
          handleDateChange={(key,value) => this.handleDateChange(key,value)}
          getRecord = {(key)=>{this.getRecordByDate(key)}}
        />
        <Container maxWidth='xl' className='pt-3'>
          <Line
            data={this.data}
            height={130}
            options={optionChartDateStatictis} />
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>  
    )
  }
}