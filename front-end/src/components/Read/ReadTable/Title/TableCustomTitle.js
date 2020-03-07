import React from 'react';
import { Box ,Button } from '@material-ui/core';
import "./TableTitle.css";
import { districtList } from '../../../Common/constants/districts';
import api from "../../../../utils/api";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';

export default class TableCustomTitle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			speeds:[],
			_speed:'',
			_district:'',
		}
	}
	componentDidMount() {
		api.getSpeeds()
			.then(response =>{
				if(response.success){
					this.setState({speeds:response.data})
				}
			})
	}

	handleChange = name => event => {
		let district = this.state._district;
		let speed = this.state._speed;
		if(name==='speed'){
			speed = event.target.value;
			this.setState({_speed:speed});
			if(district!=='' && this.props.onSortDistrictAndSpeed){
				this.props.onSortDistrictAndSpeed(speed,district)
			}
			else if(this.props.onSortSpeed){
				this.props.onSortSpeed(speed);
			}
		}else if (name==='district'){
			district = event.target.value;
			this.setState({_district:district});
			if(speed!=='' && this.props.onSortDistrictAndSpeed){
				this.props.onSortDistrictAndSpeed(speed,district);
			}
			else if(this.props.onSOrtDistrict){
				this.props.onSOrtDistrict(district);
			}
		}
	};

	render() {
		return (
			<Box display="flex" p={1} id="read-title">
				<Box p={1} flexGrow={1} className="read-child-box">
					<h4 id={"title-content"}>{this.props.titleTable? this.props.titleTable:"Bảng tin"}</h4>
				</Box>
				<Box p={1} className="read-child-box">
					<Grid
						container
						direction="row"
						justify="flex-end"
						alignItems="flex-end"
					>
						<Grid item xs={7}>
							<FormControl>
								<InputLabel>Tình trạng</InputLabel>
								<Select
									native
									value={this.state._speed}
									onChange={this.handleChange('speed')}
								>
									<option value="" />
									{this.state.speeds.map(item =><option value={item.id}> {item.name} </option>)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={3}>
							<FormControl className="pr-2">
								<InputLabel>Quận</InputLabel>
								<Select
									native
									value={this.state._district}
									onChange={this.handleChange('district')}
								>
									<option value="" />
									{districtList.map(item =><option value={item.key}>{item.name} </option>)}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={2} >
							<Button
								color="primary"
								variant="contained"
								size="small"
								onClick={()=>{
					        if(this.props.onDefault){
										this.props.onDefault();
										this.setState({_district:'', _speed:''})
									}
								}}>
								TẤT CẢ
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Box>
		)
	}
}