import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import loadjs from 'loadjs';
import * as authActions from '../redux/actions/authActions';
import * as toastActions from '../redux/actions/toastActions';
import {connect} from 'react-redux';
import {bindActionCreators,} from 'redux';
import { ToastContainer, toast } from 'react-toastify';

import {Helmet} from "react-helmet";
import {appendScript} from '../appendScript';


import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';

import RouterIcon from '@material-ui/icons/Router';
import moment from 'moment';
import 'moment-timezone';

import '../assets/css/custom.css';
import Color from '../constants/Color';
const c = require('classnames');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
      title: {
        flexGrow: 1,
      },
}));

const customStyles  = {
    list:{
        width:250
    },
    profile:{
        topProfile:{
            width:250,
            flexDirection:'row',
            padding:20,
            backgroundColor:Color.primary
        }
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            toast:this.props.toast,
            show_user_bar:false,
            time: moment().clone().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleString(),
            anchorEl:null,
            drawer:false,
            drawer_profile:false,
        }
        this.displayTime = this.displayTime.bind(this);
        this.toast_counter = 0;
    }

    displayTime(){
        this.setState({
            time: moment().clone().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleString()
        });
    }

    componentWillMount(){
        
    }
    componentDidMount() {

        console.log(this.props)
        if (this.props.param) {
            this.setState({
                param: this.props.param
            });
        }

        this.interval = setInterval(() => {
            this.displayTime();
        }, 1000);
    }

    logout = () => {
        console.log('LOGOUT PRESSED')
        localStorage.clear();
        this.props.actions.auth.unset_auth();
    };


    start_toast = (toast_info) =>{
        if(toast_info.type === "info"){
            toast.info(toast_info.message);    
        }else if(toast_info.type === "success"){
            toast.success(toast_info.message);
        }else if(toast_info.type === "warning"){
            toast.warning(toast_info.message);
        }else if(toast_info.type === "error"){
            toast.error(toast_info.message);
        }else if(toast_info.type === "default"){
            toast(toast_info.message);
        }else if(toast_info.type === "dark"){
            toast.dark(toast_info.message);
        }
    }


    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        console.log(nextProps);
        if (nextProps.toast !== this.state.toast) {
            console.log('new props');
          this.setState({ toast: nextProps.toast },()=>this.start_toast(this.state.toast));
        }
    }


    initateReduxToast = () =>{
        this.toast_counter++;
        let toast={type:'warning',message:'danger to all citizen!!'+this.toast_counter};
        this.props.actions.toast.setToastNotification(toast);
    }

    toggle_user_bar = () =>{
        this.setState({show_user_bar:!this.state.show_user_bar});
    }


    handleMenu = (event) => {
        this.setState({anchorEl:event.currentTarget});
      };
    
    handleClose = () => {
        this.setState({anchorEl:null});
    };

    toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        this.setState({drawer:open});
    };

    toggleDrawerProfile = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        this.setState({drawer_profile:open});
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }
        const classes = useStyles;
        const {anchorEl,drawer,drawer_profile} = this.state;
        return (
            <div className={classes.root}>
                <Drawer anchor={'left'} open={drawer} onClose={this.toggleDrawer(false)} className={classes.drawer}>
                    <div className={classes.list}>
                        <List>
                            <Link to="/dashboard" >
                                <ListItem button key={'Dashboard'} style={{...customStyles.list}} >
                                    <ListItemIcon> <DashboardIcon /></ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>
                            </Link>
                            <Link to="/devices" >
                                <ListItem button key={'Device'} style={{...customStyles.list}} >
                                    <ListItemIcon> <RouterIcon /></ListItemIcon>
                                    <ListItemText primary={'Device'} />
                                </ListItem>
                            </Link>
                        </List>
                    </div>
                    
                </Drawer>
                <Drawer anchor={'right'} open={drawer_profile} onClose={this.toggleDrawerProfile(false)}>
                    <div style={customStyles.profile.topProfile}>
                        <Grid container direction="row" alignItems="center" justify="flex-end">
                            <Grid item xs={9}>
                            <Typography style={{color:'#fff',fontSize:12,fontWeight:'bold',textAlign:'right'}}>{(typeof this.props.user_data.email === 'undefined') ? '' :this.props?.user_data.email}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                            <Avatar className={classes.orange} style={{marginLeft:20}}>{(typeof this.props.user_data.email === 'undefined') ? '' :this.props?.user_data.name.charAt(0).toUpperCase()}</Avatar>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.list}>
                        <List>
                            <Link to="/profile" >
                                <ListItem button key={'Profile'} style={{...customStyles.list,...{textAlign:'right'}}} >
                                    <ListItemIcon> <PersonIcon /></ListItemIcon>
                                    <ListItemText primary={'Profile'} />
                                </ListItem>
                            </Link>
                            <ListItem button key={'Logout'} style={{...customStyles.list,...{textAlign:'right'}}}onClick={this.logout} >
                                <ListItemIcon> <ExitToAppIcon /></ListItemIcon>
                                <ListItemText primary={'Logout'} />
                            </ListItem>
                        </List>
                    </div>
                    
                    
                </Drawer>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <img alt="Logo" src="data:image/png;base64,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"></img>
                        {/* <Typography variant="h6" className={classes.title}>
                            Matoa.io
                        </Typography> */}
                        
                    <IconButton
                            onClick={this.toggleDrawerProfile(true)}
                            color="inherit"
                            id="profile-menu"
                            style={{position:'absolute',right:10}}
                            // edge="end"
                        >
                            <Avatar className={classes.orange}>{(typeof this.props.user_data.email === 'undefined') ? '' :this.props.user_data.name.charAt(0).toUpperCase()}</Avatar>
                            {/* <AccountCircle /> */}
                        </IconButton> 
                    </Toolbar>
                    
                </AppBar>

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
                {
                    this.props.header == "Dashboard"
                    ?
                    this.props.content
                    :
                    <React.Fragment>
        
                        {this.props.content}
                    </React.Fragment>
                    
                }
            </div>
        );
    }
}

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
        user_data: state.auth.user_data,
        toast:state.toast.toast
    };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            auth: bindActionCreators(authActions, dispatch),
            toast:bindActionCreators(toastActions,dispatch)
        }
    }
};
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Main);