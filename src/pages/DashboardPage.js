import React,{Component,useState} from 'react';
import {Link} from 'react-router-dom';

import * as dashboardActions from '../redux/actions/dashboardActions';
import {connect} from 'react-redux';
import {bindActionCreators,} from 'redux';
import ClipLoader from "react-spinners/ClipLoader";
import {Rupiah, SortParagraph} from '../helpers/Helper';
import loadjs from 'loadjs';
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import Responsive from "react-grid-layout";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Url from '../constants/Url';
import AsyncSelect from 'react-select/async';
import Select from 'react-select'

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Modal, Tooltip } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import Switch from "react-switch";
import GaugeChart from 'react-gauge-chart'
import MediaQuery from 'react-responsive'
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/gauge";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/tree";
import "echarts/lib/component/markArea";


const c = require('classnames');
const moment = require('moment');
// const ReactGridLayout = WidthProvider(RGL);
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const customStyles = {
  content : {
    top                   : '25%',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
  }
};
class DashboardPage extends React.Component {

    static defaultProps = {
        // className: "layout",
        // rowHeight: 30,
        // cols: 12,
        // y:5

        className: "layout",
    rowHeight: 30,
    // onLayoutChange: function() {},
    // cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      };
    
      constructor(props) {
        super(props);
        this.state = { 
          layout:null,
          items: props.dashboard.data,
          // timerange: props.dashboard.dashboard_timerange,
          time_start:null,
          time_end:null,
          realtime:false,
          add_widget_modal:false,
          submiting_add_widget:false,
          time_range_modal:false,
          submiting_time_range_modal:false,
          options:[],
          widget_to_delete_index:null,
          delete_widget_modal:false,
          delete_widget_modal_loading:false
          // options:{
          //   xAxis: {
          //     type: "category",
          //     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          //   },
          //   yAxis: {
          //     type: "value"
          //   },
          //   series: [{ 
          //     data: [820, 932, 901, 934, 1290, 1330, 1320],
          //     type: "line"
          //   }, 
          // ]
          // }
        };
        this.echarts_react = null;
        this.interval_realtime = null;
        console.log(props);
      }



      componentDidUpdate = async (prevProps)   => {
        if(this.props.dashboard !== prevProps.dashboard) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
          let dashboard = this.props.dashboard;
          await this.setState({
            items:dashboard.data,
            time_start:dashboard.time_start,
            time_end:dashboard.time_end,
            realtime:dashboard.realtime,
          });
          await this.get_widget_data();
          if(this.state.realtime){
              if(this.interval_realtime !== null){
                clearInterval(this.interval_realtime);
              }
              this.interval_realtime = setInterval(async ()=>{
                await this.setState({time_end:new Date().toISOString().slice(0, 19).replace('T', ' ')});
                this.get_widget_data();
              },3000);
          }else{
            // if(this.interval_realtime !== null) {
              clearInterval(this.interval_realtime);
            // }
            
          }
          this.setState({layout:this.generateLayout()});
        }
      }

