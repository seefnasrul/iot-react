import React, {Component} from 'react';
import Url from '../constants/Url';

import {connect} from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

class MidtransPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gid: null,
            quid: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.setState({
            gid: this.props.param.gid,
            quid: (this.props.param.quid ? this.props.param.quid : null)
        });
        console.log(this.state);
        let a = {token: this.props.token, gid: this.state.gid};
        console.log('midtrans:', a);
    }

    _onURLChanged(e) {
        if (e.url.search("/order-history") > 0) {
            console.log('running');
            console.log(e.url);
            this.props.history.push("/dashboard");
            return false
        } else {
            console.log(e.url);
            return true
        }
    }

    return_param() {
        if (this.state.gid == null) {
            return 'quid=' + this.state.quid;
        } else {
            return 'gid=' + this.state.gid;
        }
    }

    render() {
        if (this.state.loading) {
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
                <iframe
                    frameBorder="0"
                    className="col-12"
                    src={Url.API + '/page/payment?token=' + this.props.token + '&' + this.return_param()}
                    width="100%"
                    height="1000px"
                    onChange={this._onURLChanged.bind(this)}
                />
            </div>
        )
    }
}


// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
    };
};

// Exports
export default connect(mapStateToProps)(MidtransPage);