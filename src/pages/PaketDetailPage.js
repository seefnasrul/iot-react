import React, {Component} from 'react';
import Url from '../constants/Url';
import axios from 'axios';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {Rupiah, SortParagraph} from "../helpers/Helper";
import ClipLoader from "react-spinners/ClipLoader";

class PaketDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // ...this.props.navigation.state.params.data,
            own_paket: false,
            tryouts: [],
            loading: true
        }
    }

    componentDidMount() {
        this.get_data();
        
    }

    async get_data() {
        try {
            let self = this;
            let token = self.props.token;
            let slug = self.props.param.slug;
            axios.get(Url.API + '/page/paket_detail?slug=' + slug + '&token=' + token)
                .then(async function (response) {
                    await self.setState({
                        tryouts: response.data.tryouts,
                        own_paket: response.data.own_paket, ...response.data.paket
                    });
                    self.setState({loading: false});
                    console.log(self.state);
                })
                .catch(function (error) {
                    console.log(error.response.data);
                    alert('Tidak ada koneksi, mohon coba beberapa saat lagi.')
                })
        } catch (error) {
            console.log(error.response.data);
            alert('Tidak ada koneksi, mohon coba beberapa saat lagi.')
        }
    }

    redirectPayment = () => {
        if (!this.state.own_paket) {
            this.props.history.push("/payment/" + this.state.gid)
        }
    };

    render() {
        const {own_paket,loading} = this.state;
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
                <div className="col-12 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="summary">
                                <div className="summary-info">
                                    <h4>{this.state.group_name}</h4>
                                    <div dangerouslySetInnerHTML={{__html: this.state.description}}/>
                                    <h6 className="text-dark">{Rupiah(this.state.price)}</h6>
                                    <p className="text-secondary">Valid for {this.state.valid_for_days} Days</p>
                                    <button onClick={this.redirectPayment}
                                            disabled={own_paket}
                                          className="btn btn-lg btn-success">
                                        {(own_paket) ? 'Subscribed':'Subscribe!'}
                                    </button>
                                </div>
                                <div className="summary-item">
                                    <h5 className="mb-5 mt-5">Daftar Tryout</h5>
                                    {
                                        this.state.tryouts.map(function(item, index){
                                            return(
                                                <li key={index} className="media mb-4">
                                                    <Link to={"/tryout/" + item.quid}>
                                                        <img className="mr-3 rounded" width="100"
                                                             src={item.gambar} alt="product"/>
                                                    </Link>
                                                    <div className="media-body">
                                                        <div className="media-title">
                                                            <Link to={"/tryout/" + item.quid}>{item.quiz_name}</Link>
                                                        </div>
                                                        <div className="text-muted text-small">
                                                            {SortParagraph(item.description.replace(/(<([^>]+)>)/ig, ''))}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                        </div>
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
export default connect(mapStateToProps)(PaketDetailPage);


