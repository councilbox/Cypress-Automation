import React from 'react';
import { Grid } from '../../../../../displayComponents';
import { EMAIL_TRACK_STATES } from '../../../../../constants';
import { getSecondary } from '../../../../../styles/colors';
import EmailIcon from '../EmailIcon';
import { isMobile } from '../../../../../utils/screen';


const selectedStyle = {
	borderBottom: `3px solid ${getSecondary()}`,
	color: getSecondary(),
	fontWeight: '700'
};


const CredentialsHeader = ({
	translate, setSelected, crendentialSendRecount, selected
}) => (
	<React.Fragment>
		<Grid
			style={{
				width: '100%',
				minHeight: '3em',
				borderBottom: '1px solid gainsboro',
				display: isMobile ? 'grid' : 'flex',
				gridTemplateColumns: isMobile && 'repeat(auto-fit, minmax(80px, auto))',
				flexDirection: !isMobile && 'row',
				alignItems: 'center',
				justifyContent: !isMobile && 'space-between',
				paddingLeft: '1.5em',
				paddingRight: isMobile ? '1.5em' : '2.5em',
				margin: 0,
			}}
		>
			<div
				onClick={() => {
					setSelected(null);
				}}
				style={{
					cursor: 'pointer',
					...(selected === null ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					color={selected === null ? getSecondary() : 'grey'}
					translate={translate}
					reqCode={'ALL'}
					number={crendentialSendRecount.all}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						EMAIL_TRACK_STATES.FAILED
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.FAILED ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.FAILED}
					number={crendentialSendRecount.failed}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						EMAIL_TRACK_STATES.NOT_SENT
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.NOT_SENT ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.NOT_SENT}
					number={crendentialSendRecount.notSend}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS}
					number={crendentialSendRecount.invalidAddress}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(EMAIL_TRACK_STATES.SPAM);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.SPAM ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.SPAM}
					number={crendentialSendRecount.spam}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						EMAIL_TRACK_STATES.PENDING_SHIPPING
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.PENDING_SHIPPING ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.PENDING_SHIPPING}
					number={crendentialSendRecount.pendingShipping}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						EMAIL_TRACK_STATES.DELIVERED
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.DELIVERED ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.DELIVERED}
					number={crendentialSendRecount.delivered}
				/>
			</div>
			<div
				onClick={() => {
					setSelected(
						EMAIL_TRACK_STATES.OPENED
					);
				}}
				style={{
					cursor: 'pointer',
					...(selected === EMAIL_TRACK_STATES.OPENED ?
						selectedStyle
						: {}
					)
				}}
			>
				<EmailIcon
					translate={translate}
					reqCode={EMAIL_TRACK_STATES.OPENED}
					number={crendentialSendRecount.opened}
				/>
			</div>
		</Grid>
	</React.Fragment>
);

export default CredentialsHeader;
