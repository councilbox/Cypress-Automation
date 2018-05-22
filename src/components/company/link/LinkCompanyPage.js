import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import withSharedProps from '../../../HOCs/withSharedProps';
import { CardPageLayout, Grid, GridItem, LoadingSection, TextInput, SelectInput, BasicButton, ButtonIcon, FileUploadButton } from '../../../displayComponents';
import { Typography, MenuItem } from 'material-ui'; 
import { getPrimary, getSecondary } from '../../../styles/colors';
import { provinces } from '../../../queries/masters';
import gql from 'graphql-tag';
import { store, bHistory } from '../../../containers/App';
import { getCompanies } from '../../../actions/companyActions';
import { toast } from 'react-toastify';

class LinkCompanyPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                linkKey: '',
                cif: ''
            },
            showPassword: false,
            errors: {},
            success: false,
            request: false,
            requestError: false
        }
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }

    checkRequiredFields = () => {
        return false;
    }

    linkCompany = async () => {
        if(!this.checkRequiredFields()){
            const response = await this.props.linkCompany({
                variables: {
                    userId: this.props.user.id,
                    companyTin: this.state.data.cif,
                    linkKey: this.state.data.linkKey
                }
            })
        }
    }


    render(){
        const { translate } = this.props;
        const { data, errors, requestError, success, request } = this.state;
        const primary = getPrimary();
        const secondary = getSecondary();

        return(
            <CardPageLayout title={translate.companies_link}>
                <Grid style={{marginTop: '4em'}}>
                    <GridItem xs={12} md={12} lg={12}>
                        <div style={{width: '400px', margin: 'auto'}}>
                            <TextInput
                                floatingText={translate.company_new_cif}
                                type="text"
                                required
                                value={data.cif}
                                errorText={errors.cif}
                                onChange={(event) => this.updateState({
                                    cif: event.target.value
                                })}
                            />
                        </div>
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <div style={{width: '400px', margin: 'auto'}}>
                            <TextInput
                                floatingText={translate.company_new_key}
                                type={this.state.showPassword? 'text' : 'password'}
                                passwordToggler={() => this.setState({showPassword: !this.state.showPassword})}
                                showPassword={this.state.showPassword}
                                required
                                value={data.linkKey}
                                errorText={errors.linkKey}
                                onChange={(event) => this.updateState({
                                    linkKey: event.target.value
                                })}
                            /><br/>
                            <BasicButton
                                text={translate.link}
                                color={getPrimary()}
                                error={requestError}
                                success={success}
                                loading={request}
                                floatRight
                                buttonStyle={{
                                    marginTop: '1.5em'
                                }}
                                textStyle={{
                                    color: 'white',
                                    fontWeight: '700'
                                }}
                                onClick={this.linkCompany}
                                icon={<ButtonIcon type="link" color='white'/>}
                            />
                        </div>
                    </GridItem>
                </Grid>
            </CardPageLayout>
        )
    }
}

const linkCompany = gql`
    mutation linkCompany($userId: Int!, $companyTin: String!, $linkKey: Int!){
        linkCompany(userId: $userId, companyTin: $companyTin, linkKey: $linkKey){
            success
            message
        }
    }
`;


export default graphql(linkCompany, {
    name: 'linkCompany'
})(withSharedProps()(withApollo(LinkCompanyPage)));