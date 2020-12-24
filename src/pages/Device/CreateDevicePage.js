import React, { useState } from "react";
import axios from "axios";
import Url from '../../constants/Url';
import {connect} from 'react-redux';
import {useFormik,FieldArray,Field} from 'formik';
import * as Yup from 'yup';
import {bindActionCreators} from 'redux';
import * as deviceActions from '../../redux/actions/deviceActions';
import * as toastActions from '../../redux/actions/toastActions';
import {Redirect,withRouter,Link} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const c = require('classnames');


function CreateDevicePage(props) { 

    const [loading, setLoading] = useState(false);
    const [redirect,setRedirect] = useState(null);

    const submit = (values) =>{
        setLoading(true);
        props.actions.device.create_new_device(values,on_success,on_failed);
    }


    const on_success = (data)=>{
        setLoading(false);  
        props.actions.toast.setToastNotification({type:'success',message:data.message});
        setRedirect('/devices');
    }

    const on_failed = (data) => {
        setLoading(false);
        console.log('failed',data);
    }
    
    const formik = useFormik({
        initialValues: {
          name: "",
          device_fields: []
        },
        validationSchema: Yup.object({
            name: Yup.string()
            .min(3, "Mininum 3 characters")
            .required("Required!"),
            device_fields: Yup.array()
          .of(
              Yup.object().shape({
                field_name: Yup.string().required("Required!"),
                field_type: Yup.string().required("Required!")
              })
          ).required('Company is required').max(100, 'Maximum characters up to 100.'),
        }),
        onSubmit: values => {
          submit(values);
        }
    });


    return (
        (redirect) ?
        <Redirect to={redirect} />
        :
        <div className="row" >
            <div className="col-md-12">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
            <div className="card card-custom gutter-b example example-compact">
                <div className="card-header">
                    <h3 className="card-title">Create New Device</h3>
                </div>
                <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-control-label">Name
                            <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className={c('form-control',{'is-invalid':formik.errors.name})}
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange} 
                            />
                            {formik.errors.name  && (
                                <div className="invalid-feedback">{formik.errors.name}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-control-label">Device Fields
                            <span className="text-danger">*</span></label>

                                        {formik.values.device_fields.map((device_field, index) => (
                                        <div className="row" key={index}>
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label className="form-control-label">Field name
                                                    <span className="text-danger">*</span></label>
                                                    <input type="text" className={c('form-control',{'is-invalid':formik.errors.device_fields && (formik.errors.device_fields[index] && (formik.errors.device_fields[index].field_name))})} name={`device_fields.${index}.field_name`} value={device_field.field_name} onChange={(event)=>{
                                                        formik.values.device_fields[index]['field_name'] = event.target.value;
                                                        formik.setFieldValue('device_fields',formik.values.device_fields);
                                                    }}/>
                                                    {
                                                    formik.errors.device_fields && (
                                                        formik.errors.device_fields[index]  && ( formik.errors.device_fields[index].field_name && (
                                                        <div className="invalid-feedback">{formik.errors.device_fields[index].field_name}</div>
                                                    ))
                                                    )
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-5">
                                            <div className="form-group">
                                                    <label className="form-control-label">Field Type
                                                    <span className="text-danger">*</span></label>
                                                    <input type="text" className={c('form-control',{'is-invalid':formik.errors.device_fields &&( formik.errors.device_fields[index] &&(formik.errors.device_fields[index].field_type))})} name={`device_fields.${index}.field_type`} value={device_field.field_type} onChange={(event)=>{
                                                        formik.values.device_fields[index]['field_type'] = event.target.value;
                                                        formik.setFieldValue('device_fields',formik.values.device_fields);
                                                    }}/>
                                                    {
                                                    formik.errors.device_fields && (
                                                        formik.errors.device_fields[index]  && 
                                                        (formik.errors.device_fields[index].field_type
                                                        && (
                                                        <div className="invalid-feedback">{formik.errors.device_fields[index].field_type}</div>
                                                        ))
                                                    )
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-2" >
                                            <button  class="btn btn-light-danger font-weight-bold mr-2" style={{marginTop:'25px'}} onClick={()=>{
                                                formik.values.device_fields.splice(index,1);
                                                formik.setFieldValue('device_fields',formik.values.device_fields).then(()=>console.log(formik.values.device_fields));
                                            }}>
														<i class="flaticon2-trash"></i>Delete
                                            </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button  class="btn btn-light-primary font-weight-bold mr-2 btn-block" style={{marginTop:'25px'}} onClick={()=>{
                                                formik.values.device_fields.push({field_name:"",field_type:""});
                                                formik.setFieldValue('device_fields',formik.values.device_fields).then(()=>console.log(formik.values.device_fields));
                                            }}>
														<i class="flaticon2-plus"></i>Add
                                            </button>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className={c("btn btn-primary font-weight-bold",{"spinner spinner-white spinner-right mr-3":loading})}>Submit</button>
                        {/* <button type="submit" className="btn btn-light-success font-weight-bold">Cancel</button> */}
                    </div>
                </form>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateDevicePage);