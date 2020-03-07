import React from 'react';
import "./Home.css"
import { Row, Col } from 'react-bootstrap';
import api from '../../utils/api';
export default function Home() {

	try {
		let testApi = api.getAddresses();
		console.log("TEST ASY",testApi);
		testApi.then( response => {
			console.log(response)
		}
			
		)
	} catch (error) {
		console.log(error)
		
	}
	
	 
	return (
		<section id="home">
			<div className="inner text-color">
				<div className='container-sm'>
					<Row>
						<Col md={{ span: 8, offset: 2 }}>
							<h1 className='margin-title text-title-font-style'>
								Kênh giao thông đô thị VOH
						</h1>
							<h4 className='text-detail-font-size'>Hệ thống hỗ trợ Kênh giao thông đô thị của VOH trên sóng FM 95.6 MHz.	
							Ghi nhận, xử lý, tổng hợp bản tin giao thông tại TP. Hồ Chí Minh và các khu vực lân cận.	
							Sản phẩm được thực hiện bởi nhóm nghiên cứu từ Khoa KH&KT Máy Tính - Trường Đại Học Bách Khoa TP. HCM</h4>	
						</Col>
					</Row>

				</div>
			</div>
			<div className='footer'>
				<p className='text-color'>Thông tin liên hệ kênh giao thông
				<a href='https://voh.com.vn/radio/fm-95.6-mhz-3.html'> VOH 95.6 Mhz </a>
					và Đại học
				 <a href='http://www.cse.hcmut.edu.vn/site/'>  Bách Khoa </a> Hồ Chí Minh</p> 
			</div>
		</section>
	)
}

