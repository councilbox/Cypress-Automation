import React from "react";
import {
	CardHeader,
	Dialog,
	DialogTitle,
	DialogContent,
	Card,
	Collapse
} from "material-ui";
import FontAwesome from "react-fontawesome";
import { Grid, GridItem, Scrollbar } from '../../../displayComponents';
import withTranslations from "../../../HOCs/withTranslations";
import withWindowSize from "../../../HOCs/withWindowSize";
import withWindowOrientation from "../../../HOCs/withWindowOrientation";
import Results from '../Results';
import OverFlowText from "../../../displayComponents/OverFlowText";
import {
	councilIsInTrash,
	councilIsNotLiveYet,
	councilIsNotCelebrated,
	councilIsFinished,
	councilIsLive
} from "../../../utils/CBX";
import {
	getPrimary,
	lightTurquoise,
	getSecondary
} from "../../../styles/colors";
import emptyMeetingTable from "../../../assets/img/empty_meeting_table.png";
import logoIcon from "../../../assets/img/logo-icono.png";
import { moment } from '../../../containers/App';
import TimelineSection from "../timeline/TimelineSection";
import { isMobile } from "react-device-detect";
import ContactModal from "./ContactModal";
import ContactForm from "./ContactForm";

const styles = {
	container: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	splittedContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative"
	},
	textContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: isMobile ? "" : "15px",
		textAlign: "center",
		height: "100%"
	},
	imageContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "15px"
	},
	image: {
		maxWidth: "60%"
	},
	textAndImage: {
		display: "flex",
		alignItems: "center",
		background: "blue"
	},
	displaiFlex: {
		display: "flex"
	},
	bottom1: {
		marginBottom: '1em'
	},
	bottom2: {
		marginBottom: '2em'
	},
};


