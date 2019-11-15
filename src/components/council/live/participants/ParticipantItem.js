import React from "react";
import { MenuItem, Typography, Tooltip, Card } from "material-ui";
import { GridItem, Grid, BasicButton } from "../../../../displayComponents";
import FontAwesome from "react-fontawesome";
import { getSecondary, primary } from "../../../../styles/colors";
import StateIcon from "./StateIcon";
import EmailIcon from "./EmailIcon";
import TypeIcon from "./TypeIcon";
import { removeHTMLTags, isRepresented, hasHisVoteDelegated } from '../../../../utils/CBX';
import withWindowSize from '../../../../HOCs/withWindowSize';
import AttendIntentionIcon from "./AttendIntentionIcon";
import { DropDownMenu } from '../../../../displayComponents';
import ParticipantStateList from "./ParticipantStateList";


const ParticipantItem = ({ participant, translate, layout, editParticipant, mode, council, ...props }) => {
	const secondary = getSecondary();
	const gridSize = window.innerWidth < 1350 ? 6 : 6;

	return (
		<GridItem
			xs={props.orientation === 'portrait' ? 12 : layout !== 'squares' ? 12 : 6}
			md={layout !== 'squares' ? 12 : gridSize}
			lg={layout !== 'squares' ? 12 : gridSize}
			{...(layout !== 'squares' ? { marginBottom: '0.3em' } : {})}
		>
			<div
				style={{
					width: '98%',
					marginRight: '5%',
					marginBottom:"10px",
					height: layout === 'compact' ? '1.8em' : layout === 'table' ? '2.5em' : '6em',
					...(layout !== 'squares' ? {
						height: '3.2em',
						marginBottom: '0.3em',
						borderBottom: '1px solid gainsboro'
					} : {})
				}}
			>
				<MenuItem
					style={{
						width: "100%",
						height: '100%',
						borderRadius: '2px',
						padding: '2px 2px',
						textOverflow: "ellipsis",
						overflow: "hidden",
					}}
					onClick={() => editParticipant(participant.id)}
				>
					{layout === 'compact' &&
						<CompactItemLayout
							secondary={secondary}
							participant={participant}
							translate={translate}
							council={council}
							refetch={props.refetch}
							showSignatureModal={props.showSignatureModal}
							mode={mode}
						/>
					}
					{layout === 'table' &&
						<CompactItemLayout
							secondary={secondary}
							participant={participant}
							translate={translate}
							council={council}
							refetch={props.refetch}
							showSignatureModal={props.showSignatureModal}
							mode={mode}
						/>
					}
					{layout === 'squares' &&
						<TabletItem
							secondary={secondary}
							participant={participant}
							translate={translate}
							council={council}
							refetch={props.refetch}
							showSignatureModal={props.showSignatureModal}
							mode={mode}
						/>
					}
				</MenuItem>
			</div>
		</GridItem>
	);
};

