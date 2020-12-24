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
        <div className="card card-custom" >
			<div className="card-header">
				<div className="card-title">
					<span className="card-icon">
						<i className="flaticon2-wifi text-primary"></i>
					</span>
					<h3 className="card-label">Device List</h3>
				</div>
			<div className="card-toolbar">
				{/* <!--begin::Dropdown--> */}
	
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