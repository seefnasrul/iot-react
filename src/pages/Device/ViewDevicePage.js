import React, { useState,useEffect } from "react";
import axios from "axios";
import Url from '../../constants/Url';
import {connect} from 'react-redux';
import {useFormik,FieldArray,Field} from 'formik';
import * as Yup from 'yup';
import {bindActionCreators} from 'redux';
import * as deviceActions from '../../redux/actions/deviceActions';
import {Redirect,withRouter,Link,useParams} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import * as toastActions from '../../redux/actions/toastActions';

const c = require('classnames');


function ViewDevicePage(props) { 

    const [loading, setLoading] = useState(false);
    const [redirect,setRedirect] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [initForm, setInitForm] = useState({name:"",device_fields:[]});
    const {id} = useParams();
    let serial_id_ref = React.createRef();
    useEffect( () => {
        console.log(id)
        let isMounted = true;
        if(isMounted){
            setFetching(true);
            props.actions.device.get_device_by_id(id,get_on_success,get_on_failed);
        }
        return () => { isMounted = false };
    },[setFetching,setInitForm])

    const get_on_success = (data) =>{
        console.log(data);
        setInitForm(data.data);   
        setFetching(false);
    }

    const get_on_failed = (data) =>{
        console.log(data);
    }

    const copy_to_clipboard = (e) => {
        serial_id_ref.current.select();
        document.execCommand('copy');
        e.target.focus();
        props.actions.toast.setToastNotification({type:'info',message:'copied to clipboard!'});
    }

    return (
        (redirect)
        ?
        <Redirect to={redirect} />
        :
        <div className="row" style={{marginTop:'25px'}}>
            <div className="col-md-12">
            <div className="card card-custom gutter-b example example-compact">
                <div className="card-header">
                    <h3 className="card-title">View Device</h3>
                </div>
                {
                    (fetching) 
                    ?
                    <div class="card-body" >
                        <div class="spinner spinner-primary spinner-lg" style={{marginLeft:'50%'}}></div>
                    </div>
                    :
                    <React.Fragment>
                        <div className="card-body">
                        <div class="form-group row">
                            <label class="col-form-label text-right col-lg-3 col-sm-12">Name</label>
                            <div class="col-lg-6 col-md-9 col-sm-12">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="kt_clipboard_1" placeholder="Type some value to copy" value={initForm.name} disabled={true}/>
                                </div>
                            </div>
                        </div>   

                        <div class="form-group row">
                            <label class="col-form-label text-right col-lg-3 col-sm-12">Serial ID</label>
                            <div class="col-lg-6 col-md-9 col-sm-12">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="kt_clipboard_1" placeholder="Type some value to copy" value={initForm.device_serial_id} disabled={true}  ref={serial_id_ref}/>
                                    <div class="input-group-append">
                                        <a href="#" class="btn btn-secondary" data-clipboard="true" data-clipboard-target="#kt_clipboard_1" onClick={copy_to_clipboard}>
                                            <i class="la la-copy"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <hr />
                        <h5 style={{marginBottom:'10px'}}>Device Fields</h5>
                        <table class="table table-bordered table-checkable dataTable no-footer dtr-inline collapsed">
                            <thead>
                                <tr>
                                    <td>Field Name</td>
                                    <td>Field Type</td>
                                    <td>Created At</td>
                                    <td>Updated At</td>
                                </tr>
                            </thead>
                            <tbody>
                                
                            {
                                initForm.device_fields.map((device_field, index) => (
                                <tr key={index}>
                                    <td>{device_field.field_name}</td>
                                    <td>{device_field.field_type}</td>
                                    <td>{device_field.created_at}</td>
                                    <td>{device_field.updated_at}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        
                        </div>
                        <div className="card-footer">
                            <Link to={"/device/"+initForm._id+"/edit"} type="button" className={c("btn btn-primary font-weight-bold mr-2")}><i class="la la-edit"></i> Edit</Link>
                            <button type="button" className={c("btn btn-danger font-weight-bold mr-2")} style={{marginLeft:'10px'}} onClick={()=>alert('deleted')} ><i class="la la-trash"></i> Delete</button>
                            {/* <button type="submit" className="btn btn-light-success font-weight-bold">Cancel</button> */}
                        </div>
                    </React.Fragment>
                }
            </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
        user_data: state.auth.user_data
    };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            device: bindActionCreators(deviceActions, dispatch),
            toast: bindActionCreators(toastActions, dispatch),
        }
    }
};
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ViewDevicePage);