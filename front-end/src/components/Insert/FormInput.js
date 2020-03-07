import React from 'react';
import api from '../../utils/api';
import Toast from '../../utils/Toast';
import '../../screens/App/App.css';
import './FormInput.css';
import firebase from '../../utils/firebase';
import { keyToDistrictObject } from '../Common/constants/districts';
import AutoRecordInput from "../Common/form/record/AutoRecordInput";
import DistrictsInput from "../Common/form/record/DistrictsInput";
import * as CONSTANT from '../Common/form/constantsForm';
import { handleFormValid } from '../Common/form/action/handleFormValid';
import { TextField, Icon, Grid, Button, Container } from "@material-ui/core";
import SpeedSelectInput from "../Common/form/record/SpeedSelectInput";

 
 class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeSpeed = this.handleChangeSpeed.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.setIdList = this.setIdList.bind(this);
    let input = props.input ? props.input : { ...CONSTANT.recordInput };
    let idList = props.idList ? props.idList : { ...CONSTANT.recordIdList };
    this.state = {
      addresses: [],
      reasons: [],
      speeds: [],
      personSharing: [],
      input,
      idList,
      suggested: { ...CONSTANT.suggestedInput },
      errors: {},
      triggerStatusRp: true,
      defaultReason: "",
    };

    if (props.isModify) {
      this.initialNotice = props.input.notice;
      this.initialSpeeds = props.idList.speeds;
    }
    this.triggerStatusRp = true;
    this.dataVohRealTime = firebase.database();
  }


  getTriggerPost = (trigger = "triggerDataEntryRecord") => {
    this.dataVohRealTime.ref().child(trigger).once("value", (snapshot) => {
      this.triggerStatusRp = snapshot.val().triggerPost;
    })
  };

  changeTriggerRecord = (trigger = "triggerDataEntryRecord") => {
    this.getTriggerPost(trigger);
    this.dataVohRealTime.ref().child(trigger).update({
      triggerPost: !this.triggerStatusRp
    });
    this.triggerStatusRp = !this.triggerStatusRp;
  };

  addNewPerson =  (data) => {
     api.createPersonSharing(data).then(response => {
      if (response.success) {
        let { idList, personSharing, suggested } = this.state;
        idList.personSharing = { id: response.data.id };
        personSharing.push(response.data);
        suggested.personSharing = true;
        this.setState({ idList, personSharing, suggested });
      }
      else if (response.message === "FAILURE_PHONE_NUMBER_EXISTED") {
        this.toast.showMessage('Số điện thoại đã tồn tại với tên ' + response.data);
      }
      else {
        this.toast.showMessage('Thêm người chia sẽ thất bại');
      }
    });
  };

  addNewReason =  (data) => {
     api.createReason(data).then(response => {
      if (response.success) {

        let { idList, reasons, suggested } = this.state;
        idList.reasons = { id: response.data.id };
        reasons.push(response.data);
        suggested.reasons = true;
        this.setState({ idList, reasons, suggested });
      }
      else {
        this.toast.showMessage('Thêm nguyên nhân thất bại');
      }
    });
  };

  addNewAddress =  (data) => {
     api.postAddress(data).then(response => {
      if (response.success) {

        let { idList, addresses, suggested } = this.state;
        idList.addresses = response.data;
        addresses.push(response.data);
        suggested.addresses = true;
        this.setState({ idList, addresses, suggested });
      }
      else {
        this.toast.showMessage('Thêm vị trí thất bại');
      }
    });
  };

  updateAddress =  (data) => {
     api.updateAddress(data).then(response => {
      if (response.success) {
        let addresses = this.state.addresses;
        let updatedAddress = addresses.find(x => x['id'] === response.data['id']);
        updatedAddress['district'] = response.data['district'];
      }
      else {
        this.toast.showMessage('Cập nhật vị trí thất bại');
      }
    });
  };

  handleChangeInput(value, keyInput) {
    let input = this.state.input;
    input[keyInput] = value;
    this.setState({ input });
  }

  handleChangeSpeed(item) {
    let { input, idList } = this.state;
    idList.speeds = item;
    input.speeds = item;
    this.setState({ input, idList });
  }

  onChange = (id, newValue) => {

    let { input, suggested } = this.state;
    let suggestedId = id;
    input[id] =  [undefined,null].includes(newValue) ? null : newValue;
    if (id === "direction" || id === "phoneNumber") {
      suggestedId = id === "direction" ? "addresses" : "personSharing";
    }
    suggested[suggestedId] = false;
    this.setState({ input, suggestedId });
  };

  setIdList = (id, idItem) => {
    let { suggested, idList, input } = this.state;
    let suggestedId = id;
    //vi 2 truong  direction va  phoneNumber la 2 truong phu thuoc nhau
    if (id === "direction" || id === "phoneNumber") {
      suggestedId = id === "direction" ? "addresses" : "personSharing";
    }
    if (idItem) {
      suggested[suggestedId] = true;
      idList[suggestedId] = idItem;
      if (suggestedId === 'addresses') {
        input.district = keyToDistrictObject(idItem.district);
      }
    } else {
      suggested[suggestedId] = false;
      idList[suggestedId] = "";
    }
    this.setState({ input, suggested });
  };

  disableEnterTextBox() {
    [document.getElementById('addresses-input'), document.getElementById('direction-input')]
      .map(item => item.addEventListener('keydown', function (k) {
        if (k.keyCode === 13) {
          k.preventDefault();
        }
      }));
  }

  onSubmitForm =  (event) => {
    event.preventDefault();
    if (handleFormValid(this.state.input, (errors) => this.setState({ errors: errors }))) {
      // if(true){
      let { idList, suggested, input } = this.state;
      if (suggested['personSharing'] === false) {
        if (idList['personSharing'] === '' ||
          input['personSharing'].trim().toUpperCase() !== idList['personSharing'].name.trim().toUpperCase() ||
          input['phoneNumber'].trim().toUpperCase() !== idList['personSharing'].phoneNumber.trim().toUpperCase()) {
          let dataNewPerson = {
            phoneNumber: input.phoneNumber,
            name: input.personSharing
          };
           this.addNewPerson(dataNewPerson);
        }
      }

      if (input['reasons'] === "") {
        idList.reasons = this.state.defaultReason;
      }
      else if (suggested['reasons'] === false) {
        if (idList['reasons'] === '' ||
          input['reasons'].trim().toUpperCase() !== idList['reasons'].name.trim().toUpperCase()) {
          let reason = {
            name: input.reasons
          };
           this.addNewReason(reason);
        }
      }

      let districtsInput = input.district.map(item => item['key']);
      let directionIdList = idList['addresses'].direction === null ? "" : idList['addresses'].direction;
      let directionInput = input['direction'] === null ? "" : input['direction'];
      if (suggested['addresses'] === false) {
        if (idList['addresses'] === '' ||
          input['addresses'].trim().toUpperCase() !== idList['addresses'].name.trim().toUpperCase() ||
          directionIdList.trim().toUpperCase() !== directionInput.trim().toUpperCase()) {
          let dataNewAddress = {
            name: input.addresses,
            district: districtsInput,
            direction: input['direction'] === '' ? null : input['direction']
          };
           this.addNewAddress(dataNewAddress);
          idList = this.state.idList;
        }
      }

      let districtIdList = idList['addresses']['district'];
      if (districtIdList !== null && districtIdList !== undefined) {
        if (districtsInput.length !== districtIdList.length ||
          !districtsInput.every((value, index) => value === districtIdList[index])) {
          let dataNewAddress = {
            id: idList['addresses']['id'],
            district: districtsInput
          };
           this.updateAddress(dataNewAddress);
        }
      }

      if (this.props.isModify) {
        let data = {
          id: this.props.recordId,
          notice: input.notice
        };

        let isUpdate = false;
        suggested = this.state.suggested;
        if (suggested.addresses) {
          data.address = idList.addresses;
          isUpdate = true;
        }

        if (input['reasons'] === "") {
          data.reason = this.state.defaultReason;
          isUpdate = true;
        }
        else if (suggested.reasons) {
          data.reason = idList.reasons;
          isUpdate = true;
        }
        if (suggested.personSharing) {
          data.personSharing = idList.personSharing;
          isUpdate = true;
        }
        if (this.initialNotice !== input.notice) {
          isUpdate = true;
        }
        if (this.initialSpeeds.id !== idList.speeds.id) {
          data.speed = idList.speeds;
          isUpdate = true;
        }
        if (isUpdate) {
           api.updateRecord(data).then(response => {
            if (response.success) {
              this.props.updateRecord(this.props.showIndex, response.data);
            }
          });
        }
        if (this.props.close) {
          this.props.close();
        }
      } else {
        let data = {
          address: {
            id: idList.addresses.id
          },
          reason: {
            id: idList.reasons.id
          },
          speed: {
            id: idList.speeds.id
          },
          personSharing: {
            id: idList.personSharing.id
          },
          distance: 100,
          notice: input['notice']
        };
        api.postRecords(data).then(response => {
          if (response.success) {
            input = { ...CONSTANT.recordInput };
            idList = { ...CONSTANT.recordIdList };
            suggested = { ...CONSTANT.suggestedInput };
            this.changeTriggerRecord();
            this.setState({ input, suggested, idList });
          } else {
            this.toast.showMessage('Gửi record thất bại');
          }
        })
      }
    } else {
      this.toast.showMessage('Các trường nhập chưa chính xác');
    }
  };

  componentDidMount() {
    this.disableEnterTextBox();
    Promise.all([
      api.getAddresses(),
      api.getReasons(),
      api.getPersonSharing(),
      api.getSpeeds(),
      api.getReasonByName()
    ]).then(response => {
      if (response[0].success && response[1].success && response[2].success && response[3].success) {
        if (this.toast) {
          let reasons = response[1].data;
          let defaultReason = "";
          if (response[4].success) {
            defaultReason = response[4].data;
          } else {
            let reason = { name: "Chưa rõ nguyên nhân" };
            api.createReason(reason).then(response => {
              if (response.success) {
                defaultReason = response.data;
                reasons.push(response.data);
              }
            });
          }
          this.setState({
            addresses: response[0].data,
            reasons,
            personSharing: response[2].data,
            speeds: response[3].data,
            defaultReason
          })
        }
      }
      else {
        if (this.toast) {
          this.toast.showMessage('Kết nối bị lỗi,vui lòng thử lại sau');
        }
      }
    });

    if (this.state.idList.addresses) {
      this.setIdList('addresses', this.state.idList.addresses);
      let suggested = this.state.suggested;
      suggested.addresses = false;
    }

    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined)
    }
  }

  confirmUpdateRecord(event) {
    this.onSubmitForm(event);
  }

  handleRelativeInput = (value, key) => {
    let input = this.state.input;
    input[key] = value ? value : '';
    this.setState({ input });
  };

  render() {
    let state = this.state;
    let submitFormBtn =
      <Button
        fullWidth
        onClick={(event) => this.onSubmitForm(event)}
        variant="contained"
        endIcon={<Icon>send</Icon>}
        id="submitFormBtn"
      >
        XÁC NHẬN
      </Button>;
    return (
      <Container maxWidth={false} className={this.props.isModify ? "contain-modify formInputContainer" : "formInputContainer"} >
        <form className={"containerForm"} >
          <div className={this.props.isModify ? "row" : ""}>
            <div className={this.props.isModify ? "col-sm" : ""}>
              <Grid container spacing={1} className={"inputField"}>
                <Grid item xs={6}>
                  <AutoRecordInput
                    label={"Số điện thoại *"}
                    error={state.errors["phoneNumber"]}
                    id={"phoneNumber"}
                    property={'phoneNumber'}
                    onChange={this.onChange}
                    dataList={state.personSharing}
                    setIdList={this.setIdList}
                    inputProps={state.input['phoneNumber']}
                    handleRelativeInput={this.handleRelativeInput}
                    relativeInput={"personSharing"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AutoRecordInput
                    label={"Tên người chia sẻ *"}
                    error={state.errors["personSharing"]}
                    id={"personSharing"}
                    onChange={this.onChange}
                    dataList={state.personSharing}
                    setIdList={this.setIdList}
                    inputProps={state.input['personSharing']}
                    handleRelativeInput={this.handleRelativeInput}
                    relativeInput={"phoneNumber"}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} className={"inputField"}>
                <Grid item xs={12}>
                  <AutoRecordInput
                    label={"Địa điểm *"}
                    error={state.errors["addresses"]}
                    id={"addresses"}
                    onChange={this.onChange}
                    dataList={this.state.addresses}
                    setIdList={this.setIdList}
                    inputProps={state.input['addresses']}
                    handleRelativeInput={this.handleRelativeInput}
                    relativeInput={"direction"}
                    multiline={true}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} className={"inputField"} id={"directionGrid"}>
                <Grid item xs={12} >
                  <AutoRecordInput
                    label={"Hướng"}
                    id={"direction"}
                    onChange={this.onChange}
                    dataList={this.state.addresses}
                    setIdList={this.setIdList}
                    inputProps={state.input['direction']}
                    handleRelativeInput={this.handleRelativeInput}
                    relativeInput={"addresses"}
                    property={'direction'}
                    multiline={true}
                  />
                </Grid>
              </Grid>

              {/*Da grid*/}
              <DistrictsInput
                district={state.input.district}
                error={state.errors["district"]}
                handleChangeInput={this.handleChangeInput}
              />
            </div>

            <div className={this.props.isModify ? "col-sm" : ""}>
              {/*Da grid*/}
              <SpeedSelectInput
                speeds={state.speeds}
                speedInput={state.input.speeds}
                handleChangeSpeed={this.handleChangeSpeed}
                error={state.errors["speeds"]}
              />

              <Grid container spacing={1} className={"inputField"}>
                <Grid item xs={12}>
                  <AutoRecordInput
                    label={"Nguyên nhân"}
                    // error={state.errors["reasons"]}
                    id={"reasons"}
                    onChange={this.onChange}
                    dataList={state.reasons}
                    setIdList={this.setIdList}
                    inputProps={state.input['reasons']}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} className={"inputField"}>
                <Grid item xs={12}>
                  <TextField
                    value={state.input.notice}
                    variant="outlined"
                    id={'input-notice'}
                    label={"Ghi chú"}
                    fullWidth
                    onChange={(event) => this.handleChangeInput(event.target.value, 'notice')}
                  />
                </Grid>
              </Grid>
            </div>
          </div>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {this.props.isModify ? "" : submitFormBtn}
            </Grid>
          </Grid>
        </form>
        <Toast ref={(ref) => this.toast = ref} />
      </Container>
    );
  }
}



export default FormInput