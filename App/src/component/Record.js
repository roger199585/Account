import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Container, Segment, Form, Icon, Grid, Label, Button } from 'semantic-ui-react'
import Headmenu from './Headmenu.js'
import Title from './Title.js'

class Record extends Component {
    constructor(props, token) {
        super(props)
        
        this.stateOptions = [ 
            { key: '飲食', value: 0, text: '飲食' },
            { key: '工作', value: 1, text: '工作' },
            { key: '交通費', value: 2, text: '交通費' },
            { key: '娛樂', value: 3, text: '娛樂' },
        ]

        this.state = {
            price: "",
            category: [],
            income: false,
            remark: "",
            inputActive: false,
            userCategory: "",
        }
        
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addOption = this.addOption.bind(this)
    }

    handleChange(event) {
        const name = event.target.name
        this.setState({
            [name]: event.target.value
        })
    }

    handleOptionChange = (e, { value }) => {
        console.log(value)
        this.setState({
            category: value
        })
    }

    handleRadioChange = (e, { value }) => {
        value === 'income' ? this.setState({ income: true }) : this.setState({ income: false })
    }

    handleInput = (e, { value }) => {
        console.log(this.state.inputActive)
        this.setState({ inputActive: !this.state.inputActive })
    }

    addOption = (e) => {
        this.stateOptions.push({ key: this.state.userCategory, value: this.stateOptions.length, text: this.state.userCategory})
        this.setState({ 
            userCategory: "", 
            inputActive: false,
        })
        alert("新類別已加入 請打開下拉式選單選取")
    }

    handleSubmit(event) {
        event.preventDefault()

        var currentCategorys = []
        for (var i = 0; i < this.state.category.length; ++i) {
            currentCategorys.push(this.stateOptions[this.state.category[i]].text)
        }

        console.log( typeof(this.state.price))

        fetch('http://localhost:8080/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.props.appDatas[0],
            },
            body: JSON.stringify({
                price: parseInt(this.state.price, 10),
                categorys: currentCategorys,
                income: this.state.income,
                remark: this.state.remark,
            }),
        })
        .then((response) => {
            console.log(response)
            return response.json()
        })
        .then((responseData) => { // responseData = undefined
        if (responseData.error === undefined) {
            this.setState({
                price: "",
                category: [],
                income: false,
                remark: "",
                inputActive: false,
            })
            alert(responseData.success)
        }
        else {
            alert(responseData.error)
        }
        })
        .catch(function(err) {
            console.log(err)
        })
    }

    render() {
        return (
            <Container>
                {(this.props.appDatas[1] === undefined) && (
                    <Redirect to={'/'}/>
                )}
                <Headmenu />
                <Title title='新增紀錄'/>  
                
                <Segment.Group>
                    <Segment>
                        <Grid container={true} centered={true}>
                            <Grid.Column>
                                <Segment piled>
                                <Form>
                                    <Form.Input iconPosition='left' placeholder='說你花了多少錢啊，嫩！' name='price' value={this.state.price} onChange={this.handleChange}>
                                        <Icon name='jpy' />
                                        <input />
                                    </Form.Input>
                                    
                                    <Form.Group unstackable widths={2}>
                                        <Form.Dropdown width={16} placeholder='到底是用去哪ww' fluid multiple search selection options={this.stateOptions} onChange={this.handleOptionChange} />
                                        <Button icon='edit' color='linkedin' onClick={this.handleInput}/>
                                    </Form.Group>

                                    {   this.state.inputActive &&
                                        <Form.Input iconPosition='left' placeholder='問題很多誒，分類還想自己定' name='userCategory' onChange={this.handleChange}>
                                            <Icon name='external' />
                                            <input />
                                            <Button icon='send' color='twitter' onClick={this.addOption}/>
                                        </Form.Input>
                                    }

                                    <Form.Group inline>
                                        <Label ribbon>
                                            <Icon name='credit card' /> 敗家？
                                        </Label>
                                        <Form.Radio label='收入' value='income' checked={this.state.income === true } onChange={this.handleRadioChange} />
                                        <Form.Radio label='支出' value='outcome' checked={this.state.income === false } onChange={this.handleRadioChange} />
                                    </Form.Group>
                        
                                    <Form.TextArea placeholder='帳目說明' name='remark' value={this.state.remark} onChange={this.handleChange} />
                                    <Form.Button color='teal' fluid onClick={this.handleSubmit}>新增帳目</Form.Button>
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

export default Record;