import React from "react";
import './PagingGrid.css';
import {Grid, Select} from "@material-ui/core";
import Pagination from "react-js-pagination";

export default class PagingGrid extends React.Component {
  render() {
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className="selectAmountPage"
      >
        <Grid item xs={2}>
          <strong>Số tin / trang: </strong>
          <Select
            native
            value={this.props.defaultAmountPage}
            onChange={this.props.handleChangeState}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </Select>
        </Grid>
        <Grid item xs={3} className="pt-1">
          <strong>Tổng số tin:</strong> <span> {this.props.totalElements} </span>
        </Grid>
        <Grid item xs={7}>
          <Pagination
            className="mt-3"
            activePage={this.props.activePage}
            itemsCountPerPage={this.props.defaultAmountPage}
            totalItemsCount={this.props.totalElements}
            pageRangeDisplayed={5}
            itemClass="page-item"
            linkClass="page-link"
            onChange={this.props.handlePageChange}
          />
        </Grid>
      </Grid>


    );
  }
}
