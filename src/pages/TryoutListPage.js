import React, {Component} from 'react';
import Url from '../constants/Url';
import axios from 'axios';
import {SortParagraph} from "../helpers/Helper";
import {Link} from "react-router-dom";

import {connect} from 'react-redux';

class TryoutListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.get_data();
    }

    async get_data() {
        try {
            let self = this;
            let token = this.props.token;
            axios.get(Url.API + '/page/tryout_list?token=' + token)
                .then(async function (response) {
                    await self.setState({data: response.data.tryouts});
                })
                .catch(function (error) {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="row">
                        {
                            this.state.data.map(function (item, index) {
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

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
    };
};

// Exports
export default connect(mapStateToProps)(TryoutListPage);