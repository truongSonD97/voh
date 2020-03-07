import React from 'react';
import { Nav, Navbar, NavDropdown, Col, OverlayTrigger, ButtonToolbar, Popover, Image,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authoUser } from "../constants/authoUser";
import "./Navigation.css";
import ConfirmModel from "../modal/ConfirmModal/ConfirmModel";
import { MdAccountCircle } from 'react-icons/md';


export default class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: true,
			isFirstAccess: true,
			user: this.props.user,
			currentPage: this.props.currentPage,
			confirmLogoutModel: false,
		};
		this.toggleNavbar = this.toggleNavbar.bind(this);
	}
	componentWillReceiveProps(nextProps, nextContext) {
		if (nextProps.user !== this.state.user) {
			this.setState({ user: nextProps.user });
		}
		if (nextProps.currentPage !== this.state.currentPage) {
			console.log("currentPage: ", nextProps.currentPage);
			this.setState({ currentPage: nextProps.currentPage });
		}
	}

	toggleNavbar() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}

	logOut = () => {
		if (this.props.onChange) {
			this.props.onChange('logout');
		}
	};

	handleSwapLogoutDialog = () => {
		this.setState({ confirmLogoutModel: !this.state.confirmLogoutModel });
	};

	showRole(role) {
		if (role === "ROLE_ADMIN")
			return "Quản lý";
		else if (role === "ROLE_EDITOR")
			return "Biên tập viên";
		else if (role === "ROLE_DATAENTRY")
			return "Thư ký";
		else if (role === "ROLE_DATAENTRY_EDITOR")
			return "Thư ký kiêm BTV";
		else
			return "MC";
	}

	_renderItemNav = () => {
		let { user } = this.state;
		let userRoles = authoUser[user.role] || [];
		return userRoles.map((item, index) => <Nav.Item key={index}>
			<Nav.Link onSelect={() => { this.setState({ isFirstAccess: false }) }}
				as={Link} to={item.path} eventKey={item.name}>{item.name}</Nav.Link>
		</Nav.Item>
		)
	}
	render() {
		return (
			<Navbar className=" context navbar navbar-expand-lg navbar-container" style={{ boxShadow: '1px 1px 20px' }} >
				{this.state.currentPage === "404" ? "" :
					<div className="collapse context navbar-collapse" id="navbar-pages">
						<Nav variant="pills" defaultActiveKey="/VohReport/home" className="navbar-nav mr-auto mt-2 mt-lg-0">
							<Nav.Item >
								<Nav.Link onSelect={() => { this.setState({ isFirstAccess: false }) }}
									as={Link} to="/VohReport/home"
									eventKey="/VohReport/home/" >TRANG CHỦ</Nav.Link>
							</Nav.Item>
							{this._renderItemNav()}
						</Nav>
						<div className='contain-avatar'>
							<ButtonToolbar >
								{['bottom'].map(placement => (
									<OverlayTrigger
										rootClose={true}
										trigger="click"
										key={placement}
										placement={placement}
										overlay={
											<Popover id={`popover-positioned-${placement}`} >
												<Popover.Content className='info-user'>
														<Image className='img-avatar'
															alt="avatar" src={require("../../../assets/images/Avatar.svg")}
															roundedCircle />
														<div className="user-name">
															<h6 style={{margin:"1rem"}}>{this.state.user.name}</h6>
															<p className='user-account'>{this.state.user.username}</p>
															<p className='user-account'>{this.state.user.phoneNumber}</p>
															<p className='user-account'>{this.state.user.role}</p>
														</div>
														<Button onClick={()=>{
															this.handleSwapLogoutDialog();
														}}>ĐĂNG XUẤT</Button>
												</Popover.Content>
											</Popover>
										}
									>
										<MdAccountCircle data-for="userInfo" size="2em" color="#fff"/>
									</OverlayTrigger>
								))}
							</ButtonToolbar>
						</div>
					</div>
				}
				<ConfirmModel
					label={"đăng xuất"}
					swapFunc={this.handleSwapLogoutDialog}
					showDialog={this.state.confirmLogoutModel}
					confirmFunction={() => {
						this.handleSwapLogoutDialog();
						this.logOut();
					}}
				/>
			</Navbar>


		);
	}
}
