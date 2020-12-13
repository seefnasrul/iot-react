import { all } from 'redux-saga/effects';
import { watchLogin,watchRegister,watchProfileUpdate} from '../sagas/authSagas';
import { watchHome } from './homeSagas';
import { watchStartExam,watchSaveExamAnswer } from './examSagas';
import { watchCreateNewDevice,watchGetDeviceByID,watchUpdateDeviceByID } from './deviceSagas';
import { watchSaveDashboard,watchGetDashboardData,watchSaveDashboardTimerange} from './dashboardSagas';
function* rootSaga() {
    yield all([
        watchProfileUpdate(),
        watchSaveExamAnswer(),
        watchStartExam(),
        watchRegister(),
        watchLogin(),
        watchHome(),
        watchCreateNewDevice(),
        watchGetDeviceByID(),
        watchUpdateDeviceByID(),
        watchSaveDashboard(),
        watchGetDashboardData(),
        watchSaveDashboardTimerange(),
    ])
}
export default rootSaga