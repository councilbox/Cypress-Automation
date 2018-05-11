import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { getPrimary, getSecondary } from '../styles/colors';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import moment from 'moment';
import 'moment/locale/es';
moment.updateLocale('es');

const primary = getPrimary();
const secondary = getSecondary();
const theme = createMuiTheme({
    palette: {
        primary: {
            main: primary,
        },
        secondary: {
            main: secondary
        }
    },

    overrides: {
        MuiTable: {
            root: {
                maxWidth: '90%',
            }
        },
        MuiTableRow: {
            root: {
                width: '50%'
            }
        },
        MuiInputLabel: {
            root: {
                color: secondary
            }
        },
        MuiInput: {
            underline: {
                '&:hover:not($disabled):before': { //underline color when hovered 
                    backgroundColor: secondary,
              },
                '&:after': {
                     backgroundColor: secondary
                }
            }
        },

        MuiStepper: {
            root: {
                backgroundColor: 'transparent'
            }
        }
    }

});

export default ({ children }) => (
    <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={moment}
            locale="es"
        >
            {children}
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>
);

