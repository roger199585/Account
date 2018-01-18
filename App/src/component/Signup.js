import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { Grid, Icon, Form, Header, Segment, Label, Button } from 'semantic-ui-react'

class Signup extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      account: "",
      password: "",
      nickname: "",
      email: "",
      gender: 'unknown',
      agree: true,
      Finish: this.props.finish
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

  handleRadioChange = (e, { value }) => this.setState({ gender: value })
  handleCheckboxChange = (e, { checked }) => this.setState({ agree: !checked })

  handleSubmit(event) {
    event.preventDefault()

    fetch('http://localhost:8080/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: this.state.account,
        password: this.state.password,
        nickname: this.state.nickname,
        email: this.state.email,
        gender: this.state.gender,
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((responseData) => { // responseData = undefined
      if (responseData.error === undefined) {
        alert(responseData.success)
        this.setState( { Finish: true })
      }
      else {
        alert(responseData.error)
        this.setState({
          account: "",
          password: "",
          email: "",
        })
      }
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  render() {
    return (
      <Grid container={true} centered={true} style={{ paddingTop: '5rem' }}>
        {/*(this.props.appDatas[1] === undefined) && (
            <Redirect to={'/overview'}/>
        )*/}

        <Grid.Column style={{ maxWidth: '450px' }}>      
          
          <Header as='h1' icon textAlign='center' color='teal'>
            <Icon name='signup' circular />
            <Header.Content >註冊</Header.Content>
          </Header>

          <Segment piled>
            <Form onSubmit={this.handleSubmit}>
                <Form.Input iconPosition='left' placeholder='Account' name='account' value={this.state.account} onChange={this.handleChange}>
                    <Icon name='user' />
                    <input />
                </Form.Input>

                <Form.Input iconPosition='left' placeholder='Nickname' name='nickname' value={this.state.nickname} onChange={this.handleChange}>
                    <Icon name='chat' />
                    <input />
                </Form.Input>

                <Form.Input iconPosition='left' placeholder='Password' type='password' name='password' value={this.state.password} onChange={this.handleChange}>
                    <Icon name='lock' />
                    <input />
                </Form.Input>

                <Form.Input iconPosition='left' placeholder='Email' name='email' value={this.state.email} onChange={this.handleChange}>
                    <Icon name='at' />
                    <input />
                </Form.Input>

                <Form.Group inline>
                    <Label ribbon>
                        <Icon name='transgender' /> Gender
                    </Label>
                    <Form.Radio label='Male' value='male' checked={this.state.gender === 'male'} onChange={this.handleRadioChange} />
                    <Form.Radio label='Female' value='female' checked={this.state.gender === 'female'} onChange={this.handleRadioChange} />
                    <Form.Radio label='Unknown' value='unknown' checked={this.state.gender === 'unknown'} onChange={this.handleRadioChange} />
                </Form.Group>

                <Form.Checkbox label='我同意將我的個人資料提供給此網站' onChange={this.handleCheckboxChange}/>

                <Button type='submit' color='teal' fluid disabled={this.state.agree}>註冊</Button>
                { this.state.Finish && (
                  <Redirect to={'/'}/>
                )}
                <br />
                <Link to='/'>
                  <Button color='twitter' fluid >
                    我有帳號了
                  </Button>
                </Link>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Signup;