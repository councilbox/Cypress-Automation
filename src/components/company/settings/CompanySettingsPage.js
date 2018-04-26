import React, { Component } from 'react';
import {
    CardPageLayout, TextInput, SelectInput, FileUploadButton, LoadingSection, ButtonIcon, BasicButton, Grid, GridItem
} from '../../displayComponents/index';
import { Typography, MenuItem } from 'material-ui';
import { graphql, compose, withApollo } from 'react-apollo';
import { provinces } from '../../../queries/masters';
import { updateCompany } from '../../../queries/company';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { store } from '../../../containers/App';
import { setCompany } from '../../../actions/companyActions';
import gql from 'graphql-tag';

export const info = gql `
  query info {
    companyTypes {
      label
      value
    }
    countries {
      deno
      id
    }
    languages{
      desc
      columnName
    }
  }
`;

function getCompanyType(type, types) {
    for (let i = 0; i < types.length; i++) {
        const typeObject = types[ i ];
        if (type === typeObject.value) {
            return typeObject.label;
        }
    }
}

class CompanySettingsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.company,
            success: false,
            error: false,
            request: false,
            provinces: [],
            errors: {}
        }
    }

    async componentWillReceiveProps(nextProps) {

        const companyTypeText = getCompanyType(nextProps.company.type, nextProps.info.companyTypes);
        this.setState({
            data: nextProps.company,
            companyTypeText
        });

        if (!nextProps.info.loading) {
            const selectedCountry = nextProps.info.countries.find((country) => country.deno === this.props.company.country);

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

    handleCountryChange = (event) => {
        this.updateState({country: event.target.value});
        const selectedCountry = this.props.info.countries.find((country) => country.deno === event.target.value);
        this.updateProvinces(selectedCountry.id);
    };

    updateProvinces = async (countryID) => {
        const response = await this.props.client.query({
            query: provinces,
            variables: {
                countryId: countryID
            },
        });

        if (response) {
            this.setState({
                provinces: response.data.provinces
            })
        }
    };

    handleFile = (event) => {
        const file = event.nativeEvent.target.files[ 0 ];
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
                store.dispatch(setCompany(response.data.updateCompany));
                this.setState({
                    error: false,
                    loading: false,
                    success: true
                });
            }
        }
    };

    checkRequiredFields() {
        const { translate } = this.props;

        let errors = {
            businessName: '',
            alias: '',
            tin: '',
        };

        const data = this.state.data;
        let hasError = false;

        if (!data.businessName.length > 0) {
            hasError = true;
            errors.businessName = translate.field_required;
        }

        if (!data.alias.length > 0) {
            hasError = true;
            errors.alias = translate.field_required;
        }

        if (!data.tin.length > 0) {
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
            return <LoadingSection/>
        }

        return (

            <CardPageLayout title={translate.settings}>
                <Typography variant="title" style={{ color: primary }}>
                    {translate.fiscal_data}
                </Typography>
                <br/>
                <Grid spacing={0}>
                    <GridItem xs={12} md={9} lg={9}>
                        <Grid spacing={16}>
                            <GridItem xs={12} md={6} lg={5}>
                                <TextInput
                                    floatingText={translate.business_name}
                                    type="text"
                                    value={data.businessName}
                                    errorText={errors.businessName}
                                    onChange={(event) => this.updateState({
                                        businessName: event.target.value
                                    })}
                                    required
                                />
                            </GridItem>
                            <GridItem xs={12} md={6} lg={4}>
                                <TextInput
                                    floatingText={translate.company_new_alias}
                                    type="text"
                                    value={data.alias}
                                    errorText={errors.alias}
                                    onChange={(event) => this.updateState({
                                        alias: event.target.value
                                    })}
                                    required
                                />
                            </GridItem>
                            <GridItem xs={12} md={6} lg={3}>
                                <TextInput
                                    disabled
                                    floatingText={translate.company_type}
                                    type="text"
                                    value={translate[ this.state.companyTypeText ]}
                                    errorText={errors.type}
                                />
                            </GridItem>
                            <GridItem xs={12} md={6} lg={4}>
                                <TextInput
                                    floatingText={translate.company_new_cif}
                                    type="text"
                                    value={data.tin}
                                    errorText={errors.tin}
                                    onChange={(event) => this.updateState({
                                        tin: event.target.value
                                    })}
                                    required
                                />
                            </GridItem>
                            <GridItem xs={12} md={6} lg={4}>
                                <TextInput
                                    floatingText={translate.company_new_domain}
                                    type="text"
                                    value={data.domain}
                                    errorText={errors.domain}
                                    onChange={(event) => this.updateState({
                                        domain: event.target.value
                                    })}
                                />
                            </GridItem>
                            <GridItem xs={12} md={6} lg={4}>
                                <TextInput
                                    floatingText={translate.company_new_key}
                                    type="text"
                                    value={data.linkKey}
                                    errorText={errors.linkKey}
                                    onChange={(event) => this.updateState({
                                        linkKey: event.target.value
                                    })}
                                />
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem xs={12} md={3} lg={3} style={{ textAlign: 'center' }}>
                        <img src={data.logo} alt="logo" style={{
                            marginBottom: '0.6em',
                            maxHeight: '4em',
                            maxWidth: '100%'
                        }}/>
                        <FileUploadButton
                            text={translate.company_logotype}
                            image
                            color={secondary}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '0.9em',
                                textTransform: 'none'
                            }}
                            icon={<ButtonIcon type="publish" color='white'/>}
                            onChange={this.handleFile}
                        />
                    </GridItem>
                </Grid>
                <br/>
                <Typography variant="title" style={{ color: primary }}>
                    {translate.contact_data}
                </Typography>
                <br/>
                <Grid spacing={16}>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.address}
                            type="text"
                            value={data.address}
                            errorText={errors.address}
                            onChange={(event) => this.updateState({
                                address: event.target.value
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={6} lg={6}>
                        <TextInput
                            floatingText={translate.company_new_locality}
                            type="text"
                            value={data.city}
                            errorText={errors.city}
                            onChange={(event) => this.updateState({
                                city: event.target.value
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={6} lg={3}>
                        <SelectInput
                            floatingText={translate.company_new_country}
                            value={data.country}
                            onChange={this.handleCountryChange}
                            errorText={errors.country}
                        >
                            {this.props.info.countries.map((country) => {
                                return <MenuItem key={country.deno} value={country.deno}>{country.deno}</MenuItem>
                            })}
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={3}>
                        <SelectInput
                            floatingText={translate.company_new_country_state}
                            value={data.countryState}
                            errorText={errors.countryState}
                            onChange={(event) => this.updateState({ countryState: event.target.value })}
                        >
                            {this.state.provinces.map((province) => {
                                return <MenuItem key={province.deno} value={province.deno}>{province.deno}</MenuItem>
                            })}
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={12} md={6} lg={3}>
                        <TextInput
                            floatingText={translate.company_new_zipcode}
                            type="text"
                            value={data.zipcode}
                            errorText={errors.zipcode}
                            onChange={(event) => this.updateState({
                                zipcode: event.target.value
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={6} lg={3}>
                        <SelectInput
                            floatingText={translate.language}
                            value={data.language}
                            onChange={(event) => this.updateState({
                                preferred_language: event.target.value
                            })}
                            errorText={errors.language}>
                            {this.props.info.languages && this.props.info.languages.map((language) => <MenuItem
                                key={`language_${language.columnName}`} value={language.columnName}>
                                {language.desc}
                            </MenuItem>)}
                        </SelectInput>
                    </GridItem>
                </Grid>
                <br/>
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    error={updateError}
                    success={success}
                    loading={request}
                    floatRight
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                    onClick={this.saveCompany}
                    icon={<ButtonIcon type="save" color='white'/>}
                />
            </CardPageLayout>

        );
    }
}

export default compose(graphql(info, { name: 'info' }), graphql(updateCompany, {
    name: 'updateCompany',
    options: {
        errorPolicy: 'all'
    }
}))(withApollo(CompanySettingsPage));