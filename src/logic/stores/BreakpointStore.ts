import { action, observable } from 'mobx';
import { breakpoints } from 'utils/breakpoints';
import { getViewPort } from 'utils/getViewport';
import { Breakpoint, BreakpointDictionary } from 'interfaces';
import { injectable } from 'inversify';

const breakpointDefaults = (): BreakpointDictionary<boolean> => ({
    md : false,
    lg : false,
    sm : false,
    xl : false,
    xs : false,
    xxl: false
})

@injectable()
export class BreakpointStore implements BreakpointDictionary<boolean> {
    @observable xs: boolean                              = false;
    @observable sm: boolean                              = false;
    @observable md: boolean                              = false;
    @observable lg: boolean                              = false;
    @observable xl: boolean                              = false;
    @observable xxl: boolean                             = false;
    @observable.deep up: BreakpointDictionary<boolean>   = breakpointDefaults()
    @observable.deep down: BreakpointDictionary<boolean> = breakpointDefaults()
    @observable width: number;

    get keys(): Breakpoint[] {return Object.keys(breakpoints) as any }

    get values(): BreakpointDictionary<number> { return breakpoints }

    listener: any = null

    constructor() {
        this.update();
        this.setAutoUpdate(true);
    }

    @action update() {
        const { height, width } = getViewPort();
        this.width              = width;

        this.keys.forEach(bp => {
            let breakpoint  = breakpoints[ bp ]
            this[ bp ]      = width > breakpoint
            this.up[ bp ]   = width > breakpoint
            this.down[ bp ] = width <= breakpoint
        })
    }

    setAutoUpdate(autoUpdate: boolean) {
        if (
            // already auto updating
        (autoUpdate === true && this.listener !== null) ||
        // already not auto updating
        (autoUpdate === false && this.listener === null)
        ) {
            return;
        }
        if ( autoUpdate === true ) {
            this.listener = () => {
                this.update();
            }
            window.addEventListener('resize', this.listener);
            return;
        }
        window.removeEventListener('resize', this.listener);
    }
}