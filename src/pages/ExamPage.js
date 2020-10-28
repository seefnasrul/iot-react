import React, {Component} from 'react';
import Url from '../constants/Url';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
/* redux */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Prompt} from 'react-router-dom';
import * as examActions from '../redux/actions/examActions';


class ExamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            modal_test_visible: false,
            quid: "4",
            current_number: 0,
            timer: {days: 0, hours: 0, minutes: 0, seconds: 0},
            answer: {},
            increase_sec_ind: 0,
            individual_time: [],
            audio_play: false,
            disable_audio_play: false,
            sound_percent: 0,
            submitingDone: false,
            webheight: [],
            webheightParagraph: 300,
            webheightQuestion: 300,
            webheightOption: [],
            shouldBlockNavigation: false,
            reload: false,
            loading: false
        };
        this.goBack = this.goBack.bind(this);
        this.sound = null;
        this.sound_interval = null;
        this.count_down = null;
        this.increase_time_interval = null;
        this.set_individual_time = null;
        this.ind_time = null;
        this.question_scrollView = null;
    }

    componentDidMount = () => {
        const {history} = this.props;
        history.listen((newLocation, action) => {
            if (action === "POP" && this.state.loading) {
                alert("Jawaban sedang di kirim")
            }
        });

        this.get_exam_data();
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !this.state.loading;
    }

    componentWillMount() {
        onbeforeunload = e => "Dont Leave";
    }

    componentWillUnmount() {
        this.set_show_modal('quit');
        onbeforeunload = null;
        clearInterval(this.count_down);
    }

    toggle_play_button = () => {
        console.log('toggle play');
        this.setState({audio_play: !this.state.audio_play});

        if (this.sound == null) {
            const {current_number, data} = this.state;
            this.setState({disable_audio_play: true});
            // console.log(Url.BASE + '/upload/mp3/' + data.questions[data.random_order[current_number]].mp3);
            this.sound = new Audio(Url.BASE + '/upload/mp3/' + data.questions[data.random_order[current_number]].mp3);
            if (!this.state.audio_play) {
                this.sound.play();
            } else {
                this.sound.pause();
            }
            // this.sound.setVolume(1);
            // this.sound.play((finished) => {
            //     if (finished) {
            //         let {data} = this.state;
            //         data.questions[data.random_order[current_number]].audio_played = true;
            //         this.setState({data: data}, () => {
            //             console.log(this.state.data);
            //         });
            //         clearInterval(this.sound_interval);
            //     }
            // });
            // let duration = this.sound.getDuration();
            // this.sound_interval = setInterval(() => {
            //     console.log('interval running');
            //     this.sound.getCurrentTime((second) => {
            //         console.log(second);
            //         this.setState({sound_percent: (second / duration) * 100});
            //     });
            // }, 1000);
            // this.setState({disable_audio_play: false});
        } else {

        }


    };

    handleBackButton = () => {
        this.setState({modal_test_visible: !this.state.modal_test_visible});
        return true;
    };

    goBack() {
        this.props.history.goBack();
    }

    /* get exam data */
    get_exam_data = () => {
        let payload = {
            token: this.props.token,
            quid: this.props.param.quid
        };
        this.props.actions.exam.getExamData(payload, this.onGetExamSuccess, this.onGetExamError)
    };

    onGetExamSuccess = (data) => {
        let individual_time = [];
        for (let y = 0; y < data.quiz.noq; y++) {
            individual_time.push(0);
        }
        this.setState({data: data, individual_time: individual_time});
        this.initiate_count_down();
    };

    onGetExamError = (error) => {
        console.log(error.response.data);
    };
    /* save and set exam answer */
    save_exam_answer = () => {
        console.log('save exam answer func');
        let payload = {
            answers: this.state.answer
        };

        this.props.actions.exam.setExamAnswerToServer(payload, this.onSaveAnswerSuccess, this.onSaveAnswerError)
    };
    onSaveAnswerSuccess = (data) => {

    };
    onSaveAnswerError = (error) => {
        console.log(error.response.data);
    };

    initiate_count_down = () => {
        const {data} = this.state;
        let countDownDate = new Date();
        console.log(countDownDate);
        countDownDate.setSeconds(countDownDate.getSeconds() + data.seconds);
        let self = this;
        this.count_down = setInterval(() => {
            // console.log('count down');
            // Get today's date and time
            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            this.setState({
                timer: {days: days, hours: hours, minutes: minutes, seconds: seconds},
                increase_sec_ind: this.state.increase_sec_ind + 1
            });
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(self.count_down);
                alert('Waktu Habis!');
                this.finish_exam();
                //   document.getElementById("demo").innerHTML = "EXPIRED";
            }
        }, 1000);

    };

    setIndividual_time = async () => {
        let {individual_time, current_number, increase_sec_ind, data} = this.state;
        console.log('before:', individual_time);
        console.log('increase:', increase_sec_ind);
        individual_time[data.random_order[current_number]] = individual_time[data.random_order[current_number]] + increase_sec_ind;
        await this.setState({
            individual_time: individual_time,
            increase_sec_ind: 0
        }, () => console.log('after:', this.state.individual_time));
        this.save_individual_time();
        return true;
    };

    save_individual_time = () => {
        try {
            let self = this;
            let formData = new FormData();
            formData.append('individual_time', self.state.individual_time.join(','));
            axios.post(Url.API + '/page/set_ind_time')
                .then((response) => {
                    console.log('save ind time response:', response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    };

    finish_exam = () => {
        try {
            let formData = new FormData();
            let self = this;
            self.setState({submitingDone: true});
            formData.append('rid', self.state.data.quiz.rid);
            formData.append('token', self.props.token);
            const CancelToken = axios.CancelToken;
            const source = CancelToken.source();
            self.setState({loading: true});
            axios.post(Url.API + '/page/submit_quiz', formData, {
                cancelToken: source.token
            })
                .then((response) => {
                    console.log(response);
                    self.setState({modal_test_visible: false});
                    self.setState({submitingDone: false});
                    self.setState({loading: false});
                    self.props.history.push('/result/' + self.state.data.quiz.rid);
                    // self.props.navigation.navigate('ResultDetail', {rid: self.state.data.quiz.rid});
                })
                .catch((error) => {
                    if (axios.isCancel(error)) {
                        console.log('im canceled');
                    } else {
                        console.log(error.response.data);
                        self.setState({submitingDone: false});
                        self.setState({modal_test_visible: false});
                        alert('submit gagal');
                    }
                });
        } catch (error) {
            console.log(error)
        }
    };

    save_answer = async (number) => {
        await this.setIndividual_time();
        console.log('hit');
        const {data} = this.state;
        console.log(data);
        let question_types = [];
        let answers = {};
        let individual_time = [];
        let formData = new FormData();
        let i = 0;
        data.questions.forEach(element => {
            individual_time.push(1);
            let q_type = 1;
            formData.append('question_type[]', q_type);
            if (typeof this.state.answer[element.qid] !== 'undefined') {
                formData.append('answer[' + i + '][]', this.state.answer[element.qid]);
            }
            i++;
        });

        formData.append('rid', data.quiz.rid);
        formData.append('noq', data.quiz.noq);
        // formData.append('question_type',question_types);
        formData.append('qn', data.random_order[number]);
        console.log('current_number:', number);
        console.log('randomOrder:', data.random_order[number]);
        formData.append('individual_time', this.state.individual_time.join(','));
        formData.append('token', this.props.token);
        console.log(formData);
        try {
            axios.post(Url.API + '/page/save_answer', formData)
                .then(async function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };


    get_data = async () => {
        try {
            let self = this;
            let formData = new FormData();
            formData.append('quid', self.props.param.quid);
            formData.append('token', self.props.token);
            console.log(formData);
            axios.post(Url.API + '/page/start_exam', formData)
                .then(async (response) => {
                    console.log(response.data);
                    let quiz = response.data.data.quiz;
                    let individual_time = [];
                    let webheight = [];
                    for (let y = 0; y < quiz.noq; y++) {
                        individual_time.push(0);
                        webheight.push(300);
                    }
                    await self.setState({
                        data: response.data.data,
                        individual_time: individual_time,
                        webheight: webheight
                    });
                    self.initiate_count_down();
                })
                .catch(function (error) {
                    console.log(error.response.data);
                })
        } catch (e) {
            console.log('err');
            console.log(e);
        }
    };

    check_if_answered = (index) => {
        let {answer, data} = this.state;
        let qid = data.questions[index].qid;
        if (typeof answer[qid] !== 'undefined') {
            return answer[qid] !== null;
        } else {
            return false
        }
    };

    set_answer = (quid, answer_id) => {
        var {answer} = this.state;
        answer[quid] = answer_id;
        this.setState({answer: answer});
        this.save_answer();
    };

    choosen_option = (qid, oid) => {
        let answer = this.state.answer;
        if (typeof answer[qid] !== 'undefined') {
            return answer[qid] === oid;
        } else {
            return false;
        }
    };

    choose = (qid, oid) => {
        let answer = this.state.answer;
        answer[qid] = oid;
        this.setState({answer: answer});
        this.save_answer(this.state.current_number);
        if (this.state.current_number < this.state.data.questions.length) {
            this.next_question()
        }
    };

    change_current_number = (index) => {
        if (index !== this.state.current_number) {
            this.setState({current_number: index});
            // this.clear_sound_data();
        }
    };

    /*navigate through questions */
    next_question = () => {
        let {current_number, data} = this.state;
        if ((current_number + 1) < data.questions.length) {
            this.setState({current_number: current_number + 1});
            // this.clear_sound_data();
            return true;
        } else {
            return false;
        }
    };
    previous_question = () => {
        let {current_number} = this.state;
        if (current_number > 0) {
            this.setState({current_number: current_number - 1});
            // this.clear_sound_data();
            console.log(this.state.data);
            this.question_scrollView.scrollTo({y: 0});
            return true;
        } else {
            return false;
        }
    };

    set_show_modal = (type) => {
        this.setState({modal_content_type: type}, () => this.handleBackButton());
    };

    modal_content() {
        const {modal_content_type} = this.state;
        switch (modal_content_type) {
            case 'quit':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                Keluar Ujian
                            </h5>
                        </div>
                        <div className="modal-body">
                            <p>
                                Apakah yakin anda akan keluar ujian ? Semua progress dan jawaban anda akan hilang.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => (this.state.submitingDone) ? null : this.handleBackButton()}
                                    className="btn btn-secondary">Batal
                            </button>
                            <button onClick={() => this.goBack()} className="btn btn-danger">Keluar</button>
                        </div>
                    </div>
                );

            case 'done':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                Selesai Ujian
                            </h5>
                        </div>
                        <div className="modal-body">
                            <p>
                                Apakah yakin anda akan selesai ujian ? Setelah ini penilaian segera dilakukan dan tidak
                                dapat diubah kembali.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button disabled={this.state.loading}
                                    onClick={() => (this.state.submitingDone) ? null : this.handleBackButton()}
                                    className="btn btn-secondary">Batal
                            </button>
                            <button onClick={() => this.finish_exam()} className="btn btn-success">
                                {
                                    (this.state.loading)
                                        ? <i className="fa fa-spinner fa-spin"/>
                                        : <span>Selesai</span>
                                }
                            </button>
                        </div>
                    </div>
                );
            default:
                break;
        }
    }

    handleBlockedNavigation = () => {
        this.set_show_modal('quit');
        return false
    };

    render() {
        const {current_number, data, timer} = this.state;
        if (this.state.data == null) {
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
                {
                    (!this.state.submitingDone)
                        ? <Prompt
                            message="Anda yakin keluar ujian?"
                        />
                        : null
                }
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 style={{
                                    fontSize: 24
                                }} className="text-dark">
                                    {this.state.data.quiz.quiz_name}
                                </h4>
                                <div className="card-header-action">
                                    <div className="row">
                                        <div className="col-6">
                                            <button onClick={() => this.set_show_modal('quit')}
                                                    className="btn btn-lg btn-round btn-danger">Keluar
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button onClick={() => this.set_show_modal('done')}
                                                    className="btn btn-lg btn-round btn-warning">Selesai
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Question {current_number + 1} of {data.questions.length}</h4>
                                <div className="card-header-action">
                                    <h4 className="text-secondary">
                                        Sisa Waktu : {" "}
                                        {timer.hours < 10 ? '0' : null}
                                        {timer.hours}:{timer.minutes < 10 ? '0' : null}
                                        {timer.minutes}:{timer.seconds < 10 ? '0' : null}
                                        {timer.seconds}
                                    </h4>
                                </div>
                            </div>
                            <div className="card-body">
                                {
                                    (data.questions[data.random_order[current_number]].paragraph !== ""  && data.questions[data.random_order[current_number]].paragraph !== null && data.questions[data.random_order[current_number]].paragraph !== "<p></p>") &&
                                        <p className="p-4" dangerouslySetInnerHTML={{__html: data.questions[data.random_order[current_number]].paragraph}}
                                           style={{
                                               backgroundColor: "rgba(0,126,60,0.1)",
                                               borderRadius: 5
                                           }}
                                        />
                                }

                                <p className="p-4"
                                   dangerouslySetInnerHTML={{__html: data.questions[data.random_order[current_number]].question}}
                                   style={{
                                       backgroundColor: "rgba(0,126,60,0.1)",
                                       borderRadius: 5
                                   }}/>
                                {
                                    data.questions[data.random_order[current_number]].mp3 !== "" &&
                                    <div>
                                        <button onClick={this.toggle_play_button}>{this.state.play ? 'Pause' : 'Play'}</button>
                                    </div>
                                }
                                <div className="mt-4">
                                    <h6 className="mb-4">Multiple Choice</h6>
                                    {
                                        data.questions[data.random_order[current_number]].options.map(function (item, index) {
                                            let choiceClassName = this.choosen_option(item.qid, item.oid) ? "text-left btn btn-primary btn-block" : "text-left btn btn-outline-primary btn-block";
                                            return (
                                                <button onClick={() => this.choose(item.qid, item.oid)} key={index}
                                                        className={choiceClassName}>
                                                    <p style={{
                                                        fontSize: 14
                                                    }} dangerouslySetInnerHTML={{__html: item.q_option}}/>
                                                </button>
                                            )
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Nomor Soal</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {
                                        data.random_order.map(function (item, index) {
                                            let numberClassName = "";
                                            if (current_number === index) {
                                                numberClassName = "btn btn-success btn-block"
                                            } else if (this.check_if_answered(item)) {
                                                numberClassName = "btn btn-secondary btn-block"
                                            } else {
                                                numberClassName = "btn btn-outline-secondary btn-block"
                                            }
                                            return (
                                                <div key={index} className="col-3 mb-3">
                                                    <button onClick={this.change_current_number.bind(this, index)}
                                                            className={numberClassName}>
                                                        {index + 1}
                                                    </button>
                                                </div>
                                            )
                                        }.bind(this))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.modal_test_visible}>
                    {this.modal_content()}
                </Modal>
            </div>
        )
    }
}

const ProgressBar = (props) => {
    return (
        <div className="progress-bar" width="50%">
            50%
        </div>
    )
};

const Modal = (props) => {
    let style = props.isOpen
        ? {display: "block", backdropFilter: "blur(1px) contrast(.5)"}
        : {display: "none"};
    return (
        <div className="modal fade show" id="exampleModal" role="dialog" style={style}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                {props.children}
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        exam: state.exam.examData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            exam: bindActionCreators(examActions, dispatch)
        }
    }
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ExamScreen);

