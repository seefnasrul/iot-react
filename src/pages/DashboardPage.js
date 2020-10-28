import React from 'react';
import {Link} from 'react-router-dom';

import * as homeActions from '../redux/actions/homeActions';
import {connect} from 'react-redux';
import {bindActionCreators,} from 'redux';
import ClipLoader from "react-spinners/ClipLoader";
import {Rupiah, SortParagraph} from '../helpers/Helper';
import loadjs from 'loadjs';

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            name: '',
            user_pakets: [],
            tryouts: [],
            pakets: [],
            colors: ['#4E73DF', '#E74A3B', '#F6C23E', '#36B9CC'],
            refreshing: false
        }
    }
    componentDidMount () {
        // console.log(this.props.history.location.pathname)
        // if(typeof this.props.location !== 'undefined'){
        //     const {prevPath} = this.props.location.state;
        //     console.log('prev_path',prevPath);
        //     if(prevPath == '/login'){
        //         window.location.reload();
        //     }
        // }
        // window.location.reload();
    }
    // compoentWillMount() {
        
        
    //     // loadjs('./assets/plugins/global/plugins.bundle.js', function() {
    //     //     loadjs('./assets/plugins/custom/prismjs/prismjs.bundle.js', function() {
    //     //         loadjs('./assets/plugins/custom/fullcalendar/fullcalendar.bundle.js', function() {
    //     //             loadjs('./assets/js/pages/widgets.js');
    //     //           });
    //     //     });
    //     // });
    //     setTimeout(() => {
    //         this.getHome();
    //     }, 500);
    
        
    // }
    

    getHome = () => {
        this.setState({loading: true});
        let payload = {
            token: this.props.token
        };
        this.props.actions.home.getHomeData(payload, this.onSuccess, this.onError);
    };
    onSuccess = (data) => {
        this.setState({
            loading: false,
            pakets: data.pakets,
            tryouts: data.tryouts,
            name: data.user.last_name,
            user_image: '',
            user_pakets: data.user.groups,
        });
    };
    onError = (error) => {
        this.setState({loading: false});
        console.log('error home:', error.data);
    };


    render() {
        const {loading} = this.state;
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
                    <div className="hero text-white hero-bg-image hero-bg-parallax"
                         style={{backgroundImage: `url(${'assets/img/unsplash/books.jpg'})`}}>
                        <div className="hero-inner">
                            <h2>Selamat Datang {this.props.user_data.last_name},</h2>
                            <p className="lead">Yuk mulai ujian! Cek Paket Tryout yang kamu miliki disini.</p>
                            <div className="mt-4">
                                <Link to="/paketmu" className="btn btn-outline-white btn-lg btn-icon icon-left">
                                    <i className="fas fa-book"/> Paket Milikmu
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <div className="d-flex pt-4 pb-4">
                        <h5 className="text-dark">Paket Populer</h5>
                        <div className="ml-auto">
                            <Link to="/pakets" className="btn btn-success">See All</Link>
                        </div>
                    </div>
                    <div className="row">
                        {
                            this.state.pakets.map(function (item, index) {
                                return (
                                    <PaketItem
                                        key={index}
                                        index={index}
                                        {...item}
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <div className="d-flex pt-4 pb-4">
                        <h5 className="text-dark">Tryout Populer</h5>
                        <div className="ml-auto">
                            <Link to="/tryouts" className="btn btn-success">See All</Link>
                        </div>
                    </div>
                    <div className="row">
                        {
                            this.state.tryouts.map(function (item, index) {
                                return (
                                    <Link to={"/tryout/" + item.quid} className="col-md-6" key={index}
                                          style={{textDecoration: "none"}}>
                                        <div className="card">
                                            <div className="summary">
                                                <div className="summary-item">
                                                    <li className="media mb-4">
                                                        <div>
                                                            <img className="mr-3 rounded" width="100"
                                                                 src={item.gambar} alt="product"/>
                                                        </div>
                                                        <div className="media-body">
                                                            <div className="media-title">
                                                                <p>{item.quiz_name}</p>
                                                            </div>
                                                            <div className="text-muted text-small">
                                                                {SortParagraph(item.description.replace(/(<([^>]+)>)/ig, ''))}
                                                            </div>
                                                        </div>
                                                    </li>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        )
    }
}


const PaketItem = (props) => {
    return (
        <Link to={"/paket/" + props.slug} className="col-lg-4 col-md-6 col-sm-12" style={{textDecoration: "none"}}>
            <div className="card">
                <div className="card-header pb-1">
                    <h4>{props.group_name}</h4>
                </div>
                <div className="card-body pt-1 pb-4">
                    {Rupiah(props.price)}
                </div>
            </div>
        </Link>
    );
};

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
            home: bindActionCreators(homeActions, dispatch)
        }
    }
};
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);