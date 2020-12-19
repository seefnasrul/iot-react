//configureStore.js
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import React, {Component} from "react";
import {BrowserRouter as Router, Link, Redirect, Route, Switch, useHistory, useParams} from "react-router-dom";
import setupAxios from './setupAxios';
import axios from 'axios';

import LoginPage from './pages/LoginPage'
import RegisterPage from "./pages/RegisterPage";


import {applyMiddleware, compose, createStore} from 'redux';
import {Provider, ReactReduxContext} from 'react-redux';
import allReducers from './redux/reducers';
import creatSagaMiddleware from 'redux-saga';
import rootSaga from './redux/sagas/rootSaga';
import {PersistGate} from 'redux-persist/integration/react';
import Main from './layouts/Main';
import DashboardPage from './pages/DashboardPage';
import PaketListPage from './pages/PaketListPage';
import TryoutListPage from "./pages/TryoutListPage";
import PaketDetailPage from "./pages/PaketDetailPage";
import TryoutDetailPage from "./pages/TryoutDetailPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import ResultListPage from "./pages/ResultListPage";
import YourPaketListPage from "./pages/YourPaketListPage";
import ProfilePage from "./pages/ProfilePage";
import MidtransPage from "./pages/MidtransPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import DevicesPage from './pages/Device/DevicesPage';
import CreateDevicePage from './pages/Device/CreateDevicePage';
import ImportScript from './ImportScript'; 

import {createBrowserHistory} from "history";
import EditDevicePage from './pages/Device/EditDevicePage';
import ViewDevicePage from './pages/Device/ViewDevicePage';
import DeviceLogListPage from './pages/Device/DeviceLogListPage';
import { useMediaQuery } from 'react-responsive';

export const history = createBrowserHistory({ forceRefresh: true });
const persistConfig = {
    key: 'root',
    storage,
};


const persistedReducer = persistReducer(persistConfig, allReducers);


const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
// const composeEnhancers = composeWithDevTools({ realtime: true, port: 8081 });
const sagaMiddleware = creatSagaMiddleware();
let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
let persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

setupAxios(axios,store,history);

export default function App() {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    return (
        
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router history={history} >
                    {/* {false ? <Redirect to="/dashboard" /> : <Redirect to="/login" />} */}
                    <Switch>
                        
                        <Route path="/login">
                            <LoginPage/>
                        </Route>
                        <Route path="/register">
                            <RegisterPage/>
                        </Route>

                        <Route exact path="/">
                            <Redirect to="/dashboard"/>
                        </Route>
                        <PrivateRoute path="/dashboard">
                            <Main route="/dashboard" content={<DashboardPage isMobile={isMobile}/>} header="Dashboard"/>
                        </PrivateRoute>
                        <PrivateRoute exact path="/devices">
                            <Main route="/devices" content={<DevicesPage/>} header="Device List"/>
                        </PrivateRoute>
                        <PrivateRoute exact path="/devices/create">
                            <Main route="/devices/create" content={<CreateDevicePage/>} header="Create Device"/>
                        </PrivateRoute>

                        <PrivateRoute exact path="/device/:id">
                            <Main route="/device/:id" content={<ViewDevicePage/>} header="View Device"/>
                        </PrivateRoute>
                        <PrivateRoute exact path="/device/:id/edit">
                            <Main route="/device/:id/edit" content={<EditDevicePage/>} header="Edit Device"/>
                        </PrivateRoute>

                        <PrivateRoute exact path="/device/:id/logs">
                            <Main route="/device/:id/logs" content={<DeviceLogListPage/>} header="Device Logs"/>
                        </PrivateRoute>

                        {/* <PrivateRoute path="/devices" children={<Devices />}/> */}


                        <PrivateRoute path="/paketmu">
                            <Main route="/paketmu" content={<YourPaketListPage/>} header="Paket Milikmu"/>
                        </PrivateRoute>
                        <PrivateRoute path="/order-history" children={<History />}/>
                        <PrivateRoute path="/profile">
                            <Main route="/profile" content={<ProfilePage />} header="Profile"/>
                        </PrivateRoute>
                        <PrivateRoute path="/pakets">
                            <Main route="/pakets" content={<PaketListPage/>} header="Paket List"/>
                        </PrivateRoute>
                        <PrivateRoute path="/paket/:slug" children={<DetailPaket/>}/>
                        <PrivateRoute path="/tryouts">
                            <Main route="/tryouts" content={<TryoutListPage/>} header="Daftar Tryout"/>
                        </PrivateRoute>
                        <PrivateRoute path="/tryout/:quid" children={<DetailTryout/>}/>
                        <PrivateRoute exact path="/exam/:quid" children={<Exam/>}/>
                        <PrivateRoute path="/results" children={<ResultList/>}/>
                        <PrivateRoute path="/result/:rid" children={<ResultExam/>}/>
                        <PrivateRoute path="/payment/:gid" children={<Midtrans />}/>

                        <Route path="*">
                            <NoPage/>
                        </Route>
                        <Route exact path="/404">
                            <NoPage/>
                        </Route>
                    </Switch>
                </Router>
            </PersistGate>
        </Provider>
    );
}



function PrivateRoute({children, ...rest}) {
    return (
        <ReactReduxContext.Consumer>
            {({store}) =>
                // console.log(store.getState().auth.token);
                <Route
                    {...rest}
                    render={({location}) =>
                        store.getState().auth.token.access_token ? (
                            children
                        ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    state: {from: location}
                                }}
                            />
                        )
                    }
                />

            }
        </ReactReduxContext.Consumer>
    );
}

function NoPage() {
    return (
		<div class="d-flex flex-column flex-root" style={{height:'100vh'}}>
			<div class="d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30" style={{backgroundImage:`url(${require('./assets_copy/media/error/bg1.jpg')})`,height:'100%'}}>
				<h1 class="font-weight-boldest text-dark-75 mt-15" style={{fontSize: "10rem"}}>404</h1>
				<p class="font-size-h3 text-muted font-weight-normal">OOPS! Something went wrong here</p>
			</div>
		</div>
    )
}


function DetailPaket() {
    let param = useParams();
    let history = useHistory();
    return (
        <Main route="/paket/:slug" content={<PaketDetailPage history={history} param={param}/>} header="Detail Paket"/>
    )
}

function DetailTryout() {
    let param = useParams();
    let history = useHistory();
    return (
        <Main route="/tryout/:quid" content={<TryoutDetailPage history={history} param={param}/>}
              header="Detail Tryout"/>
    )
}

function Exam() {
    let param = useParams();
    let history = useHistory();
    return (
        <ExamPage history={history} param={param}/>
    )
}

function ResultExam() {
    let param = useParams();
    let history = useHistory();
    return (
        <Main route="/result/:rid" content={<ResultPage history={history} param={param}/>} header="Hasil Ujian"/>
    )
}

function ResultList() {
    let history = useHistory();
    return (
        <Main route="/results" content={<ResultListPage history={history}/>} header="Daftar Hasil Ujian"/>
    )
}

function Midtrans() {
    let history = useHistory();
    let param = useParams();
    return (
        <Main route="/midtrans/:gid" content={<MidtransPage param={param} history={history}/>} header="Pembayaran"/>
    )
}

function Devices() {
    let history = useHistory();
    let param = useParams();
    return (
        <Main route="/devices" content={<DevicesPage param={param} history={history}/>} header="Device List"/>
    )
}


function History() {
    let history = useHistory();
    let param = useParams();
    return (
        <Main route="/order-history" content={<OrderHistoryPage param={param} history={history}/>} header="Riwayat Pembelian"/>
    )
}