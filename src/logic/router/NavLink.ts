import {withLink} from './withLink';
import {BaseLink} from './BaseLink';

@withLink()
export class NavLink extends BaseLink {
    static displayName = 'NavLink'
}
