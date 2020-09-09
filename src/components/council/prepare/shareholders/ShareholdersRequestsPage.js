import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, PaginationFooter, DropDownMenu, Scrollbar, TextInput, Icon, Grid } from '../../../../displayComponents';
import { usePolling } from '../../../../hooks';
import { Table, TableBody, TableRow, MenuItem } from 'material-ui';
import { TableHead } from 'material-ui';
import { TableCell } from 'material-ui';
import { moment } from '../../../../containers/App';
import CheckShareholderRequest, { getTypeText } from './CheckShareholderRequest';
import { isMobile } from '../../../../utils/screen';


const ShareholdersRequestsPage = ({ council, translate, client }) => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [search, setSearch] = React.useState({ state: '0' });
    const [usersPage, setUsersPage] = React.useState(1);
    const [usersTotal, setUsersTotal] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');


    const getData = React.useCallback(async () => {
        const response = await client.query({
            query: gql`
                query ShareholdersRequest($councilId: Int!,$filters: [FilterInput],$options: OptionsInput, $searchText: String){
                    shareholdersRequests(councilId: $councilId, filters: $filters, options: $options, searchText: $searchText){
                        list { 
                            councilId
                            id
                            participantId
                            data
                            participantCreated
                            date
                            state
                        }
                        total
                    }
                }
            `,
            variables: {
                councilId: council.id,
                filters: [{ field: 'state', text: search }],
                options: {
                    limit: 10,
                    offset: (usersPage - 1) * 10,
                    orderDirection: 'ASC',

                },
                searchText
            }
        });

        if (response.data.shareholdersRequests) {
            setData(response.data.shareholdersRequests.list);
            setUsersTotal(response.data.shareholdersRequests.total);
        }
        setLoading(false);
    }, [council.id, usersPage, search, searchText])

    usePolling(getData, 8000);

    React.useEffect(() => {
        const timeout = setTimeout(getData, 300);
        return () => clearTimeout(timeout);
    }, [getData, usersPage, search, searchText])

    if (loading) {
        return <LoadingSection />
    }

    return (
        <div style={{ padding: '2em 1em 1em', height: "calc( 100% - 3em )" }}>
            <Scrollbar>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ display: "flex", width: "50px", marginBottom: "2em" }}>
                        <DropDownMenu
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            color="transparent"
                            Component={() =>
                                <div style={{ marginTop: "0.5em", cursor: "pointer" }}>
                                    <div>
                                        <i class="fa fa-filter" aria-hidden="true" style={{ color: '#c196c3', fontSize: "24px" }}></i>
                                    </div>
                                </div>
                            }
                            textStyle={{ color: "#c196c3" }}
                            type="flat"
                            items={
                                <div style={{ color: "" }}>
                                    {/* TRADUCCION */}
                                    <MenuItem onClick={() => setSearch('1')} >
                                        Aceptada
                                    </MenuItem>
                                    <MenuItem onClick={() => setSearch('0')}>
                                        Pendiente
                                    </MenuItem>
                                </div>
                            }
                        />
                        
                    </div>
                    <TextInput
                        className={isMobile && !searchText ? "openInput" : ""}
                        disableUnderline={true}
                        styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", padding: isMobile && searchText && "4px 5px", paddingLeft: !isMobile && "5px" }}
                        stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: isMobile && searchText ? "8px" : "4px" }}
                        adornment={<Icon onClick={() => setSearchText(!searchText)} >search</Icon>}
                        floatingText={" "}
                        type="text"
                        value={searchText}
                        placeholder={isMobile ? "" : translate.search}
                        onChange={event => {
                            setSearchText(event.target.value);
                        }}
                        styles={{ marginTop: "-16px", width: '200px' }}
                        stylesTextField={{ marginBottom: "0px" }}
                    />
                </div>
                <Table>
                    <TableHead>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.name}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.email}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.dni}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.type}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.date}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            {translate.state}
                        </TableCell>
                        <TableCell style={{ color: 'rgb(125, 33, 128)', fontWeight: 'bold', borderBottom: 'none', fontSize: "0.75rem" }}>
                            Aprobar
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {data.map(request => (
                            <TableRow key={`request_${request.id}`}>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.name}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.email}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.data.dni}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {getTypeText(request.data.requestType, translate)}
                                </TableCell>
                                {/* <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    
                                </TableCell> */}
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {moment(request.date).format('LLL')}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    {request.state === '0' ? "Pendiente" : "Aceptada"}
                                </TableCell>
                                <TableCell style={{ color: "black", borderBottom: 'none' }}>
                                    <CheckShareholderRequest
                                        request={request}
                                        refetch={getData}
                                        translate={translate}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Grid style={{ margin: "1em", width: "97%" }} >
                    <PaginationFooter
                        page={usersPage}
                        translate={translate}
                        length={data.length}
                        total={usersTotal}
                        limit={10}
                        changePage={setUsersPage}
                        md={12}
                        xs={12}
                    />
                </Grid>
            </Scrollbar>
        </div >
    )
}

export default withApollo(ShareholdersRequestsPage);