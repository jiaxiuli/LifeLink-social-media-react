import React from 'react';
import Login from './views/Login/Login';
import { Route, Redirect } from 'react-router-dom'
import './App.css';

function App() {
 
  return (
      <div>
          <Route path="/" exact render={() => (
            <Redirect to='/login'/>)} 
          />
          <Route path="/login" component={Login}/>
      </div>
  );
}

export default App;
