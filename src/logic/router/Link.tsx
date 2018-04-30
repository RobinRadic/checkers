import {BaseLink} from './BaseLink';
import {withRoute} from './withRoute';

@withRoute()
export class Link extends BaseLink {
    static displayName = 'Link'
}

