import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { toast } from 'react-toastify';
import { closeAgenda as closeAgendaMutation, openAgenda as openAgendaMutation, openActPoint } from '../../../queries';
import { BasicButton, Icon, LiveToast } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { councilHasSession, getActPointSubjectType } from '../../../utils/CBX';
import { AGENDA_STATES } from '../../../constants';

const ToggleAgendaButton = ({
	agenda, council, active, translate, ...props
}) => {
	const [loading, setLoading] = React.useState(false);

	const openAgenda = async () => {
		setLoading(true);

		if (agenda.subjectType === getActPointSubjectType()) {
			const response = await props.openActPoint({
				variables: {
					councilId: agenda.councilId
				}
			});
			if (response) {
				props.refetch();
			}
		} else {
			const response = await props.openAgenda({
				variables: {
					agendaId: agenda.id
				}
			});
			if (response) {
				if (response.errors) {
					toast(
						<LiveToast
							id="error-toast"
							message={translate.open_point_error}
						/>, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: 'errorToast'
						}
					);
				}
				props.refetch();
			}
		}
		setLoading(true);
	};

	const closeAgenda = async () => {
		const response = await props.closeAgenda({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			props.refetch();
			props.nextPoint();
		}
	};

	const primary = getPrimary();
	const secondary = getSecondary();

	if (!councilHasSession(council)) {
		return <span/>;
	}

	return (
		<React.Fragment>
			{agenda.pointState === AGENDA_STATES.INITIAL ? (
				active ? (
					<BasicButton
						text={translate.discuss_agenda}
						id="open-agenda-point-button"
						color={'white'}
						loading={loading}
						loadingColor={getPrimary()}
						textPosition="before"
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: '1.1em',
									color: primary
								}}
							>
								lock_open
							</Icon>
						}
						buttonStyle={{ width: '11em' }}
						onClick={openAgenda}
						textStyle={{
							fontSize: '0.75em',
							fontWeight: '700',
							textTransform: 'none',
							color: primary
						}}
					/>
				) : (
					<Tooltip title={translate.warning_unclosed_agenda}>
						<FontAwesome
							name="lock"
							style={{
								color: secondary,
								fontSize: '2em'
							}}
						/>
					</Tooltip>
				)
			) : (
				<BasicButton
					text={translate.close_point}
					color={primary}
					id="close-agenda-point-button"
					textPosition="before"
					icon={
						<Icon
							className="material-icons"
							style={{
								fontSize: '1.1em',
								color: 'white'
							}}
						>
							lock_open
						</Icon>
					}
					buttonStyle={{ width: '11em' }}
					onClick={closeAgenda}
					textStyle={{
						fontSize: '0.75em',
						fontWeight: '700',
						textTransform: 'none',
						color: 'white'
					}}
				/>
			)}
		</React.Fragment>
	);
};


export default compose(
	graphql(openAgendaMutation, {
		name: 'openAgenda'
	}),
	graphql(openActPoint, {
		name: 'openActPoint'
	}),
	graphql(closeAgendaMutation, {
		name: 'closeAgenda'
	})
)(ToggleAgendaButton);
