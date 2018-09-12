import React from "react";
import { MenuItem } from "material-ui";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	DateTimePicker,
	LiveToast,
	ErrorAlert,
	Grid,
	GridItem,
	LoadingSection,
	SelectInput,
	TextInput
} from "../../../displayComponents";
import gql from 'graphql-tag';
import RichTextInput from "../../../displayComponents/RichTextInput";
import { getPrimary, getSecondary } from "../../../styles/colors";
import PlaceModal from "./PlaceModal";
import LoadDraftModal from "../../company/drafts/LoadDraftModal";
import { compose, graphql } from "react-apollo";
import { changeStatute, councilStepOne, updateCouncil } from "../../../queries";
import * as CBX from "../../../utils/CBX";
import EditorStepLayout from './EditorStepLayout';
import { moment } from '../../../containers/App';
import { toast } from 'react-toastify';

class StepNotice extends React.Component {

	state = {
		placeModal: false,
		changeCensusModal: false,
		loading: false,
		success: false,
		alert: false,
		data: {},
		errors: {
			name: "",
			dateStart: "",
			dateStart2NdCall: "",
			country: "",
			countryState: "",
			city: "",
			zipcode: "",
			conveneText: "",
			street: ""
		}
	};

	baseState = this.state;

	editor = null;

 	componentDidUpdate(prevProps, prevState){
		if(!this.props.data.loading){
			if(prevState.data.dateStart !== this.state.data.dateStart){
				if(!CBX.checkMinimumAdvance(this.state.data.dateStart, this.props.data.council.statute)){
					this.updateError({
						dateStart: this.props.translate.new_statutes_warning
						.replace('{{council_prototype}}', this.props.translate[this.props.data.council.statute.title] || this.props.data.council.statute.title)
						.replace('{{days}}', this.props.data.council.statute.advanceNoticeDays)
					});
				}
			}
		}
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.data.council){
			const council = nextProps.data.council;
			return {
				data: {
					...nextProps.data.council,
					...(!council.dateStart || !council.dateStart2NdCall? CBX.generateInitialDates(nextProps.data.council.statute) : {}),
				}
			}
		}
		return null;
	}

	resetButtonStates = () => {
		this.setState({
			loading: false,
			success: false
		});
	}

	nextPage = async () => {
		if (!this.checkRequiredFields()) {
			const response = await this.updateCouncil(2);
			if(!response.data.errors){
				this.props.nextStep();
				this.props.data.refetch();
			}
		}
	};

	updateCouncil = async step => {
		this.setState({
			loading: true
		});
		const { __typename, statute, councilType, ...council } = this.state.data;
		const response = await this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
				}
			}
		});

		if(!response.data.errors){
			this.setState({
				loading: false,
				success: true
			});
		}

		return response;
	};

	savePlaceAndClose = council => {
		this.setState({
			placeModal: false,
			data: {
				...this.state.data,
				...council
			}
		});
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	updateError = object => {
		this.setState({
			errors: {
				...this.state.errors,
				...object
			}
		});
	};

	changeCensus = async () => {
		const response = await this.props.changeCensus({
			variables: {
				censusId: this.props.data.council.statute.censusId,
				councilId: this.props.data.council.id
			}
		});
		if (response) {
			this.setState({
				changeCensusModal: false
			});
		}
	}

	changeStatute = async statuteId => {
		const { statuteId: statute, ...actualState } = this.state.data;
		const response = await this.props.changeStatute({
			variables: {
				councilId: this.props.councilID,
				statuteId: statuteId
			}
		});

		if (response) {
			this.loadDraft({
				text: response.data.changeCouncilStatute.conveneHeader
			});
			await this.props.data.refetch();
			this.checkAssociatedCensus(statuteId);
			this.setState({
				data: actualState
			}, this.updateDate);
		}
	};

	updateDate = (
		firstDate = this.state.data.dateStart,
		secondDate = this.state.data.dateStart2NdCall
	) => {
		const { translate } = this.props;
		const statute = this.props.data.council.statute;
		const errors = {
			dateStart: '',
			dateStart2NdCall: ''
		};

		this.updateState({
			dateStart: firstDate,
			dateStart2NdCall: secondDate
		});

		if(!CBX.checkMinimumAdvance(firstDate, statute)){
			errors.dateStart = translate.new_statutes_warning
				.replace('{{council_prototype}}', translate[statute.title] || statute.title)
				.replace('{{days}}', statute.advanceNoticeDays)
		}
		if (!CBX.checkSecondDateAfterFirst(firstDate, secondDate)) {
			errors.dateStart2NdCall = translate["2nd_call_date_changed"];
			this.updateState({
				dateStart: firstDate,
				dateStart2NdCall: CBX.addMinimumDistance(
					firstDate,
					statute
				)
			});
		} else {
			if (
				!CBX.checkMinimumDistanceBetweenCalls(
					firstDate,
					secondDate,
					statute
				)
			) {
				errors.dateStart2NdCall = translate.new_statutes_hours_warning.replace("{{hours}}", statute.minimumSeparationBetweenCall);
			}
		}

		this.updateError(errors);
	};

	loadDraft = draft => {
		const correctedText = CBX.changeVariablesToValues(draft.text, {
			company: this.props.company,
			council: this.state.data
		}, this.props.translate);
		this.updateState({
			conveneText: correctedText
		});
		this.editor.setValue(correctedText);
	};

	checkRequiredFields() {
		const { translate } = this.props;
		const { data } = this.state;

		let errors = {
			name: "",
			dateStart: "",
			dateStart2NdCall: "",
			conveneText: ""
		};

		let hasError = false;

		if (!data.name) {
			hasError = true;
			errors.name = translate.new_enter_title;
		}

		if (!data.dateStart) {
			hasError = true;
			errors.dateStart = translate.field_required;
		}

		if (
			!data.conveneText ||
			data.conveneText.replace(/<\/?[^>]+(>|$)/g, "").length <= 0
		) {
			hasError = true;
			errors.conveneText = translate.field_required;
		} else {
			if(CBX.checkForUnclosedBraces(data.conveneText)){
				hasError = true;
				errors.conveneText = translate.revise_text;
				toast(
					<LiveToast
						message={translate.revise_text}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "errorToast"
					}
				);
			}
		}

		this.setState({
			alert: hasError,
			errors: errors
		});

		return hasError;
	}

	checkAssociatedCensus = (statuteId) => {
		const statute = this.props.data.companyStatutes.find(statute => statute.id === statuteId);
		console.log(statute);
		if(!!statute.censusId){
			this.setState({
				changeCensusModal: true
			});
		}

	}

	render() {
		const { translate, company } = this.props;
		const { companyStatutes, draftTypes } = this.props.data;
		const council = this.state.data;
		const { errors } = this.state;
		const primary = getPrimary();
		const secondary = getSecondary();
		let statute = {};
		if(!!this.props.data.council){
			statute = this.props.data.council.statute;
		}


		return (
			<React.Fragment>
				<EditorStepLayout
					body={
						!this.props.data.council && !this.props.data.errors?
							<div
								style={{
									height: "300px",
									width: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<LoadingSection />
							</div>
						:
							<React.Fragment>
								<Grid>
									<GridItem xs={12} md={4} lg={4} style={{paddingRight: '3.5em' }}>
										<SelectInput
											required
											floatingText={translate.council_type}
											value={
												this.props.data.council.statute.statuteId || ""
											}
											onChange={event =>
												this.changeStatute(+event.target.value)
											}
										>
											{companyStatutes.map((statute, index) => {
												return (
													<MenuItem
														value={statute.id}
														key={`statutes_${statute.id}`}
													>
														{translate[statute.title] ||
															statute.title}
													</MenuItem>
												);
											})}
										</SelectInput>
									</GridItem>
									<GridItem
										xs={12}
										md={8}
										lg={8}
										style={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}
									>
										<BasicButton
											text={translate.change_location}
											id={'change-place'}
											color={secondary}
											textStyle={{
												color: "white",
												fontWeight: "600",
												fontSize: "0.9em",
												textTransform: "none"
											}}
											textPosition="after"
											onClick={() => this.setState({ placeModal: true })}
											icon={
												<ButtonIcon type="location_on" color="white" />
											}
										/>
										<h6 style={{ paddingTop: "0.8em", marginLeft: '1em' }}>
											<b>{`${translate.new_location_of_celebrate}: `}</b>
											{council.remoteCelebration === 1
												? translate.remote_celebration
												: `${council.street}, ${council.country}`}
										</h6>
									</GridItem>

									<GridItem xs={12} md={4} lg={4} style={{marginTop: '1.3em'}}>
										<DateTimePicker
											required
											onChange={date => {
												const newDate = new Date(date);
												const dateString = newDate.toISOString();
												this.updateDate(dateString);
											}}
											minDateMessage={""}
											errorText={errors.dateStart}
											acceptText={translate.accept}
											cancelText={translate.cancel}
											minDate={Date.now()}
											label={translate["1st_call_date"]}
											value={council.dateStart}
										/>
									</GridItem>
									<GridItem xs={12} md={4} lg={4} style={{marginTop: '1.3em'}}>
										{CBX.hasSecondCall(statute) && (
											<DateTimePicker
												required
												minDate={
													!!council.dateStart
														? new Date(council.dateStart)
														: new Date()
												}
												errorText={errors.dateStart2NdCall}
												onChange={date => {
													const newDate = new Date(date);
													const dateString = newDate.toISOString();
													this.updateDate(undefined, dateString);
												}}
												minDateMessage={""}
												acceptText={translate.accept}
												cancelText={translate.cancel}
												label={translate["2nd_call_date"]}
												value={council.dateStart2NdCall}
											/>
										)}
									</GridItem>
									<GridItem xs={12} md={10} lg={10} style={{marginTop: '2em'}}>
										<TextInput
											required
											floatingText={translate.table_councils_name}
											type="text"
											errorText={errors.name}
											value={council.name || ""}
											onChange={event =>
												this.updateState({
													name: event.nativeEvent.target.value
												})
											}
										/>
									</GridItem>
									<GridItem xs={12} md={12} lg={12}>
										<RichTextInput
											ref={editor => this.editor = editor}
											key={this.props.versionControl}
											errorText={errors.conveneText}
											required
											loadDraft={
												<LoadDraftModal
													translate={translate}
													companyId={company.id}
													loadDraft={this.loadDraft}
													statute={statute}
													statutes={companyStatutes}
													draftType={
														draftTypes.filter(
															draft =>
																draft.label === "convene_header"
														)[0].value
													}
												/>
											}
											tags={[
												{
													value: moment(council.dateStart).format(
														"LLL"
													),
													label: translate.date
												},
												{
													value: company.businessName,
													label: translate.business_name
												},
												{
													value: `${council.street}, ${
														council.country
													}`,
													label: translate.new_location_of_celebrate
												},
												{
													value: council.country,
													label: translate.company_new_country
												}
											]}
											floatingText={translate.convene_info}
											value={council.conveneText || ""}
											onChange={value =>
												this.updateState({
													conveneText: value
												})
											}
										/>
									</GridItem>
								</Grid>
								<PlaceModal
									open={this.state.placeModal}
									close={() => this.setState({ placeModal: false })}
									place={this.state.place}
									countries={this.props.data.countries}
									translate={this.props.translate}
									saveAndClose={this.savePlaceAndClose}
									council={council}
								/>
								<AlertConfirm
									requestClose={() => this.setState({ changeCensusModal: false })}
									open={this.state.changeCensusModal}
									acceptAction={this.changeCensus}
									buttonAccept={translate.want_census_change}
									buttonCancel={'No cambiar'}//TRADUCCION
									bodyText={<div>{translate.census_change_statute}</div>}
									title={translate.census_change}
								/>
								<ErrorAlert
									title={translate.error}
									bodyText={translate.alert_must_fix_form}
									buttonAccept={translate.accept}
									open={this.state.alert}
									requestClose={() => this.setState({ alert: false })}
								/>
							</React.Fragment>
					}
					buttons={
						<React.Fragment>
							<BasicButton
								floatRight
								text={translate.save}
								loading={this.state.loading}
								success={this.state.success}
								reset={this.resetButtonStates}
								color={secondary}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none",
									marginRight: "0.6em"
								}}
								icon={<ButtonIcon type="save" color="white" />}
								textPosition="after"
								onClick={() => this.updateCouncil(1)}
							/>
							<BasicButton
								floatRight
								text={translate.next}
								color={primary}
								disabled={this.props.data.loading}
								loading={this.state.loading}
								icon={
									<ButtonIcon
										type="arrow_forward"
										color="white"
									/>
								}
								textStyle={{
									color: "white",
									fontWeight: "700",
									fontSize: "0.9em",
									textTransform: "none"
								}}
								textPosition="after"
								onClick={this.nextPage}
							/>
						</React.Fragment>
					}
				/>
			</React.Fragment>
		);
	}
}

const changeCensus = gql`
	mutation changeCensus($councilId: Int!, $censusId: Int!) {
		changeCensus(councilId: $councilId, censusId: $censusId){
			success
		}
	}
`;

export default compose(
	graphql(councilStepOne, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.company.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeCensus, {
		name: 'changeCensus'
	}),

	graphql(changeStatute, {
		name: "changeStatute"
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(StepNotice);