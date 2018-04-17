import React, { Component } from 'react';
import { CardPageLayout, LoadingSection } from '../displayComponents';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateUserForm from './UpdateUserForm';
import { graphql } from 'react-apollo';
import { languages } from '../../queries';


class UserSettingsPage extends Component {

    render(){
        const { translate } = this.props;

        if(this.props.data.loading){
            return <LoadingSection />;
        }

        return(
           <CardPageLayout title={translate.settings}>
                <UpdateUserForm
                    translate={translate}
                    user={this.props.user}
                    languages={this.props.data.languages}
                />
                <ChangePasswordForm
                    translate={translate}
                />
            </CardPageLayout>
        );
    }
}

export default graphql(languages)(UserSettingsPage);