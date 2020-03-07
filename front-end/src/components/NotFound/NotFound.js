import React from 'react';
import './NotFound.css';
import Clound from './images/clouds.svg';
import Star from './images/stars.svg';
import Moon from './images/moon.svg';
import Astronault from './images/astronaut.svg';

export default class NotFound extends React.Component {
  componentDidMount() {
    this.props.handleCurrentPageChange("404");
  }

  render() {
    return(
      <div className="bodyPage">
        <img src={Clound} id="clouds"/>
        <img id = "stars" src={Star}/>
        <div id="body">
          <div className="error404">Page not found</div>
          <img src={Moon} id="moon" />
          <img src={Astronault} id="astronaut" />
        </div>
      </div>
    )
  }


}