const CouncilState = ({ translate, council, company, windowSize, windowOrientation, isAssistance, selectHeadFinished, ...props }) => {
	const [modal, setModal] = React.useState(false);
	const [state, setState] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
		expanded: false
	});
	const primary = getPrimary();

	const updateDimensions = () => {
		setState({
			width: window.innerWidth,
			height: window.innerHeight
		});
	}

	const showContactModal = () =>{
		setModal(true);
	}

	const closeContactModal = () => {
		setModal(false);
	}

	React.useEffect(() => {
		window.addEventListener("resize", updateDimensions);

		return () => window.removeEventListener('resize', updateDimensions);
	}, [council.id]);

	return (
		<div
			style={
				(windowSize === "xs" && windowOrientation === "portrait"
					? styles.container
					: styles.splittedContainer)
			}
		>
			<div
				style={{
					...styles.textContainer,
					...(windowSize === "xs" &&
						windowOrientation === "portrait"
						? { maxWidth: "100%", width: "100%" }
						: { maxWidth: "85%", minWidth: "50%" }),
					// : { maxWidth: "50%", minWidth: "50%" }),
				}}
			>
				{councilIsInTrash(council) && (
					// {true && (
					<StateContainer
						widths={state.width}
						heights={state.height}
						windowOrientation={windowOrientation}
					>
						<div style={{ width: "410px" }}>
							<TextRender
								title={translate.we_are_sorry}
								text={translate.not_held_council}
								council={council}
								company={company}
								translate={translate}
							/>
						</div>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
							styles={{ marginLeft: "" }}
						>
						</Image>
					</StateContainer>
				)}

				{isAssistance && councilIsLive(council) && (
					<StateContainer
						widths={state.width}
						heights={state.height}
						windowOrientation={windowOrientation}
					>
						<div>
							<TextRender
								title={translate.we_are_sorry}
								text={translate.room_opened_use_access_link}
								isHtmlText={true}
								council={council}
								company={company}
								translate={translate}
								styles={styles}
								windowOrientation={windowOrientation}
							/>
						</div>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						>
						</Image>
					</StateContainer>
				)}

				{!isAssistance && councilIsNotLiveYet(council) && (
					<StateContainer
						widths={state.width}
						heights={state.height}
						windowOrientation={windowOrientation}
					>
						<div style={{ width: "410px" }}>
							<TextRender
								title={translate.we_are_sorry}
								text={translate.council_not_started_yet_retry_later}
								isHtmlText={true}
								council={council}
								company={company}
								translate={translate}
							/>
						</div>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						>
						</Image>
					</StateContainer>
				)}

				{councilIsNotCelebrated(council) && (
					<StateContainer
						widths={state.width}
						heights={state.height}
						windowOrientation={windowOrientation}
					>
						<div style={{ width: "410px" }}>
							<TextRender
								title={translate.we_are_sorry}
								text={translate.not_held_council}
								council={council}
								company={company}
								translate={translate}
							/>
						</div>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						>
						</Image>
					</StateContainer>
				)}

				{councilIsFinished(council) && (
					<React.Fragment>
						{isMobile ?
							<div style={{ height: "100%", width: "100%", padding: "0.5em", paddingTop: "1.5em", fontSize: "15px", overflow: "hidden" }}>
								<div style={{ width: "100%", background: "white", padding: "0.8em 1em", borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)' }}>
									<div>
										<h3 style={{
											color: primary,
											fontSize: "28px",
											paddingTop: "0.5em"
										}}
										>
											{translate.concil_finished}
										</h3>
									</div>
									<div style={{ display: "flex", justifyContent: "space-between", padding: "0 1em" }}>
										<div>
											<div style={{ display: "flex", marginBottom: "1em", fontWeight: "900" }} >
												{council.name}
											</div>
											<div style={{ display: "flex" }} >
												-
												</div>
										</div>
										<div>
											<Image
												src={emptyMeetingTable}
												styles={{ width: '77px', minWidth: "", marginLeft: "2em" }}
												windowOrientation={windowOrientation}
											>
											</Image>
										</div>
									</div>
								</div>
								<div style={{ marginTop: "1em", background: "white", padding: "0.5em", boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: 'solid 1px #d7d7d7' }}>
									<div>
										{moment(council.dateEnd).format('LLL')}
									</div>
								</div>
								<div style={{ overflow: "hidden", height: "calc( 100% - 15em )", marginTop: "1em", background: "white", padding: "0.5em", boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)', border: 'solid 1px #d7d7d7' }}>
									<div style={{ padding: "1em 1em", height: " 100% ", overflow: "hidden", }}>
										<div style={{ textAlign: "center" }}>{/**TRADUCCION */}
											Mi participacion - <span style={{ color: primary }}>{props.participant.name + " " + props.participant.surname}</span>
										</div>
										<div style={{ marginTop: "1em", height: " 100% ", overflow: "hidden" }}>
											{selectHeadFinished === "participacion" &&
												<Scrollbar>
													<div style={{ height: " 100% ", overflow: "hidden", paddingBottom: "1em" }}>
														<Results
															council={council}
															participant={props.participant}
															translate={translate}
															endPage={true}
														/>
													</div>
												</Scrollbar>
											}
											{selectHeadFinished === "reunion" &&
												<Scrollbar>
													<div style={{ height: " 100% ", overflow: "hidden", paddingBottom: "1em" }}>
														<TimelineSection council={council} translate={translate} endPage={true} />
													</div>
												</Scrollbar>
											}
											{selectHeadFinished === "contactAdmin" &&
												<Scrollbar>
													<div style={{ height: " 100% ", overflow: "hidden", paddingBottom: "1em" }}>
														<ContactForm
															participant={props.participant}
															translate={translate}
															council={council}
														/>
													</div>
												</Scrollbar>
											}
										</div>
									</div>
								</div>
							</div>
							:
							<StateContainer
								widths={state.width}
								heights={state.height}
								windowOrientation={windowOrientation}
							>
								<div style={{ width: "815px", height: "100%" }}>
									<TextRenderFinished
										title={translate.concil_finished}
										council={council}
										company={company}
										translate={translate}
									/>

									<Grid style={{ padding: "0 2em 0 2em", color: "#000000 ", fontSize: "15px", height: "calc( 100% - 5em )" }}>
										<GridItem xs={6} lg={6} md={6} style={{ paddingRight: '10px' }}>
											<Card
												style={{
													borderRadius: '3px',
													boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
													marginBottom: "0.6em",
													padding: "1em",
												}}>
												<div>
													<div style={{ display: "flex", marginBottom: "1em" }} >
														<b>{council.name}</b>
													</div>
													<div style={{ display: "flex" }} >
														-
												</div>
												</div>
											</Card>
											<Card
												style={{
													borderRadius: "0px",
													boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
													marginBottom: "0.6em",
													padding: "0.5em",
													border: 'solid 1px #d7d7d7',
													display: "flex"
												}}>
												{moment(council.dateEnd).format('LLL')}
											</Card>
											<Card
												onClick={showContactModal}
												style={{
													borderRadius: "0px",
													boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
													marginBottom: "0.6em",
													padding: "0.5em",
													cursor: 'pointer',
													border: `solid 1px ${primary}`,
													color: ` ${primary}`,
													display: "flex"
												}}>
												Contactar con el administrador
											</Card>
											<Card
												style={{
													borderRadius: "0px",
													boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
													marginBottom: "0.6em",
													border: 'solid 1px #d7d7d7',
													display: "flex"
												}}>
												<div style={{
													width: "100%",
												}}>
													<div onClick={() => setState({ expanded: !state.expanded })} style={{ padding: "0.5em", justifyContent: "space-between", display: "flex", cursor: "pointer", width: "100%", }}>
														<div>Ver resumen</div>{/**TRADUCCION */}
														<i className="material-icons" style={{ color: 'rgba(10, 10, 10, 0.49)', width: '18px', height: '10px' }}>
															arrow_drop_down
													</i>
													</div>
													<Collapse in={state.expanded} timeout="auto" unmountOnExit>
														<div style={{ height: '220px', marginTop: "1em", }}>
															<Scrollbar>
																<TimelineSection council={council} translate={translate} endPage={true} />
															</Scrollbar>
														</div>
													</Collapse>
												</div>
											</Card>
										</GridItem>
										<GridItem xs={6} lg={6} md={6} style={{ paddingLeft: '10px', height: "100%" }}>
											<Card
												style={{
													borderRadius: "0px",
													boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
													marginBottom: "0.6em",
													padding: "1em",
													border: 'solid 1px #d7d7d7',
													height: "100%"
												}}>
												<div style={{ width: "100%", height: "100%" }}>{/**TRADUCCION */}
													<div style={{ display: "flex" }}>Mi participacion - <span style={{ color: primary }}>{props.participant.name + " " + props.participant.surname}</span></div>
													<div style={{ marginTop: "1em", height: "calc( 100% - 2em )" }}>
														<Scrollbar>
															<div style={{ height: '165px', }}>
																<Results
																	council={council}
																	participant={props.participant}
																	translate={translate}
																	endPage={true}
																/>
															</div>
														</Scrollbar>
													</div>
												</div>
											</Card>
										</GridItem>
									</Grid>
								</div>
							</StateContainer>
						}
					</React.Fragment>
				)}
			</div>
			<ContactModal
				open={modal}
				requestClose={closeContactModal}
				participant={props.participant}
				translate={translate}
				council={council}
			/>
		</div>
	);
}


const TextRenderFinished = ({ title, windowOrientation }) => {
	const primary = getPrimary();

	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<h3
				style={{
					color: primary,
					marginBottom: windowOrientation === "landscape" ? "" : "1em",
					fontSize: "28px",
					paddingTop: "0.5em"
				}}
			>
				{title}
			</h3>

			<Image
				src={emptyMeetingTable}
				styles={{ width: '77px', minWidth: "", marginLeft: "2em" }}
				windowOrientation={windowOrientation}
			>
			</Image>
		</div>
	);
}


