import React from "react";
import { withApollo } from "react-apollo";
import { downloadCouncilAttachment, downloadAgendaAttachment } from "../../queries";
import { CircularProgress } from "material-ui";
import { getSecondary } from "../../styles/colors";
import FontAwesome from "react-fontawesome";
import { downloadFile, printPrettyFilesize } from "../../utils/CBX";

class AttachmentDownload extends React.Component {
	state = {
		downloading: false
	};

	downloadAttachment = async id => {
		this.setState({
			downloading: true
		});

		const response = await this.props.client.query({
			query: this.props.agenda? downloadAgendaAttachment : downloadCouncilAttachment,
			variables: {
				attachmentId: this.props.attachment.id
			}
		});

		if (response) {
			if(this.props.agenda){
				if (response.data.agendaAttachment.base64) {
					const file = response.data.agendaAttachment;
					downloadFile(file.base64, file.filetype, file.filename);
				}
				this.setState({
					downloading: false
				});
			}else{
				if (response.data.councilAttachment.base64) {
					const file = response.data.councilAttachment;
					downloadFile(file.base64, file.filetype, file.filename);
				}
				this.setState({
					downloading: false
				});
			}

		}
	};

	render() {
		const { attachment } = this.props;
		const secondary = getSecondary();

		return (
			<div
				style={{
					cursor: "pointer",
					padding: "0.2em 0.5em",
					border: `1px solid ${secondary}`,
					borderRadius: "3px",
					color: secondary
				}}
				onClick={() => this.downloadAttachment(attachment.filename)}
			>
				{this.state.downloading ? (
					<CircularProgress
						size={14}
						color={"secondary"}
						style={{ marginRight: "0.8em" }}
					/>
				) : (
					<FontAwesome
						name={"download"}
						style={{
							fontSize: "0.9em",
							marginRight: '0.3em',
							color: secondary
						}}
					/>
				)}

				{`${attachment.filename} (${printPrettyFilesize(
					attachment.filesize
				)})`}
			</div>
		);
	}
}

export default withApollo(AttachmentDownload);
