import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Container, Segment, Grid, Icon, Image, Header, Form, Button, Label } from 'semantic-ui-react'
import Headmenu from './Headmenu.js'
import Title from './Title.js'

import UserLogo from '../images/userLogo.png'

class Detail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            account: "",
            nickname: "",
            newNickname: "",
            gender: "",
            email: "",
            newEmail: "",
            password: "",
            newPassword: "",
            inputPassword: ""
        }

        fetch('http://localhost:8080/user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.appDatas[0],
            },
            })
            .then((response) => {
                return response.json()
            })
            .then((responseData) => { // responseData = undefined
                console.log(responseData[0])
                this.setState({
                    account: responseData[0].account,
                    nickname: responseData[0].nickname,
                    password: responseData[0].password,
                    email: responseData[0].email,
                    gender: responseData[0].gender,
                })
            })
            .catch(function(err) {
                console.log(err)
            })

            this.handleChange = this.handleChange.bind(this)
            this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const name = event.target.name
    
        this.setState({
          [name]: event.target.value
        })
    }

    handleRadioChange = (e, { value }) => this.setState({ gender: value })

    handleSubmit(event) {
        if (this.state.password !== this.state.inputPassword) {
            alert("密碼錯誤")
            this.setState({
                newEmail: "",
                newGender: "",
                newNickname: "",
                newPassword: "",
            })
            window.location.reload()
        }
        else {
            var doc = {
                'account': this.state.account,
                'gender': this.state.gender
            }
            

            if (this.state.newPassword === undefined || this.state.newPassword === "") {
                doc.password = this.state.password
            }
            else {
                doc.password = this.state.newPassword
            }

            if (this.state.newNickname === undefined || this.state.newNickname === "") {
                doc.nickname = this.state.nickname
            }
            else {
                doc.nickname = this.state.newNickname
            }

            if (this.state.newEmail === undefined || this.state.newEmail === "") {
                doc.email = this.state.email
            }
            else {
                doc.email = this.state.newEmail
            }

            console.log(doc)
            

            fetch('http://localhost:8080/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doc)
                })
                .then((response) => {
                return response.json()
                })
                .then((responseData) => { // responseData = undefined
                if (responseData.error === undefined) {
                    alert(responseData.success)
                    window.location.reload()
                }
                else {
                    alert(responseData.error)
                    window.location.reload()
                    this.setState({
                        newEmail: "",
                        newNickname: "",
                        inputPassword: "",
                        newPassword: "",
                    })
                }
                })
                .catch(function(err) {
                console.log(err)
                })
        }
    }

    render() {
        return (
            <Container>
                {(this.props.appDatas[1] === undefined) && (
                    <Redirect to={'/'}/>
                )}
                <Headmenu />
                <Title title='個人資料'/>  

                <Segment.Group>
                    <Segment>
                        <Grid container={true} centered={true}>
                            <Grid.Column>
                                <Segment piled textAlign='center'>
                                    <Header as='h1' icon textAlign='center'>
                                        <Image src={UserLogo} circular bordered/>
                                        <Header.Content >Hi! {this.state.nickname}</Header.Content>
                                    </Header>
                                    
                                    <Form onSubmit={this.handleSubmit}>
                                        <Segment>
                                            <Icon name='user' />
                                            {this.state.account}
                                        </Segment>

                                        <Form.Input iconPosition='left' placeholder={this.state.nickname} name='newNickname' value={this.state.newNickname} onChange={this.handleChange}>
                                            <Icon name='chat' />
                                            <input />
                                        </Form.Input>

                                        <Form.Input iconPosition='left' placeholder='新密碼' type='password' name='newPassword' onChange={this.handleChange}>
                                            <Icon name='lock' />
                                            <input />
                                        </Form.Input>

                                        <Form.Input iconPosition='left' placeholder='請輸入你的舊密碼密碼' type='password' name='inputPassword' onChange={this.handleChange}>
                                            <Icon name='lock' />
                                            <input />
                                        </Form.Input>

                                        <Form.Input iconPosition='left' placeholder={this.state.email} name='newEmail' value={this.state.newEmail} onChange={this.handleChange}>
                                            <Icon name='at' />
                                            <input />
                                        </Form.Input>

                                        <Form.Group inline>
                                            <Label ribbon>
                                                <Icon name='transgender' /> Gender
                                            </Label>
                                            <Form.Radio label='Male' value='male' checked={this.state.gender === 'male'} onChange={this.handleRadioChange}/>
                                            <Form.Radio label='Female' value='female' checked={this.state.gender === 'female'} onChange={this.handleRadioChange}/>
                                            <Form.Radio label='Unknown' value='unknown' checked={this.state.gender === 'unknown'} onChange={this.handleRadioChange}/>
                                        </Form.Group>

                                        <Button type='submit' color='teal' fluid>更新</Button>
                                    </Form>
                                </Segment>
                            </Grid.Column >
                        </Grid>
                    </Segment>
                </Segment.Group>
            </Container>
        )
    }
}

export default Detail;