const TextRender = ({ title, text, isHtmlText, council, company, translate, windowOrientation }) => {
	const [modal, setModal] = React.useState(false);
	const primary = getPrimary();

	const openModal = () => {
		setModal(true);
	}

	const closeModal = () => {
		setModal(false);
	}


	return (
		<React.Fragment>
			<h3 style={{ color: primary, marginBottom: windowOrientation === "landscape" ? "" : "1em" }}>{title}</h3>

			{text && (
				<p style={{ fontSize: '1.1em', marginBottom: windowOrientation === "landscape" ? "" : "2em" }}>
					{isHtmlText ? (
						<span dangerouslySetInnerHTML={{ __html: text }} />
					) : (
							text
						)}
				</p>
			)}

			{council.noCelebrateComment &&
				council.noCelebrateComment.trim() !== "" && (
					<div style={{ maxWidth: "100%", position: "relative" }}>
						<p style={{ marginBottom: "0px" }}>
							{translate.reason_not_held_council}:
						</p>
						<OverFlowText
							icon={"info-circle"}
							action={openModal}
						>
							<p
								style={{
									maxWidth: "100%",
									marginBottom: "8px",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									overflow: "hidden"
								}}
							>
								{council.noCelebrateComment}
							</p>
						</OverFlowText>
					</div>
				)}


			<CouncilInfoCardRender council={council} company={company} windowOrientation={windowOrientation} />

			<TextDialog
				handleClose={closeModal}
				text={council.noCelebrateComment}
				open={modal}
			/>
		</React.Fragment>
	);
}


