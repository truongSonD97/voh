import React from 'react';
import UserInput from "../../form/user/UserInput";
import RoleInput from "../../form/user/RoleInput";
import api from "../../../../utils/api";
import Toast from '../../../../utils/Toast';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Slide, Button} from "@material-ui/core";

export default class UserModel extends React.Component {
  

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    let showModal = props.showModal?props.showModal:false;
    let isAddUser = this.props.IsAddUser?this.props.IsAddUser:true;
    let initialInput = this.props.userInfo ? this.props.userInfo : {
      username:"",
      password:"",
      name:"",
      phoneNumber:"",
      role:"",
    };

    this.state={
      showModal,
      input: initialInput,
      IsAddUser:isAddUser
    }
  }

  validateForm = () =>{
    if(this.state.input["username"] === "" 
      || this.state.input["password"] === ""
      || this.state.input["phoneNumber"] === ""
      || this.state.input["role"] === ""){
        if(this.toast){
          this.toast.showMessage("Vui lòng điền đủ thông tin");
        }
        return false
      }
      else{
        if(this.state.input["username"].length < 5){
          if(this.toast){
            this.toast.showMessage("Username phải từ 5 ký tự trở lên");
          }
          return false
        }
      }
    return true
  }
  close() {
    this.props.closeModal();
  }

  open() {
    this.setState({ showModal: true });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({showModal:nextProps.showModal,
                    });
    if(this.props.IsAddUser !== nextProps.IsAddUser){
      this.setState({IsAddUser:nextProps.IsAddUser});
    }
    if (this.props.userInfo !== nextProps.userInfo) {
      this.setState({
        input: nextProps.userInfo
      });
    }
  }

  handleChangeInput = (id, value) => {
    let {input} = this.state;
    input[id] = value;
    this.setState({ input });
  };

  addNewUser = async (data) => {
    await api.createUser(data).then(response => {
      if (response.success) {
        this.props.pushUserToList(response.data);
        if(this.toast){
          this.toast.showMessage('Thêm tài khoản mới thành công');
        }
        
      }
      else {
        if(this.toast){
          this.toast.showMessage('Lỗi hệ thống');
        }
        
      }
    });
  };


  updateUser = (data) => {
     api.updateUser(data).then(response => {
      if (response.success) {
        this.props.pushUserToList(response.data);
        if(this.toast){
          this.toast.showMessage('Cập nhật tài khoản thành công');
        }
        
      }
      else {
        if(this.toast){
          this.toast.showMessage('Lỗi hệ thống');
        }
        
      }
    });
  };
  onSubmitForm =  (event) => {
    event.preventDefault();
    if(this.validateForm()){
      if(this.state.IsAddUser){
        this.addNewUser(this.state.input);
      }
      else{
        this.updateUser(this.state.input)
      }
       
      this.props.closeModal();
      let input = {
        username:"",
        password:"",
        name:"",
        phoneNumber:"",
        role:"",
      };
      this.setState({input})
    }   
  };



  render(){

   return(
     <Dialog
       fullWidth={true}
       maxWidth={"sm"}
       TransitionComponent={Transition}
       open={this.state.showModal}
       keepMounted
       onClose={this.close}
     >
       <DialogTitle>THÊM TÀI KHOẢN</DialogTitle>
       <DialogContent>
         <DialogContentText>
           <UserInput
             label={"Username"}
             value={this.state.input["username"]}
             onChange={(event) => this.handleChangeInput("username", event.target.value)}
           />
           <UserInput
             label={"Password"}
             value={this.state.input["password"]}
             type={"password"}
             onChange={(event) => this.handleChangeInput("password", event.target.value)}
           />
           <UserInput
             label={"Tên đầy đủ"}
             value={this.state.input["name"]}
             onChange={(event) => this.handleChangeInput("name", event.target.value)}
           />
           <UserInput
             label={"Số điện thoại"}
             type={"number"}
             value={this.state.input["phoneNumber"]}
             onChange={(event) => this.handleChangeInput("phoneNumber", event.target.value)}
           />
           <RoleInput
             label={"Vai trò"}
             value={this.state.input["role"]}
             handleChangeInput={this.handleChangeInput}
           />
         </DialogContentText>
       </DialogContent>
       <DialogActions>
         <Button
           variant="contained"
           color="primary"
           onClick={(event) => this.onSubmitForm(event)}
         >{this.state.IsAddUser?"Thêm mới":"Cập nhật"}</Button>
         <Button
           variant="contained"
           color="secondary"
           onClick={this.close}
         >Đóng</Button>
       </DialogActions>
       <Toast ref={(ref) => this.toast = ref} />
     </Dialog>
   )
 }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});