// import { error } from "jquery";
import { UNSET_AUTH } from "./redux/actions/actionTypes";

export default function setupAxios(axios, store,history) {
    axios.interceptors.request.use(
      config => {
        const {
          auth: { token:{access_token} }
        } = store.getState();
        console.log(store.getState());
        if (access_token && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
          console.log(access_token);
          config.headers.Authorization = `Bearer ${access_token}`;
        }
        console.log(config);
        return config;
      },
      error => {
        // console.log('setupAxios',error.response.status);
        // if (error.response.status === 401) {
        //   localStorage.clear();
        //   store.dispatch({type:UNSET_AUTH})
        // }
        return Promise.reject(error)  
      }
    );
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
       console.log('setupAxios',error.response.status);
        if (error.response.status === 401) {
          localStorage.clear();
          store.dispatch({type:UNSET_AUTH})
        }

        if (error.response.status === 404) {
          history.push('/404');
        }
      return Promise.reject(error);
    });

  }
  