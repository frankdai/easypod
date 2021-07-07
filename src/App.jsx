import React, {useState, useCallback} from 'react';
import { BrowserRouter, Switch, useHistory } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import DashBoard from './dashboard/dashboard'
import Login from './login/login'
import Show from "./show";
import './theme/index.css'
import './theme/common/button.css'
import './theme/icomoon/style.css'

export default  () => {
  let [currentUser, setCurrentUser] = useState(null)
  let [currentShow, setCurrentShow] = useState(null)
  let [channels, setChannels] = useState([])
  const requireLogin = (to, from, next) => {
    if (to.meta.auth) {
      if (firebase.auth().currentUser) {
        next();
      }
      next.redirect('/login');
    } else {
      next();
    }
  };
  function onSetCurrentShow (show, userChannels) {
    setCurrentShow(show)
    setChannels(userChannels)
  }
  return (
    <BrowserRouter>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <GuardedRoute path="/login" exact component={()=>Login({setCurrentUser})} meta={{ auth: false }}/>
          <GuardedRoute path="/dashboard" exact component={()=>DashBoard({user:currentUser,onSetCurrentShow})} meta={{ auth: true }} />
          <GuardedRoute path="/show" exact component={()=>{
            return Show({show: currentShow, channels})}
          } meta={{ auth: true }} />
        </Switch>
      </GuardProvider>
    </BrowserRouter>
  )
};