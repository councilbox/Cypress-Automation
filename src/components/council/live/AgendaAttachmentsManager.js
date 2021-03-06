import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	FileUploadButton,
	Icon
} from '../../../displayComponents';
import AttachmentList from '../../attachments/AttachmentList';
import { darkGrey, getSecondary } from '../../../styles/colors';
import { addAgendaAttachment, removeAgendaAttachment } from '../../../queries';
import { MAX_FILE_SIZE } from '../../../constants';
import { LIVE_COLLAPSIBLE_HEIGHT } from '../../../styles/constants';

class AgendaAttachmentsManager extends React.Component {
	state = {
		open: false,
		loadingId: ''
	};

	handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		if (file.size / 1000 + this.state.totalSize > MAX_FILE_SIZE) {
			this.setState({
				alert: true
			});
			return;
		}
		const reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = async loadEvent => {
			const fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: loadEvent.loaded.toString(),
				base64: btoa(loadEvent.target.result),
				state: 0,
				agendaId: this.props.agendaID,
				councilId: this.props.councilID
			};

			this.setState({
				uploading: true
			});
			const response = await this.props.addAgendaAttachment({
				variables: {
					attachment: fileInfo
				}
			});
			if (response) {
				this.props.refetch();
				this.setState({
					uploading: false
				});
			}
		};
	};

	removeAgendaAttachment = async attachmentID => {
		this.setState({
			loadingId: attachmentID
		});

		const response = await this.props.removeAgendaAttachment({
			variables: {
				attachmentId: attachmentID,
				agendaId: this.props.agendaID
			}
		});

		if (response) {
			const refetch = await this.props.refetch();
			if (refetch) {
				this.setState({ loadingId: '' });
			}
		}
	};

	_button = () => {
		const { attachments } = this.props;

		return (
			<div
				style={{
					height: LIVE_COLLAPSIBLE_HEIGHT,
					display: 'flex',
					...(attachments.length === 0 ? { cursor: 'auto' } : {}),
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<div
					style={{
						width: '25%',
						height: LIVE_COLLAPSIBLE_HEIGHT,
						display: 'flex',
						alignItems: 'center',
						paddingLeft: '1.5em'
					}}
				>
					<Icon className="material-icons" style={{ color: 'grey' }}>
						description
					</Icon>
					<span
						style={{
							marginLeft: '0.7em',
							color: darkGrey,
							fontWeight: '700'
						}}
					>{`${attachments.length}`}</span>
				</div>
				<div
					style={{
						width: '25%',
						display: 'flex',
						justifyContent: 'flex-end',
						paddingRight: '2em'
					}}
				>
					{attachments.length > 0 && (
						<Icon className="material-icons" style={{ color: 'grey' }}>
							keyboard_arrow_down
						</Icon>
					)}
				</div>
			</div>
		);
	};

	section = () => {
		const { attachments, translate } = this.props;

		return (
			<AttachmentList
				attachments={attachments}
				translate={translate}
				loadingId={this.state.loadingId}
				deleteAction={this.removeAgendaAttachment}
				refetch={this.props.refetch}
				isAgendaAttachment
			/>
		);
	};

	render() {
		const secondary = getSecondary();

		return (
			<div
				style={{
					width: '100%',
					position: 'relative'
				}}
			>
				{this.props.attachments.length > 0 ?
					this.section()
					: <div style={{
						display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', paddingTop: '4em'
					}}>
						{this.props.translate.no_results}
					</div>
				}
				<div style={{
					width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1em'
				}}>
					<FileUploadButton
						color={'white'}
						text={this.props.translate.add_attachment}
						textStyle={{
							color: secondary,
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none'
						}}
						loading={this.state.uploading}
						loadingColor={'primary'}
						buttonStyle={{
							border: `1px solid ${secondary}`,
							height: '100%',
							marginTop: '5px'
						}}
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: '1.5em',
									color: secondary
								}}
							>
								control_point
							</Icon>
						}
						onChange={this.handleFile}
					/>
				</div>
			</div>
		);
	}
}

export default compose(
	graphql(addAgendaAttachment, {
		name: 'addAgendaAttachment'
	}),

	graphql(removeAgendaAttachment, {
		name: 'removeAgendaAttachment'
	})
)(AgendaAttachmentsManager);
