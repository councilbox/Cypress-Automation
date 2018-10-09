import React from "react";
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	FileUploadButton,
	Grid,
	GridItem,
	LoadingSection,
	LiveToast,
	SelectInput,
	SectionTitle,
	TextInput
} from "../../../displayComponents";
import { MenuItem } from "material-ui";
import withSharedProps from '../../../HOCs/withSharedProps';
import { compose, graphql, withApollo } from "react-apollo";
import { provinces } from "../../../queries/masters";
import { unlinkCompany, updateCompany } from "../../../queries/company";
import { getPrimary, getSecondary } from "../../../styles/colors";
import { bHistory, store } from "../../../containers/App";
import { getCompanies, setCompany } from "../../../actions/companyActions";
import gql from "graphql-tag";
import { toast } from "react-toastify";
import ConfirmCompanyButton from "../../corporation/companies/ConfirmCompanyButton";

export const info = gql`
	query info {
		companyTypes {
			label
			value
		}
		countries {
			deno
			id
		}
		languages {
			desc
			columnName
		}
	}
`;

class CompanySettingsPage extends React.Component {

	state = {
		data: this.props.company,
		success: false,
		error: false,
		fileSizeError: false,
		unlinkModal: false,
		request: false,
		provinces: [],
		errors: {}
	};

	componentDidMount(){
		this.props.info.refetch();
	}

	componentDidUpdate() {
		if (!this.props.info.loading && this.state.provinces.length === 0) {
			const selectedCountry = this.props.info.countries.find(
				country => country.deno === this.props.company.country
			);

			this.updateProvinces(selectedCountry.id);
		}
	}

	updateState(newValues) {
		this.setState({
			data: {
				...this.state.data,
				...newValues
			},
			success: false
		});
	}


	handleCountryChange = event => {
		this.updateState({ country: event.target.value });
		const selectedCountry = this.props.info.countries.find(
			country => country.deno === event.target.value
		);
		this.updateProvinces(selectedCountry.id);
	};

	updateProvinces = async countryID => {
		const response = await this.props.client.query({
			query: provinces,
			variables: {
				countryId: countryID
			}
		});

		if (!response.errors) {
			this.setState({
				provinces: response.data.provinces
			});
		}
	};

