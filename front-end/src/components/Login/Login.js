import React from 'react';

import { Form, FormControl, FormGroup, FormLabel, Button, Spinner } from 'react-bootstrap';

const NoticeLoading = 'Đang kết nối tới server';
const NoticeLoadFail = "Kết nối tới server bị lỗi";
const MaxInterval = 20000;
const DelayLogin = 500;
const messageLoginFail = 'Thông tin đăng nhập không chính xác';
const EmptyInput = 'Vui lòng điền đủ  thông tin';
class Login extends React.Component {
	constructor(props) {
		super(props);
		let messLoginFail = this.props.message || '';
		this.state = {
			email: '',
			password: '',
			key: '',
			isSubmit: false,
			notice_login: messLoginFail,
			isLoading: false

		}
	}

	handelChange(key, event) {
		//console.log('key, event', key, event.target.value);
		this.setState({ [key]: event.target.value });
	}
	validDate = () => {
		if (!this.state.email || !this.state.password) {
			return false
		}
		else return true

	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.message !== this.state.notice_login) {
			this.setState({
				notice_login: nextProps.message,
				isSubmit: false
			})
		}
	}



	handleSubmit = (event) => {
		if (this.validDate()) {
			this.setState({
				isSubmit: true,
				notice_login: NoticeLoading
			})
			setTimeout(() => {
				if (this.props.onChange) {
					this.setState({ isSubmit: true });
					console.log('type of input login', typeof this.state.email, typeof this.state.password);
					let data = {
						username: this.state.email,
						password: this.state.password
					}
					console.log('DATA', data);
					var timerSubmit = setTimeout(() => {

						this.setState({
							notice_login: NoticeLoadFail,
							isSubmit: false
						})
					}, MaxInterval)
					this.props.onChange(data, timerSubmit);
				}
			}, DelayLogin)
		}
		else {
			this.setState({ notice_login: EmptyInput })
		}

		event.preventDefault();
	};

	render() {
		let { key, email } = this.state;
		console.log('state key', key, 'mail', email);
		return (
			<div className="login-page">
				<div className="col-md-2 col-lg-5 login-form">
					<div className="text-center">
						<h1>Kênh giao thông đô thị VOH</h1>
					</div>
					<div className="mt-4">
						<div className="card card-body" id='form_login'>
							<Form className="form_login">
								<FormGroup>
									<FormLabel htmlFor="email">{"Tài khoản"}</FormLabel>
									<FormControl
										className="input_login"
										type="email"
										name="email"
										required={true}
										placeholder="tài khoản ..."
										value={this.state.email}
										onChange={(event) => this.handelChange('email', event)}
									/>
								</FormGroup>
								<FormGroup>
									<FormLabel htmlFor="password">{"Mật khẩu"}</FormLabel>
									<FormControl
										className="input_login"
										type="password"
										name="password"
										placeholder="mật khẩu ..."
										required={true}
										value={this.state.password}
										onChange={(event) => this.handelChange('password', event)} />
								</FormGroup>
								<Button
									className="mt-4"
									variant="primary"
									block
									type="submit"
									onClick={this.handleSubmit}>
									ĐĂNG NHẬP
								</Button>
							</Form>

							<div className='text-center p-0'>
								<p className="mt-2">&copy; 2019-2020</p>
								<p className="text-danger">{this.state.notice_login}</p>
								{this.state.isSubmit ? <Spinner animation="grow" variant='danger'/> : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;