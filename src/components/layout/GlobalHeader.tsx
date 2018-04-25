import * as React from 'react';
import { Fragment } from 'react';
import { Icon, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import styles from './layout.module.styl'
import { CSSModules, Hot } from 'decorators';
import { classes } from 'typestyle';

export interface GlobalHeaderProps extends CSSModules.InjectedCSSModuleProps {
    compactMenu?: boolean
    developMenu?: boolean
    title?: string
    showRightToggle?: boolean
    rightToggled?: boolean
    showLeftToggle?: boolean
    leftToggled?: boolean
    onLeftToggleClick?: (toggled: boolean) => void
    onRightToggleClick?: (toggled: boolean) => void
}

interface State {}

const log = require('debug')('globalheader')


@Hot(module)
@CSSModules(styles)
@observer
export class GlobalHeader extends React.Component<GlobalHeaderProps & CSSModules.InjectedCSSModuleProps, State> {
    static displayName = 'GlobalHeader';

    toggleSide = (side: 'left' | 'right') => () => {
        if ( side === 'left' && this.props.onLeftToggleClick ) {
            this.props.onLeftToggleClick(this.props.leftToggled)
        } else if ( this.props.onRightToggleClick ) {
            this.props.onRightToggleClick(this.props.rightToggled)
        }
    }

    render() {


        log({styles})
        debugger
        const {
                  showLeftToggle, showRightToggle, leftToggled, rightToggled,
                  title
              }           = this.props
        let toggleTooltip = {
            left : `Click to ${leftToggled ? 'open' : 'close'} the left menu`,
            right: `Click to ${rightToggled ? 'open' : 'close'} the right menu`
        }
        return (
            <Fragment>
                {/* RIGHT ICON */}
                {showRightToggle ? <Tooltip placement="left" title={toggleTooltip.right}><Icon
                    className={classes(this.props.styles.sideMenuToggleRight)}
                    type={rightToggled ? 'menu-fold' : 'menu-unfold'}
                    onClick={this.toggleSide('right')}
                /></Tooltip> : null}
                {/* LEFT ICON */}
                {showLeftToggle ? <Tooltip placement="right" title={toggleTooltip.left}><Icon
                    className={classes(this.props.styles.sideMenuToggleLeft)}
                    type={leftToggled ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleSide('left')}
                /></Tooltip> : null}
                {/* TITLE */}
                {title ? <div styleName="title">{title}</div> : null}
                {this.props.children}
            </Fragment>
        )
    }
}

