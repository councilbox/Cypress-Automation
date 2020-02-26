import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { LoadingSection } from '../../../../displayComponents';
import { Card } from 'material-ui';
import DownloadParticipantProxy from '../../prepare/DownloadParticipantProxy';
import { moment } from '../../../../containers/App';
const DelegationDocuments = ({ council, translate, client }) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query CouncilProxies($councilId: Int!){
                    councilProxies(councilId: $councilId){
                        date
                        signer {
                            id
                            name
                            surname
                        }
                        delegate {
                            id
                            name
                            surname
                        }
                        participant {
                            id
                            name
                            surname
                        }
                    }
                }
            `,
            variables: {
                councilId: council.id
            }
        });

        setData(response.data.councilProxies);
        setLoading(false);
    }, [council.id]);

    React.useEffect(() => {
        getData();
    }, [getData]);


    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            {loading?
                <LoadingSection />
            :
                data.map(item => (
                    <Card style={{marginTop: '1em', width: '95%', padding: '0.6em'}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <span style={{fontWeight: '700'}}>{translate.participant}:</span>
                                    {` ${item.participant.name} ${item.participant.surname}`}
                                <br/>
                                <span style={{fontWeight: '700'}}>{translate.delegates}</span>
                                {` ${item.delegate.name} ${item.delegate.surname}`}
                                {item.participant.id !== item.signer.id &&
                                    <>
                                        <br/>
                                        <span style={{fontWeight: '700'}}>{translate.signed}:</span>
                                        {` ${item.signer.name} ${item.signer.surname}, ${moment(item.date).format('LLL')}`}
                                    </>
                                }
                            </div>
                            <div>
                                <DownloadParticipantProxy
                                    participantId={item.participant.id}
                                    participant={item.participant}
                                    translate={translate}
                                />
                            </div>
                        </div>
                    </Card>
                ))
            }
        </div>
    )
}

export default withApollo(DelegationDocuments);