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
const RegisterSchema = Yup.object().shape({
    email: Yup.string()
        .email('Format email salah!')
        .required('Wajid Disi!'),
    password: Yup.string()
        .min(2, 'Password Harus lebih dari 2 digit!'),
    confirm_password: Yup.string()
        .test('passwords-match', 'Pengulangan Password Harus Sama.', function (value) {
            return this.parent.password === value;
        }),
    username: Yup.string().trim('Harus Tanpa Spasi!').strict(true).required('Wajib Diisi!'),
    name: Yup.string().required('Wajib Diisi!'),
    kontak: Yup.string().matches(/^08[0-9]{9,}$/g, 'Format nomor anda salah Cth: 08123456789').required('Wajib Diisi!'),
    desa: Yup.string().required('Wajib Diisi!'),
    sekolah: Yup.string().required('Wajib Diisi!'),
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


        if (new_profile_image_form_data) {
            formData.append('profile_picture', new_profile_image_form_data);
        }

        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirm_password', data.confirm_password);
        formData.append('username', data.username);
        formData.append('name', data.name);
        formData.append('kontak', data.kontak);
        formData.append('desa', data.desa);
        formData.append('sekolah', data.sekolah);
        formData.append('token', token);

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
            <div className="row">
                <div className="col-12 col-md-12 col-lg-10">
                    <Form onSubmit={this.onPressSubmitButton} user_data={user_data} this={this}/>
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
            password: '',
            confirm_password: '',
            username: props.user_data.first_name,
            name: props.user_data.last_name,
            kontak: props.user_data.contact_no,
            desa: props.user_data.alamat_lengkap,
            sekolah: props.user_data.alamat_sekolah
        },
        onSubmit: values => {
            props.onSubmit(values)
        },
        validationSchema: RegisterSchema
    });
    const {handleChange, handleBlur, handleSubmit, values, errors, setFieldTouched, touched, setFieldValue} = formik;
    return (
        <form onSubmit={handleSubmit}>
            <div className="card profile-widget">
                <div className="profile-widget-description">
                    <div className="row">
                        <div className="col-md-12 mb-4 text-center">
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
                        </div>

                        <div className="form-group col-md-6">
                            <label>Nama</label>
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
                        <div className="form-group col-md-6">
                            <label>Username</label>
                            <input
                                onError={(errors.username && touched.username) ? errors.username : null}
                                type="text" className="form-control"
                                onBlur={() => setFieldTouched('username')}
                                onChange={handleChange('username')} value={values.username}
                                required=""/>
                            {
                                formik.errors.username &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.username}
                                </div>
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Alamat Email</label>
                            <input onError={(errors.email && touched.email) ? errors.email : null}
                                   type="email" className="form-control"
                                   onBlur={() => setFieldTouched('username')}
                                   onChange={handleChange('email')} value={values.email} required=""/>
                            {
                                formik.errors.email &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.email}
                                </div>
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Telepon</label>
                            <input onError={(errors.kontak && touched.kontak) ? errors.kontak : null}
                                   type="number" className="form-control"
                                   onBlur={() => setFieldTouched('kontak')}
                                   onChange={handleChange('kontak')} value={values.kontak} required=""/>
                            {
                                formik.errors.kontak &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.kontak}
                                </div>
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Kecamatan / Desa</label>
                            <AsyncSelect
                                name="desa"
                                cacheOptions defaultOptions
                                loadOptions={promiseOptions}
                                defaultValue={{value: values.desa, label: values.desa}}
                                onChange={(value) => setFieldValue('desa', value.value, true)}
                            />

                            {
                                formik.errors.desa &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.desa}
                                </div>
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label>Nama Sekolah</label>
                            <input onError={(errors.sekolah && touched.sekolah) ? errors.sekolah : null}
                                   type="text" className="form-control"
                                   onBlur={() => setFieldTouched('sekolah')}
                                   onChange={handleChange('sekolah')} value={values.sekolah}
                                   required=""/>
                            {
                                formik.errors.password &&
                                <div className="invalid-feedback" style={{display:'block'}}>
                                    {formik.errors.password}
                                </div>
                            }
                        </div>
                    </div>
                    <h6 className="text-success">Ubah Password</h6>
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
                            <label>Konfirmasi Password</label>
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
                </div>
                <div className="card-footer">
                    <button className="btn btn-lg btn-success" type={"submit"}>Perbarui Data
                    </button>
                </div>
            </div>
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
