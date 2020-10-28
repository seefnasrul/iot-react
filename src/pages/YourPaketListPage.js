import React, {Component} from 'react';
import Url from '../constants/Url';
import axios from 'axios';
import {Rupiah} from '../helpers/Helper';

import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

class YourPaketListPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            colors:['#4E73DF', '#E74A3B', '#F6C23E', '#36B9CC'],
            data:[],
            loading: true
        }
    }

    componentDidMount(){
        this.get_data();
    }

    async get_data(){
        try {
            let self = this;
            let token = this.props.token;
            axios.get(Url.API+'/page/paket_list?token='+token)
                .then(async function(response){
                    await self.setState({data:response.data.pakets, loading: false});
                })
                .catch(function(error){
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
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
                <div className="col-12 mb-4">
                    <div className="row">
                        {
                            this.state.data.map(function (item, index) {
                                return (
                                    <div key={index} className="col-md-4 col-sm-6">
                                        <Link to={"/paket/" + item.slug}  style={{
                                            textDecoration: "none"
                                        }}>
                                            <div className="card">
                                                <div className="card-header pb-1">
                                                    <h4>{item.group_name}</h4>
                                                </div>
                                                <div className="card-body pt-1 pb-4">
                                                    {Rupiah(item.price)}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            }.bind(this))
                        }
                    </div>
                </div>
            </div>
        );
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
export default connect(mapStateToProps)(YourPaketListPage);