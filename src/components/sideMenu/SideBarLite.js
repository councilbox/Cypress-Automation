import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import cx from "classnames";
import {
	Drawer,
	Hidden,
	List,
	Icon,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	withStyles,
	Tooltip
} from "material-ui";
import sidebarStyleLite from "../../styles/sidebarStyleLite";
import withWindowSize from '../../HOCs/withWindowSize';
import { getPrimary, darkGrey } from "../../styles/colors";
import { bHistory, store } from "../../containers/App";
import { changeCompany } from "../../actions/companyActions";
import CompanyMenu from "../sideMenu/CompanyMenu";
import FontAwesome from "react-fontawesome";

class Sidebar extends React.Component {

	state = {
		selectedRoute: 0,
		companyMenu: false
	};

	routes = [
		{
			path: `/company/${this.props.company.id}`,
			sidebarName: 'Dashboard',
			icon: 'dashboard'
		},
		{
			path: `/company/${this.props.company.id}/councils/drafts`,
			name: "council",
			sidebarName: 'Reuniones',
			icon: 'import_contacts'
		},
		{
			path: `/company/${this.props.company.id}/meeting/new`,
			name: "meeting",
			sidebarName: 'Conferencias',
			icon: 'video_call'
		},
		{
			path: `/company/${this.props.company.id}/signatures/drafts`,
			name: "signature",
			sidebarName: 'Firmas',
			icon: 'border_color'
		}
	];

	componentDidMount() {
		const index = this.findActiveRoute(this.props.location.pathname);
		this.setState({
			selectedRoute: index
		});
	}


	componentDidUpdate(prevProps){
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.setState({
				location: this.props.location.pathname,
				companyMenu: false,
				selectedRoute: this.findActiveRoute(this.props.location.pathname)
			});
		}
	}

	findActiveRoute = (pathname, routes) => {
		let routeIndex = 0;
		this.routes.forEach((route, index) => {
			if (pathname.includes(route.name)) {
				routeIndex = index;
			}
		});
		return routeIndex;
	};

	links = () => (
		<div className={this.props.classes.list} 
			style={{
				display: 'flex',
				flexDirection: this.props.windowSize === 'xs'? 'row' : 'column'
			}}
		>
			<div
				className={this.props.classes.logoLink}
				style={{
					display: "flex",
					flexDirection: "row",
					width: this.props.windowSize === 'xs'? '2em' : '100%',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '0.5em'
					}}
				>
					<Tooltip title={this.props.company.businessName} placement="top-end">
					{!!this.props.company.logo ? (
						<img
							src={this.props.company.logo}
							alt="logo"
							className={this.props.classes.img}
						/>
					) : (
						<FontAwesome
							name={"building-o"}
						/>
					)}
					</Tooltip>
				</div>
			</div>
			{this.routes.map((route, key) => {
				if (route.redirect) {
					return null;
				}
				const listItemClasses = cx({
					[" " +
					this.props.classes[this.props.color]]: this.activeRoute(key)
				});
				const whiteFontClasses = cx({
					[" " + this.props.classes.whiteFont]: this.activeRoute(key)
				});
				return (
					<NavLink
						to={route.path}
						className={this.props.classes.item}
						activeClassName="active"
						key={key}
						style={{
							":hover": {
								textDecoration: "none",
								color: "red"
							}
						}}
						onClick={() => this.setState({ selectedRoute: key })}
					>
						<ListItem
							button
							className={
								this.props.classes.itemLink + listItemClasses
							}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<div
								style={{
									width: "24px",
									height: "30px",
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: "rgba(255, 255, 255, 0.8)"
								}}
							>
								<Icon>
									{route.icon}
								</Icon>
							</div>
							<span
								style={{
									color: 'white',
									fontSize: '0.5em'
								}}
							>
								{route.sidebarName}
							</span>
						</ListItem>
					</NavLink>
				);
			})}
		</div>
	);

	brand = () => (
		<div
			style={{
				width: this.props.windowSize === 'xs'? '3em' : '100%',
				height: '45px',
				display: 'flex',
				marginTop: '15px',
				alignItems: 'center',
				justifyContent: 'center'
			}}
			onClick={() => this.setState({
				companyMenu: !this.state.companyMenu
			})}
		>
			<div className={this.props.classes.logo}>
				<Icon
					style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.8em'}}
				>
					apps
				</Icon>
			</div>
		</div>
	);

	activeRoute(index) {
		return index === this.state.selectedRoute;
	}

	render() {
		const { classes, image } = this.props;
		return (
			<div style={{float: 'left', zIndex: '0'}}>
				<div style={
					{backgroundColor: darkGrey,
					height: '100vh',
					zIndex: '1000',
					position: 'absolute',
					display: 'flex',
					...(this.props.windowSize === 'xs'? 
						{
							flexDirection: 'row',
							bottom: 0,
							left: 0,
							width: '100%',
							alignItems: 'center',
							height: '3.5em'
						}
					:
						{
							flexDirection:  'column',
							top: 0,
					 		left: 0,
							width: '5em',
						}
					),
					alignItems: 'center',
				}}>
					{this.brand()}
					<div className={classes.sidebarWrapper}>
						{this.links()}
					</div>
				</div>
				<CompanyMenu
					open={this.state.companyMenu}
					company={this.props.company}
					companies={this.props.companies}
					translate={this.props.translate}
				/>
			</div>
		);
	}
}


export default withStyles(sidebarStyleLite)(withRouter(withWindowSize(Sidebar)));