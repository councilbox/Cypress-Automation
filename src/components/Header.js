import React from "react";
import logo from "../assets/img/logo.png";
import icono from "../assets/img/logo-icono.png";
import { Link } from "react-router-dom";
import LanguageSelector from "./menus/LanguageSelector";
import UserMenu from "./menus/UserMenu";
import CommandLine from './dashboard/CommandLine';
import { Icon } from "../displayComponents";
import { bHistory } from "../containers/App";
import withWindowSize from "../HOCs/withWindowSize";
import { getSecondary } from "../styles/colors";
import Tooltip from "material-ui/Tooltip";
import Paper from 'material-ui/Paper';
import { isLandscape } from '../utils/screen';
import { CLIENT_VERSION, variant } from "../config";
import { getCustomLogo, getCustomIcon } from "../utils/subdomain";

const Header = ({ actions, backButton, windowSize, languageSelector, drawerIcon, translate, ...props }) => {
	const goBack = () => {
		bHistory.goBack();
	};

	const showVerticalLayout = () => {
		return windowSize === 'xs' && !isLandscape();
	}

	const secondary = getSecondary();
	const language = translate && translate.selectedLanguage;
	const customIcon = getCustomIcon();
	const customLogo = getCustomLogo();

	return (
		<Paper
			elevation={0}
			style={{
				height: "3em",
				zIndex: 1000,
				display: "flex",
				flexDirection: "row",
				borderBottom: '1px solid gainsboro',
				width: "100%",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: "white"
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					height: "100%",
					alignItems: "center"
				}}
			>
				{backButton && (
					<Tooltip
						title={translate.back}
						placement="bottom"
					>
						<div
							style={{
								cursor: "pointer",
								width: "2em",
								height: "60%",
								borderRight: "1px solid darkgrey",
								display: "flex",
								alignItems: "center"
							}}
							id="back-button"
							onClick={goBack}
						>
							<Icon
								className="material-icons"
								style={{ color: secondary }}
							>
								keyboard_arrow_left
							</Icon>
						</div>
					</Tooltip>
				)}
				<Link to="/">
					<div>
						<img
							src={!showVerticalLayout() ? customLogo? customLogo : logo : customIcon? customIcon : icono}
							className="App-logo"
							style={{
								height: "1.5em",
								marginLeft: "1em",
								// marginLeft: "2em",
								userSelect: 'none'
							}}
							alt="logo"
						/>
					</div>
				</Link>
			</div>

			{props.commandLine && false &&
				<CommandLine />
			}

			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center"
				}}
			>
				{languageSelector &&
					<span style={{fontSize: '0.85em'}}>
						{`v${CLIENT_VERSION}`}
					</span>
				}
				{languageSelector && (
					<LanguageSelector selectedLanguage={language} />
				)}
				{props.user && (
					<UserMenu
						user={props.user}
						translate={translate}
						company={props.company}
					/>
				)}
				{drawerIcon && "DRAWER"}
			</div>
		</Paper>
	);
}


export default withWindowSize(Header);
