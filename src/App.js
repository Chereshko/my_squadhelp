import React from 'react';
import History from "./Components/Transaction/HistoryPage";
import Header from "./Components/Header/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import 'react-toastify/dist/ReactToastify.css'
import {Router, Route, Switch} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import CONSTANTS from './constants';
import browserHistory from './browserHistory';
import PrivateHoc from "./Components/PrivateHoc/PrivateHoc";


class App extends React.Component{
    render(){
        return (
            <Router history={browserHistory}>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                        rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                    />
                    <Switch>
                        <Route exact path='/' component={PrivateHoc(Dashboard)}/>
                    </Switch>
            </Router>
        )
    }
}

export default App;
