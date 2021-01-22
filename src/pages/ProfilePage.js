import React, {Component} from 'react';
import * as Yup from "yup";
import * as authActions from '../redux/actions/authActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {useFormik} from "formik";
import 'react-image-crop/dist/ReactCrop.css';
import AsyncSelect from 'react-select/async';
import axios from "axios";
import Url from "../constants/Url";
import ClipLoader from "react-spinners/ClipLoader";


/* validation schema */
const ProfileSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid Email!')
        .required('Required!'),
    password: Yup.string()
        .min(8, 'Password minimum of 8 digits'),
    confirm_password: Yup.string()
        .test('passwords-match', 'Confirm password must match.', function (value) {
            return this.parent.password === value;
        }),
    name: Yup.string().required('Required!'),
    company_name: Yup.string().required('Required!'),
    // kontak: Yup.string().matches(/^08[0-9]{9,}$/g, 'Format nomor anda salah Cth: 08123456789').required('Required!'),
});

class ProfilePage extends Component {

    constructor(props) {
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
        this.fileInputRef = React.createRef();
        this.state = {
            identifier: null,
            error: false,
            disableSubmit: false,
            spinner: false,
            desa: '',
            submit_loading: false,
            loading: false,
            new_profile_image: null,
            new_profile_image_form_data: null,
            isLoading: false,
            modal_test_visible: false,
        };

        this.desa_input = null;
    }

    onSuccess = async (data) => {
        this.setState({isLoading: false});
        if (typeof data.data !== 'undefined') {
            // await AsyncStorage.setItem('user_data', JSON.stringify(data.data));
        }
        if (typeof data.message !== 'undefined') {
            alert(data.message);
        }

    };

    onError = (error) => {
        console.log(error.response.data);
        this.setState({isLoading: false});
        if (typeof (error.response.data.message) !== 'undefined') {
            alert(error.response.data.message);
        }
    };

    onPressSubmitButton = (data) => {
        this.setState({isLoading: true});
        const {token} = this.props;
        const {new_profile_image_form_data} = this.state;
        let payload = {
            ...data,
            token: token,
            ...(new_profile_image_form_data) ? {profile_picture: new_profile_image_form_data} : {}
        };

        let formData = new FormData();


        // if (new_profile_image_form_data) {
        //     formData.append('profile_picture', new_profile_image_form_data);
        // }

        formData.append('email', data.email);
        formData.append('name', data.name);
        formData.append('company_name', data.company_name);
        if(data.password !== "" || data.password !== null){
            formData.append('password', data.password);
            formData.append('confirm_password', data.confirm_password);
        }
        
        // formData.append('token', token);

        this.setState({
            loading: true
        });
        this.props.actions.login.profileUpdate(formData, this.onSuccess, this.onError);
    };

    toggle_modal_visible() {
        this.setState({modal_test_visible: !this.state.modal_test_visible});
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                new_profile_image_form_data: file,
                new_profile_image: reader.result
            });
        };

        reader.readAsDataURL(file);
        this.toggle_modal_visible()
    }

    render() {
        const {loading, user_data} = this.props;
        if (loading) {
            return (
                <div style={{textAlign: 'center', width: '100%'}}>
                    <ClipLoader
                        size={50}
                        color={"#007F3C"}
                        loading={true}
                    />
                </div>
            )
        }

        return (
            <div className="card card-custom">
                <div className="card-header">
                    <div className="card-title">
                        <span class="card-icon"><i class="flaticon2-user text-primary"></i></span>
                        <h3 class="card-label">Profile</h3>
                    </div>
                    <div className="card-toolbar"></div>
                </div>
                <div class="card-body alert-custom alert-white alert-shadow gutter-b" id="dt-container">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12" style={{width:'100%',height:'100vh'}}>
                            <Form onSubmit={this.onPressSubmitButton} user_data={user_data} this={this}/>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}


// Map State To Props (Redux Store Passes State To Component)
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
            login: bindActionCreators(authActions, dispatch),
        }
    }
};
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

