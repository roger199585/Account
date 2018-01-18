import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { Grid, Statistic, Segment, Container, Icon, Card, Button, Item} from 'semantic-ui-react'
import {PieChart, Pie, ResponsiveContainer, Tooltip, LabelList, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend} from 'recharts'
import Headmenu from './Headmenu.js'
import Title from './Title.js'
import './css/style.css'

class OverView extends Component {
  constructor(props) {
    super(props)
    this.state = {
        total_income: 0,
        total_expense: 0,
        max_income: 0,
        max_expense: 0,
        income_categorys: "",
        expense_categorys: "",
        nickname: "",


        data: [{name: "", income: 0, outcont: 0}],
        current_usage1: [],
        current_usage2: [],
        usage1_categorys: [],
        usage2_categorys: []
    }
    
    fetch('http://localhost:8080/info?permonth=true', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.appDatas[0],
        },
    })
    .then((response) => {
        // console.log(response)
        return response.json()
    })
    .then((responseData) => {
        if (responseData === undefined) {
            console.log("The database is empty")
        }
        else {
            // console.log(responseData)
            this.setState({
                total_income: responseData.data.incomes,
                total_expense: responseData.data.expenses,
                max_income: responseData.extremum_in,
                max_expense: responseData.extremum_out,
                income_categorys: responseData.extremum_in.categorys,
                expense_categorys: responseData.extremum_out.categorys
            })
        }
    })
    .catch(function(err) {
        console.log(err)
    })

    fetch('http://localhost:8080/info?daily=true', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.appDatas[0],
        },
    })
    .then((response) => {
        return response.json()
    })
    .then((responseData) => {
        if (responseData === undefined) {
            console.log("The database is empty")
        }
        else {
            console.log(responseData)
            this.setState({
                total_income: responseData.data.incomes,
                total_expense: responseData.data.expenses,                                                                                                                                                                                                                                  
            })
        }
    })
    .catch(function(err) {
        console.log(err)
    })

    fetch('http://localhost:8080/info?permonth=true&limit=10', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.appDatas[0],
        },
    })
    .then((response) => {
        return response.json()
    })
    .then((responseData) => {
        if (responseData === undefined) {
            console.log("The database is empty")
        }
        else {
            // console.log(responseData)
            this.setState({
                data: [
                    {name: responseData.data6[0].date, income: responseData.data6[0].income, outcome: responseData.data6[0].expense},
                    {name: responseData.data5[0].date, income: responseData.data5[0].income, outcome: responseData.data5[0].expense},
                    {name: responseData.data4[0].date, income: responseData.data4[0].income, outcome: responseData.data4[0].expense},
                    {name: responseData.data3[0].date, income: responseData.data3[0].income, outcome: responseData.data3[0].expense},
                    {name: responseData.data2[0].date, income: responseData.data2[0].income, outcome: responseData.data2[0].expense},
                    {name: responseData.data1[0].date, income: responseData.data1[0].income, outcome: responseData.data1[0].expense},
                ]
            })
        }
    })
    .catch(function(err) {
        console.log(err)
    })

    fetch('http://localhost:8080/info?limit=2', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': this.props.appDatas[0],
        },
    })
    .then((response) => {
        return response.json()
    })
    .then((responseData) => {
        if (responseData === undefined) {
            console.log("The database is empty")
        }
        else {
            console.log(responseData.data)
            this.setState({
                current_usage1: responseData.data[0],
                current_usage2: responseData.data[1],
                usage1_categorys: responseData.data[0].categorys,
                usage2_categorys: responseData.data[1].categorys,
            })
        }
    })
    .catch(function(err) {
        console.log(err)
    })
  }

  render() {
    const items = [
        { key:'cash', label: '現金', value: 'NT$ 2,500', color: 'red'},
        { key:'save', label: '存款', value: 'NT$ 27,680', color: 'green'},
    ]

    const income = [ 
        {name: '工讀費用', value: 4800}, 
        {name: '研究計畫經費', value: 6000},
    ]

    const outcome = [ 
        {name: '飲食', value: 5000}, 
        {name: '玩樂', value: 2000},
        {name: '雜物', value: 1200},
        {name: '油錢', value: 3000},
        {name: '雲端服務', value: 1000},
    ]

    return (
        <Container>
            {(this.props.appDatas[1] === undefined) && (
                <Redirect to={'/'}/>
            )}
            <Headmenu/>
            <Title title='概要'/>

            <Segment.Group horizontal raised>
                <Segment textAlign='center'>
                    <Statistic color='green'>
                        <Statistic.Value>NT$ {this.state.total_income}</Statistic.Value>
                        <Statistic.Label>月收入</Statistic.Label>
                    </Statistic>
                </Segment>
                <Segment textAlign='center'>
                    <Statistic color='red'>
                        <Statistic.Value>NT$ {this.state.total_expense}</Statistic.Value>
                        <Statistic.Label>月支出</Statistic.Label>
                    </Statistic>
                </Segment>
            </Segment.Group>

            <Segment>
                <Segment inverted color='teal'>
                    帳戶結餘
                </Segment>
                <Segment textAlign='center'>
                    <Statistic.Group widths='two' items={items} />
                </Segment>
            </Segment>

            <Grid stackable columns={2}>
                <Grid.Column>
                    <Segment.Group>
                        <Segment textAlign='center' color='green' inverted>
                            收入分類
                        </Segment>
                        <Segment>
                            <ResponsiveContainer width="100%" aspect={1}>
                                <PieChart>
                                    <Pie dataKey='value' data={income} outerRadius={140} fill="#8884d8" label>
                                        <LabelList dataKey="name" position="inside" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>    
                        </Segment>
                    </Segment.Group>
                </Grid.Column>
                <Grid.Column>
                    <Segment.Group>
                        <Segment textAlign='center' color='red' inverted>
                            支出分類
                        </Segment>
                        <Segment>
                            <ResponsiveContainer width="100%" aspect={1}>
                                <PieChart>
                                    <Pie dataKey='value' data={outcome} outerRadius={140} fill="#a5673f" label>
                                        <LabelList dataKey="name" position="inside"/>
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>  
                        </Segment>
                    </Segment.Group>
                </Grid.Column>
            </Grid>

            <Card.Group itemsPerRow={2}>
                <Card fluid>
                    <Card.Content>
                        <Card.Header textAlign='center'>
                            近期最大收入
                        </Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <Card.Description textAlign='center'>
                            <Statistic color='green'>
                                <Statistic.Value>NT$ { this.state.max_income.price }</Statistic.Value>
                                <Statistic.Label>
                                    {
                                        Object.values(this.state.income_categorys).map(data => {
                                            return ' | ' + data
                                        })
                                    }
                                    {
                                        ' |'
                                    }
                                   
                                </Statistic.Label>
                            </Statistic>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Grid columns='equal'>
                            <Grid.Column textAlign='left'>
                                <Icon name='user' size='large' />
                                由Corn登入
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                2016 年 12 月 2 日
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                    <Button attached='bottom'>
                        檢視該筆收入
                        <Icon name="chevron right" />
                    </Button>
                </Card>

                <Card fluid>
                    <Card.Content>
                        <Card.Header textAlign='center'>
                            近期最大支出
                        </Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <Card.Description textAlign='center'>
                            <Statistic color='red'>
                                <Statistic.Value>NT$ {this.state.max_expense.price }</Statistic.Value>
                                <Statistic.Label>
                                    {
                                        Object.values(this.state.expense_categorys).map(data => {
                                            return ' | ' + data
                                        })
                                    }
                                    {
                                        ' |'
                                    }
                                </Statistic.Label>
                            </Statistic>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Grid columns='equal'>
                            <Grid.Column textAlign='left'>
                                <Icon name='user' size='large' />
                                由Corn登入
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                2016 年 12 月 26 日
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                    <Button attached='bottom'>
                        檢視該筆支出
                        <Icon name="chevron right" />
                    </Button>
                </Card>
                
                <Card fluid>
                    <Card.Content>
                        <Card.Header textAlign='center'>
                            <Statistic color='teal' size='mini'>
                                <Statistic.Value>
                                    近期收入以及支出
                                </Statistic.Value>
                            </Statistic>
                        </Card.Header>
                        <br/>
                        <br/>
                        <Card.Description>
                           <Item.Group>
                                <Item>
                                    <Item.Content>
                                        <Item.Header as='a'>NT$ {this.state.current_usage1.price}</Item.Header>
                                        <Item.Meta>
                                            {   
                                                this.state.usage1_categorys.map(category => {
                                                    return ' | ' + category
                                                })
                                            }
                                            { ' |' }
                                        </Item.Meta>
                                        <Item.Description>
                                            {this.state.current_usage1.remark}
                                        </Item.Description>
                                        <Item.Extra>
                                            {
                                                this.state.current_usage1.income ? "檢視該筆收入" : "檢視該筆支出"
                                            }
                                            <Icon name="chevron right" />
                                        </Item.Extra>
                                    </Item.Content>
                                </Item>

                                <Item>
                                    <Item.Content>
                                        <Item.Header as='a'>NT$ {this.state.current_usage2.price}</Item.Header>
                                        <Item.Meta>
                                            {   
                                                this.state.usage2_categorys.map(category => {
                                                    return ' | ' + category
                                                })
                                            }
                                            { ' |' }
                                        </Item.Meta>
                                        <Item.Description>
                                            {this.state.current_usage2.remark}
                                        </Item.Description>
                                        <Item.Extra>
                                            {
                                                this.state.current_usage2.income ? "檢視該筆收入" : "檢視該筆支出"
                                            }
                                            <Icon name="chevron right" />
                                        </Item.Extra>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Card.Description>
                    </Card.Content>
                </Card>

                <Card fluid>
                    <Card.Content>
                        <Card.Header textAlign='center'>
                            <Statistic color='teal' size='mini'>
                                <Statistic.Value>
                                    月結餘統計
                                </Statistic.Value>
                            </Statistic>
                        </Card.Header>
                        
                        <Card.Description>
                            <ResponsiveContainer width="100%" aspect={2}>
                                <LineChart data={this.state.data} margin={{top: 60, right: 20}}>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{r: 4}}/>
                                    <Line type="monotone" dataKey="outcome" stroke="#82ca9d" activeDot={{r: 4}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Card.Group>
        </Container>
    );
  }
}

export default OverView;