import React from 'react';
import {Button, Modal} from "react-bootstrap";
import './DetailModal.css';

export default class DetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

 render(){
    let props = this.props;
   return(
     <div>
       <Modal show={props.showModal} onHide={props.close}>
         <Modal.Header closeButton>
           <Modal.Title>Thông tin chi tiết</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           {props.info}
         </Modal.Body>
         <Modal.Footer>
           <Button variant="success" onClick={props.modify}>Chỉnh sửa</Button>
           <Button variant="danger" onClick={props.close}>Đóng</Button>
         </Modal.Footer>
       </Modal>
     </div>
   )
 }
}