import React, {Component} from 'react';
import axios from 'axios';
import Url from '../constants/Url';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

class TryoutDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            ranks: [],
            own_paket: false,
            refreshing: false,
            modal_test_visible: false,
            loading: true
        };
        this.toggle_modal_visible = this.toggle_modal_visible.bind(this);
    }

    componentDidMount() {
        this.get_data();
    }

    async get_data() {
        try {
            let self = this;
            let token = self.props.token;
            let quid = self.props.param.quid;
            axios.get(Url.API + '/page/quiz_detail?token=' + token + '&quid=' + quid)
                .then(async function (response) {
                    await self.setState({...response.data});
                    self.setState({loading: false})
                })
                .catch(function (error) {
                    alert('Tidak ada koneksi, mohon coba beberapa saat lagi.')
                })
        } catch (error) {
            alert('Tidak ada koneksi, mohon coba beberapa saat lagi.')
        }
    }

    toggle_modal_visible() {
        this.setState({modal_test_visible: !this.state.modal_test_visible});
    }


    start_exam = () => {
        if (this.state.quiz.maximum_attempts <= this.state.quiz.attempt_left) {
            alert('Anda sudah Mencapai batas percobaan maksimum');
        } else {
            this.toggle_modal_visible();
            this.props.history.push('/exam/' + this.props.param.quid);
        }
    };

    button_exam_or_subscribe() {
        console.log(this.state);
        if (this.state.own_paket || this.state.own_quiz || this.state.free_quiz) {
            return (
                <button type="button" onClick={() => this.start_exam()} className="btn btn-outline-success btn-lg">
                    Mulai Sekarang!
                </button>
            );
        } else if (!this.state.own_paket && !this.state.own_quiz && !this.state.free_quiz && parseInt(this.state.quiz.quiz_price) > 0) {
            return (
                <div>
                    <button onClick={() => this.props.history.push("/payment/" + this.props.param.quid)} className="btn btn-outline-success btn-lg">
                        Subscribe!
                    </button>
                </div>
            );
        }
    }


    render() {
        const {loading, quiz} = this.state;
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

        const styles = {
            header: {
                background: `url(${quiz.gambar})`,
                padding: 0
            },
            content: {
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                paddingTop: 50,
                paddingBottom: 50
            }
        };

        return (
            <div ref={this.wrapper}>
                <div className="row">
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="summary">
                                    <div className="summary-info"
                                        style={styles.header}>
                                        <div style={styles.content}>
                                            <h4>{quiz.quiz_name}</h4>
                                            <div dangerouslySetInnerHTML={{__html: quiz.description}}/>
                                            <button className="btn btn-lg btn-success"
                                                    onClick={() => this.toggle_modal_visible()}
                                                    type="button" className="btn btn-success">
                                                Mulai Tryout!
                                            </button>
                                            <Modal quiz={quiz} isOpen={this.state.modal_test_visible}
                                                   toggle={() => this.toggle_modal_visible()} this={this}
                                                   state={this.state}/>
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <h5 className="text-center mb-5 mt-5">Top 10 Ranking Terbaik</h5>
                                        <ul className="list-unstyled">
                                            {
                                                this.state.ranks.map(function (item, index) {
                                                    return (
                                                        <li key={index} className="mx-5 px-5 mb-4">
                                                            <div className="row w-75 m-auto">
                                                                <div className="col-2 d-flex">
                                                                    <h5 className="align-self-center text-success">{index + 1}</h5>
                                                                </div>
                                                                <div className="col-8">
                                                                    <div className="media ">
                                                                        <img className="mr-3 rounded" width="50"
                                                                             src={item.photo ? item.photo : require('../assets/img/avatar/avatar-1.png')}
                                                                             alt="photo profile"/>
                                                                        <div className="media-body">
                                                                            <div className="media-title">
                                                                                <Link to="/">{item.first_name}</Link>
                                                                            </div>
                                                                            <div className="text-muted text-small">
                                                                                {item.alamat_sekolah}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2">
                                                                    <h5 className="align-self-center text-warning">{item.score_obtained}</h5>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const Modal = (props) => {
    let style = props.isOpen
        ? {display: "block", backdropFilter: "blur(1px) contrast(.5)"}
        : {display: "none"};

    return (
        <div className="modal fade show" id="exampleModal" role="dialog" style={style}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">
                            Tryout Detail
                        </h5>
                    </div>
                    <div className="modal-body">
                        <p>Periode Mulai: {props.quiz.start_date_readable}</p>
                        <p>Periode Berakhir: {props.quiz.end_date_readable}</p>
                        <p>Durasi: {props.quiz.duration} Menit</p>
                        <p>Maksimum Percobaan: {props.quiz.maximum_attempts}x
                            ({props.quiz.attempt_left} Tersisa)</p>
                        <p>Minimum Persentase Lulus: {props.quiz.pass_percentage}</p>
                        <p>Skor Benar: {props.quiz.correct_score}</p>
                        <p>Skor Salah: {props.quiz.incorrect_score}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-lg btn-outline-secondary"
                                onClick={props.toggle}>Close
                        </button>
                        {
                            props.this.button_exam_or_subscribe()
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
    // Redux Store --> Component
    return {
        token: state.auth.token,
    };
};

// Exports
export default connect(mapStateToProps)(TryoutDetailPage);
