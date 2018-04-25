import * as React from 'react';
import { observer } from 'mobx-react';
import { inject, Symbols } from 'ioc';
import { LayoutStoreSide, RootStore } from 'stores';
import { observe } from 'mobx';
import { Layout } from 'antd';
import { CSSProperties } from 'typestyle/lib/types';
import { DynamicMenu, DynamicMenuProps } from '@/DynamicMenu';
import { classes, style } from 'typestyle'
import { Hot } from 'decorators';

const { Sider } = Layout

const log = require('debug')('components:side')

interface Props extends Pick<DynamicMenuProps, 'itemRenderType'> {
    theme?: 'light' | 'dark'
    side: 'left' | 'right'
    sideBorder?: boolean
    onCollapse?: (collapsed: boolean) => void

    // store: LayoutStoreSide
}

interface State {}

@Hot(module)
@observer
export class GlobalSide extends React.Component<Props, State> {
    static displayName = 'GlobalSide';
    @inject(Symbols.RootStore) store: RootStore

    get side(): LayoutStoreSide { return this.store.layout[ this.props.side ] }

    componentDidMount(): void {
        observe(this.side, 'collapsed', (change) => {
            let onCollapse = this.props.onCollapse
            if ( onCollapse ) {
                onCollapse(change.newValue);
            }
        })
    }

    render() {
        const { side } = this
        if ( ! side || ! side.show ) {
            return null
        }
        let { theme, sideBorder, itemRenderType } = this.props
        let styles: Partial<CSSProperties>        = { ...side.style }
        if ( side.static ) {
            // style.position = 'fixed';
            // {classes(this.layout.header.classes, classNames.header)}
        }
        log('render', { side })

        let sideStyle          = style(styles)
        let collapsedIconStyle = style(side.collapsed ? {
            $nest: {
                [ `ul.ant-menu > li.ant-menu-item > i.fa` ]                                    : { margin: '0 20px 0 0' },
                [ `ul.ant-menu > li.ant-menu-submenu > .ant-menu-submenu-title > span > i.fa` ]: { margin: '0 20px 0 0' }
            }
        } : {})

        return (
            <Sider
                trigger={null}
                width={side.width}
                className={classes(side.classes, collapsedIconStyle)}
                collapsible={side.collapsible}
                collapsedWidth={side.collapsedWidth}
                collapsed={side.collapsed}
                breakpoint={side.breakpoint}
            >
                <DynamicMenu
                    menu={{
                        theme          : theme || 'light',
                        mode           : side.collapsed ? 'vertical' : 'inline',
                        inlineCollapsed: side.collapsed
                    }}
                    items={side.menu}
                    border={sideBorder ? (this.props.side === 'left' ? 'right' : 'left') : 'none'}
                    itemRenderType={itemRenderType}
                    expandBehaviour="single-root"
                    selectBehaviour="single"
                    name={'side:' + this.props.side}
                    collapsed={side.collapsed}
                />
            </Sider>
        )
    }

}
