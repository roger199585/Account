import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Grid, Icon, Form, Header, Segment, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router'

class Login extends Component {
  constructor(){
    super()

    this.state = {
      account: "",
      password: "",
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const name = event.target.name

    this.setState({
      [name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: this.state.account,
        password: this.state.password,
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((responseData) => { // responseData = undefined
      if (responseData.error === undefined) {
        this.props.setToken(responseData.token)
        this.props.setLogin(true)
      }
      else {
        alert(responseData.error)
        this.setState({
          account: "",
          password: ""
        })
      }
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  render() {
    const { from } = this.props.location.state || '/'

    return (
      <Grid container={true} centered={true} style={{ paddingTop: '5rem' }}>
        <Grid.Column style={{ maxWidth: '450px' }}>      
          
          <Header as='h1' icon textAlign='center' color='teal'>
            <Icon name='users' circular />
            <Header.Content >登入</Header.Content>
          </Header>

          <Segment piled>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input iconPosition='left' placeholder='Account' name='account' value={this.state.account} onChange={this.handleChange}>
                <Icon name='at' />
                <input />
              </Form.Input>

              <Form.Input iconPosition='left' placeholder='Password' type='password' name='password' value={this.state.password} onChange={this.handleChange}>
                <Icon name='lock' />
                <input />
              </Form.Input>
              
              <Form.Button color='teal' fluid >登入</Form.Button>
              
              { (this.props.appDatas[1] === true) && (
                <Redirect to={from || '/overview'}/>
              )}
              
              <Link to='/signup'>
                <Button color='youtube' fluid >
                  註冊
                </Button>
              </Link>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
