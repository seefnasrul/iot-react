//configureStore.js
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import React, {Component} from "react";
import {BrowserRouter as Router, Link, Redirect, Route, Switch, useHistory, useParams} from "react-router-dom";
import setupAxios from './setupAxios';
import axios from 'axios';

import LoginPage from './pages/LoginPage'


import {applyMiddleware, compose, createStore} from 'redux';
import {Provider, ReactReduxContext} from 'react-redux';
import allReducers from './redux/reducers';
import creatSagaMiddleware from 'redux-saga';
import rootSaga from './redux/sagas/rootSaga';
import {PersistGate} from 'redux-persist/integration/react';
import Main from './layouts/Main';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from "./pages/ProfilePage";
import DevicesPage from './pages/Device/DevicesPage';
import CreateDevicePage from './pages/Device/CreateDevicePage';
import ImportScript from './ImportScript'; 

import {createBrowserHistory} from "history";
import EditDevicePage from './pages/Device/EditDevicePage';
import ViewDevicePage from './pages/Device/ViewDevicePage';
import DeviceLogListPage from './pages/Device/DeviceLogListPage';
import { useMediaQuery } from 'react-responsive';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import Color from './constants/Color';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: Color.primary,
    },
    secondary: {
      main:  Color.seconday,
    },
  },
});

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
        <ThemeProvider theme={theme}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router history={history} >
                    {/* {false ? <Redirect to="/dashboard" /> : <Redirect to="/login" />} */}
                    <Switch>
                        
                        <Route path="/login">
                            <LoginPage/>
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

                        <PrivateRoute path="/profile">
                            <Main route="/profile" content={<ProfilePage />} header="Profile"/>
                        </PrivateRoute>

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
        </ThemeProvider>
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



function Devices() {
    let history = useHistory();
    let param = useParams();
    return (
        <Main route="/devices" content={<DevicesPage param={param} history={history}/>} header="Device List"/>
    )
}