const CouncilInfoCardRender = ({ council, windowOrientation }) => (
	<React.Fragment>
		<div
			style={{
				backgroundColor: lightTurquoise,
				borderRadius: "4px"
			}}
		>
			<CardHeader
				title={
					<div style={{ marginBottom: windowOrientation === "landscape" ? "" : "10px" }}>
						<img src={logoIcon} style={{ height: logoIcon !== "" ? '2em' : '' }} alt="icono councilbox"></img>{logoIcon !== "" ? <br /> : ""}
						<b>{council.name}</b>
					</div>
				}
				subheader={moment(new Date(council.dateStart)).format(
					"LLL"
				)}
			/>
		</div>
	</React.Fragment>
);

const TextDialog = ({ open, handleClose, title, text }) => (
	<Dialog
		open={open}
		onClose={handleClose}
		aria-labelledby="simple-dialog-title"
	>
		{title && (
			<DialogTitle id="simple-dialog-title">
				Set backup account
					</DialogTitle>
		)}
		<DialogContent>
			<FontAwesome
				name={"close"}
				style={{
					position: "absolute",
					right: "10px",
					top: "5px",
					cursor: "pointer",
					color: getSecondary()
				}}
				onClick={handleClose}
			/>
			{text}
		</DialogContent>
	</Dialog>
);

const Image = ({ src, widths, windowOrientation, styles }) => (
	<div
		style={{
			width: widths < 690 ? "60%" : "33%",
			minWidth: windowOrientation ? "" : '250px',
			marginLeft: widths < 690 ? (windowOrientation === "landscape" ? "3em" : "") : "6em",
			marginTop: widths < 690 ? (windowOrientation === "landscape" ? "" : "3em") : "",
			...styles
		}}>
		<img
			style={{ width: '100%' }}
			src={src}
			alt="empty table"
		/>
	</div>
);

const StateContainer = ({ widths, windowOrientation, heights, children }) => (
	<div
		style={{
			overflow: "hidden",
			display: widths > 690 ? 'flex' : (windowOrientation === "landscape" ? "flex" : "contents"),
			alignItems: "center",
			margin: (windowOrientation === "landscape" ? "" : "3em"),
			justifyContent: 'space-between',
			fontSize: windowOrientation === "landscape" && heights < 370 ? "10px" : ""
		}}>
		{children}
	</div>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(CouncilState))
);
