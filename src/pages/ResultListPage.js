import React, {Component} from 'react';
import axios from 'axios';
import Url from '../constants/Url';
import {connect} from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

class ResultListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            page: 1,
            loading_infinate: false,
            loading: true
        };
    }

    componentDidMount() {
        this.get_data();
    }

    async get_data() {
        try {
            let self = this;
            let token = self.props.token;
            console.log('getting payment_hisory');
            return await axios.get(Url.API + '/page/result_list?token=' + token + '&page=' + self.state.page)
                .then(async function (response) {
                    console.log(response.data);
                    let new_data = [...self.state.data, ...response.data.data];
                    await self.setState({data: new_data});
                    self.setState({
                        loading: false
                    });
                    return true;
                })
                .catch(function (error) {
                    alert('Gagal menghubungkan, coba beberapa saat lagi.');
                    console.log(error.response.data);
                    return false;
                })
        } catch (error) {
            alert('Gagal menghubungkan, coba beberapa saat lagi.');
            console.log(error.response.data);
            return false;
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
                                <th scope="col">ID Hasil</th>
                                <th scope="col">Nama Ujian</th>
                                <th scope="col">Status</th>
                                <th scope="col">Presentase</th>
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
                                        <tr onClick={() => this.props.history.push("/result/" + item.rid)} key={index}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            className="Item"
                                        >
                                            <td>{item.rid}</td>
                                            <td>{item.quiz_name}</td>
                                            <td>{item.result_status}</td>
                                            <td>{item.percentage_obtained}</td>
                                        </tr>
                                    )
                                }.bind(this))
                            }
                            </tbody>
                        </table>
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
    };
};

// Exports
export default connect(mapStateToProps)(ResultListPage);