function Form(props) {
    const formik = useFormik({
        initialValues: {
            email: props.user_data.email,
            name: props.user_data.name,
            company_name: props.user_data.company.name,
            password: '',
            confirm_password: '',
        },
        onSubmit: values => {
            props.onSubmit(values)
        },
        validationSchema: ProfileSchema
    });
    const {handleChange, handleBlur, handleSubmit, values, errors, setFieldTouched, touched, setFieldValue} = formik;
    return (
        <form onSubmit={handleSubmit}>
                    <h6 className="text-primary">Account</h6>
                    <hr/>
                    <div className="row">
                        {/* <div className="col-md-12 mb-4 text-center">
                            <div>
                                <img width="20%" alt="image"
                                     src={props.this.state.new_profile_image ? props.this.state.new_profile_image : ((props.user_data.photo) ? props.user_data.photo : "../assets/img/avatar/avatar-1.png")}
                                     className="rounded-circle"/>
                            </div>
                            <button type="button" onClick={() => props.this.toggle_modal_visible()}
                                    className="btn btn-warning mt-2 mb-2">Edit Foto
                            </button>
                            <Modal isOpen={props.this.state.modal_test_visible}
                                   toggle={() => props.this.toggle_modal_visible()} this={props.this}
                                   state={props.this.state}/>
                        </div> */}
                        
                        <div className="form-group col-md-12">
                            <label>Email</label>
                            <input type="text" className="form-control" value={values.email} readOnly="true" disabled={true}/>
                        </div>
                        <div className="form-group col-md-12">
                            <label>Name</label>
                            <input onError={(errors.name && touched.name) ? errors.name : null}
                                   type="text" className="form-control"
                                   onBlur={() => setFieldTouched('name')}
                                   onChange={handleChange('name')} value={values.name} required=""/>
                            {
                                formik.errors.name &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.name}
                                </div>
                            }
                        </div>
                    </div>
                    <h6 className="text-primary">Company</h6>
                    <hr/>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label>Name</label>
                                <input onError={(errors.company_name && touched.company_name) ? errors.company_name : null}
                                    type="text" className="form-control"
                                    onBlur={() => setFieldTouched('company_name')}
                                    onChange={handleChange('company_name')} value={values.company_name} required=""/>
                                {
                                    formik.errors.company_name &&
                                    <div className="invalid-feedback" style={{display:'block'}}>
                                        {formik.errors.company_name}
                                    </div>
                                }
                            </div>

                        </div>
                    <h6 className="text-primary">Ubah Password</h6>
                    <hr/>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label>Password</label>
                            <input
                                onError={(errors.password && touched.password) ? errors.password : null}
                                type="password" className="form-control"
                                onBlur={() => setFieldTouched('password')}
                                onChange={handleChange('password')}/>
                            {
                                formik.errors.password &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.password}
                                </div>
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Change Password</label>
                            <input
                                onError={(errors.confirm_password && touched.confirm_password) ? errors.confirm_password : null}
                                type="password" className="form-control"
                                onBlur={() => setFieldTouched('confirm_password')}
                                onChange={handleChange('confirm_password')}/>
                            {
                                formik.errors.confirm_password &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.confirm_password}
                                </div>
                            }

                        </div>
                    </div>
                    <button className="btn btn-lg btn-primary" type={"submit"}>Save
                    </button>
        </form>
    )
}

const get_data = async (inputValue) => {
    try {
        return await axios.get(Url.API + '/auth/kecamatan_auto?term=' + inputValue)
            .then(function (response) {
                let data = [];
                for (let index = 0; index < response.data.length; index++) {
                    data.push({value: response.data[index], label: response.data[index]});
                }
                console.log(data);
                return data;
            })
            .catch(function (error) {
                return [];
            })
    } catch (error) {
        console.log(error);
    }
};

const promiseOptions = inputValue =>
    new Promise(resolve => {
        resolve(get_data(inputValue));
    });

const Modal = (props) => {
    let style = props.isOpen
        ? {display: "block", backdropFilter: "blur(1px) contrast(.5)"}
        : {display: "none"};

    return (
        <div className="modal fade show" id="exampleModal" role="dialog" style={style}>
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">
                            Edit Foto
                        </h5>
                    </div>
                    <div className="modal-body">
                        <input className="form-control"
                               accept="image/png, image/jpeg, image/jpg"
                               type="file"
                               onChange={(e) => props.this._handleImageChange(e)}/>
                    </div>
                    <div className="modal-footer">
                        <button onClick={() => {
                            props.this.toggle_modal_visible();
                            props.this.setState({
                                new_profile_image_form_data: null,
                                new_profile_image: null
                            })
                        }} className="btn btn-secondary" type="button">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};
