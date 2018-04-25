import * as React from 'react';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from 'interfaces';
import { CSSModules, Hot } from 'decorators'
import { classes, style, types } from 'typestyle';

const log = require('debug')('components:log')

export interface IconProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: types.CSSProperties
    /** Optional className */
    className?: string;

    name: FontAwesomeIcon

}

@Hot(module)
@observer
export class Icon extends React.Component<IconProps> {
    static identifier: string               = 'fas ';
    static prefix: string                   = 'fa-';
    static defaultProps: Partial<IconProps> = {
        style: {
            fontSize: '18px'
        }
    }

    render() {
        let { className, name } = this.props
        let fname               = Icon.identifier + Icon.prefix + name

        return (
            <i className={classes(fname, style(this.props.style), this.props.className)}/>
        )
    }
}
