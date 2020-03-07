import React from 'react';
import ReactTable from 'react-table';
import { Button, Row, Col, Container, Modal, Form, Dropdown } from 'react-bootstrap';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import '../../../screens/App/App.css';
import { districtList, keyToDistrictObject } from '../../Common/constants/districts';
import { IconButton, Tooltip } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import Checkbox from '@material-ui/core/Checkbox';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import './ManageType.css';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';


export default class Address extends React.Component {


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
      Header: () => <strong>HƯỚNG</strong>,
      accessor: 'direction',
      Cell: (props) => {
        return (
          <span>{props.value}</span>
        )
      }
    },
    {
      Header: () => <strong>QUẬN</strong>,
      accessor: 'district',
      Cell: (props) => {
        return (
          <span>
            {props.value ? keyToDistrictObject(props.value).map((item, index) => index === 0 ? item.name : (' - ' + item.name)) : ''}
          </span>
        )
      }
    },

    {
      Header: () => <strong>TÙY CHỈNH</strong>,
      // accessor: 'name',
      maxWidth: 150,
      Cell: (props) => {
        return (
          <Tooltip title="Chỉnh sửa">
            <IconButton
              aria-label="read" size="small" color="primary"
              onClick={() => {
                this.setState({ inputForm: props.original, district_total: props.original.district.length, showModal: true, isAdd: false })
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
    super(props);
    this.state = {
      listAddress: [],
      showModal: false,
      showDigitalAddress: false,
      inputForm: {
        startCoordinate: null,
        endCoordinate: null,
        direction: null,
        district: []
      },
      district_total: 0,
      errors: {},
      selectLong: true,
      isAdd: true
    }
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      inputForm: {
        startCoordinate: null,
        endCoordinate: null,
        direction: null,
        district: []
      }
    });
  };

  getAddresses = () => {
    api.getAddresses().then(response => {
      if (response.success) {
        this.globalAddressENV = response.data;
        this.filterAddress(this.state.showDigitalAddress);
      }
      else {
        if (this.toast) {
          this.toast.showMessage('kết nối bị lỗi,vui lòng thử lại sau');
        }

      }
    })
  };

  onInputChange = (event) => {
    let fieldName = event.target.name;
    let fieldVal = event.target.value;
    if (fieldName === "startCoordinate" || fieldName === "endCoordinate") {
      let position = fieldVal.replace(/\s/g, '').split(",");
      fieldVal = {
        latitude: position[0],
        longitude: position[1]
      }

    }

    this.setState({ inputForm: { ...this.state.inputForm, [fieldName]: fieldVal } })

  };

  componentDidMount() {
    this.getAddresses();
  }

  handleDistrictTotalChange = (event) => {
    let sumDict = parseInt(event.target.value);
    let inputForm = { ...this.state.inputForm };
    if (inputForm.district.length > sumDict) {
      let inputDistrict = inputForm.district.slice(0, sumDict);
      inputForm.district = inputDistrict;
      console.log("district", inputForm.district)
      this.setState({ inputForm: inputForm })
    }
    this.setState({ district_total: sumDict })
  };

  showDistricts(num) {
    return Array.from(Array(num).keys()).map((item, idx) =>
      <Col xs={4} md={4} key={idx}>
        <Dropdown id={item + 1} >
          <Dropdown.Toggle
            variant="outline-secondary"
            style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}
            size="sm"
          >
            {this.state.inputForm.district[item] ? this.state.inputForm.district[item] : 'Quan'}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: '20em', overflow: 'auto' }} >
            {districtList.map((subitem, subIdx) =>
              <Dropdown.Item
                key={subIdx}
                onClick={(event) => {
                  let input = this.state.inputForm;
                  input.district[idx] = subitem["key"];
                  this.setState({ inputForm: input });
                }}
              >{subitem['name']}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    )
  }
  handleValidForm = () => {
    let isValid = true;
    let errors = { ...this.state.errors };

    if (!this.state.inputForm.name || this.state.inputForm.name === "") {
      errors["location"] = "Bắt buộc";
      isValid = false;
    }
    if (this.state.selectLong) {
      if (!this.state.inputForm.startCoordinate || this.state.inputForm.startCoordinate === "") {
        errors["startCrd"] = "Bắt buộc";
        isValid = false;
      }
    }

    if (!this.state.inputForm.district.length) {
      errors["district"] = "Bắt buộc";
      isValid = false;
    }
    this.setState({ errors });
    return isValid;
  };
  addNewAddress = () => {
    api.postAddress(this.state.inputForm)
      .then((response) => {
        if (response.success) {
          this.getAddresses();
          this.setState({
            inputForm: {
              startCoordinate: null,
              endCoordinate: null,
              direction: null,
              district: []
            }
          });
          if (this.toast) {
            this.toast.showMessage("Thêm vị trí thành công");
          }
          this.closeModal();
        }
        else {
          if (this.toast) {
            this.toast.showMessage("Thêm vị trí thất bại");
          }
        }
      })
  }

  updateAddress = () => {
    api.updateAddress(this.state.inputForm)
      .then((response) => {
        if (response.success) {
          this.getAddresses();
          this.setState({
            inputForm: {
              startCoordinate: null,
              endCoordinate: null,
              direction: null,
              district: []
            }
          });
          if (this.toast) {
            this.toast.showMessage("Cập nhật vị trí thành công");
          }
          this.closeModal();
        }
        else {
          if (this.toast) {
            this.toast.showMessage("Cập nhật vị trí thất bại");
          }
        }
      })
  }
  onSubmitForm = (event) => {
    event.preventDefault();
    if (this.handleValidForm()) {
      if (this.state.inputForm.endCoordinate === "") {
        this.state.inputForm.endCoordinate = null;
      }
      if (this.state.isAdd) {
        this.addNewAddress();
      }
      else {
        this.updateAddress();
      }

    }
    else {
      if (this.toast) {
        this.toast.showMessage("Vui lòng nhập đủ thông tin")
      }
    }
  };

  filterAddress = (value) => {
    let filterData = [];
    if (value) {
      filterData = this.globalAddressENV.filter((item) => {
        return item.startCoordinate !== null
      })
    }
    else {
      filterData = this.globalAddressENV.filter((item) => {
        return item.startCoordinate === null
      })
    }

    this.setState({ listAddress: filterData, showDigitalAddress: value })
  }
  onSwitchShowDigitalChange = (event) => {
    this.filterAddress(event.target.checked);
  }
  render() {
    console.log(this.state.listAddress);
    console.log("current input", this.state.inputForm);
    return (
      <Container className="mt-2 bg-light" >
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className="d-flex justify-content-between flex-wrap flex-md-nowrap p-1 pt-2">
          <h3 className="pl-3 ">DANH SÁCH ĐỊA ĐIỂM</h3>

          <FormControlLabel
            control={
              <Switch
                checked={this.state.showDigitalAddress}
                onChange={this.onSwitchShowDigitalChange}
                value="checkDigitalAddress"
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Đã số hóa"
            labelPlacement="start"
          />
        </div>
        <ReactTable
          data={this.state.listAddress}
          columns={this.columns}
          pageSize={10}
          style={{
            height: "84vh"
          }}
        />
        <div className="circle">
          <Tooltip title="Thêm địa chỉ" >
            <IconButton
              onClick={() => { this.setState({ showModal: true, isAdd: true }) }}>
              <AddLocationIcon
                fontSize="large"
                color="primary"
              />
            </IconButton>
          </Tooltip>
        </div>
        <Modal
          className='custom-map-modal'
          size='lg'
          show={this.state.showModal}
          onHide={this.closeModal}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Thêm vị trí</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form size='lg'>
              <Form.Group controlId="inputLocation">
                <Form.Label>Vị Trí</Form.Label>
                <span style={{ color: "red", fontSize: '12px', fontStyle: 'italic' }}>
                  *{this.state.errors["location"]}
                </span>
                <Form.Control
                  type="text"
                  name="name"
                  value={this.state.inputForm.name ? this.state.inputForm.name : ""}
                  onChange={this.onInputChange}
                  placeholder="Nhập vị trí" />
              </Form.Group>
              <Form.Group controlId="inputLong">
                <Form.Label>Tọa độ đầu</Form.Label>
                <Tooltip title="Bắt buộc">
                  <Checkbox
                    defaultChecked
                    checked={this.state.selectLong}
                    onChange={(event) => { this.setState({ selectLong: event.target.checked }) }}
                    value="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Tooltip>

                <Form.Control
                  type="text"
                  placeholder={this.state.inputForm.startCoordinate ?
                    (this.state.inputForm.startCoordinate.longitude + " " + this.state.inputForm.startCoordinate.latitude) 
                    : "Nhập tọa độ đầu"}
                  name="startCoordinate"
                  onChange={this.onInputChange}
                />

              </Form.Group>
              <Form.Group controlId="inputLan">
                <Form.Label>Tọa độ cuối</Form.Label>
                <Form.Control
                  type="text"
                  name='endCoordinate'  
                  onChange={this.onInputChange}
                  placeholder={this.state.inputForm.endCoordinate ? 
                    this.state.inputForm.endCoordinate.longitude + " " + this.state.inputForm.endCoordinate.latitude
                    : "Nhập toạ độ cuối"} 
                    />
              </Form.Group>
              <Form.Group controlId="inputdirection">
                <Form.Label>Hướng</Form.Label>
                <Form.Control
                  type="text"
                  name='direction'
                  onChange={this.onInputChange}
                  value={this.state.inputForm.direction ? this.state.inputForm.direction : ""}
                  placeholder="Hướng về" />
              </Form.Group>
              <Form.Row md={12}>
                <Col md={12}>
                  <Form.Group style={{ width: '100%' }}>
                    <Row className={'m-0 d-flex'}>
                      <Form.Label className="mr-auto">Quận
                      <span style={{ color: "red", fontSize: '12px', fontStyle: 'italic' }}>
                          *{this.state.errors["district"]}
                        </span>
                      </Form.Label>
                      <div key={'inline-radio'}>
                        <span className={'pr-3'}>Số quận : </span>
                        <Form.Check
                          inline
                          type="radio"
                          label="1"
                          name="district_total"
                          id="district_total_1"
                          value={1}
                          checked={this.state.district_total === 1}
                          onChange={this.handleDistrictTotalChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="2"
                          name="district_total"
                          id="district_total_2"
                          value={2}
                          checked={this.state.district_total === 2}
                          onChange={this.handleDistrictTotalChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="3"
                          name="district_total"
                          id="district_total_3"
                          value={3}
                          checked={this.state.district_total === 3}
                          onChange={this.handleDistrictTotalChange}
                        />
                      </div>
                    </Row>
                    <Row>
                      {this.showDistricts(this.state.district_total)}
                    </Row>
                  </Form.Group>
                </Col>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className='p-1'>
            <Button
              onClick={(event) => this.onSubmitForm(event)}
            >
              XÁC NHẬN
					</Button>
            <Button variant="danger" onClick={this.closeModal}>Huy</Button>
          </Modal.Footer>
        </Modal>

        <Toast ref={(ref) => this.toast = ref} />

      </Container>
    );
  }
}


