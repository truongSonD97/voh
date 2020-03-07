import React from 'react';
import ReactTable from 'react-table';
import { Button, Row, Col, Container, Modal, Form } from 'react-bootstrap';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import CreateIcon from "@material-ui/icons/Create";
import { IconButton, Tooltip } from "@material-ui/core";
export default class SharerTable extends React.Component {
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
      Header: () => <strong>SĐT</strong>,
      accessor: 'phoneNumber',
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
                this.setState({
                  isAdd:false,
                  currentInfo: props.original,
                  showModal: true
                })
              }}
            >
              <CreateIcon />
            </IconButton>
          </Tooltip>

        )
      }
    }
  ];

  constructor(props) {
    super(props)
    this.state = {
      listSharers: [],
      showModal: false,
      isAdd: true,
      currentInfo: {}
    }

  }
  getPersonSharing = () => {
    api.getPersonSharing().then(response => {
      if (response.success) {
        this.setState({ listSharers: response.data });
      }
      else {
        if (this.toast) {
          this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
        }

      }
    })
  }

  componentDidMount() {
    this.getPersonSharing();
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  validateForm = () => {
    if (this.state.currentInfo.name === "" || this.state.currentInfo.phoneNumber === "") {
      return false;
    }
    return true
  }
  handleInputChange = (key, event) => {
    console.log("hadle change", event.target.value);
    let { currentInfo } = this.state;
    currentInfo[key] = event.target.value;
    this.setState({ currentInfo });
  }
  addSharer = () => {
    if (this.validateForm()) {
      api.createPersonSharing(this.state.currentInfo)
        .then(response => {
          if (response.success) {
            if(this.toast){
              this.toast.showMessage("Thêm người chia sẽ mới thành công");
            }
            this.getPersonSharing();
          }
          else {
            if (this.toast) {
              this.toast.showMessage("Lỗi hệ thống,vui lòng thử lại sau")
            }
          }
        })
    }
    else {
      if (this.toast)
        this.toast.showMessage('Vui lòng nhập đủ thông tin');
    }
    this.closeModal();
  }
  updateSharer = () => {
    if (this.validateForm()) {
      api.updateSharer(this.state.currentInfo)
        .then(response => {
          if (response.success) {          
            this.getPersonSharing();
            if(this.toast){
              this.toast.showMessage("Cập nhật thông tin thành công");
            }
          }
          else {
            if (this.toast) {
              this.toast.showMessage("Lỗi hệ thống,vui lòng thử lại sau")
            }
          }
        })
    }
    else {
      if (this.toast)
        this.toast.showMessage('Vui lòng nhập đủ thông tin');
    }
    this.closeModal();
  }
  render() {
    return (
      <Container className="mt-2 bg-light">
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className="d-flex justify-content-between flex-wrap flex-md-nowrap p-1 pt-2">
          <h3 className="pl-3 ">DANH SÁCH NGƯỜI CHIA SẼ</h3>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => {
              this.setState({
                showModal: true,
                isAdd: true,
                currentInfo: {}
              })
            }}>Thêm người chia sẽ
            </Button>
        </div>
        <Row className="justify-content-md-center "  >
          <Col>
            <ReactTable
              data={this.state.listSharers}
              columns={this.columns}
              pageSize={10}
              style={{
                height: "84vh"
              }}
            />
            <Toast ref={(ref) => this.toast = ref} />
          </Col>
        </Row>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Chỉnh sửa thông tin
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  name='sharername'
                  value={this.state.currentInfo.name}
                  onChange={(event) => this.handleInputChange('name', event)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>SDT</Form.Label>
                <Form.Control
                  name='phoneNumber'
                  value={this.state.currentInfo.phoneNumber}
                  onChange={(event) => this.handleInputChange("phoneNumber", event)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button size='sm' variant='danger' onClick={this.state.isAdd ? this.addSharer : this.updateSharer}>Lưu thay đổi</Button>
            <Button size='sm' variant='primary' onClick={this.closeModal}>Hủy</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}