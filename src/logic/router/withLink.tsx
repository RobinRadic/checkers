/**
 * HOC that creates custom wrappers around the BaseLink component
 *
 * The resulting composed element will passed to withRoute so that it will be aware
 * of route changes and apply an `active` className on the LinkWrapper (not on the BaseLink).
 * In practise the final component will be a <Link/> element wrapped with a LinkWrapper
 *
 * @param LinkWrapper - the component to be wrapped. This is supposed to be a DOM element: li, div, ectr
 * @param storeName - the mobx-router5 instance name. Default 'routerStore'
 * @returns {ComponentWithRoute}
 */
import React, { Component } from 'react';
import {BaseLink} from './BaseLink';
import {withRoute} from './withRoute';
import { getDisplayName } from './utils';

export function withLink() {
    return (LinkWrapper) => {
        /***
         * HOC WithLink that wraps the LinkWrapper
         *
         * It receives all the props that LinkWrapper would receive in ComponentWithRoute
         * The only difference is that it only passes the className to the original LinkWrapper
         * All the other props will be passed to the inner BaseLink
         *
         * If a prop linkClassName is passed then it will be applied to the inner BaseLink
         * Note: the `active` class will be applied to the LinkWrapper, not the BaseLink
         */
        @withRoute()
        class WithLink extends Component<any> {
            static displayName = 'WithLink[' + getDisplayName(LinkWrapper) + ']';

            render() {
                const { linkClassName, ...passThroughProps } = this.props;
                return (
                    <LinkWrapper className={this.props.className}>
                        <BaseLink {...passThroughProps as any} className={linkClassName}>
                            {passThroughProps.children}
                        </BaseLink>
                    </LinkWrapper>
                );
            }
        }

        return WithLink as any;
        // Make the final result similar to a Link component (aware of route changes)
        // return withRoute(WithLink, storeName);
    }
}

