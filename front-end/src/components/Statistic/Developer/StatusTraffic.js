import React, { Component } from 'react';
import Calender from '../Calendar';
import Toast from '../../../utils/Toast';
import api from '../../../utils/api';
import AutoRecordInput from '../../Common/form/record/AutoRecordInput';
import Doughnut from 'react-chartjs-2';
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

class StatusTraffic extends Component {

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
  constructor(props) {
    super(props);
    this.startDefaultDate = new Date();
    this.startDefaultDate.setDate(this.startDefaultDate.getDate() - 7);
    this.endDefaultDate = new Date();
    this.state = {
      RecordStatus: [],
      Dates: {
        StartDate: this.startDefaultDate,
        EndDate: this.endDefaultDate
      },
      address: [],
      inputAddress: {
        fullName: "",
        id: ""
      }
    }
    this.canvasRef = React.createRef();
  };

  onChange = (id, newValue) => {
    let inputAddress = { ...this.state.inputAddress };
    inputAddress.fullName = newValue
    this.setState({ inputAddress });
  };

  getSelect = (id, newValue) => {
    console.log("value select,", newValue);
    if (newValue) {
      let inputAddress = { ...this.state.inputAddress };
      inputAddress.fullName = newValue.name + " hướng " + newValue.direction;
      inputAddress.id = newValue.id;
      this.setState({ inputAddress });
    }
  }

  componentDidMount() {
    api.getAddresses()
      .then(response => {
        if (response.success) {
          this.setState({ address: response.data })
        }
      })
      .catch(err => console.log("err"))
  }

  getStartEndDate = (date) => {
    let monthFromDate = date.StartDate.getMonth() + 1;
    let monthToDate = date.EndDate.getMonth() + 1;
    let startDate = date.StartDate.getFullYear() + '-' + monthFromDate + '-' + date.StartDate.getDate();
    let endDate = date.EndDate.getFullYear() + '-' + monthToDate + '-' + date.EndDate.getDate();
    return [startDate, endDate];
  }


  getRecord = () => {
    let dates = this.getStartEndDate(this.state.Dates);
    api.aggregateSpeedInPosition(dates[0],dates[1],this.state.inputAddress.id)
      .then((response) =>{
        if(response.success){
          if(response.data.list.length < 0) {
            if(this.toast){
              this.toast.showMessage("Không có bản tin");
            }
          }
          else {
            let RecordStatus = [];
            for (let item of response.data.list){
              RecordStatus.push({name:item.speed.name,size:item.count})
            }
            this.InitChart(RecordStatus);
            this.setState({RecordStatus});
          }
        }
        else{
          if(this.toast){this.toast.showMessage("Tải dữ liệu thất bại")}
        }
      })

  }

  InitChart = (arrayList) => {
    this.data = {
      labels: arrayList.map((x) => x ? x.name : ''),
      datasets: [{
        data: arrayList.map((x) => x ? x.size : ''),
        backgroundColor: this.getArraycolor(arrayList)

      }],
    }
  }
  render() {
    return (
      <div>
        <h3 className='pt-2'>TỶ LỆ TÌNH TRẠNG GIAO THÔNG TẠI MỘT ĐỊA ĐIỂM</h3>
        <Calender
          Dates={this.state.Dates}
          handleDateChange={(key, value) => { this.handleDateChange(key, value) }}
          getRecord={(key) => { this.getRecord(key) }}
        />

        <AutoRecordInput
          variant='standard'
          id={"addresses"}
          label={"Chọn vị trí"}
          dataList={this.state.address}
          setIdList={this.getSelect}
          inputProps={this.state.inputAddress.fullName}
          onChange={this.onChange}
        />

        <Container maxWidth='xl' className='pt-3'>
          <Doughnut
            data={this.data}
            height={130}
            legend={{
              position: 'right',
            }}
            options={optionForDoughnut} />
        </Container>
        <Toast ref={(ref) => this.toast = ref} />
      </div>
    )
  }

}
export default StatusTraffic;