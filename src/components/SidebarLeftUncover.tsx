import React, { Component } from 'react'
import Sidebar from 'semantic-ui-react/dist/es/modules/Sidebar'
import 'semantic-ui-less/definitions/modules/sidebar.less'

import Menu from 'semantic-ui-react/dist/es/collections/Menu'
import 'semantic-ui-less/definitions/collections/menu.less'

import Icon from 'semantic-ui-react/dist/es/elements/Icon'
import 'semantic-ui-less/definitions/elements/icon.less'


class SidebarLeftUncover extends Component {
    state = { visible: false }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    render() {
        const { visible } = this.state
        return (
            <div>
                <button onClick={this.toggleVisibility}>Toggle Visibility</button>
                <Sidebar.Pushable as={'div'}>
                    <Sidebar as={Menu} animation='uncover' width='thin' visible={visible} icon='labeled' vertical inverted>
                        <Menu.Item name='home'>
                            <Icon name='home' />
                            Home
                        </Menu.Item>
                        <Menu.Item name='gamepad'>
                            <Icon name='gamepad' />
                            Games
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <div>
                            pusher over this
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

export default SidebarLeftUncover