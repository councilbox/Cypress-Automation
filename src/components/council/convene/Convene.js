import React from "react";
import { graphql, withApollo, compose } from "react-apollo";
import FontAwesome from "react-fontawesome";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { updateCouncil } from "../../../queries";
import gql from "graphql-tag";
import {
	BasicButton,
	AlertConfirm,
	ErrorWrapper,
	Grid,
	GridItem,
	LoadingSection
} from "../../../displayComponents";
import { Typography, Paper, Tooltip } from "material-ui";
import AttachmentDownload from "../../attachments/AttachmentDownload";
import { downloadConvenePDF } from "../../../queries";
import * as CBX from '../../../utils/CBX';
import withWindowSize from '../../../HOCs/withWindowSize';
import { Switch, FormControlLabel } from 'material-ui';
import { useOldState } from "../../../hooks";

export const conveneDetails = gql`
	query CouncilDetails($councilID: Int!) {
		council(id: $councilID) {
			id
			publicConvene
			attachments {
				councilId
				filename
				filesize
				filetype
				id
			}
			emailText
		}
	}
`;

const Convene = ({ translate, data, ...props }) => {
	const [state, setState] = useOldState({
		loading: false,
		downloadingPDF: false,
		htmlCopiedTooltip: false,
		publicConveneModal: false
	});
	const secondary = getSecondary();


	const downloadPDF = async () => {
		setState({
			downloadingPDF: true
		})
		const response = await props.client.query({
			query: downloadConvenePDF,
			variables: {
				councilId: props.council.id
			}
		});

		if (response) {
			if (response.data.downloadConvenePDF) {
				setState({
					downloadingPDF: false
				});
				CBX.downloadFile(
					response.data.downloadConvenePDF,
					"application/pdf",
					`${translate.convene.replace(/ /g, '_')}-${
					props.council.name.replace(/ /g, '_').replace(/\./, '')
					}`
				);
			}
		}
	};

	const handlePublicChange = () => {
		if (data.council.publicConvene === 0) {
			setState({
				publicConveneModal: true
			});
			return;
		}

		togglePublicConvene();
	}

	const togglePublicConvene = async () => {
		const response = await props.updateCouncil({
			variables: {
				council: {
					id: data.council.id,
					publicConvene: data.council.publicConvene === 1 ? 0 : 1
				}
			}
		});

		data.refetch();
		setState({
			publicConveneModal: false
		});
	}

	const showTooltip = () => {
		setState({
			htmlCopiedTooltip: true
		});
		setTimeout(() => setState({ htmlCopiedTooltip: false }), 3000);
	}

	const copyConveneHTML = () => {
		const html = document.createElement('textarea');
		document.body.appendChild(html);
		html.value = data.council.emailText;
		html.select();
		document.execCommand('copy');
		showTooltip();
	}

	const { council, error, loading } = data;


	if (loading) {
		return <LoadingSection />;
	}

	if (error) {
		return <ErrorWrapper error={error} translate={translate} />;
	}
	if (props.agendaNoSession) {
		return (
			<React.Fragment>
				{council.attachments.length > 0 && !props.hideAttachments && (
					<div
						style={{
							paddingTop: "1em 0",
							width: "98%"
						}}
					>
						<Typography
							variant="title"
							style={{ color: getPrimary() }}
						>
							{translate.new_files_title}
						</Typography>
						<div style={{ marginTop: "1em" }}>
							<Grid>
								{council.attachments.map(attachment => {
									return (
										<GridItem
											key={`attachment${attachment.id}`}
										>
											<AttachmentDownload
												attachment={attachment}
												loading={state.downloading}
												spacing={0.5}
											/>
										</GridItem>
									);
								})}
							</Grid>
						</div>
					</div>
				)
			}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '0.8em'
				}}
			>
				<div
					className={props.windowSize !== 'xs' ? 'htmlPreview' : ''}
				>
					<div
						dangerouslySetInnerHTML={{ __html: council.emailText }}
						style={{
							padding: "2em",
							margin: "0 auto"
						}}
					/>
				</div>
			</div>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				{council.attachments.length > 0 && !props.hideAttachments && (
					<div
						style={{
							paddingTop: "1em 0",
							width: "98%"
						}}
					>
						<Typography
							variant="title"
							style={{ color: getPrimary() }}
						>
							{translate.new_files_title}
						</Typography>
						<div style={{ marginTop: "1em" }}>
							<Grid>
								{council.attachments.map(attachment => {
									return (
										<GridItem
											key={`attachment${attachment.id}`}
										>
											<AttachmentDownload
												attachment={attachment}
												loading={state.downloading}
												spacing={0.5}
											/>
										</GridItem>
									);
								})}
							</Grid>
						</div>
					</div>
				)}
				<div>
					<BasicButton
						text={translate.export_convene}
						color={secondary}
						loading={state.downloadingPDF}
						buttonStyle={{ marginTop: "0.5em" }}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						icon={
							<FontAwesome
								name={"file-pdf-o"}
								style={{
									fontSize: "1em",
									color: "white",
									marginLeft: "0.3em"
								}}
							/>
						}
						textPosition="after"
						onClick={downloadPDF}
					/>
					<BasicButton
						text={translate.copy_html_clipboard}
						color={secondary}
						buttonStyle={{ marginTop: "0.5em", marginLeft: '0.6em' }}
						textStyle={{
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						icon={<i className="fa fa-clipboard" aria-hidden="true" style={{ marginLeft: '0.3em' }}></i>}
						textPosition="after"
						onClick={copyConveneHTML}
					/>
				</div>
				<div style={{ marginTop: '0.6em' }}>
					<FormControlLabel
						control={
							<Switch
								checked={council.publicConvene === 1}
								onChange={handlePublicChange}
								value='true'
								color="primary"
							/>
						}
						label={council.publicConvene === 1 ? 'Convocatoria pública' : 'Convocatoria privada'}
					/>
					{council.publicConvene === 1 &&
						<div style={{ userSelect: 'text' }}>
							{`Enlace para compartir: ${window.location.origin}/convene/${data.council.id}`/*TRADUCCION*/}
						</div>
					}

				</div>
				<Tooltip title={'Html copiado'} open={state.htmlCopiedTooltip}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: '0.8em'
						}}
					>
						<Paper
							className={props.windowSize !== 'xs' ? 'htmlPreview' : ''}
						>
							<div
								dangerouslySetInnerHTML={{ __html: council.emailText }}
								style={{
									padding: "2em",
									cursor: 'pointer',
									margin: "0 auto"
								}}
								onClick={copyConveneHTML}
							/>
						</Paper>
					</div>
				</Tooltip>
				<AlertConfirm
					requestClose={() => setState({ publicConveneModal: false })}
					open={state.publicConveneModal}
					acceptAction={togglePublicConvene}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={
						<div>
							{/*TRADUCCION*/}
							Al realizar está acción se mostrará un link el cual cualquier persona podrá ver la convocatoria, para deshacer está acción puede volver a configurar su convocatoria como privada.
						</div>
					}
					title={translate.warning}
				/>
			</React.Fragment>
		);
	}
}


export default compose(
	graphql(conveneDetails, {
		name: "data",
		options: props => ({
			variables: {
				councilID: props.council.id
			}
		})
	}),
	graphql(updateCouncil, {
		name: 'updateCouncil'
	})
)(withApollo(withWindowSize(Convene)));
