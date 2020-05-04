import React from "react";
import { deleteSignature, signatures } from "../../queries/signature";
import { compose, graphql } from "react-apollo";
import {
	AlertConfirm,
	CloseIcon,
	ErrorWrapper,
	LoadingSection,
	MainTitle,
	Table,
	BasicButton
} from "../../displayComponents/index";
import { getPrimary } from "../../styles/colors";
import { TableCell, TableRow } from "material-ui/Table";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { bHistory } from "../../containers/App";
import CantCreateCouncilsModal from "./CantCreateCouncilsModal";
import { ConfigContext } from "../../containers/AppControl";


const Signatures = ({ translate, data, ...props }) => {
	const [cantAccessModal, setCantAccessModal] = React.useState(false);
	const [deleteModalId, setDeleteModalId] = React.useState(null);
	const primary = getPrimary();
	const config = React.useContext(ConfigContext);

	const openCantAccessModal = () => {
		setCantAccessModal(true);
	}

	const closeCantAccessModal = () => {
		setCantAccessModal(false);
	}

	const openDeleteModal = id => {
		setDeleteModalId(id);
	}
	
	const deleteSignature = async () => {
		data.loading = true;
		const response = await props.mutate({
			variables: {
				id: deleteModalId
			}
		});
		if (response) {
			setDeleteModalId(null);
			data.refetch();
		}
	}

	function _renderDeleteIcon(signatureID) {
		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					openDeleteModal(signatureID);
					event.stopPropagation();
				}}
			/>
		);
	}


	const { loading, signatures = [], error } = data;

	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				overflow: "hidden",
				position: "relative"
			}}
		>
			<div style={{ width: '100%', height: '100%', padding: '1em' }}>
				<MainTitle
					icon={props.icon}
					title={props.title}
					subtitle={props.desc}
				/>
				{loading ? (
					<div style={{
						width: '100%',
						marginTop: '8em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<LoadingSection />
					</div>
				) : (
						<div style={{ height: 'calc(100% - 10.5em)', overflow: 'hidden' }}>
							<div style={{
								display: "flex"
							}}>
								<BasicButton
									color='white'
									disabled={!config.signature}
									text={translate.dashboard_new_signature}
									textStyle={{
										color: getPrimary(),

									}}
									buttonStyle={{
										border: "1px solid " + getPrimary(),
										marginTop: '1em'
									}}
								
									onClick={() => bHistory.push(`/company/${props.company.id}/signature/new`)}
								/>
							</div>
							<Scrollbar>
								<div style={{ padding: "1em", paddingTop: '2em' }}>
									{false ? (
										<div>
											{error.graphQLErrors.map((error, index) => {
												return (
													<ErrorWrapper
														key={`error_${index}`}
														error={error}
														translate={translate}
													/>
												);
											})}
										</div>
									) : signatures.length > 0 ? (
										<Table
											headers={[
												{ name: translate.name },
												{ name: '' }
											]}
											action={_renderDeleteIcon}
											companyID={props.company.id}
										>
											{signatures.map(signature => {
												return (
													<HoverableRow
														signature={signature}
														disabled={props.disabled}
														company={props.company}
														key={`signature_${signature.id}`}
														translate={translate}
														showModal={openCantAccessModal}
														openDeleteModal={openDeleteModal}
													/>
												);
											})}
										</Table>
									) : (
												<span>{translate.no_results}</span>
											)}
									<AlertConfirm
										title={translate.send_to_trash}
										bodyText={translate.send_to_trash_desc}
										open={!!deleteModalId}
										buttonAccept={translate.send_to_trash}
										buttonCancel={translate.cancel}
										modal={true}
										acceptAction={deleteSignature}
										requestClose={() => setDeleteModalId(null)}
									/>
								</div>
							</Scrollbar>
						</div>
					)}
			</div>
			<CantCreateCouncilsModal
				translate={translate}
				open={cantAccessModal}
				requestClose={closeCantAccessModal}
			/>
		</div>
	);

}


export default compose(
	graphql(deleteSignature),
	graphql(signatures, {
		options: props => ({
			variables: {
				state: props.state,
				companyId: props.company.id,
			},
			notifyOnNetworkChange: true
		})
	})
)(Signatures);

class HoverableRow extends React.PureComponent {

	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		})
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		})
	}

	deleteIcon = (signatureId) => {
		const primary = getPrimary();

		return (
			<CloseIcon
				style={{ color: primary }}
				onClick={event => {
					this.props.openDeleteModal(signatureId);
					event.stopPropagation();
				}}
			/>
		);
	}


	render() {
		const { signature, translate, disabled } = this.props;


		return (
			<TableRow
				onMouseOver={this.mouseEnterHandler}
				onMouseLeave={this.mouseLeaveHandler}
				style={{
					cursor: "pointer",
					backgroundColor: disabled ? 'whiteSmoke' : 'inherit'
				}}
				onClick={() => {
					disabled ?
						this.props.showModal()
						:
						bHistory.push(`/company/${this.props.company.id}/signature/${signature.id}`
						);
				}}
				key={`signature${
					signature.id
					}`}
			>
				<TableCell>
					{signature.title || translate.dashboard_new_signature}
				</TableCell>
				<TableCell>
					{this.state.showActions ?
						this.deleteIcon(signature.id)
						:
						<div style={{ width: '5em' }} />
					}
				</TableCell>
			</TableRow>
		)
	}
}