const CompactItemLayout = ({ participant, translate, mode, showSignatureModal, secondary, council, refetch }) => (
	<Grid
		spacing={0}
		style={{
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			width: "100%",
			fontSize: '14px',
			textOverflow: "ellipsis",
			overflow: "hidden"
		}}
	>
		<GridItem
			xs={mode === 'ATTENDANCE' ? 1 : 2}
			lg={mode === 'ATTENDANCE' ? 1 : 2}
			md={mode === 'ATTENDANCE' ? 1 : 2}
		>
			<div >
				{ mode === 'STATES' && participant.personOrEntity === 0?
					<DropDownMenu
						claseHover={"classHover "}
						color="transparent"
						style={{ paddingLeft: '0px', paddingRight: '0px' }}
						textStyle={{ boxShadow: "none", height: '100%',fontSize:"12px"  }}
						icon={
							<StateIcon
								translate={translate}
								state={participant.state}
								ratio={1.3}
							/>
						}
						items={
							<React.Fragment>
								<ParticipantStateList
									participant={participant}
									council={council}
									translate={translate}
									inDropDown={true}
									refetch={refetch}
								/>
							</React.Fragment>
						}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}

					/>
				:
					<div
						style={{
							width: '88px',
							height: '100%',
							display: 'flex',
							fontSize: '1.3em',
							paddingLeft: '0.4em',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						{_getIcon(mode, participant, translate)}
					</div>
				}
			</div>
		</GridItem>
		{mode === 'ATTENDANCE' &&
			<GridItem
				xs={1}
				lg={1}
				md={1}
			>
				{participant.assistanceComment &&
					<Tooltip title={removeHTMLTags(participant.assistanceComment)}>
						<div style={{ padding: "0.5em" }}>
							<FontAwesome
								name={"comment"}
								style={{ fontSize: '1.5em', color: 'grey' }}
							/>
						</div>
					</Tooltip>
				}
			</GridItem>
		}

		<GridItem
			xs={4}
			md={4}
			lg={4}
		>
			{`${participant.name} ${participant.surname || ''}`}
		</GridItem>
		<GridItem
			xs={3}
			md={2}
			lg={2}
		>
			{`${participant.dni || '-'}`}
		</GridItem>
		<GridItem
			xs={3}
			md={2}
			lg={2}
		>
			{!isRepresented(participant) && council.councilType < 2 && !hasHisVoteDelegated(participant) && participant.personOrEntity !== 1 &&
				<BasicButton
					text={participant.signed ? translate.user_signed : translate.to_sign}
					fullWidth
					buttonStyle={{ border: `1px solid ${participant.signed ? primary : secondary}` }}
					type="flat"
					color={"white"}
					onClick={event => {
						event.stopPropagation();
						showSignatureModal()
					}}
					textStyle={{ color: participant.signed ? primary : secondary, fontWeight: '700' }}
				/>
			}
		</GridItem>
	</Grid>
)

const TabletItem = ({ participant, translate, secondary, mode, showSignatureModal, council, refetch }) => (

	<React.Fragment>
		<Card
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				width: "100%",
				textOverflow: "ellipsis",
				overflow: "hidden"
			}}
		>
			<div style={{ width: '60%', display: 'flex', height: "84px" }}>
				<div>
					{ mode === 'STATES' && participant.personOrEntity === 0 && council.councilType < 2?
						<DropDownMenu
							claseHover={"classHover "}
							color="transparent"
							style={{ paddingLeft: '0px', paddingRight: '0px' }}
							textStyle={{ boxShadow: "none", height: '100%', minWidth: "15px" }}
							icon={
								<StateIcon
									translate={translate}
									state={participant.state}
									ratio={1.3}
								/>
							}
							items={
								<React.Fragment>
									<ParticipantStateList
										participant={participant}
										council={council}
										refetch={refetch}
										translate={translate}
										inDropDown={true}
									/>
								</React.Fragment>
							}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}

						/>
					:
						<div
							style={{
								width: '88px',
								height: '100%',
								display: 'flex',
								fontSize: '1.3em',
								paddingLeft: '0.4em',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							{_getIcon(mode, participant, translate)}
						</div>
					}
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: "0.6em",
						width: "100%",
						textOverflow: "ellipsis",
						overflow: "hidden",
						// paddingTop: '15px'
						justifyContent:"center"
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center"
						}}
					>
						<div
							style={{
								width: "2.2em",
								display: "flex",
								justifyContent: "center"
							}}
						>
							<FontAwesome
								name={"info"}
								style={{
									color: secondary,
									fontSize: "1em",
									marginRight: 0
								}}
							/>
						</div>
						<Tooltip title={`${participant.name} ${participant.surname || ''}`}>
							<Typography
								variant="body1"
								className="truncate"
								style={{
									fontWeight: "600",
									width: 'calc(100% - 2.2em)'
								}}
							>
								{`${participant.name} ${participant.surname || ''}`}
							</Typography>
						</Tooltip>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center"
						}}
					>
						<div
							style={{
								width: "2.2em",
								display: "flex",
								justifyContent: "center"
							}}
						>
							<FontAwesome
								name={"id-card"}
								style={{
									color: secondary,
									fontSize: "1em",
									marginRight: 0
								}}
							/>
						</div>
						<Typography
							variant="body1"
							style={{ color: "grey", fontSize: "0.75rem" }}
						>
							{`${participant.dni || '-'}`}
						</Typography>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center"
						}}
					>
						<div
							style={{
								width: "2.2em",
								display: "flex",
								justifyContent: "center"
							}}
						>
							<FontAwesome
								name={"tag"}
								style={{
									color: secondary,
									fontSize: "1em",
									marginRight: 0
								}}
							/>
						</div>
						<Typography
							variant="body1"
							style={{ color: "grey", fontSize: "0.75rem" }}
						>
							{`${participant.position ? participant.position : '-'}`}
						</Typography>
					</div>
					{mode === 'ATTENDANCE' && participant.assistanceComment &&
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<div
								style={{
									width: "2.2em",
									display: "flex",
									justifyContent: "center",
									alignItems: 'center'
								}}
							>
								<FontAwesome
									name={"comment"}
									style={{
										color: primary,
										fontSize: "1em",
										marginRight: 0
									}}
								/>
							</div>
							<div
								style={{
									color: "grey",
									fontSize: "0.75rem",
									textOverflow: "ellipsis",
									height: '1.5em',
									overflow: "hidden"
								}}
							>
								{removeHTMLTags(participant.assistanceComment)}
							</div>
						</div>
					}
				</div>
			</div>
			<div
				style={{
					width: '35%',
					padding: '0.3em',
					paddingRight: '0.6em',
					height: '6em',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'
				}}
			>
				{!isRepresented(participant) && council.councilType < 2 && !hasHisVoteDelegated(participant) && participant.personOrEntity !== 1 &&
					<BasicButton
						text={participant.signed ? translate.user_signed : translate.to_sign}
						fullWidth
						buttonStyle={{ border: `1px solid ${participant.signed ? primary : secondary}` }}
						type="flat"
						color={"white"}
						onClick={event => {
							event.stopPropagation();
							showSignatureModal()
						}}
						textStyle={{ color: participant.signed ? primary : secondary, fontWeight: '700' }}
					/>
				}
			</div>
		</Card>
	</React.Fragment>
)

const _getIcon = (mode, participant, translate, showCommentModal) => {
	switch (mode) {
		case 'STATES':
			return <StateIcon translate={translate} state={participant.state} />
		case 'CONVENE':
			return <EmailIcon translate={translate} reqCode={participant.sendConvene.reqCode} />
		case 'CREDENTIALS':
			if(participant.sendCredentials){
				return <EmailIcon translate={translate} reqCode={participant.sendCredentials.reqCode} />
			}
			return '-';
		case 'TYPE':
			return <TypeIcon translate={translate} type={participant.type} />
		case 'ATTENDANCE':
			return <AttendIntentionIcon participant={participant} translate={translate} size="2em" color={getSecondary()} />
		default:
			break;
	}
}

export default withWindowSize(ParticipantItem);
