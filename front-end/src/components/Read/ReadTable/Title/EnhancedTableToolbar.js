import React from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Fab, Tooltip} from "@material-ui/core";
import './TableTitle.css';
import ConfirmModel from "../../../Common/modal/ConfirmModal/ConfirmModel";


export default class EnhancedTableToolbar extends React.Component {
  constructor(props) {
    super(props);
    let status = {};
    this.props.statusList.map(x => status[x.status]=false);
    this.state = status;
    this.state.numSelected = this.props.selectList ? this.props.selectList.length:0;
  }

  handleClick = (status, content) =>{
    let selectList = this.props.selectList ;
    if(this.props.handleSwitchStatus && selectList && this.props.userId){
      selectList.map(id => this.props.handleSwitchStatus(this.props.userId, id, status, content));
      if(this.props.clearSelectList){
        this.props.clearSelectList();
      }
    }
    this.handleSwapDialog(status);
  };

  handleSwapDialog = name => {
    this.setState({[name]: !this.state[name]});
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.selectList !== this.props.selectList){
      let numSelected = nextProps.selectList ? nextProps.selectList.length:0;
      this.setState({numSelected})
    }
  }

  render() {
    let numSelected = this.state.numSelected;
    return(
      <Grid
        container
        direction="row"
        justify="flex-end"
        alignItems="flex-start"
        className="tableToolbar"
      >
        <Grid item xs={12}>
          <Paper className="paper-title pl-2">
            {numSelected > 0 ?
              <div>
                {
                  this.props.statusList.map(item=>
                    <span>
                      <Tooltip title= {item.title.charAt(0).toUpperCase() + item.title.slice(1)+" các tin đã chọn"}>
                        <Fab
                          size="small"
                          onClick={()=>this.handleSwapDialog(item.status)}
                          color={item.color}
                        >
                          {item.ic}
                        </Fab>
                      </Tooltip>{"      "}
                    </span>)
                }
                <strong className="pl-4">
                  {numSelected > 0 ? numSelected + ' tin được chọn !':''}
                </strong>
              </div>
              : ""}
          </Paper>
          {
            this.props.statusList.map(item=>{
              return(
                <ConfirmModel
                  label={item.title}
                  deleteConfirm = {item.status === "delete" || item.status === "unread"}
                  swapFunc={()=>this.handleSwapDialog(item.status)}
                  showDialog={this.state[item.status]}
                  confirmFunction={(content)=>this.handleClick(item.status, content)}
                />)})
          }
        </Grid>
      </Grid>
    )
  }
}