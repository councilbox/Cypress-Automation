import React, { Component, Fragment } from 'react';

import {
    BasicButton, CardPageLayout, DropDownMenu, ErrorWrapper, Icon, LoadingSection
} from "../../../displayComponents";
import { getPrimary, getSecondary } from '../../../styles/colors';
import { Divider, MenuItem } from 'material-ui';
import { graphql, withApollo } from 'react-apollo';
import { bHistory } from '../../../containers/App';
import { councilDetails, downloadConvenePDF } from '../../../queries';
import * as CBX from '../../../utils/CBX';
import ReminderModal from './modals/ReminderModal';
import FontAwesome from 'react-fontawesome';
import RescheduleModal from './modals/RescheduleModal';
import SendConveneModal from './modals/SendConveneModal';
import CancelModal from './modals/CancelModal';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Convene from '../convene/Convene';
import ConvenedParticipantsTable from "./ConvenedParticipantsTable";

const panelStyle = {
    height: '77vh',
    overflow: 'hidden',
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
    borderRadius: '0px 5px 5px 5px',
    padding: '1vw'
};


class CouncilPreparePage extends Component {

    goToPrepareRoom = () => {
        bHistory.push(`/company/${this.props.companyID}/council/${this.props.councilID}/live`);
    };
    downloadPDF = async () => {
        const response = await this.props.client.query({
            query: downloadConvenePDF,
            variables: {
                councilId: this.props.data.council.id
            }
        });

        if (response) {
            if (response.data.downloadConvenePDF) {
                CBX.downloadFile(response.data.downloadConvenePDF, 'application/pdf', `${this.props.translate.convene} - ${this.props.data.council.name}`);
            }
        }
        console.log(response);
    };

    constructor(props) {
        super(props);
        this.state = {
            participants: false,
            sendReminder: false,
            sendConvene: false,
            cancel: false,
            rescheduleCouncil: false
        }
    }

    componentDidMount() {
        this.props.data.refetch();
    }

    render() {
        const { council, error, loading, councilSocialCapital, councilTotalVotes, refetch } = this.props.data;
        const { translate, councilID } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();

        if (loading) {
            return (<LoadingSection/>);
        }

        if (error) {
            return (<ErrorWrapper error={error} translate={translate}/>)
        }

        return (<CardPageLayout title={translate.prepare_room}>
            <div>
                <div style={{
                    float: 'right'
                }}>
                    <DropDownMenu
                        color="transparent"
                        buttonStyle={{
                            boxSizing: 'border-box',
                            padding: '0',
                            border: `1px solid ${primary}`,
                            marginLeft: '0.3em'
                        }}
                        text={<FontAwesome
                            name={'bars'}
                            style={{
                                cursor: 'pointer',
                                fontSize: '0.8em',
                                height: '0.8em',
                                color: primary
                            }}
                        />}
                        textStyle={{ color: primary }}
                        type="flat"
                        icon={<Icon className="material-icons"
                                    style={{ color: primary }}>keyboard_arrow_down</Icon>}
                        items={<Fragment>
                            {CBX.councilIsNotified(council) ?
                                <MenuItem onClick={() => this.setState({ sendReminder: true })}>
                                    <Icon className="material-icons" style={{
                                        color: secondary,
                                        marginRight: '0.4em'
                                    }}>update</Icon>
                                    {translate.send_reminder}
                                </MenuItem> : <MenuItem onClick={() => this.setState({ sendConvene: true })}>
                                    <Icon className="material-icons" style={{
                                        color: secondary,
                                        marginRight: '0.4em'
                                    }}>notifications</Icon>
                                    {translate.new_send}
                                </MenuItem>}
                            <MenuItem onClick={() => this.setState({ rescheduleCouncil: true })}>
                                <Icon className="material-icons" style={{
                                    color: secondary,
                                    marginRight: '0.4em'
                                }}>schedule</Icon>
                                {translate.reschedule_council}
                            </MenuItem>
                            <Divider light/>
                            <MenuItem onClick={() => this.setState({ cancel: true })}>
                                <Icon className="material-icons" style={{
                                    color: 'red',
                                    marginRight: '0.4em'
                                }}>highlight_off</Icon>
                                {translate.cancel_council}
                            </MenuItem>
                        </Fragment>}
                    />
                </div>
                <BasicButton
                    floatRight
                    text={translate.prepare_room}
                    color={primary}
                    buttonStyle={{
                        margin: '0',
                        height: '100%'
                    }}
                    textStyle={{
                        color: 'white',
                        fontWeight: '700',
                        marginLeft: '0.3em',
                        fontSize: '0.9em',
                        textTransform: 'none'
                    }}
                    icon={<FontAwesome
                        name={'user-plus'}
                        style={{
                            fontSize: '1em',
                            color: 'white',
                            marginLeft: '0.3em'
                        }}
                    />}
                    textPosition="after"
                    onClick={this.goToPrepareRoom}
                />
            </div>
            <Tabs
                selectedIndex={this.state.selectedTab}
                style={{
                    padding: '0',
                    width: '100%',
                    margin: '0'
                }}>
                <TabList>
                    <Tab onClick={() => this.setState({
                        page: !this.state.page
                    })}>
                        {translate.convene}
                    </Tab>
                    <Tab onClick={() => this.setState({
                        page: !this.state.page
                    })}>
                        {translate.new_list_called}
                    </Tab>
                </TabList>
                <TabPanel style={panelStyle}>
                    <Convene councilID={councilID}
                             translate={translate}/>
                </TabPanel>

                <TabPanel style={panelStyle}>
                    <ConvenedParticipantsTable
                        council={council}
                        participations={CBX.hasParticipations(this.props.council)}
                        translate={translate}
                        refetch={refetch}
                    />
                </TabPanel>
            </Tabs>

            <ReminderModal
                show={this.state.sendReminder}
                council={council}
                requestClose={() => this.setState({ sendReminder: false })}
                translate={translate}
            />
            <CancelModal
                show={this.state.cancel}
                council={council}
                requestClose={() => this.setState({ cancel: false })}
                translate={translate}
            />
            <SendConveneModal
                show={this.state.sendConvene}
                council={council}
                refetch={refetch}
                requestClose={() => this.setState({ sendConvene: false })}
                translate={translate}
            />
            <RescheduleModal
                show={this.state.rescheduleCouncil}
                council={council}
                requestClose={() => this.setState({ rescheduleCouncil: false })}
                translate={translate}
            />
        </CardPageLayout>);
    }
}

export default graphql(councilDetails, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
        }
    })
})(withApollo(CouncilPreparePage));