      componentWillUnmount = () =>{
        // if(this.interval_realtime !== null) {
          clearInterval(this.interval_realtime);
        // }
      }
      
      
      get_widget_data = async () =>{
        for (let index = 0; index < this.state.items.length; index++) {
          const element = this.state.items[index];
          if(element.data.widget_type == 'line_chart' || element.data.widget_type == 'gauge'){
            console.log(element.data);
            var res = await axios.get(Url.API+'/dashboard/get-widget-data',{
              params:{
              time_start:this.state.time_start,
              time_end:this.state.time_end,
              type:element.data.widget_type,
              device_serial_id:element.data.device_serial_id,
              device_field:element.data.device_field_name,
              aggregation:element.data.aggregation,
            }});
            // console.log('get-widget',res)
            let options = this.state.options;
            let option = {};
          if(element.data.widget_type == 'line_chart'){
            let labels = [];

            for (let index = 0; index < res.data.data.labels.length; index++) {
              // if()
              const row = res.data.data.labels[index];
              labels.push(moment.unix(row).format("HH:mm MM/DD/YY"));
            }
            option = {
                title: {
                  text: 'Evolução da dívida'
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
                tooltip:{
                  trigger: 'item',
                  show: true
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: labels
                },
                yAxis: {
                  type: "value"
                },
                series: [{ 
                  data: res.data.data.values,
                  type: "line",
                  tooltip: {
                    formatter: '{c}'
                  },
                  name:'data'
                }, 
              ]
            };
          }else if(element.data.widget_type == 'gauge'){
            option = {
              // value:res.data.data.values[0],
              // aggregation:element.data.aggregation,
              // label:res.data.data.labels[0]
              tooltip: {
                  formatter: '{a} <br/>{b} : {c}'
              },
              toolbox: {
                  feature: {
                      restore: {},
                      saveAsImage: {}
                  }
              },
              series: [
                  {
                      name: element.data.aggregation,
                      type: 'gauge',
                      detail: {formatter: '{value}'},
                      data: [{value: res.data.data.values[0], name: res.data.data.labels[0]/*this.state.time_end */ }]
                  }
              ]
          };
          }

            options[index] = option;
            
            await this.setState({options:options});
          }else{
            let options = this.state.options;
            options[index] = {};
            await this.setState({options:options});
          }
        }
        
      }

      componentDidMount = async () =>{
        this.props.actions.dashboard.get_dashboard_data(this.on_success_get_dashboard,this.on_failed_get_dashboard);
        
        this.setState({layout:this.generateLayout()});
      }

      add_new_grid = async (form_data) => {
        this.setState({submiting_add_widget:true});
        var {items} = this.state;
        var latest_i = items.length > 0 ? items.length-1 : items.length;
        items.push({
          x: ((latest_i > 0 ? latest_i+1 : latest_i) * 4) % 12,
          y: Math.floor(latest_i+1 / 6) * 6,
          w: 4,
          h: 6,
          i: latest_i,
          data:form_data
        });
        await this.setState({items:items});
        await this.setState({layout:this.generateLayout()});
        console.log('runs');
        this.props.actions.dashboard.save_dashboard(this.state.items,this.on_success,this.on_failed);
      }

      on_success_get_dashboard = (data) =>{
        // this.setState({items:[]});
        console.log(data);
      }

      
      on_failed_get_dashboard = (data) =>{
        // this.setState({items:[]});
        console.log(data);
      }

      on_success = (data) =>{
        console.log('success',data);
        this.setState({submiting_add_widget:false});
        this.close_modal();
      }

      
      on_failed = (data) =>{
        console.log('failed',data);
        this.setState({submiting_add_widget:false});
        this.close_modal();
      }




    
      generateDOM() {
        return this.state.items.map((value,index)=>{
          

          return (
            <div key={index} className="grid-widget-box">
              <div className="toolbar">
                <span>{value.data?.widget_title}</span>
                <div className="btn-group dropleft">
                <div className="dropdown dropdown-inline">
                    <button type="button" className="btn btn-light-primary btn-icon btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="ki ki-bold-more-ver"></i>
                    </button>
                    <div className="dropdown-menu">
                    <a className="dropdown-item" href="#" onClick={()=>this.setState({widget_to_delete_index:index,delete_widget_modal:true})}>Delete</a>
                    </div>
                </div>

              </div>
              </div>
              {
                this.state.items[index].data.widget_type == 'line_chart' &&
                <ReactEchartsCore option={typeof this.state.options[index] == 'undefined' ? {} : this.state.options[index]} echarts={echarts} showLoading={typeof this.state.options[index] == 'undefined' ? true :false} />
              }
              {
                this.state.items[index].data.widget_type == 'gauge' &&
                // <GaugeChart id={"gauge-"+index}
                //   nrOfLevels={20} 
                //   percent={0.86} 
                //   formatTextValue={value=>{
                //    if(typeof this.state.options[index] == 'undefined'){
                //     return '0';
                //    }else{
                //      return typeof this.state.options[index].value;
                //    }
                //   }}
                  
                // />
                <ReactEchartsCore option={typeof this.state.options[index] == 'undefined' ? {} : this.state.options[index]} echarts={echarts} showLoading={typeof this.state.options[index] == 'undefined' ? true :false} />
              }

              {
              this.state.items[index].data.widget_type == 'text' &&
              this.state.items[index].data.text_content
              }
              
            </div>
          );
        });
      }
    
      generateLayout() {
        return this.state.items.map((item, i) => {
          // const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
          return {
            x: item.x,
            y: item.y,
            w: this.props.isMobile ? 12 : item.w,
            h: item.h,
            i: i.toString(),
            isResizable:!this.props.isMobile
            
          };
        });
      }
    
      // onLayoutChange(layout) {
      //   // this.save_on_layout_change(layout)
      // }

      save_on_layout_change = (layout) => {

        var new_items = [];
        
        for (let index = 0; index < layout.length; index++) {
          const lay = layout[index];

          if(typeof this.state.items[index] === 'undefined'){

          }else{
            if(!this.props.isMobile){
              new_items[index] = {
                i: index/*lay.i*/,
                w:lay.w,
                x:lay.x,
                y:lay.y,
                h:lay.h,
                data:this.state.items[index].data,
              }
            }else{
              new_items[index] = {
                i:index/*lay.i*/,
                w:(typeof this.state.layout[index] === 'undefined') ? lay.w : this.state.layout[index].w,
                x:lay.x,
                y:lay.y,
                h:(typeof this.state.layout[index] === 'undefined') ? lay.h : this.state.layout[index].h,
                data:this.state.items[index].data,
              }
            }
            
          }
          
        }

        this.props.actions.dashboard.save_dashboard(new_items,this.on_success,this.on_failed);
      }
      //mantap

      delete_layout = async () =>{
        this.setState({delete_widget_modal_loading:true});
        const res = await axios.post(Url.API+"/dashboard/delete-widget",{index:this.state.widget_to_delete_index});
        this.setState({delete_widget_modal_loading:false,delete_widget_modal:false,widget_to_delete_index:null});
        this.props.actions.dashboard.get_dashboard_data(this.on_success_get_dashboard,this.on_failed_get_dashboard);
        this.setState({layout:this.generateLayout()});
      }


      get_device_id_options = async (inputValue) =>{
        const res = await axios.get(Url.API+"/device/get-device-select?keyword="+inputValue);
        console.log(res);
        return res.data.data;
      }

      get_device_field_select = async (device_serial_id) =>{
        const res = await axios.get(Url.API+"/device/get-device-field-select?device_serial_id="+device_serial_id);
        console.log(res);
        return res.data.data;
      }


      close_modal = () =>{
        this.setState({add_widget_modal:false});
      }

      open_modal = () =>{
        this.setState({add_widget_modal:true});
      }


      close_modal_timerange = () =>{
        this.setState({time_range_modal:false});
      }

      open_modal_timerange = () =>{
        this.setState({time_range_modal:true});
      }


      submit_timerange = (form_data) =>{
        this.setState({submiting_time_range_modal:true});
        let submit_data = {
          time_start:moment(form_data.time_start,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
          time_end:moment(form_data.time_end,'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD HH:mm:ss'),
          realtime:form_data.realtime,
        }
        // console.log(submit_data);
        this.props.actions.dashboard.save_dashboard_timerange(submit_data,this.success_save_timerange,this.failed_save_timerange);
      }

      success_save_timerange = (data) =>{
        console.log(data)
        this.setState({submiting_time_range_modal:false});
        this.close_modal_timerange();
      }

      failed_save_timerange = (data) =>{
        console.log(data)
        this.setState({submiting_time_range_modal:false});
        this.close_modal_timerange();
      }

    
      render() {
        const {time_start,time_end,realtime} = this.state;
        const {header} = this.props;
        return (
          <React.Fragment>
            <div className="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader" style={{marginTop:'40px'}}>
              <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                            
                <div className="d-flex align-items-center flex-wrap mr-2">
                    <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5" >{header}</h5>    
                </div>

                <div className="d-flex align-items-center">

									<a href="#" className="btn btn-clean btn-sm font-weight-bold font-size-base mr-1" onClick={()=>this.setState({time_range_modal:true})}>
                  <i className="icon-1x text-muted flaticon2-calendar"></i>
                  <span  className="text-primary font-size-base font-weight-bolder" id="kt_dashboard_daterangepicker_date">{time_start}</span>
                  <span  className="text-primary font-size-base font-weight-bolder" id="kt_dashboard_daterangepicker_date"> - </span>
                  <span  className="text-primary font-size-base font-weight-bolder" id="kt_dashboard_daterangepicker_date">{(!realtime) ? time_end : 'Now'}</span>
                  </a>

                                    
                  <a href="#"  className="btn btn-clean btn-sm font-weight-bold font-size-base mr-1" 
                   ><i className="icon-2x text-dark-50 flaticon2-add-square"  onClick={this.open_modal}></i></a>

									<div className="dropdown dropdown-inline" data-toggle="tooltip" title="" data-placement="left" data-original-title="Widget Menu">
										<a href="#" className="btn btn-sm btn-clean btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="icon-2x text-dark-50 flaticon-more"></i>
										</a>
										<div className="dropdown-menu p-0 m-0 dropdown-menu-md dropdown-menu-right py-3" >
											<ul className="navi navi-hover py-5">
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-drop"></i>
														</span>
														<span className="navi-text">New Group</span>
													</a>
												</li>
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-list-3"></i>
														</span>
														<span className="navi-text">Contacts</span>
													</a>
												</li>
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-rocket-1"></i>
														</span>
														<span className="navi-text">Groups</span>
														<span className="navi-link-badge">
															<span className="label label-light-primary label-inline font-weight-bold">new</span>
														</span>
													</a>
												</li>
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-bell-2"></i>
														</span>
														<span className="navi-text">Calls</span>
													</a>
												</li>
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-gear"></i>
														</span>
														<span className="navi-text">Settings</span>
													</a>
												</li>
												<li className="navi-separator my-3"></li>
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-magnifier-tool"></i>
														</span>
														<span className="navi-text">Help</span>
													</a>
												</li>
												<li className="navi-item">
													<a href="#" className="navi-link">
														<span className="navi-icon">
															<i className="flaticon2-bell-2"></i>
														</span>
														<span className="navi-text">Privacy</span>
														<span className="navi-link-badge">
															<span className="label label-light-danger label-rounded font-weight-bold">5</span>
														</span>
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
                                
              </div>
            </div>
                           
            <div className="d-flex flex-column-fluid">
              <div className="container" style={{minHeight:'100vh'}}>
                  <div className="row" style={{marginTop:'25px',minHeight:'100vh'}}>
                    
                    <div className="col-md-12">
                      <ResponsiveReactGridLayout
                        layout={this.state.layout}
                        onLayoutChange={this.save_on_layout_change}
                        {...this.props}

                      >
                        {this.generateDOM()}
                        <span className="react-resizable-handle react-resizable-handle-se" style="touch-action: none;"></span>
                      </ResponsiveReactGridLayout>
                    </div>
                </div>
                
              </div>
          </div>

          <Modal show={this.state.add_widget_modal} onHide={this.close_modal} >
            <Modal.Header closeButton>
              <Modal.Title>Add Widget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddWidgetForm onSubmit={(value)=>this.add_new_grid(value)} get_device_id_options={this.get_device_id_options} get_device_field_select={this.get_device_field_select} close_modal={this.close_modal} loading={this.state.submiting_add_widget} />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.time_range_modal} onHide={()=>this.setState({time_range_modal:false})} >
            <Modal.Header closeButton>
              <Modal.Title>Time Range</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <TimeRangeForm 
              onSubmit={(value)=>this.submit_timerange(value)}
              close_modal={this.close_modal_timerange} 
              loading={this.state.submiting_time_range_modal} 
              dashboard={this.props.dashboard}

              />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.delete_widget_modal} onHide={()=>this.setState({delete_widget_modal:false})} >
            <Modal.Header closeButton>
              <Modal.Title>Delete Widget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to delete this <b>{this.state.widget_to_delete_index !== null ? this.state.items[this.state.widget_to_delete_index].data.widget_title : ''}</b> ?</p>

              <div className="modal-footer">
                <button type="button" className="btn btn-light-primary font-weight-bold" onClick={()=>this.setState({delete_widget_modal:false})}>Cancel</button>
                <button type="button" 
                className={c("btn btn-primary font-weight-bold",{"spinner spinner-white spinner-right mr-3":this.state.delete_widget_modal_loading})} 
                onClick={()=>this.delete_layout()}>Yes</button>
              </div>
            </Modal.Body>
          </Modal>
                            
          </React.Fragment>

            
        );
      }

}
const AddWidgetSchema = Yup.object({
  widget_title: Yup.string().required('Widget Title is required'),
  widget_type: Yup.string().required('Widget Type is required'),
  device_serial_id: Yup.string()
  .when('widget_type',{
    is:(value)=>['gauge','line_chart'].includes(value),
    then:Yup.string().required('Device Serial ID is required')
  })
  ,
  device_field_name: Yup.string()
  .when('widget_type',{
    is:(value)=>['gauge','line_chart'].includes(value),
    then:Yup.string().required('Device Field Name is required')
  }),
  text_content: Yup.string()
  .when('widget_type',{
    is:(value)=>['text'].includes(value),
    then:Yup.string().required('Text Content is required')
  }),
  gauge_range_value_min: Yup.number()
  .when('widget_type',{
    is:(value)=>['gauge'].includes(value),
    then:Yup.number().required('Gauge Range Value Min is required').lessThan(Yup.ref('gauge_range_value_max'), "must be less than max value").integer()
  }),
  gauge_range_value_max: Yup.number()
  .when('widget_type',{
    is:(value)=>['gauge'].includes(value),
    then:Yup.number().required('Gauge Range Value Max is required').moreThan(Yup.ref('gauge_range_value_min'), "must be more than min value").integer()
  }),
  aggregation:Yup.string()
  .when('widget_type',{
    is:(value)=>['gauge','line_chart'].includes(value),
    then:Yup.string().required('Aggregation Method is required')
  }),
});


