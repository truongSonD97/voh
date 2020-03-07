import React from 'react';
import ReactTable from 'react-table';
import api from '../../../utils/api';
import Toast from '../../../utils/Toast';
import UserModel from "../../Common/modal/UserModel/UserModel";
import { Button ,Container } from 'react-bootstrap';
import { ButtonGroup, Tooltip ,IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import ConfirmModel from "../../Common/modal/ConfirmModal/ConfirmModel";
import "./ManageType.css";

export default class UserTable extends React.Component {
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
      Header: () => <strong>TÀI KHOẢN</strong>,
      accessor: 'username',
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
      Header: () => <strong>VAI TRÒ</strong>,
      accessor: 'role',
      Cell: (props) => {
        return (
          <span>{this.showRole(props.value)}</span>
        )
      }
    },
    {
      Header: () => <strong>CHỈNH SỬA</strong>,
      maxWidth: 150,
      Cell: (props) => {
        return (
          <ButtonGroup size="small" aria-label="small outlined button group">
            <Tooltip title="Chỉnh sửa">
              <IconButton
                aria-label="read" size="small" color="primary"
                onClick={() => {
                  console.log(props.original);
                  let selectUser = props.original;
                  selectUser["password"] = "";
                  this.setState({showModal:true,IsAddUser:false,currentInfo:selectUser})}}
              >
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa tài khoản">
              <IconButton
                aria-label="uncheck" size="small" color="secondary"
                onClick={() => this.setState({
                  selectUserId:props.original.id,
                  showDeleteDialog:true
                  }) }>

                  {/*this.deleteUser(props.original.id)*/}
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        )
      }
    }  
  ]

  showRole(role){
    if(role === "ROLE_ADMIN")
      return "Quản lý";
    else if(role === "ROLE_EDITOR")
      return "Biên tập viên";
    else if(role === "ROLE_DATAENTRY")
      return "Thư ký";
    else if(role === "ROLE_DATAENTRY_EDITOR")
      return "Thư ký kiêm BTV";
    else
      return "MC";
  }

  constructor(props) {
    super(props);
    this.pushUserToList = this.pushUserToList.bind(this);
    this.state = {
      user: [],
      page : 0,
      size:100,
      status: "",
      showModal: false,
      IsAddUser:true,
      currentInfo:{
        username:"",
        password:"",
        name:"",
        phoneNumber:"",
        role:"",
      },
      showDeleteDialog:false,
      showModifyDialog:false,
      selectUserId:'',
    }
  }
  
  getUsers = () => {
    api.getUser(this.state.page,this.state.size)
      .then((response) => {
        if (response.success) {
          // if(this.toast){
          //   this.toast.showMessage("Tải danh sách thành công");
          // }
          const listUser = response.data.content
          this.setState({ user: listUser })
        }
        else {
          if(this.toast){
            this.toast.showMessage("kết nối bị lỗi,vui lòng thử lại sau");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  componentDidMount() {
    this.getUsers();
  }

  modifyInfo = (event) =>{
    this.child.updateInfo(event)
  };

  closeModal = () =>{
    this.setState({showModal:false,
      currentInfo:{
        username:"",
        password:"",
        name:"",
        phoneNumber:"",
        role:"",
      }})
  };

  pushUserToList = (value) => {
    if(this.state.IsAddUser){
      let newList= [...this.state.user];
      newList.push(value);
      this.setState({ user: newList});
    }
    else {
      this.getUsers();
    }
    
  };

  deleteUser = async (id) => {
    await api.deleteUser(id).then(response => {
      if (response.success) {
        // this.toast.showMessage('Xóa tài khoản thành công');
        let newList= [...this.state.user];
        this.setState( { user: newList.filter(item => item.id !== id)});
      }
      else {
        this.toast.showMessage('Lỗi hệ thống');
      }
    });
    this.handleSwapDeleteDialog();
  };

  handleSwapDeleteDialog = () => {
    this.setState({showDeleteDialog: !this.state.showDeleteDialog});
  };

  render() {
    let state = this.state;
    return (
      <Container className="mt-2 bg-light" >
        <div
          style={{ display: 'flex', justifyContent: 'center' }}
          className="d-flex justify-content-between flex-wrap flex-md-nowrap p-1 pt-2">
          <h3 className="pl-3 ">DANH SÁCH USER HỆ THỐNG</h3>
          <Button
            variant="outline-success"
            size="sm"
            onClick={()=>{ this.setState({
                  showModal: true,
                  IsAddUser:true
                 })}}>Thêm tài khoản
          </Button>
        </div>
        <ReactTable
          columns={this.columns}
          data={state.user}
          pageSize = {10}
          style={{
            height: "84vh"
          }}
        />
        <UserModel
          IsAddUser={this.state.IsAddUser}
          userInfo={this.state.currentInfo}
          showModal = {state.showModal}
          closeModal = {() =>{this.closeModal()}}
          pushUserToList = {this.pushUserToList}
        />
        <ConfirmModel
          label={"xóa"}
          swapFunc={this.handleSwapDeleteDialog}
          showDialog={this.state.showDeleteDialog}
          confirmFunction={()=>this.deleteUser(this.state.selectUserId)}
        />
        <Toast ref={(ref) => this.toast = ref} />
      </Container>
    )
  }
}