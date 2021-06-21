import React, {useState, useCallback} from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import DashBoard from './dashboard/dashboard'
import Login from './login/login'
import './theme/index.css'
import './theme/common/button.css'
import './theme/icomoon/style.css'

export default  () => {
  let [currentUser, setCurrentUser] = useState('Frank')
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
  let CurrentUserContext = React.createContext(currentUser)
  return (
    <BrowserRouter>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <GuardedRoute path="/login" exact component={()=>Login({setCurrentUser})} meta={{ auth: false }}/>
          <GuardedRoute path="/dashboard" exact component={()=>DashBoard({user:currentUser})} meta={{ auth: true }} />
        </Switch>
      </GuardProvider>
    </BrowserRouter>
  )
};