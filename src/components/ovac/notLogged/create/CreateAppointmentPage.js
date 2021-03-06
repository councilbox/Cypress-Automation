import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as mainActions from '../../../../actions/mainActions';
import { BasicButton, Grid, GridItem, Link, LoadingMainApp, Scrollbar } from '../../../../displayComponents';
import { bHistory, moment } from '../../../../containers/App';
import withTranslations from '../../../../HOCs/withTranslations';
import { getPrimary } from '../../../../styles/colors';
import { isMobile } from '../../../../utils/screen';
import { getCustomLogo, useSubdomain } from '../../../../utils/subdomain';
import AppointmentDateForm from './AppointmentDateForm';
import AppointmentParticipantForm from './AppointmentParticipantForm';
import ServiceSelector from './ServiceSelector';
import CreationSuccessPage from './CreationSuccessPage';
import AppointmentFooter from './AppointmentFooter';
import { useCheckValidPhone } from '../../../../hooks';
import { checkValidEmail } from '../../../../utils';
import { buildDateFromDateTime } from '../../../../utils/CBX';


const CreateAppointmentPage = ({ match, translate, actions, client }) => {
	const [loadLanguage, setLoadedLanguage] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [appointmentData, setAppointmentData] = React.useState({
		companyId: '',
		statuteId: '',
		name: 'DEMO',
		acceptedLegal: false,
		participant: {
			name: '',
			surname: '',
			phoneCountryCode: '34',
			dni: '',
			email: '',
			phone: '',
		},
		date: new Date(),
		time: ''
	});
	const [errors, setErrors] = React.useState({
		name: '',
		surname: '',
		dni: '',
		email: '',
		phone: '',
		legalTerms: '',
		date: '',
		time: ''
	});
	const [subdomainData, setSubdomainData] = React.useState(null);
	const subdomain = useSubdomain();
	const { checkValidPhone } = useCheckValidPhone(client);
	const { language } = match.params;

	const primary = getPrimary();

	React.useEffect(() => {
		if (language && language !== translate.selectedLanguage) {
			actions.setLanguage(language);
		} else {
			setLoadedLanguage(true);
		}
	}, [language, translate.selectedLanguage]);


	const updateAppointmentData = object => {
		setAppointmentData({
			...appointmentData,
			...object
		});
	};

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query Subdomain($name: String!){
					subdomain(name: $name) {
						name
						entities {
							id
							businessName
						}
					}
				}
			`,
			variables: {
				name: subdomain.name
			}
		});

		setSubdomainData(response.data.subdomain);
		updateAppointmentData({
			companyId: response.data.subdomain.entities[0].id
		});
	}, [subdomain.name]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const checkRequiredFields = async () => {
		const cleanErrors = {
			name: '',
			surname: '',
			dni: '',
			email: '',
			phone: '',
			phoneCountryCode: '',
			legalTerms: '',
			date: '',
			time: ''
		};
		const newErrors = {};
		const { participant, acceptedLegal, ...council } = appointmentData;

		if (!participant.name || !participant.name.trim()) {
			newErrors.name = translate.required_field;
		}

		if (!participant.surname || !participant.name.trim()) {
			newErrors.surname = translate.required_field;
		}

		if (!participant.phone || !participant.phoneCountryCode) {
			if (!participant.phone) {
				newErrors.phone = translate.required_field;
			}

			if (!participant.phoneCountryCode) {
				newErrors.phoneCountryCode = translate.required_field;
			}
		} else {
			const response = await checkValidPhone(`+${participant.phoneCountryCode}${participant.phone}`);

			if (!response.success) {
				newErrors.phone = translate.enter_valid_phone_number;
			}
		}

		if (!participant.email) {
			newErrors.email = translate.required_field;
		} else if (!checkValidEmail(participant.email)) {
			newErrors.email = translate.valid_email_required;
		}

		if (!participant.dni) {
			newErrors.dni = translate.required_field;
		}

		if (!acceptedLegal) {
			newErrors.acceptedLegal = translate.must_accept_terms_and_conditions;
		}

		if (!council.date) {
			newErrors.date = translate.appointment_date_is_required;
		}

		if (!council.time) {
			newErrors.time = translate.appointment_time_is_required;
		} else {
			const startDate = buildDateFromDateTime(council.date, council.time);
			if (!moment(startDate).isAfter(moment())) {
				newErrors.date = translate.start_date_earlier_right_now;
			}
		}

		const hasError = Object.keys(newErrors).length > 0;

		if (hasError) {
			setErrors({
				...errors,
				...cleanErrors,
				...newErrors
			});
		} else {
			setErrors({
				...errors,
				...cleanErrors
			});
		}

		return hasError;
	};

	const createAppointment = async () => {
		if (!await checkRequiredFields()) {
			setLoading(true);
			const { participant, acceptedLegal, ...council } = appointmentData;

			council.dateStart = buildDateFromDateTime(council.date, council.time);
			delete council.date;
			delete council.time;

			participant.phone = `+${participant.phoneCountryCode}${participant.phone}`;
			delete participant.phoneCountryCode;

			const response = await client.mutate({
				mutation: gql`
					mutation CreateAppointment($council: CouncilInput, $participant: ParticipantInput) {
						createAppointment(council: $council, participant: $participant) {
							id
							company {
								businessName
								id
							}
							name
							dateStart
							statute {
								title
							}
						}
					}
				`,
				variables: {
					participant,
					council
				}
			});

			if (response.data?.createAppointment?.id) {
				setSuccess(response.data.createAppointment);
			}
			setLoading(false);
		}
	};

	const updateParticipant = object => {
		setAppointmentData({
			...appointmentData,
			participant: {
				...appointmentData.participant,
				...object
			}
		});
	};

	if (!loadLanguage || !subdomainData) {
		return <LoadingMainApp />;
	}

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Scrollbar>
				<div style={{ width: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
					<div style={{
						height: '4.5em',
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Link to="/">
							<img src={getCustomLogo()} style={{
								height: '3em',
								width: 'auto',
								...subdomain?.styles?.appointmentLogo
							}} />
						</Link>
					</div>
					<h2 style={{
						marginTop: '1em',
						textAlign: 'center',
						fontWeight: 'normal',
						fontStretch: 'normal',
						fontStyle: 'normal',
						lineHeight: 'normal',
						letterSpacing: 'normal'
					}}>
						{translate.request_appointment}
					</h2>
					<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
						<Grid
							style={{
								maxWidth: '1024px',
							}}
							spacing={success ? 0 : 16}
						>
							{success ?
								<CreationSuccessPage
									translate={translate}
									appointment={success}
									participant={appointmentData.participant}
								/>
								:
								<>
									<GridItem xs={12} md={6} lg={6} style={isMobile ? {} : { height: '100%', overflow: 'hidden' }} >
										<ServiceSelector
											appointment={appointmentData}
											setState={updateAppointmentData}
											entities={subdomainData.entities}
											translate={translate}
										/>
										<AppointmentDateForm
											errors={errors}
											translate={translate}
											appointment={appointmentData}
											setState={updateAppointmentData}
											style={{
												marginTop: '1em'
											}}
										/>
									</GridItem>
									<GridItem xs={12} md={6} lg={6} style={isMobile ? {} : { height: '100%', overflow: 'hidden' }}>
										<AppointmentParticipantForm
											translate={translate}
											errors={errors}
											appointment={appointmentData}
											participant={appointmentData.participant}
											setLegalTerms={value => setAppointmentData({
												...appointmentData,
												acceptedLegal: value
											})}
											setState={updateParticipant}
										/>
									</GridItem>
								</>
							}
						</Grid>
					</div>
					{!success &&
						<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
							<Grid
								style={{
									maxWidth: '1024px',
								}}
								alignItems="flex-end"
								alignContent="flex-end"
							>
								<GridItem xs={12} md={12} lg={12} style={{ height: '100%', overflow: 'hidden' }}>
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'flex-end',
											padding: '0.6em 0',
											paddingRight: isMobile ? '0.4em' : '4px'
										}}>
										<BasicButton
											text={translate.cancel}
											color="white"
											type="flat"
											onClick={() => bHistory.push('/')}
											textStyle={{
												fontWeight: '700',
												fontSize: '1.1em'
											}}
											buttonStyle={{
												padding: '0.8em'
											}}
										/>
										<BasicButton
											text={translate.request_appointment_button}
											loading={loading}
											loadingColor={'white'}
											onClick={createAppointment}
											color={primary}
											textStyle={{
												color: 'white',
												fontWeight: '700',
												fontSize: '1.1em'
											}}
											buttonStyle={{
												marginLeft: '0.6em',
												padding: '0.8em'
											}}
										/>
									</div>
								</GridItem>
							</Grid>
						</div>
					}
				</div>
				<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
					<Grid
						style={{
							maxWidth: '1024px',
						}}
						alignItems="flex-end"
						alignContent="flex-end"
					>
						<GridItem xs={12} md={12} lg={12} style={{ height: '100%', overflow: 'hidden' }}>
							<div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '0.6em 0' }}>
								<AppointmentFooter />
							</div>
						</GridItem>
					</Grid>
				</div>
			</Scrollbar>
		</div>
	);
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(mainActions, dispatch)
});

export default withTranslations()(withApollo(connect(null, mapDispatchToProps)(CreateAppointmentPage)));
