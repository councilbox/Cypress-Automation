// ##############################
// // // Sidebar styles
// #############################

import {
	boxShadow,
	dangerColor,
	defaultFont,
	drawerWidth,
	primaryBoxShadow,
	primaryColor,
	successColor,
	transition,
	warningColor
} from './styles';

import { isLandscape } from '../utils/screen';
import { getSecondary } from './colors';
import { variant } from '../config';

const sidebarStyle = theme => ({
	drawerPaper: {
		border: 'none',
		position: 'fixed',
		top: '0',
		bottom: '0',
		left: '0',
		zIndex: '1000',
		overflow: 'hidden',
		...boxShadow,
		width: drawerWidth,
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			position: 'fixed',
			height: '100%'
		},
		[theme.breakpoints.down('sm')]: {
			width: drawerWidth,
			...boxShadow,
			position: 'fixed',
			display: 'block',
			top: '0',
			height: '100vh',
			right: '0',
			left: 'auto',
			zIndex: '1032',
			visibility: 'visible',
			overflowY: 'visible',
			borderTop: 'none',
			textAlign: 'left',
			paddingRight: '0px',
			paddingLeft: '0',
			transform: `translate3d(${drawerWidth}px, 0, 0)`,
			...transition
		}
	},
	logo: {
		position: 'relative',
		padding: '10px 10px',
		zIndex: '1000',
		'&:after': {
			content: '""',
			position: 'absolute',
			bottom: '0',

			height: '1px',
			right: '15px',
			width: 'calc(100% - 20px)',
			backgroundColor: 'rgba(180, 180, 180, 0.3)'
		}
	},
	logoLink: {
		...defaultFont,
		textTransform: 'uppercase',
		textDecoration: 'none',
		backgroundColor: 'transparent',
		'&,&:hover': {
			color: '#FFFFFF'
		}
	},
	logoImage: {
		width: '30px',
		maxHeight: '30px'
	},
	img: {
		width: '35px',
		top: '22px',
		verticalAlign: 'middle',
		border: '0'
	},
	background: {
		position: 'absolute',
		zIndex: '1000',
		height: '100%',
		width: '100%',
		display: 'block',
		top: '0',
		left: '0',
		backgroundSize: 'cover',
		backgroundPosition: 'center center',
		'&:after': {
			position: 'absolute',
			zIndex: '1000',
			width: '100%',
			height: '100%',
			content: '""',
			display: 'block',
			background: '#000',
			opacity: '.8'
		}
	},
	list: {
		marginTop: '10px',
		paddingLeft: '0',
		paddingTop: '0',
		paddingBottom: '0',
		marginBottom: '0',
		listStyle: 'none'
	},
	item: {
		position: 'relative',
		display: 'block',
		textDecoration: 'none'
	},
	itemLink: {
		width: '100%',
		transition: 'all 300ms linear',
		margin: '7px 7px 0',
		borderRadius: '3px',
		position: 'relative',
		display: 'block',
		padding: '10px 6px',
		backgroundColor: 'transparent',
		...defaultFont
	},
	itemIcon: {
		width: '24px',
		height: '30px',
		float: 'left',
		marginRight: '15px',
		textAlign: 'center',
		verticalAlign: 'middle',
		color: 'rgba(255, 255, 255, 0.8)'
	},
	itemText: {
		...defaultFont,
		margin: '0',
		lineHeight: '30px',
		fontSize: '14px',
		color: '#FFFFFF'
	},
	whiteFont: {
		color: '#FFFFFF'
	},
	purple: {
		backgroundColor: primaryColor,
		...primaryBoxShadow,
		'&:hover': {
			backgroundColor: primaryColor,
			...primaryBoxShadow
		}
	},

	blue: {
		backgroundColor: variant === 'CUSTOM' ? getSecondary() : '#00acc1',
		boxShadow:
'0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2)',
		'&:hover': {
			backgroundColor: variant === 'CUSTOM' ? getSecondary() : '#00acc1',
			boxShadow:
'0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2)'
		}
	},
	green: {
		backgroundColor: successColor,
		boxShadow:
'0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2)',
		'&:hover': {
			backgroundColor: successColor,
			boxShadow:
'0 12px 20px -10px rgba(76,175,80,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(76,175,80,.2)'
		}
	},
	orange: {
		backgroundColor: warningColor,
		boxShadow:
'0 12px 20px -10px rgba(255,152,0,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(255,152,0,.2)',
		'&:hover': {
			backgroundColor: warningColor,
			boxShadow:
'0 12px 20px -10px rgba(255,152,0,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(255,152,0,.2)'
		}
	},
	red: {
		backgroundColor: dangerColor,
		boxShadow:
'0 12px 20px -10px rgba(244,67,54,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(244,67,54,.2)',
		'&:hover': {
			backgroundColor: dangerColor,
			boxShadow:
'0 12px 20px -10px rgba(244,67,54,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(244,67,54,.2)'
		}
	},
	sidebarWrapper: {
		position: 'relative',
		...(isLandscape() ? {
			[theme.breakpoints.down('sm')]: {
				height: '3.5em',
				display: 'flex',
				width: '100%',
				flexDirection: 'row',
				alignItems: 'center'
			},
		} : {}),
		height: 'calc(100vh - 75px)',
		overflow: 'auto',
		width: '5em',
		zIndex: '1000',
		overflowScrolling: 'touch'
	}
});

export default sidebarStyle;