	handleFile = event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}

		let reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = async () => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: Math.round(file.size / 1000),
				base64: reader.result,
				councilId: this.props.councilID
			};

			if(fileInfo.filesize > 2000){
				this.setState({
					fileSizeError: true
				});
			}else{
				this.setState({
					uploading: true,
					data: {
						...this.state.data,
						logo: fileInfo.base64
					},
					success: false
				});
			}
		};
	};

	saveCompany = async () => {
		if (!this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const { __typename, ...data } = this.state.data;

			const response = await this.props.updateCompany({
				variables: {
					company: data
				}
			});
			if (response.errors) {
				this.setState({
					error: true,
					loading: false,
					success: false
				});
			} else {
				this.setState({
					error: false,
					loading: false,
					success: true
				}, () => bHistory.push('/'));
				toast(
					<LiveToast
						message={this.props.translate.changes_saved}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "successToast"
					}
				);
				store.dispatch(setCompany(response.data.updateCompany));
			}
		}
	};

	unlinkCompany = async () => {
		const response = await this.props.unlinkCompany({
			variables: {
				userId: this.props.user.id,
				companyTin: this.props.company.tin
			}
		});

		if (!response.errors) {
			if (response.data.unlinkCompany.success) {
				store.dispatch(getCompanies(this.props.user.id));
				toast(
					<LiveToast
						message={this.props.translate.company_link_unliked_title}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,
						className: "successToast"
					}
				);
				bHistory.push("/");
			}
		}
	};

	checkRequiredFields() {
		const { translate } = this.props;

		let errors = {
			businessName: "",
			alias: "",
			tin: ""
		};

		const data = this.state.data;
		let hasError = false;

		if (!data.businessName) {
			hasError = true;
			errors.businessName = translate.field_required;
		}

		if (!data.alias) {
			hasError = true;
			errors.alias = translate.field_required;
		}

		if (!data.tin) {
			hasError = true;
			errors.tin = translate.field_required;
		}

		this.setState({
			errors: errors
		});
		return hasError;
	}

	render() {
		const primary = getPrimary();
		const secondary = getSecondary();
		const { translate } = this.props;
		const { data, errors, success, request } = this.state;
		const updateError = this.state.error;
		const { loading } = this.props.info;

		if (loading) {
			return <LoadingSection />;
		}

		return (
			<CardPageLayout title={translate.company_settings}>
				<div style={{width: '100%', height: '100%', padding: '1.5em'}}>
					<SectionTitle
						text={translate.fiscal_data}
						color={primary}
					/>
					<br />
					<Grid spacing={0}>
						<GridItem xs={12} md={9} lg={9}>
							<Grid spacing={16}>
								<GridItem xs={12} md={6} lg={5}>
									<TextInput
										floatingText={translate.business_name}
										type="text"
										id="business-name"
										value={data.businessName}
										errorText={errors.businessName}
										onChange={event =>
											this.updateState({
												businessName: event.target.value
											})
										}
										required
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={4}>
									<TextInput
										floatingText={translate.entity_name}
										type="text"
										value={data.alias}
										errorText={errors.alias}
										onChange={event =>
											this.updateState({
												alias: event.target.value
											})
										}
										required
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={3}>
									<SelectInput
										floatingText={translate.company_type}
										value={data.type}
										disabled
										onChange={event =>
											this.updateState({
												type: event.target.value
											})
										}
										errorText={errors.type}
									>
										{this.props.info.companyTypes.map(
											companyType => {
												return (
													<MenuItem
														key={companyType.label}
														value={companyType.value}
													>
														{
															translate[
																companyType.label
															]
														}
													</MenuItem>
												);
											}
										)}
									</SelectInput>
								</GridItem>
								<GridItem xs={12} md={6} lg={4}>
									<TextInput
										floatingText={translate.entity_cif}
										type="text"
										value={data.tin}
										errorText={errors.tin}
										onChange={event =>
											this.updateState({
												tin: event.target.value
											})
										}
										required
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={4}>
									<TextInput
										floatingText={translate.company_new_domain}
										type="text"
										value={data.domain}
										errorText={errors.domain}
										onChange={event =>
											this.updateState({
												domain: event.target.value
											})
										}
									/>
								</GridItem>
								<GridItem xs={12} md={6} lg={4}>
									<TextInput
										floatingText={translate.company_new_key}
										type="text"
										value={data.linkKey}
										helpPopover={true}
										helpTitle={translate.company_new_key}
										helpDescription={translate.company_link_key_desc}
										errorText={errors.linkKey}
										onChange={event =>
											this.updateState({
												linkKey: event.target.value
											})
										}
									/>
								</GridItem>
							</Grid>
						</GridItem>
						<GridItem
							xs={12}
							md={3}
							lg={3}
							style={{ textAlign: "center" }}
						>
							<GridItem xs={12} md={12} lg={12}>
								{!!data.logo && (
									<img
										src={data.logo}
										alt="logo"
										style={{
											marginBottom: "0.6em",
											maxHeight: "4em",
											maxWidth: "100%"
										}}
									/>
								)}
							</GridItem>
							<GridItem xs={12} md={12} lg={12}>
								<FileUploadButton
									text={translate.company_logotype}
									image
									color={secondary}
									textStyle={{
										color: "white",
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									icon={
										<ButtonIcon type="publish" color="white" />
									}
									onChange={this.handleFile}
								/>
							</GridItem>
						</GridItem>
					</Grid>
					<br />
					<SectionTitle
						text={translate.contact_data}
						color={primary}
						style={{
							marginTop: '2em'
						}}
					/>
					<br />
					<Grid spacing={16}>
						<GridItem xs={12} md={6} lg={6}>
							<TextInput
								floatingText={translate.address}
								type="text"
								value={data.address}
								errorText={errors.address}
								onChange={event =>
									this.updateState({
										address: event.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={6} lg={6}>
							<TextInput
								floatingText={translate.company_new_locality}
								type="text"
								value={data.city}
								errorText={errors.city}
								onChange={event =>
									this.updateState({
										city: event.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={6} lg={3}>
							<SelectInput
								floatingText={translate.company_new_country}
								value={data.country}
								onChange={this.handleCountryChange}
								errorText={errors.country}
							>
								{this.props.info.countries.map(country => {
									return (
										<MenuItem
											key={country.deno}
											value={country.deno}
										>
											{country.deno}
										</MenuItem>
									);
								})}
							</SelectInput>
						</GridItem>
						<GridItem xs={12} md={6} lg={3}>
							<SelectInput
								floatingText={translate.company_new_country_state}
								value={data.countryState}
								errorText={errors.countryState}
								onChange={event =>
									this.updateState({
										countryState: event.target.value
									})
								}
							>
								{this.state.provinces.map(province => {
									return (
										<MenuItem
											key={province.deno}
											value={province.deno}
										>
											{province.deno}
										</MenuItem>
									);
								})}
							</SelectInput>
						</GridItem>
						<GridItem xs={12} md={6} lg={3}>
							<TextInput
								floatingText={translate.company_new_zipcode}
								type="text"
								value={data.zipcode}
								errorText={errors.zipcode}
								onChange={event =>
									this.updateState({
										zipcode: event.target.value
									})
								}
							/>
						</GridItem>
						<GridItem xs={12} md={6} lg={3}>
							<SelectInput
								floatingText={translate.language}
								value={data.language}
								onChange={event =>
									this.updateState({
										language: event.target.value
									})
								}
								errorText={errors.language}
							>
								{this.props.info.languages &&
									this.props.info.languages.map(language => (
										<MenuItem
											key={`language_${language.columnName}`}
											value={language.columnName}
										>
											{language.desc}
										</MenuItem>
									))}
							</SelectInput>
						</GridItem>
					</Grid>
					<br />
					<BasicButton
						text={translate.save}
						id="save-button"
						color={getPrimary()}
						error={updateError}
						success={success}
						loading={request}
						floatRight
						textStyle={{
							color: "white",
							fontWeight: "700"
						}}
						onClick={this.saveCompany}
						icon={<ButtonIcon type="save" color="white" />}
					/>
					{this.props.linkButton &&
						<BasicButton
							text={translate.unlink}
							color={getPrimary()}
							floatRight
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							buttonStyle={{ marginRight: "1.2em" }}
							onClick={() =>
								this.setState({
									unlinkModal: true
								})
							}
							icon={<ButtonIcon type="link_off" color="white" />}
						/>
					}

					{this.props.confirmCompany &&
						<ConfirmCompanyButton
							translate={translate}
							company={this.props.company}
							refetch={this.props.refetch}
						/>
					}
					<AlertConfirm
						requestClose={() => this.setState({ unlinkModal: false })}
						open={this.state.unlinkModal}
						acceptAction={this.unlinkCompany}
						buttonAccept={translate.accept}
						buttonCancel={translate.cancel}
						bodyText={<div>{translate.companies_unlink}</div>}
						title={translate.edit}
					/>
					<AlertConfirm
						requestClose={() => this.setState({ fileSizeError: false })}
						open={this.state.fileSizeError}
						buttonCancel={translate.accept}
						bodyText={<div>{translate.file_exceeds}</div>}
						title={translate.error}
					/>
				</div>
			</CardPageLayout>
		);
	}
}

export default compose(
	graphql(info, {
		name: "info",
		options: props => ({
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(updateCompany, {
		name: "updateCompany",
		options: {
			errorPolicy: "all"
		}
	}),
	graphql(unlinkCompany, {
		name: "unlinkCompany"
	})
)(withApollo(withSharedProps()(CompanySettingsPage)));
