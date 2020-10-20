import { DatePicker } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import withSharedProps from '../../HOCs/withSharedProps';

const KPI = ({ translate, client }) => {
    const [dateStart, setDateStart] = React.useState('');
    const [dateEnd, setDateEnd] = React.useState('');
    const [KPI, setKPI] = React.useState(null);

    const getData = React.useCallback(async () => {
        if(!dateStart || !dateEnd){
            return;
        }

        const response = await client.query({
            query: gql`
                query KPI($dateStart: String!, $dateEnd: String!){
                    kpi(dateStart: $dateStart, dateEnd: $dateEnd)
                }
            `,
            variables: {
                dateStart: dateStart.format('YYYY/MM/DD'),
                dateEnd: dateEnd.format('YYYY/MM/DD'),
            }
        });
        console.log(response);
        setKPI(response.data.kpi);
    }, [dateStart, dateEnd]);

    React.useEffect(() => {
        getData();
    }, [getData])

    console.log(dateStart);

    return (
        <div style={{ padding: '2em' }}>
            <DatePicker onChange={value => setDateStart(value)} />
            <DatePicker onChange={value => setDateEnd(value)} />
            {KPI &&
                <>
                    {Object.keys(KPI).map((key, index) => (
                        <div key={`${key}_${index}`}>
                            {key}: {KPI[key]}
                        </div>
                    ))}
                </>
            }
        </div>
    )
}

export default withSharedProps()(withApollo(KPI));