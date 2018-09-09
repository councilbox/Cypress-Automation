import React from 'react';
import { EnhancedTable, CloseIcon, BasicButton, ButtonIcon, SelectInput, AlertConfirm } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import { TableRow, TableCell, MenuItem } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import NewParticipantModal from './NewParticipantModal';
import ParticipantEditorModal from './ParticipantEditorModal';
import ChangeCensusMenu from '../../../council/editor/census/ChangeCensusMenu';

class SignatureParticipants extends React.Component {

    state = {
        newParticipantModal: false,
        participantId: null,
        censusModal: false,
        selectedCensus: null
    }

    openCensusChangeModal = event => {
        console.log(event.target.value);
        this.setState({
            censusModal: true,
            selectedCensus: event.target.value
        })
    }

    deleteParticipant = async participantId => {
        const response = await this.props.removeSignatureParticipant({
            variables: {
                participantId: participantId
            }
        });

        if(response.data.removeSignatureParticipant.success){
            this.props.data.refetch();
        }
    }

    editParticipant = id => {
        this.setState({
            editParticipant: id
        })
    }

    render(){
        const { translate } = this.props;
        const { signatureParticipants = { list: [], total: 0}, loading, censuses = { list: [], total: 0}} = this.props.data;
        const primary = getPrimary();
        const secondary = getSecondary();

        return(
            <React.Fragment>
                <NewParticipantModal
                    open={this.state.newParticipantModal}
                    translate={translate}
                    signature={this.props.signature}
                    refetch={this.props.data.refetch}
                    requestClose={() => this.setState({ newParticipantModal: false })}
                />
                {!!this.state.editParticipant &&
                    <ParticipantEditorModal
                        participantId={this.state.editParticipant}
                        key={this.state.editParticipant}
                        translate={translate}
                        signature={this.props.signature}
                        refetch={this.props.data.refetch}
                        requestClose={() => this.setState({ editParticipant: null })}
                    />
                }
                <EnhancedTable
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={PARTICIPANTS_LIMITS[0]}
                    defaultFilter={"fullName"}
                    defaultOrder={["fullName", "asc"]}
                    limits={PARTICIPANTS_LIMITS}
                    menuButtons={
                        <React.Fragment>
                            <div style={{minWidth: '8em', marginRight: '1em'}}>
                                <SelectInput
                                    floatingText={translate.current_census}
                                    value={this.props.signature.selectedCensusId}
                                    onChange={this.openCensusChangeModal}
                                >
                                    {censuses.list.map(census => {
                                        return (
                                            <MenuItem
                                                value={parseInt(census.id, 10)}
                                                key={`census${census.id}`}
                                            >
                                                {census.censusName}
                                            </MenuItem>
                                        );
                                    })}
                                </SelectInput>
                            </div>
                            <div style={{width: '15em', display: 'flex', justifyContent: 'flex-end'}}>
                                <BasicButton
                                    text={translate.add_participant}
                                    color={'white'}
                                    textStyle={{color: primary, textTransform: 'none', fontWeight: '700'}}
                                    buttonStyle={{border: `2px solid ${primary}`, marginRight: '1.2em'}}
                                    icon={<ButtonIcon type="add" color={primary} />}
                                    onClick={() => this.setState({ newParticipantModal: true })}
                                />
                            </div>
                        </React.Fragment>
                    }
                    page={1}
                    loading={loading}
                    length={signatureParticipants.list.length}
                    total={signatureParticipants.total}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                    fields={[
                        {
                            value: "fullName",
                            translation: translate.participant_data
                        },
                        {
                            value: "dni",
                            translation: translate.dni
                        },
                        {
                            value: "email",
                            translation: translate.email
                        }
                    ]}
                    headers={[
                        {
                            name: 'fullName',
                            text: translate.participant_data,
                            canOrder: true
                        },
                        {
                            name: 'dni',
                            text: translate.dni,
                            canOrder: true
                        },
                        {   
                            name: 'email',
                            text: translate.email,
                            canOrder: true
                        },
                        {
                            text: ''
                        }
                    ]}
                >
                    {signatureParticipants.list.length > 0 &&
                        signatureParticipants.list.map(participant => (
                            <HoverableRow
                                participant={participant}
                                key={`participant_${participant.id}`}
                                deleteParticipant={this.deleteParticipant}
                                editParticipant={this.editParticipant}
                            />
                        ))
                    }
                </EnhancedTable>
                <AlertConfirm
                    requestClose={() => this.setState({
                        censusModal: false
                    })}
                    open={this.props.open}
                    acceptAction={this.updateCensus}
                    buttonAccept={translate.accept}
                    buttonCancel={translate.cancel}
                    bodyText={this._renderBody()}
                    title={translate.census}
                />
            </React.Fragment>
        )
    }
}

class HoverableRow extends React.Component {

    state = {
        showActions: false
    }

    handleMouseEnter = () => {
        this.setState({
            showActions: true
        });
    }

    handleMouseLeave = () => {
        this.setState({
            showActions: false
        });
    }

    render(){
        const { participant } = this.props;

        return(
            <TableRow
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                hover
                style={{
                    cursor: 'pointer'
                }}
                onClick={() => this.props.editParticipant(participant.id)}
            >
                <TableCell>
                    {`${participant.name} ${participant.surname}`}
                </TableCell>
                
                <TableCell>
                    {participant.dni}
                </TableCell>
                <TableCell>
                    {participant.email}
                </TableCell>
                <TableCell>
                    {this.state.showActions?
                        <CloseIcon
                            style={{
                                color: getPrimary()
                            }}
                            onClick={event => {
                                event.stopPropagation();
                                this.props.deleteParticipant(participant.id)
                            }}
                        />
                    :
                        <div style={{width: '4em'}} />
                    }
                </TableCell>
            </TableRow>
        )
    }
}

const signatureParticipants = gql`
    query SignatureParticipants($signatureId: Int!, $filters: [FilterInput], $options: OptionsInput, $companyId: Int!){
        signatureParticipants(signatureId: $signatureId, filters: $filters, options: $options){
            list{
                id
                name
                surname
                dni
                email
            }
            total
        }
        censuses(companyId: $companyId) {
			list {
				id
				companyId
				censusName
				censusDescription
				defaultCensus
				quorumPrototype
				state
			}
			total
		}
    }
`;

const removeSignatureParticipant = gql`
    mutation RemoveSignatureParticipant($participantId: Int!){
        removeSignatureParticipant(id: $participantId){
            success
            message
        }
    }
`;

export default compose(
    graphql(removeSignatureParticipant, {
        name: 'removeSignatureParticipant'
    }),
    graphql(signatureParticipants, {
        options: props => ({
            variables: {
                signatureId: props.signature.id,
                companyId: props.company.id,
                options: {
                    limit: PARTICIPANTS_LIMITS[0],
                    offset: 0
                }
            }
        })
    })
)(SignatureParticipants);