import React from 'react';
import ReactTable from 'react-table';
import { Button,Container,Modal, Form } from 'react-bootstrap';
import { registerLocale } from "react-datepicker";
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import CreateIcon from "@material-ui/icons/Create";
import { IconButton, Tooltip } from "@material-ui/core";

import es from 'date-fns/locale/es';
import "./ManageType.css";

registerLocale('es', es);
export default class Reason extends React.Component {
  columns = [
    {
      Header: () => <strong>TÊN</strong>,
      accessor: 'name',
      Cell: (props) => {
        return (
          <span>{props.value}</span>

        )
      }
    },
    {
      Header: () => <strong>CHỈNH SỬA</strong>,
      // accessor: 'name',
      maxWidth: 150,
      Cell: (props) => {
        return (
          <Tooltip title="Chỉnh sửa">
            <IconButton
              aria-label="read" size="small" color="primary"
              onClick={() => {
                this.setState({currentInfo:props.original,
                  isAdd:false,
                  showModal:true})
              }}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>
        )
      }
    }
  ]

  constructor(props) {
    super(props)
    this.state = {
      listReason: [],
      showModal:false,
      currentInfo:{},
      isAdd:true
    }

  }
  getReasons = () =>{
    api.getReasons().then(response => {
      if (response.success) {
        this.setState({ listReason: response.data });
      }
      else {
        if(this.toast){
          this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
        }

      }
    })
  }
  componentDidMount() {
    this.getReasons();
  }

  handleAddReason=()=>{
    api.createReason(this.state.currentInfo)
      .then(response =>{
        if(response.success){
          if(this.toast){
            this.toast.showMessage("Thêm nguyên nhân thành công");
          }
          this.getReasons();

        }
        else{
          if(this.toast){
            this.toast.showMessage("Lỗi hệ thống,xin vui lòng thử lại sau");
          }
        }
      })
    this.setState({showModal:false})
  }
  handleUpdateReason=()=>{
    api.updateReason(this.state.currentInfo)
      .then(response =>{
        if(response.success){
          if(this.toast){
            this.toast.showMessage("Cập nhật nguyên nhân thành công");
          }
          this.getReasons();

        }
        else{
          if(this.toast){
            this.toast.showMessage("Lỗi hệ thống,xin vui lòng thử lại sau");
          }
        }
      })
    this.setState({showModal:false})
  }

  handleClose = () =>{
    this.setState({showModal:false})
  }
  handleReasonChange=(event)=>{
    let value = event.target.value;
    let currentInfo = {...this.state.currentInfo};
    currentInfo.name=value;
    this.setState({currentInfo})
  }

  render() {
    return (
      <Container className="mt-2 bg-light" >
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className="d-flex justify-content-between flex-wrap flex-md-nowrap p-1 pt-2">
          <h3 className="pl-3 ">DANH SÁCH NGUYÊN NHÂN</h3>
          <Button
            variant="outline-success"
            size="sm"
            onClick={()=>{ this.setState({
              showModal: true,
              isAdd:true,
              currentInfo:{}})}}>Thêm nguyên nhân
          </Button>
        </div>
        <ReactTable
          data={this.state.listReason}
          columns={this.columns}
          pageSize = {10}
          style={{
            height: "84vh"
          }}
        />
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.isAdd?"Thêm nguyên nhân":"Chỉnh sửa nguyên nhân"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Tên nguyên nhân mới</Form.Label>
                <Form.Control
                  name='reason'
                  value={this.state.currentInfo.name}
                  onChange={(event) => this.handleReasonChange(event)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button size='sm' varaint='primary' onClick={this.state.isAdd?this.handleAddReason:this.handleUpdateReason}>Lưu thay đổi</Button>
            <Button size='sm' variant='secondary' onClick={this.handleClose}>Đóng</Button>
          </Modal.Footer>
        </Modal>
        <Toast ref={(ref) => this.toast = ref} />
      </Container>
    );
  }
}