import React, { Component } from "react";

import {Redirect,withRouter} from 'react-router-dom'
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AsyncSelect from 'react-select/async';

import { connect } from 'react-redux';
import { bindActionCreators,compose } from 'redux';
import * as authActions from '../redux/actions/authActions';
import Url from "../constants/Url";
import axios from "axios";
class RegisterPage extends React.Component{
    constructor(props){
        super(props);
        
        this.state ={
            redirect:null
        }

    }

    onSuccess = async (data) =>{
        this.setState({ submit_loading: false })
        if (data.token && data.token.length > 0) {
            await localStorage.setItem('token',data.token)
            await localStorage.setItem('user_data',JSON.stringify(data.data));
            console.log(data);
            this.setState({redirect:'/dashboard'});
        }
    }

    onError = (error) =>{
        this.setState({ submit_loading: false });
    }

    onPressSubmit = (data) =>{

        this.setState({submit_loading:true});
        this.props.actions.register.register(data,this.onSuccess,this.onError);

    }


    render(){
        if(this.state.redirect){
            return(
                <Redirect to={this.state.redirect} />
            )
        }
        return(
            <div className="container mt-5">
        <div className="row">
          <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
            <div className="login-brand">
              <img src="ms-icon-150x150.png" alt="logo" width="100" className="shadow-light rounded-circle" />
            </div>

            <div className="card card-primary">
              <div className="card-header"><h4>Register</h4></div>

              <div className="card-body">
                <RegisterForm onSubmit={this.onPressSubmit} />
              </div>
            </div>
            <div className="simple-footer">
              Copyright &copy; Adzkia {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
        
        );
    }
}
const mapStateToProps = (state) => ({
    data: {
        token: state.auth.token
    }
})
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            register: bindActionCreators(authActions, dispatch)
        }
    }
}
// Exports
export default compose(withRouter,connect(mapStateToProps, mapDispatchToProps))(RegisterPage);

const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Format email salah!')
      .required('Wajid Disi!'),
    password: Yup.string()
      .min(2, 'Password Harus lebih dari 2 digit!')
      .required('Wajib Diisi!'),
    password2: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Password harus sama').required('Wajib Diisi!'),
    username: Yup.string().trim('Harus Tanpa Spasi!').strict(true).required('Wajib Diisi!'),
    name:Yup.string().required('Wajib Diisi!'),
    kontak:Yup.string().matches(/^08[0-9]{9,}$/g, 'Format nomor anda salah Cth: 08123456789').required('Wajib Diisi!'),
    desa:Yup.string().required('Wajib Diisi!'),
    sekolah:Yup.string().required('Wajib Diisi!'),
});

const get_data = async (inputValue) =>{
    try {
        return await axios.get(Url.API+'/auth/kecamatan_auto?term='+inputValue)
        .then(function(response){
            var data = [];
            for (let index = 0; index < response.data.length; index++) {
                data.push({value:response.data[index],label:response.data[index]});
            }
            console.log(data)
            return data;
        })
        .catch(function(error){
            return [];
        })
    } catch (error) {
        console.log(error);
    }
}

const promiseOptions = inputValue =>
  new Promise(resolve => {
    resolve(get_data(inputValue));
  });

function RegisterForm(props) {

    
    const formik = useFormik({
        initialValues:{ 
            email: '',
            password:'',
            password2:'',
            username:'',
            name:'',
            kontak:'',
            desa:'',
            sekolah:''
        },
        validationSchema:validationSchema,
        onSubmit: values => {
            props.onSubmit(values)
        },
        });
    
        return(
        <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
                <label for="email">Alamat Email</label>
                <input id="email"  className="form-control" name="email" onChange={formik.handleChange}/>
                {
                    formik.errors.email &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.email}
                    </div>
                }
            </div>

            <div className="row">
              <div className="form-group col-6">
                <label for="password" className="d-block">Password</label>
                <input id="password" type="password" className="form-control" name="password" onChange={formik.handleChange} />
                {
                    formik.errors.password &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.password}
                    </div>
                }
              </div>
              <div className="form-group col-6">
                <label for="password2" className="d-block">Password Confirmation</label>
                <input id="password2" type="password" className="form-control" name="password2" onChange={formik.handleChange} />
                {
                    formik.errors.password2 &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.password2}
                    </div>
                }
              </div>
            </div>

            <div className="form-group">
              <label for="username">Username</label>
              <input id="username" type="text" className="form-control" name="username" onChange={formik.handleChange} />
              {
                    formik.errors.username &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.username}
                    </div>
                }
            </div>

            <div className="form-group">
              <label for="name">Nama</label>
              <input id="name" type="text" className="form-control" name="name" onChange={formik.handleChange}/>
              {
                    formik.errors.name &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.name}
                    </div>
                }
            </div>

            <div className="form-group">
              <label for="kontak">Nomor Kontak</label>
              <input id="kontak" type="text" className="form-control" name="kontak" onChange={formik.handleChange}/>
                {
                    formik.errors.kontak &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.kontak}
                    </div>
                }
            </div>

            <div className="form-divider">
              Asal Sekolah & Daerah
            </div>

            <div className="row">
              <div className="form-group col-12">
                <label>Kecamatan/Desa</label>
                <AsyncSelect 
                    name="desa" 
                    cacheOptions 
                    defaultOptions 
                    loadOptions={promiseOptions} 
                    onChange={(value)=>formik.setFieldValue('desa',value.value,true)}
                 />
                 {
                    formik.errors.desa &&
                    <div className="invalid-feedback" style={{display:'block'}}>
                        {formik.errors.desa}
                    </div>
                }
                {/* <select className="form-control selectric" name="desa">
                  <option>Indonesia</option>
                  <option>Palestine</option>
                  <option>Syria</option>
                  <option>Malaysia</option>
                  <option>Thailand</option>
                </select> */}
              </div>
              <div className="form-group col-12">
                <label>Nama Sekolah</label>
                <textarea name="sekolah" className="form-control" onChange={formik.handleChange}></textarea>
              </div>
            </div>

            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" name="agree" className="custom-control-input" id="agree" />
                <label className="custom-control-label" for="agree">I agree with the terms and conditions</label>
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-lg btn-block">
                Register
              </button>
            </div>
          </form>
        )
    }
