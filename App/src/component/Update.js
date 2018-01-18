import React, { Component } from 'react';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { Container, Segment, Button, Icon, Grid, Table } from 'semantic-ui-react'
import Headmenu from './Headmenu.js'
import Title from './Title.js'

class Update extends Component {
    constructor(props, token) {
        super(props)
        
        this.state = {
            datas: [],
        }

        fetch('http://localhost:8080/info?limit=5', {
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
            }
            else {
                this.setState({
                    datas: responseData.data,
                })
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
                <Title title='新增與紀錄' />
                
                <Segment.Group>
                    <Segment size='big' color='teal' inverted>
                        <Grid columns={3}>
                            <Grid.Column> </Grid.Column>
                            <Grid.Column verticalAlign='middle' textAlign='center'>
                                近十日金額紀錄 
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                                <Link to='/update/record'>
                                    <Button color='blue' animated='fade' circular>
                                        <Button.Content visible>
                                            新紀錄
                                        </Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='plus' />
                                        </Button.Content>
                                    </Button>
                                </Link>
                            </Grid.Column>
                        </Grid>
                    </Segment>

                    <Segment>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>日期</Table.HeaderCell>
                                    <Table.HeaderCell>收入</Table.HeaderCell>
                                    <Table.HeaderCell>收入類別</Table.HeaderCell>
                                    <Table.HeaderCell>支出</Table.HeaderCell>
                                    <Table.HeaderCell>支出類別</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.state.datas.map(datas => {
                                        return (
                                            datas.income ?
                                            <Table.Row key={datas.date}>
                                                <Table.Cell key='date'>{datas.date}</Table.Cell>
                                                <Table.Cell key='price'>{datas.price}</Table.Cell>
                                                <Table.Cell key='category'>
                                                {
                                                    datas.categorys.map(category => {
                                                        return category + "、"
                                                    })
                                                }
                                                </Table.Cell>
                                                <Table.Cell key='aaa'>0</Table.Cell>
                                                <Table.Cell key='bbb'>nil</Table.Cell>
                                            </Table.Row>
                                            :
                                            <Table.Row key={datas.date}>
                                                <Table.Cell key='date'>{datas.date}</Table.Cell>
                                                <Table.Cell key='price'>0</Table.Cell>
                                                <Table.Cell key='category'>nil</Table.Cell>
                                                <Table.Cell key='aaa'>{datas.price}</Table.Cell>
                                                <Table.Cell key='bbb'>
                                                {
                                                    datas.categorys.map(category => {
                                                        return category + "、"
                                                    })
                                                }
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table>
                    </Segment>
                    <Link to='/update/accounts'>
                        <Button attached='bottom'>
                            更多紀錄
                            <Icon name="chevron right" />
                        </Button>
                    </Link>
                </Segment.Group>
            </Container>
        )
    }
}

export default Update;
