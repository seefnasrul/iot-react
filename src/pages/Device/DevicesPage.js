// import "./styles.css";
import ReactDOM from 'react-dom';
import React, { Component } from "react";
import axios from "axios";
import Url from '../../constants/Url';
import {connect} from 'react-redux';
import {Link, Redirect,withRouter} from 'react-router-dom';
// import {bindActionCreators} from 'redux';

// import '../../assets_copy/plugins/custom/datatables/datatables.bundle.css';

const $ = require('jquery')
$.DataTable = require('datatables.net')


class DevicesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
	  loading: true,
	  columns : [
		{
			title: 'Name',
			data: 'name'
		},
		{
			title: 'Serial ID',
			data: 'device_serial_id'
		},
		{
			title: 'Created At',
			data: 'created_at'
		},
		{   orderable: false,	
			title:"Action",
			data: null, 
			className: "center",
			createdCell : ( td, cellData, rowData, row, col) => 
			ReactDOM.render(
				// return '<a href="/device/"+rowData._id></a>'
				<React.Fragment>
					<div class="btn btn-sm btn-clean btn-icon" title="Edit details" onClick={()=>this.change_route("/device/"+rowData._id+"/edit")}><i class="la la-edit"></i></div>
					<div class="btn btn-sm btn-clean btn-icon" title="View details"  onClick={()=>this.change_route("/device/"+rowData._id)}><i class="la la-eye"></i></div>
				</React.Fragment>,td
			)
		}
	],
    };
  }


  change_route = (route) => {
	this.props.history.push(route);
  }

  //option 1
  async getUsersData() {
    const res = await axios.get(Url.API+"/device/get-device");	
    console.log(res.data);
    this.setState({ loading: false, users: res.data });
  }

  //option 2
  async getUsersData1() {
    const res = await axios.get(Url.API+"/device/get-device");
    return res.data;
  }

	componentDidMount = ()=>{
		this.$el = $(this.el);
			this.$el.DataTable({
			processing: true,
			serverSide: true,
			columns:this.state.columns,
			ordering: true,
			paging:true,
			ajax: {
			url: Url.API+"/device/get-device",
			type: 'GET',
			beforeSend : (xhr) => {
				xhr.setRequestHeader("Authorization","Bearer " + this.props.token.access_token);
			}
		},

		});
	}

  render() {
    return (
        <div className="card card-custom" style={{marginTop:'25px'}}>
			<div className="card-header">
				<div className="card-title">
					<span className="card-icon">
						<i className="flaticon2-wifi text-primary"></i>
					</span>
					<h3 className="card-label">Device List</h3>
				</div>
			<div className="card-toolbar">
				{/* <!--begin::Dropdown--> */}
				<div className="dropdown dropdown-inline mr-2">
					<button type="button" className="btn btn-light-primary font-weight-bolder dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="svg-icon svg-icon-md">
						{/* <!--begin::Svg Icon | path:assets/media/svg/icons/Design/PenAndRuller.svg--> */}
						<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
							<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
								<rect x="0" y="0" width="24" height="24"></rect>
								<path d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z" fill="#000000" opacity="0.3"></path>
								<path d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z" fill="#000000"></path>
							</g>
						</svg>
						{/* <!--end::Svg Icon--> */}
					</span>Export</button>
					{/* <!--begin::Dropdown Menu--> */}
					<div className="dropdown-menu dropdown-menu-sm dropdown-menu-right" >
						{/* <!--begin::Navigation--> */}
						<ul className="navi flex-column navi-hover py-2">
							<li className="navi-header font-weight-bolder text-uppercase font-size-sm text-primary pb-2">Choose an option:</li>
							<li className="navi-item">
								<a href="#" className="navi-link">
									<span className="navi-icon">
										<i className="la la-print"></i>
									</span>
									<span className="navi-text">Print</span>
								</a>
							</li>
							<li className="navi-item">
								<a href="#" className="navi-link">
									<span className="navi-icon">
										<i className="la la-copy"></i>
									</span>
									<span className="navi-text">Copy</span>
								</a>
							</li>
							<li className="navi-item">
								<a href="#" className="navi-link">
									<span className="navi-icon">
										<i className="la la-file-excel-o"></i>
									</span>
									<span className="navi-text">Excel</span>
								</a>
							</li>
							<li className="navi-item">
								<a href="#" className="navi-link">
									<span className="navi-icon">
										<i className="la la-file-text-o"></i>
									</span>
									<span className="navi-text">CSV</span>
								</a>
							</li>
							<li className="navi-item">
								<a href="#" className="navi-link">
									<span className="navi-icon">
										<i className="la la-file-pdf-o"></i>
									</span>
									<span className="navi-text">PDF</span>
								</a>
							</li>
						</ul>
						{/* <!--end::Navigation--> */}
					</div>
					{/* <!--end::Dropdown Menu--> */}
				</div>
				{/* <!--end::Dropdown--> */}
				{/* <!--begin::Button--> */}
				<Link to="/devices/create" className="btn btn-primary font-weight-bolder">
				<span className="svg-icon svg-icon-md">
					{/* <!--begin::Svg Icon | path:assets/media/svg/icons/Design/Flatten.svg--> */}
					<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
						<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
							<rect x="0" y="0" width="24" height="24"></rect>
							<circle fill="#000000" cx="9" cy="15" r="6"></circle>
							<path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3"></path>
						</g>
					</svg>
					{/* <!--end::Svg Icon--> */}
				</span>Add New Device</Link>
				{/* <!--end::Button--> */}
			</div>
		</div>
        <div className="card-body alert-custom alert-white alert-shadow gutter-b" id="dt-container" >
			<table
				width="100%"
				ref={(el) => (this.el = el)}
			></table>
			{/* <table ref="main" ></table> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
        user_data: state.auth.user_data
    };
};

// Exports
export default connect(mapStateToProps)(withRouter(DevicesPage));