const AddWidgetForm = (props) =>{
  
  const [device_serial_id_select, setDeviceSerialIDSelect] = useState('');
  const [device_field_select, setDeviceFieldSelect] = useState([]);
  const formik = useFormik({
    initialValues:{
        widget_type:'',
        widget_title:'',
        device_serial_id:'',
        device_field_name:'',
        text_content:'',
        gauge_range_value_min:0,
        gauge_range_value_max:100,
    },
    validationSchema:AddWidgetSchema,
    onSubmit: values => {
        formik.resetForm({});
        props.onSubmit(values)
    },
  });

  const handleChangeDeviceSerialID = async (value) =>{
    await formik.setFieldValue('device_serial_id',value.value);
    const res = await axios.get(Url.API+"/device/get-device-field-select",{params:{device_serial_id:value.value}});
    await setDeviceFieldSelect(res.data.data);
  }


  const handleChangeDeviceFieldName = async (value) =>{
    await formik.setFieldValue('device_field_name',value.value);
    
  }
  // const {isLoading} = props;
  return(
    // <React.Fragment>
      <form className="form" id="kt_login_signin_form" onSubmit={formik.handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label for="exampleSelect2">Widget Title <span className="text-danger">*</span></label>
              <input type="text" className="form-control" onChange={formik.handleChange} name="widget_title" value={formik.values.widget_title} />
              {
                  formik.errors.widget_title ?
                  <div className="invalid-feedback" style={{display:'block'}}>
                      {formik.errors.widget_title}
                  </div>
                  :
                  null
              }
            </div>             
            <div className="form-group">
              <label for="exampleSelect2">Widget Type <span className="text-danger">*</span></label>
              <select className="form-control" id="exampleSelect2" onChange={formik.handleChange} name="widget_type" value={formik.values.widget_type}>
              <option value="" ></option>
                <option value="text" >Text</option>
                <option value="gauge">Gauge</option>
                <option value="line_chart">Line Chart</option>
              </select>
              {
                  formik.errors.widget_type ?
                  <div className="invalid-feedback" style={{display:'block'}}>
                      {formik.errors.widget_type}
                  </div>
                  :
                  null
              }
            </div>

            {
              formik.values.widget_type !== 'text' && formik.values.widget_type !== '' &&
              
              <React.Fragment>
                <div className="form-group">
                <label for="exampleSelect2">Device<span className="text-danger">*</span></label>
                <AsyncSelect 
                cacheOptions 
                defaultOptions 
                loadOptions={props.get_device_id_options} 
                onChange={(value)=>handleChangeDeviceSerialID(value)} 
                placeholder="Type to search" 
                />
                {
                    formik.errors.device_serial_id ?
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.device_serial_id}
                    </div>
                    :
                    null
                }
              </div>

              <div className="form-group">
                <label for="exampleSelect2">Device Field Name<span className="text-danger">*</span></label>
                <Select 
                options={device_field_select} 
                isDisabled={formik.values.device_serial_id == ''} 
                onChange={(value)=>handleChangeDeviceFieldName(value)} 

                />
                {/* <AsyncSelect 
                cacheOptions 
                defaultOptions={props.get_device_field_select(formik.values.device_serial_id)}
                // loadOptions={(inputValue)=>props.get_device_field_select(inputValue,formik.values.device_serial_id)} 
                onChange={(value)=>handleChangeSelect('device_field_name',value)} 
                placeholder="Type to search" 
                
                /> */}
                {
                    formik.errors.device_field_name ?
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.device_field_name}
                    </div>
                    :
                    null
                }
              </div>
              
              </React.Fragment>
            }


            {
              formik.values.widget_type == 'gauge' &&
              <React.Fragment>
                <div className="form-group">
                  <label for="exampleSelect2">Min Value<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" onChange={formik.handleChange} name="gauge_range_value_min" value={formik.values.gauge_range_value_min} />
                  {
                      formik.errors.gauge_range_value_min ?
                      <div className="invalid-feedback" style={{display:'block'}}>
                          {formik.errors.gauge_range_value_min}
                      </div>
                      :
                      null
                  }
                </div>  
                <div className="form-group">
                  <label for="exampleSelect2">Max Value<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" onChange={formik.handleChange} name="gauge_range_value_max" value={formik.values.gauge_range_value_max} />
                  {
                      formik.errors.gauge_range_value_max ?
                      <div className="invalid-feedback" style={{display:'block'}}>
                          {formik.errors.gauge_range_value_max}
                      </div>
                      :
                      null
                  }
                </div>  
              </React.Fragment>
            }


            {
              formik.values.widget_type == 'text' &&
              <React.Fragment>
                <div className="form-group">
                  <label for="exampleSelect2">Text Content<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" onChange={formik.handleChange} name="text_content" value={formik.values.text_content} />
                  {
                      formik.errors.text_content ?
                      <div className="invalid-feedback" style={{display:'block'}}>
                          {formik.errors.text_content}
                      </div>
                      :
                      null
                  }
                </div>  
              </React.Fragment>
            }
            {
              (formik.values.widget_type == "line_chart" || formik.values.widget_type == "gauge") &&
              <div className="form-group">
              <label for="exampleSelect2">Aggregation Method<span className="text-danger">*</span></label>
              <select className="form-control" id="exampleSelect2" onChange={formik.handleChange} name="aggregation" value={formik.values.aggregation}>
                <option value="" ></option>
                <option value="last_value" >Last Value</option>
                <option value="count" >Count</option>
                <option value="max" >Max</option>
                <option value="min" >Min</option>
                <option value="avg" >Avg</option>
                <option value="sum" >Sum</option>
              </select>
              {
                  formik.errors.aggregation ?
                  <div className="invalid-feedback" style={{display:'block'}}>
                      {formik.errors.aggregation}
                  </div>
                  :
                  null
              }
            </div>
            }

            

    </div>
    <div className="modal-footer">
        <button type="button" className="btn btn-light-primary font-weight-bold" onClick={props.close_modal}>Close</button>
        <button type="submit" className={c("btn btn-primary font-weight-bold",{"spinner spinner-white spinner-right mr-3":props.loading})}>Save changes</button>
    </div>
    
    </form>
    // </React.Fragment>
  )
}


