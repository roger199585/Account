import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'

/* my components */
import Login from '../component/Login'
import Signup from '../component/Signup'
import Overview from '../component/Overview'
import Update from '../component/Update'
import Record from '../component/Record'
import Accounts from '../component/Accounts'
import Detail from '../component/Detail'


import { setToken, setLogin } from '../actions/appActions'

class SignupComp extends Component {
  render() {
    return (
      <Signup finish= { false } />
    )
  }
}

class App extends Component {
  render() {

    let mapState = (state) => { return { ...state } }
    let LoginComp = connect(mapState, { setToken, setLogin } )(Login)
    let OverviewComp = connect(mapState, {setLogin} )(Overview)
    let UpdateComp = connect(mapState)(Update)
    let RecordComp = connect(mapState)(Record)
    let AccountsComp = connect(mapState)(Accounts)
    let DetailComp = connect(mapState)(Detail)

    return (
      <Switch>
        <Route exact path='/' component={LoginComp}/>
        <Route path='/signup' component={SignupComp}/>
        <Route path='/overview' component={OverviewComp}/>
        <Route exact path='/update' component={UpdateComp}/>
        <Route path='/update/record' component={RecordComp}/>
        <Route path='/update/accounts' component={AccountsComp}/>
        <Route paht='/detail' component={DetailComp}/>
      </Switch>
    )
  }
}

export default App
