import React, { Component } from 'react';
import { Icon, Segment, Header} from 'semantic-ui-react'

class Title extends Component {

  render() {
    return (
        <Segment textAlign='left' raised>
            <Header as='h2' color='teal'>
                <Icon name='settings' color='teal' size='large' />
                <Header.Content>
                    {this.props.title}
                </Header.Content>
            </Header>
        </Segment>
    )
  }
}



export default Title;