const TimeRangeSchema = Yup.object({
  time_start: Yup.string().required('Time Start is required'),
  time_end: Yup.string().required('Time End is required'),
  realtime: Yup.string().required('Realtime Type is required'),
});

const TimeRangeForm = (props) =>{
  const [realtime_checked, setRealtime] = useState((props.dashboard.realtime == 0) ? false:true);
  const formik = useFormik({
    initialValues:{
        time_start:moment(props.dashboard.time_start, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        time_end:moment(props.dashboard.time_end, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DDTHH:mm'),
        realtime:(props.dashboard.realtime == 0) ? false:true,
    },
    validationSchema:TimeRangeSchema,
    onSubmit: values => {
        props.onSubmit(values)
        formik.resetForm({});
    },
  });

  const handleChangeRealtime = (value) =>{
    formik.setFieldValue('realtime',value);
    setRealtime(value);
  }

  return(
    // <React.Fragment>
      <form className="form" id="kt_login_signin_form" onSubmit={formik.handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              {formik.values.time_start}
              <label for="exampleSelect2">Time Start<span className="text-danger">*</span></label>
              <input 
                type="datetime-local" 
                
                onChange={formik.handleChange} 
                name="time_start" 
                value={formik.values.time_start} 
                className="form-control"
                max={formik.values.time_end}
                />
              {
                  formik.errors.time_start ?
                  <div className="invalid-feedback" style={{display:'block'}}>
                      {formik.errors.time_start}
                  </div>
                  :
                  null
              }
            </div>
            <div className="form-group">
              {formik.values.time_end}
              <label for="exampleSelect2">Time End<span className="text-danger">*</span></label>
              <input 
                type="datetime-local" 
                onChange={formik.handleChange}
                name="time_end" 
                value={formik.values.time_end} 
                className="form-control"
                min={formik.values.time_start}
                disabled={formik.values.time_start == null}
                />
              {
                  formik.errors.time_end ?
                  <div className="invalid-feedback" style={{display:'block'}}>
                      {formik.errors.time_end}
                  </div>
                  :
                  null
              }
            </div>      
            <div className="form-group" style={{flexDirection:'column',display:'flex'}}>
              <label for="exampleSelect2">Real Time<span className="text-danger">*</span></label>
              {/* <label htmlFor="material-switch">
                <span>Switch with style inspired by Material Design</span> */}
                <Switch
                  checked={realtime_checked}
                  onChange={handleChangeRealtime}
                  onColor="#86d3ff"
                  onHandleColor="#2693e6"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={48}
                  className="react-switch"
                  id="material-switch"
                  name="realtime"
                />
              {/* </label> */}
              {
                  formik.errors.time_end ?
                  <div className="invalid-feedback" style={{display:'block'}}>
                      {formik.errors.time_end}
                  </div>
                  :
                  null
              }
            </div>  
          </div>
          <div className="modal-footer">
              <button type="button" className="btn btn-light-primary font-weight-bold" onClick={props.close_modal}>Close</button>
              <button type="submit" className={c("btn btn-primary font-weight-bold",{"spinner spinner-white spinner-right mr-3":props.loading})} disabled={props.loading} >Save changes</button>
          </div>
    </form>
    // </React.Fragment>
  )
}


const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
        user_data: state.auth.user_data,
        dashboard:state.dashboard.dashboard_data,
    };
};



// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            dashboard: bindActionCreators(dashboardActions, dispatch)
        }
    }
};
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);