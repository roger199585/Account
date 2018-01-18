import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Image} from 'semantic-ui-react'

import UserLogo from '../images/userLogo.png'

class Headmenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            detail: false,
        }

        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(event, data) {
        if (data.value === 1) {
            localStorage.clear()
            window.location.reload()
        }
        if (data.value === 0) {
            this.setState({
                detail: true,
            })
        }
    }

    render() {
        const trigger = (
            <span>
                <Image src={UserLogo} circular bordered size='mini'/>
                User
            </span>
        )

        const options = [
            {key: 'profile', text: '個人資料', value: 0},
            {key: 'sign-out', text: '登出', value: 1},
        ]

        return (
            <Menu>
                <Menu.Item name='記帳系統' color='green' header />
                <Menu.Item>
                    <Link to='/overview' style={{ color: 'black'}}>概要</Link>
                </Menu.Item>

                <Menu.Item>
                    <Link to='/update' style={{ color: 'black'}} >新增與紀錄</Link>
                </Menu.Item>
                
                <Menu.Item name='統計報表' />

                <Menu.Menu position='right'>
                    {/*
                    <Menu.Item>
                        <Icon size='big' color='green' name='plus'/>
                    </Menu.Item>
                    */}
                    {
                        this.state.detail && (
                            <Redirect to={'/detail'}/>
                          )
                    }
                    <Menu.Item>
                        <Dropdown trigger={trigger} options={options} onChange={this.handleChange}/>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default Headmenu;