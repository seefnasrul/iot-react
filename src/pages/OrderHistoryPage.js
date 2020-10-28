import React, {Component} from 'react';
import Url from '../constants/Url';
import axios from 'axios';
import {Rupiah} from '../helpers/Helper';
import { connect } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

class OrderHistoryPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            refreshing:false,
            loading:true,
        };
    }
    componentDidMount(){
        this.get_data();
    }

    async get_data(){
        try {
            let self = this;
            let token = self.props.token;
            console.log('getting payment_hisory');
            axios.get(Url.API+'/page/payment_history?token='+token)
                .then(async function(response){
                    console.log(response.data);
                    await self.setState({data:response.data.data});
                    self.setState({
                        loading:false
                    });
                })
                .catch(function(error){
                    console.log(error.response.data);
                    alert('Gagal menghubungkan, coba beberapa saat lagi.')
                })
        } catch (error) {
            console.log(error.response.data);
            alert('Gagal menghubungkan, coba beberapa saat lagi.')
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
            <div>
                <div className="card">
                    <div className="card-body">
                        <table className="table">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Item</th>
                                <th scope="col">Total</th>
                                <th scope="col">Status</th>
                                <th scope="col">Tanggal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.data.map(function (item, index) {
                                    let buttonIsHovered = false;
                                    let setButtonHovered = (cond) => {
                                        buttonIsHovered = cond;
                                    };
                                    return (
                                        <tr onClick={() => this.props.history.push("/paket/" + item.paket.slug)} key={index}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            className="Item"
                                        >
                                            <td>{item.type} {(item.type === 'Paket') ? item.paket.group_name : 'Matematik'}</td>
                                            <td>{Rupiah(item.amount)}</td>
                                            <td>{item.payment_status === 'settlement' ? 'Selesai' : 'Pending'}</td>
                                            <td>{item.created_at}</td>
                                        </tr>
                                    )
                                }.bind(this))
                            }
                            </tbody>
                        </table>
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
export default connect(mapStateToProps)(OrderHistoryPage);