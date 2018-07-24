import React from "react";
import { AlertConfirm, Icon } from "../../../../displayComponents/index";
import { Typography } from "material-ui";
import { graphql } from "react-apollo";
import { cancelCouncil } from "../../../../queries/council";
import { bHistory } from "../../../../containers/App";
import { moment } from '../../../../containers/App';

class CancelModal extends React.Component {
	state = {
		success: false,
		sending: false,
		error: ""
	};

	close = () => {
		this.props.requestClose();
		bHistory.push("/");
	};

	hide = () => {
		this.props.requestClose();
	};

	cancelCouncil = async () => {
		this.setState({
			sending: true
		});
		const response = await this.props.cancelCouncil({
			variables: {
				councilId: this.props.council.id,
				timezone: moment().utcOffset()
			}
		});
		if (response.data.cancelCouncil.success) {
			this.setState({
				sending: false,
				success: true
			});
		} else {
			this.setState({
				sending: false,
				error: true
			});
		}
	};

	_renderCancelBody() {
		const { translate } = this.props;

		if (this.state.sending) {
			return <div>{translate.rescheduling_council}</div>;
		}

		if (this.state.success) {
			return <SuccessMessage message={translate.canceled_council} />;
		}

		return <React.Fragment>{translate.cancel_council_desc}</React.Fragment>;
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				requestClose={this.hide}
				open={this.props.show}
				loadingAction={this.state.sending}
				acceptAction={
					this.state.success ? () => this.close() : this.cancelCouncil
				}
				buttonAccept={
					!this.state.sending
						? this.state.success
							? translate.accept
							: translate.cancel_council
						: ""
				}
				buttonCancel={translate.close}
				bodyText={this._renderCancelBody()}
				title={translate.cancel_council}
			/>
		);
	}
}

export default graphql(cancelCouncil, {
	name: "cancelCouncil"
})(CancelModal);

const SuccessMessage = ({ message }) => (
	<div
		style={{
			width: "500px",
			display: "flex",
			alignItems: "center",
			alignContent: "center",
			flexDirection: "column"
		}}
	>
		<Icon
			className="material-icons"
			style={{
				fontSize: "6em",
				color: "green"
			}}
		>
			check_circle
		</Icon>
		<Typography variant="subheading">{message}</Typography>
	</div>
);
