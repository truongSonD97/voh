import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {DialogActions, TextField} from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

export default class ConfirmModel extends React.Component {
  constructor(props) {
    super(props);
    let showDialog = props.showDialog?props.showDialog:false;
    this.state={
      showDialog,
      removeReason:"",
      removeError:false
    }
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.showDialog !== this.state.showDialog){
      this.setState({showDialog : nextProps.showDialog});
    }
  }

  handleClose = () => {
    this.setState({showDialog:false, removeReason:"", removeError:false});
    this.props.swapFunc()
  };

  handleConfirm = () => {
    if(this.props.deleteConfirm === true){
      if(this.state.removeReason.trim() === "") {
        this.setState({removeError: true});
      }else{
        this.props.confirmFunction(this.state.removeReason);
      }
    }else{
      this.props.confirmFunction();
    }
  };

  handleChangeReason = (removeReason) => {
    if(removeReason.trim() !== ""){
      let removeError = false ;
      this.setState({ removeReason, removeError });
    }
    else{
      this.setState({ removeReason });
    }
  };

  render(){
    return(
      <div>
        <Dialog
         TransitionComponent={Transition}
         open={this.state.showDialog}
         keepMounted
         onClose={this.handleClose}
         fullWidth={true}
         maxWidth={this.props.removeContent?"sm":"xs"}
        >
        <DialogTitle>{this.props.label.toUpperCase()}</DialogTitle>
        <DialogContent>
         <DialogContentText>
           Bạn có chắc muốn {this.props.label} tin này không ?
         </DialogContentText>
          {
            this.props.deleteConfirm ?
            <TextField
              autoFocus
              margin="dense"
              value={this.state.removeReason}
              onChange={(event) => this.handleChangeReason(event.target.value)}
              label={`Nhập lý do ${this.props.label} ...`}
              fullWidth
              error={ this.state.removeError}
              // multiline
              // rows="2"
            /> : ""
          }
        </DialogContent>
        <DialogActions>
         <Button
           onClick={()=>this.handleConfirm(this.state.removeReason)} variant="contained" color="primary"
           startIcon={<CheckIcon />}>
           {this.props.label.toUpperCase()}
         </Button>
         <Button
           onClick={this.handleClose} color="secondary" variant="contained"
           startIcon={<CloseIcon />}>
           HỦY
         </Button>
        </DialogActions>
        </Dialog>
      </div>
    )
 }
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});