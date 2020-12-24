import React, { Component } from "react";

import {Redirect,withRouter,Link} from 'react-router-dom'
import {useFormik} from 'formik';
import * as Yup from 'yup';

import { connect } from 'react-redux';
import { bindActionCreators,compose } from 'redux';
import * as authActions from '../redux/actions/authActions';
import * as toastActions from '../redux/actions/toastActions';

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";

import "../assets_copy/css/pages/login/classic/login-5.css"
import {Helmet} from "react-helmet";
class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.state ={
        }
    }

    onPressSubmitButton = async (data) =>{
        this.setState({isLoading:true});
        this.props.actions.login.login(data,this.onSuccess,this.onError);
    }

    onSuccess = async (data) => {
        
        this.setState({ isLoading: false })
        this.setState({redirect:'/dashboard'});
    }

    onError = (error) => {
        this.setState({ isLoading: false })
        console.log(error);
        if(typeof error.response.data.message !== 'undefined'){
            console.log('isok');
            //oke
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    }

    

    render(){
        if(this.state.redirect){
            return(
                <Redirect to={this.state.redirect} />
            )
        }
        return(

            <div className="d-flex flex-column flex-root" style={{height:'100vh'}}>
                <Helmet>
                    <title>Login - Matoa.io</title>
                    <meta name="description" content="Login - Matoa.io" />
                </Helmet>
                <div className="login login-5 login-signin-on d-flex flex-row-fluid" id="kt_login">
                    <div className="d-flex flex-center bgi-size-cover bgi-no-repeat flex-row-fluid" style={{backgroundImage: `url(${require("../assets_copy/media/bg/bg-2.jpg")})`}}>
                        <div className="login-form text-center text-white p-7 position-relative overflow-hidden">

                            <div className="d-flex flex-center mb-15">
                                <a href="#">
                                    <img src={require("../assets_copy/media/logos/logo-letter-13.png")} className="max-h-75px" alt="" />
                                </a>
                            </div>

                            <div className="login-signin">
                                <div className="mb-20">
                                    <h3 className="opacity-40 font-weight-normal">Sign In To Matoa.io</h3>
                                    <p className="opacity-40">Enter your details to login to your account:</p>
                                </div>


                                <LoginForm onSubmit={this.onPressSubmitButton} isLoading={this.state.isLoading} />
                                
                                
                            </div>


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
            login: bindActionCreators(authActions, dispatch),
            toast: bindActionCreators(toastActions, dispatch)
        }
    }
}

// Exports
export default compose(withRouter,connect(mapStateToProps, mapDispatchToProps))(LoginPage);

const LoginSchema = Yup.object({
    password: Yup.string()
        .required('Wajib Diisi!')
        .min(2, 'Password Harus lebih dari 2 digit!'),
    email: Yup.string()
        .email('Format email salah!')
        .required('Wajid Disi!'),
    });


function LoadingText (){
    return <ClipLoader
        size={20}
        color={"#FFFF"}
        loading={true}
    />
}
function LoginForm(props) {

    const formik = useFormik({
        initialValues:{
            email:'seefnasrul@gmail.com',
            password:'password'
        },
        validationSchema:LoginSchema,
        onSubmit: values => {
            props.onSubmit(values)
        },
        });
    const {isLoading} = props;
        return(
            <form className="form" id="kt_login_signin_form" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <input className="form-control h-auto text-white bg-white-o-5 rounded-pill border-0 py-4 px-8" name="email" type="email" id="email" autoComplete="off" onChange={formik.handleChange} value={formik.values.email} />
                    {
                        formik.errors.email ?
                        <div className="invalid-feedback" style={{display:'block'}}>
                            {formik.errors.email}
                        </div>
                        :
                        null
                    }
                </div>
                <div className="form-group">
                    <input className="form-control h-auto text-white bg-white-o-5 rounded-pill border-0 py-4 px-8" type="password" name="password" autoComplete="off" onChange={formik.handleChange} values={formik.values.password} />
                    {
                        formik.errors.password ?
                        <div className="invalid-feedback" style={{display:'block'}}>
                            {formik.errors.password}
                        </div>
                        :
                        null
                    }
                </div>
                {/* <div className="form-group d-flex flex-wrap justify-content-between align-items-center px-8 opacity-60">
                    <div className="checkbox-inline">
                        <label className="checkbox checkbox-outline checkbox-white text-white m-0">
                        <input type="checkbox" name="remember" />
                        <span></span>Remember me</label>
                    </div>
                    <a id="kt_login_forgot" className="text-white font-weight-bold">Forget Password ?</a>
                </div> */}
                <div className="form-group text-center mt-10">
                    <button id="kt_login_signin_submit" className="btn btn-pill btn-primary opacity-90 px-15 py-3" type="submit">{isLoading ? <LoadingText/> : 'Sign In'}</button>
                </div>
            </form>

        )
    }
