import React from 'react';
import {Form, FormControl, FormGroup, FormLabel, Button} from 'react-bootstrap';


class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			email:'',
			password: '',
			key:''
		}
	}

	handelChange (key, event){
		//console.log('key, event', key, event.target.value);
		this.setState({ [key]: event.target.value });
	}


	handleSubmit = event => {
		console.log('handle submit runnnnnnnnnnnnnnnn');
		if(this.props.onChange){
			console.log('type of input login', typeof this.state.email, typeof this.state.password);
			let data = {
				username: this.state.email,
				password: this.state.password
			}
			console.log('DATA', data);
			this.props.onChange(data); 
		}
		event.preventDefault();
	};

	render (){
		let {key, email, name} = this.state;
		console.log('state key', key,'mail', email);
		return (
			<div className="login-page">
				<div className="col-md-6 col-lg-4 login-form">
					<div className="text-center">
					<h2>VOH - Ghi nhận tình hình giao thông</h2>
					</div>
					
					<div className="">
					
						<div className="card card-body">
							
							<Form>
								<FormGroup>
									<FormLabel htmlFor="email">{"Email"}</FormLabel>
									<FormControl type="email" name="email" placeholder="email" value={this.state.email} onChange={(event) =>  this.handelChange('email',event)}/>
								</FormGroup>
								<FormGroup>
									<FormLabel htmlFor="password">{"Password"}</FormLabel>
									<FormControl type="password" name="password" placeholder="password" value={this.state.password} onChange={(event) => this.handelChange('password',event)}/>
								</FormGroup>
								<Button  
									color="primary"
									// type="submit"
									// value={this.renderButtonText()}
									// bsSize="lg"
									// className=" btn btn-primary border-0 text-white"
									block
									onClick={this.handleSubmit}>
										Submit
								</Button>
							</Form>
						</div>
					</div>
				</div>
				
			</div>
		);
	}
}

export default Register;