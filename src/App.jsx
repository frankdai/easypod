import React, {useState, useCallback} from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import DashBoard from './dashboard/dashboard'
import Login from './login/login'
import './theme/index.css'
import './theme/common/button.css'
import './theme/icomoon/style.css'
import {DatabaseContext, fireBaseDataBase} from './database/databaseProvide'

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
  return (
    <BrowserRouter>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <DatabaseContext.Provider value={fireBaseDataBase}>
            <GuardedRoute path="/login" exact component={()=>Login({setCurrentUser})} meta={{ auth: false }}/>
            <GuardedRoute path="/dashboard" exact component={DashBoard} meta={{ auth: true }} />
          </DatabaseContext.Provider>
        </Switch>
      </GuardProvider>
    </BrowserRouter>
  )
};