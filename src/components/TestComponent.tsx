import React, { Component } from 'react';
import { TestDecorator } from '../decorators';

const log = require('debug')('component:TestComponent')

interface ExtendProps {

}
interface Props {
    name: string
}

@TestDecorator<Props>()
export class TestComponent extends Component<Props> {
    render() {
        const { name } = this.props
        return (
            <span>{name}</span>
        );
    }
}


export class TestComponent2 extends TestComponent {
    render() {
        const { name } = this.props
        return (
            <span>2 {name}</span>
        );
    }
}





@TestDecorator<Props>()
export class TestComponent3 extends TestComponent {
    render() {
        const { name } = this.props
        return (
            <span>2 {name}</span>
        );
    }
}


