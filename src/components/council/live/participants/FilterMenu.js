import React from 'react';
import { Typography } from 'material-ui';
import FontAwesome from 'react-fontawesome';
import {
	TextInput,
	Icon,
	FilterButton,
	RefreshButton,
	Scrollbar
} from '../../../../displayComponents';
import { getSecondary, getPrimary } from '../../../../styles/colors';

const FilterMenu = ({
	state,
	translate,
	updateState,
	updateFilterText,
	updateParticipantState,
	updateParticipantType,
	refreshEmailStates
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();

	return (
		<Scrollbar option={{ suppressScrollX: true }}>
			<TextInput
				adornment={<Icon>search</Icon>}
				floatingText={' '}
				type="text"
				value={state.filterText}
				onChange={event => {
					updateFilterText(event.target.value);
				}}
			/>
			<div style={{ display: 'flex', flexDirection: 'row' }}>

			</div>
			<Typography
				variant="subheading"
				style={{
					textTransform: 'uppercase',
					color: 'grey',
					marginTop: '1.2em',
					fontWeight: '700'
				}}
			>
				{translate.see}:
			</Typography>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row'
				}}
			>
				<FilterButton
					tooltip={translate.current_state}
					onClick={() => {
						updateState({ tableType: 'participantState' });
					}}
					active={state.tableType === 'participantState'}
				>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<FontAwesome
							name={'user'}
							style={{
								margin: '0.5em',
								color: secondary,
								fontSize: '1.1em'
							}}
						/>
						<FontAwesome
							name={'globe'}
							style={{
								position: 'absolute',
								right: '5px',
								top: '0.8m',
								color: primary,
								fontSize: '0.7em'
							}}
						/>
					</div>
				</FilterButton>
				<FilterButton
					tooltip={translate.sends}
					onClick={() => {
						updateState({ tableType: 'participantSend' });
					}}
					active={state.tableType === 'participantSend'}
				>
					<FontAwesome
						name={'envelope'}
						style={{
							margin: '0.5em',
							color: secondary,
							fontSize: '1.1em'
						}}
					/>
				</FilterButton>
				<FilterButton
					tooltip={translate.assistance}
					onClick={() => {
						updateState({ tableType: 'attendIntention' });
					}}
					active={state.tableType === 'attendIntention'}
				>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<FontAwesome
							name={'user'}
							style={{
								margin: '0.5em',
								color: secondary,
								fontSize: '1.1em'
							}}
						/>
						<FontAwesome
							name={'question'}
							style={{
								position: 'absolute',
								right: '5px',
								marginTop: '0.4m',
								color: primary,
								fontSize: '0.9em'
							}}
						/>
					</div>
				</FilterButton>
			</div>

			{state.tableType === 'participantSend'
&& <React.Fragment>
	<Typography
		variant="subheading"
		style={{
			textTransform: 'uppercase',
			color: 'grey',
			marginTop: '1.2em',
			fontWeight: '700'
		}}
	>
		{translate.refresh_convened}
	</Typography>
	<RefreshButton
		tooltip={`${
			translate.tooltip_refresh_convene_email_state_assistance
		} (ALT + R)`}
		loading={state.refreshing}
		onClick={refreshEmailStates}
	/>
</React.Fragment>
			}

			<Typography
				variant="subheading"
				style={{
					textTransform: 'uppercase',
					color: 'grey',
					marginTop: '1.2em',
					fontWeight: '700'
				}}
			>
				{translate.type}
			</Typography>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row'
				}}
			>
				<FilterButton
					tooltip={translate.participant}
					onClick={() => {
						updateParticipantType('0');
					}}
					active={state.participantType === '0'}
				>
					<FontAwesome
						name={'user'}
						style={{
							margin: '0.5em',
							color: secondary,
							fontSize: '1.1em'
						}}
					/>
				</FilterButton>
				<FilterButton
					tooltip={translate.guest}
					onClick={() => {
						updateParticipantType(1);
					}}
					active={state.participantType === 1}
				>
					<FontAwesome
						name={'user-o'}
						style={{
							margin: '0.5em',
							color: secondary,
							fontSize: '1.1em'
						}}
					/>
				</FilterButton>
				<FilterButton
					tooltip={translate.representative}
					onClick={() => {
						updateParticipantType(2);
					}}
					active={state.participantType === 2}
				>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<FontAwesome
							name={'user-o'}
							style={{
								margin: '0.5em',
								color: secondary,
								fontSize: '1.1em'
							}}
						/>
						<FontAwesome
							name={'user'}
							style={{
								position: 'absolute',
								right: '5px',
								top: '0.8m',
								color: primary,
								fontSize: '0.85em'
							}}
						/>
					</div>
				</FilterButton>
			</div>

			<Typography
				variant="subheading"
				style={{
					textTransform: 'uppercase',
					color: 'grey',
					marginTop: '1.2em',
					fontWeight: '700'
				}}
			>
				{translate.participant}
			</Typography>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<FilterButton
					tooltip={translate.customer_initial}
					onClick={() => {
						updateParticipantState('0');
					}}
					active={state.participantState === '0'}
				>
					<FontAwesome
						name={'globe'}
						style={{
							margin: '0.5em',
							color: secondary,
							fontSize: '1.1em'
						}}
					/>
				</FilterButton>
				<FilterButton
					tooltip={translate.customer_present}
					onClick={() => {
						updateParticipantState(5);
					}}
					active={state.participantState === 5}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Icon
							className="material-icons"
							style={{
								color: secondary,
								fontSize: '1.2em'
							}}
						>
face
						</Icon>
					</div>
				</FilterButton>
			</div>
		</Scrollbar>
	);
};

export default FilterMenu;
