import BaseLink from './BaseLink';
import withRoute from './withRoute';

@withRoute()
class Link extends BaseLink {
    static displayName = 'Link'
}

export default Link;


