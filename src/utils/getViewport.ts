
/**
 * Get the current viewport
 * @returns {{width: *, height: *}}
 */
export function getViewPort() {
    let e: any = window,
        a: any = 'inner';
    if ( ! ('innerWidth' in window) ) {
        a = 'client';
        e = document.documentElement || document.body;
    }

    return {
        width : e[ a + 'Width' ],
        height: e[ a + 'Height' ]
    };
}
