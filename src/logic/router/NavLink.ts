import withLink from './withLink';
import BaseLink from './BaseLink';

@withLink()
class NavLink extends BaseLink {
    static displayName = 'NavLink'
}

export default NavLink;
