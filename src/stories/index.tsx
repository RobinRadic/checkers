import 'reflect-metadata';
import * as React from 'react';
import * as storybook from '@storybook/react';
import { setDefaults as setInfoDefaults } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

declare module '@storybook/addon-knobs' {
    export const selectV2: any
}
setInfoDefaults({
    inline: true,
    header: false,
    source: true,
    styles: {

        button        : {
            base    : {
                fontFamily: 'sans-serif',
                fontSize  : '12px',
                display   : 'block',
                position  : 'fixed',
                border    : 'none',
                background: '#28c',
                color     : '#fff',
                padding   : '5px 15px',
                cursor    : 'pointer'
            },
            topRight: {
                top         : 0,
                right       : 0,
                borderRadius: '0 0 0 5px'
            }
        },
        info          : {
            position  : 'fixed',
            background: 'white',
            // top: 0,
            bottom    : 0,
            left      : 0,
            right     : 0,
            padding   : '40px 0px',
            overflow  : 'auto',
            zIndex    : 99999
        },
        children      : {
            position: 'relative',
            zIndex  : 0
        },
        infoBody      : {
            // ...baseFonts,
            fontWeight     : 300,
            lineHeight     : 1.45,
            fontSize       : '15px',
            border         : '1px solid #eee',
            padding        : '20px 40px 40px',
            borderRadius   : '2px',
            backgroundColor: '#fff',
            // marginTop      : '300px',
            position       : 'absolute',
            left           : 0,
            right          : 0,
            bottom         : 0,
            height         : '20%',
            marginBottom   : '20px'
        },
        infoContent   : {
            marginBottom: 0
        },
        infoStory     : {},
        jsxInfoContent: {
            borderTop: '1px solid #eee',
            margin   : '20px 0 0 0'
        },
        header        : {
            h1  : {
                margin  : 0,
                padding : 0,
                fontSize: '15px'
            },
            h2  : {
                margin    : '0 0 10px 0',
                padding   : 0,
                fontWeight: 400,
                fontSize  : '12px'
            },
            body: {
                borderBottom: '1px solid #eee',
                paddingTop  : 10,
                marginBottom: 10
            },

            blockquote: {
                background: 'rgba(0,0,0,0.6)',
                padding   : '10px',
                borderLeft: '3px solid grey'
            }
        },
        source        : {
            h1: {
                margin      : '20px 0 0 0',
                padding     : '0 0 5px 0',
                fontSize    : '15px',
                borderBottom: '1px solid #EEE'
            }
        },
        propTableHead : {
            margin: '20px 0 0 0'
        }
    }
})
storybook.addDecorator(withKnobs)



import '../styles/stylesheet.scss';

import './foundation'
import './menu'
