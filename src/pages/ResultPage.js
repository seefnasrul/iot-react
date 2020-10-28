import React, {Component} from 'react';
import axios from 'axios';
import Url from '../constants/Url';
import {connect} from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";

class ResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            data: '',
            loading: true,
            webheightQuestions: [],
            webheightAnswer: [],
            webheightCorrect: [],
            carauselIndex: 0,
        };
        this._carousel = null;
        window.addEventListener('popstate', this.onBackButtonEvent);
    }

    get_min = () => {
        const {data} = this.state;
        let time = data.result.start_time - data.result.end_time;
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;

        if (minutes > 0) {
            return ((minutes < 10) ? '0' : '') + minutes + ':' + seconds;
        } else {
            return '00:' + seconds;
        }
    };

    componentDidMount = () => {
        window.addEventListener('popstate', this.onBackButtonEvent);
        this._get_result();
    };

    componentWillUnmount() {
        window.addEventListener('popstate', this.onBackButtonEvent);
    }

    onBackButtonEvent = () => {
        window.history.pushState(null, null, "/results");
        this.props.history.push("/results")
    };

    _get_result = () => {
        try {
            let formData = new FormData();
            let self = this;
            formData.append('token', self.props.token);
            formData.append('rid', self.props.param.rid);

            axios.post(Url.API + '/page/view_result', formData)
                .then(function (response) {
                    self.setState({data: response.data, loading: false});
                })
                .catch(function (error) {
                    console.log(error.response.data);
                });
        } catch (error) {
            console.log(error)
        }
    };

    get_icon_status = () => {
        const {result} = this.state.data;

        if (result.result_status === "Lulus") {
            return (
                <div>
                    <h4>Lulus</h4>
                </div>
            );
        } else {
            return (
                <div>
                    <h4 className="text-danger">Tidak Lulus</h4>
                </div>
            );
        }

    };

    _renderCarouselItem = (item, index) => {
        const {webheightQuestions, webheightCorrect, webheightAnswer} = this.state;
        let correct = ((typeof item.index_option_answer !== 'undefined') ? item.index_option_answer : null) === item.index_option_correct_answer;
        return (
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4>Question {index + 1} of {this.state.data.pembahasan.length}</h4>
                    </div>
                    <div className="card-body">
                        <p className="p-4"
                           dangerouslySetInnerHTML={{__html: item.question}}
                           style={{
                               backgroundColor: "rgba(0,126,60,0.1)",
                               borderRadius: 5
                           }}/>
                    </div>
                </div>
            </div>
        )
    };

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
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="summary">
                                    <div className="summary-info">
                                        {this.get_icon_status()}

                                        <div className="row w-50 m-auto pt-3">
                                            <div className="col-md-4">
                                                <p><b>Score</b></p>
                                                <h6>{this.state.data.result.score_obtained}</h6>
                                            </div>
                                            <div className="col-md-4">
                                                <p><b>Time Spent</b></p>
                                                <h6>{this.get_min()}</h6>
                                            </div>
                                            <div className="col-md-4">
                                                <p><b>Benar</b></p>
                                                <h6>{this.state.data.result.percentage_obtained}%</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <table className="table table-bordered">
                                            <thead>
                                            <tr>
                                                <th scope="col">Kategori</th>
                                                <th scope="col">Benar</th>
                                                <th scope="col">Salah</th>
                                                <th scope="col">Skor</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.data.categories.map(function (item, index) {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.name}</td>
                                                            <td>{item.total_correct}</td>
                                                            <td>{item.total_incorrect}</td>
                                                            <td>{(item.total_correct * this.state.data.result.correct_score) + (item.total_incorrect * this.state.data.result.incorrect_score)}</td>
                                                        </tr>
                                                    )
                                                }.bind(this))
                                            }
                                            <tr>
                                                <th colSpan="3">
                                                    Total Score
                                                </th>
                                                <th>
                                                    {this.state.data.result.score_obtained}
                                                </th>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mb-4 py-4" style={{
                        backgroundColor: "#007F3C"
                    }}>
                        <div className="row mx-5">
                            <div className="col-sm-1">
                                <a onClick={() => this.setState({carauselIndex: (this.state.carauselIndex === 0 ? this.state.data.pembahasan.length -1 : this.state.carauselIndex - 1)})}
                                   className="carousel-control-prev" role="button">
                                    <span className="carousel-control-prev-icon"/>
                                    <span className="sr-only">Previous</span>
                                </a>
                            </div>
                            <div className="col-sm-10">
                                <div id="carouselExampleIndicators3" className="carousel slide" data-ride="carousel">
                                    <div className="carousel-inner">
                                        {
                                            this.state.data.pembahasan.map(function (item, index) {
                                                let correct = ((typeof item.index_option_answer !== 'undefined') ? item.index_option_answer : null) === item.index_option_correct_answer;
                                                let itemCarouselClassName = this.state.carauselIndex === index ? "carousel-item active" : "carousel-item";
                                                return (
                                                    <div key={index} className={itemCarouselClassName}>
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4>Question {index + 1} of {this.state.data.pembahasan.length}</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                {
                                                                    (item.paragraph !== ""  && item.paragraph !== null && item.paragraph !== "<p></p>") &&
                                                                    <p className="p-4"
                                                                       dangerouslySetInnerHTML={{__html: item.paragraph}}
                                                                       style={{
                                                                           backgroundColor: "rgba(0,126,60,0.1)",
                                                                           borderRadius: 5
                                                                       }}
                                                                    />
                                                                }
                                                                <p className="p-4"
                                                                   dangerouslySetInnerHTML={{__html: item.question}}
                                                                   style={{
                                                                       backgroundColor: "rgba(0,126,60,0.1)",
                                                                       borderRadius: 5
                                                                   }}/>

                                                                <p>Jawaban Kamu : <span
                                                                    className={correct ? "text-primary" : "text-danger"}> {correct ? "Benar" : "Salah"} </span>
                                                                </p>
                                                                <p className={correct ? "text-primary mt-2" : "text-danger mt-2"}
                                                                dangerouslySetInnerHTML={{__html: ((typeof item.index_option_answer !== 'undefined') ? item.options[item.index_option_answer].q_option : '<p>Your Did Not Answer This Question.</p>')}}>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }.bind(this))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-1">
                                <a onClick={() => this.setState({carauselIndex: (this.state.carauselIndex === this.state.data.pembahasan.length-1 ? 0 : this.state.carauselIndex + 1)})}
                                   className="carousel-control-next" role="button">
                                    <span className="carousel-control-next-icon"/>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
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
    };
};

// Exports
export default connect(mapStateToProps)(ResultPage);