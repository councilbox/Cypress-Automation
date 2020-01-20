import React from "react";
import {
	Grid,
	GridItem,
	BasicButton,
	Scrollbar,
	Link,
	TextInput,
	LoadingSection,
	PaginationFooter,
	CardPageLayout,
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { Avatar, Icon } from "material-ui";
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import withSharedProps from "../../../HOCs/withSharedProps";
import NewCompanyPage from "../../company/new/NewCompanyPage";
import RemoveCompany from './RemoveCompany';
import DeleteCompany from './DeleteCompany';
import MenuSuperiorTabs from "../../dashboard/MenuSuperiorTabs";
import { isMobile } from "react-device-detect";


const TablaCompanies = ({ client, translate, company, match }) => {
	const [companies, setCompanies] = React.useState(false);
	const [companiesPage, setCompaniesPage] = React.useState(1);
	const [companiesTotal, setCompaniesTotal] = React.useState(false);
	const [addEntidades, setEntidades] = React.useState(false);
	const [selectedCompany, setSelectedCompany] = React.useState('Lista de entidades');
	const [state, setState] = React.useState({
		filterTextCompanies: "",
		filterTextUsuarios: "",
		filterFecha: ""
	});
	const primary = getPrimary();

	const getCompanies = async () => {
		const response = await client.query({
			query: corporationCompanies,
			variables: {
				filters: [{ field: 'businessName', text: state.filterTextCompanies }],
				options: {
					limit: 20,
					offset: (companiesPage - 1) * 20,
					orderDirection: 'DESC'
				},
				corporationId: company.id
			}
		});

		if (response.data.corporationCompanies.list) {
			setCompanies(response.data.corporationCompanies.list)
			setCompaniesTotal(response.data.corporationCompanies.total)
		}
	}

	React.useEffect(() => {
		getCompanies()
	}, [state.filterTextCompanies, companiesPage]);

	const changePageCompanies = value => {
		setCompaniesPage(value)
	}

	if (addEntidades) {
		return <NewCompanyPage requestClose={() => setEntidades(false)} buttonBack={true} />
	}

	if (isMobile) {
		return (
			<div>
				
			</div>
		)
	} else {
		return (
			companies.length === undefined ?
				<LoadingSection />
				:
				<CardPageLayout title={translate.entities} stylesNoScroll={{ height: "100%" }} disableScroll={true}>
					<div style={{ fontSize: "13px", padding: '1.5em 1.5em 1.5em', height: "100%" }}>
						<div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
							{/* <div>
							<div>
								<MenuSuperiorTabs
									items={['Lista de entidades', 'Usuarios de entidades']}
									setSelect={setSelectedCompany}
								/>
							</div>
						</div> */}
							<div style={{ padding: "0.5em", display: "flex", alignItems: "center" }}>
								<BasicButton
									buttonStyle={{ boxShadow: "none", marginRight: "1em", borderRadius: "4px", border: `1px solid ${primary}`, padding: "0.2em 0.4em", marginTop: "5px", color: primary, }}
									backgroundColor={{ backgroundColor: "white" }}
									text={translate.add}
									onClick={() => setEntidades(true)}
								/>

								<div style={{ padding: "0px 8px", fontSize: "24px", color: "#c196c3" }}>
									<i className="fa fa-filter"></i>
								</div>

								<TextInput
									placeholder={translate.search}
									adornment={<Icon style={{ background: "#f0f3f6", paddingLeft: "5px", height: '100%', display: "flex", alignItems: "center", justifyContent: "center" }}>search</Icon>}
									type="text"
									value={state.filterTextCompanies || ""}
									styleInInput={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.54)", background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
									disableUnderline={true}
									stylesAdornment={{ background: "#f0f3f6", marginLeft: "0", paddingLeft: "8px" }}
									onChange={event => {
										setState({
											...state,
											filterTextCompanies: event.target.value
										})
									}}
								/>
							</div>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", padding: "1em", }}>
							<div style={{ color: primary, fontWeight: "bold", width: 'calc( 5% )', textAlign: 'left' }}>

							</div>
							<div style={{ color: primary, fontWeight: "bold", width: 'calc( 40% )', textAlign: 'left' }}>
								{translate.name}
							</div>
							<div style={{ color: primary, fontWeight: "bold", width: 'calc( 10% )', textAlign: 'left' }}>
								Id
						</div>
							<div style={{ color: primary, fontWeight: "bold", width: 'calc( 15% )', textAlign: 'left' }}>
								{translate.company_type}
							</div>
							<div style={{ color: primary, fontWeight: "bold", width: 'calc( 40% )', textAlign: 'left' }}>

							</div>
						</div>
						<div style={{ height: "calc( 100% - 13em )" }}>
							<Scrollbar>
								{companies.filter(item => item.id !== company.id).map(item => {
									return (
										<div
											key={item.id}
											style={{
												display: "flex",
												justifyContent: "space-between",
												padding: "1em"
											}}>
											<CellAvatar width={5} avatar={item.logo} />
											<Cell width={40} style={{ fontWeight: "bold" }} >
												{item.businessName}
											</Cell>
											<Cell width={10}>
												{item.id}
											</Cell>
											<Cell width={15}>
												S.L.
											{/* {item.companyType} */}
											</Cell>
											<Cell width={40} style={{ display: 'flex', overflow: "" }}>
												<RemoveCompany
													translate={translate}
													refetch={getCompanies}
													company={item}
													styles={{
														color: getPrimary(),
														background: 'white',
														borderRadius: '4px',
														boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														padding: "0.3em",
														marginRight: "1em",
														width: "100px"
													}}
													render={
														<span style={{}}>
															Expulsar
													</span>
													}
												/>
												<DeleteCompany
													translate={translate}
													refetch={getCompanies}
													company={item}
													styles={{
														color: getPrimary(),
														background: 'white',
														borderRadius: '4px',
														boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														padding: "0.3em",
														marginRight: "1em",
														width: "100px"
													}}
													render={
														<span style={{}}>
															Eliminar
													</span>
													}
												/>
												<Link to={`/company/${company.id}/edit/${item.id}`}
													styles={{
														color: getPrimary(),
														background: 'white',
														borderRadius: '4px',
														boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														padding: "0.3em",
														marginRight: "1em",
														width: "100px"
													}}>
													Editar
											</Link>
											</Cell>
										</div>

									)
								})}
							</Scrollbar>
						</div>
						<Grid style={{ marginTop: "1em" }}>
							<PaginationFooter
								page={companiesPage}
								translate={translate}
								length={companies.length}
								total={companiesTotal}
								limit={10}
								changePage={changePageCompanies}
							/>
						</Grid>
					</div>
				</CardPageLayout>
		)
	}
}

const Table = () => {

	return(
		<div></div>
	)
}

const CellAvatar = ({ avatar, width }) => {
	return (
		<div style={{ overflow: "hidden", width: `calc(${width}%)`, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: "10px" }}>
			{avatar ?
				<div style={{ height: '1.7em', width: '1.7em', borderRadius: '0.9em' }}>
					<img src={avatar} alt="Foto" style={{ height: '100%', width: '100%' }} />
				</div>
				:
				<i style={{ color: 'lightgrey', fontSize: "1.7em", marginLeft: '6px' }} className={'fa fa-building-o'} />
			}
		</div>
	)
}

const Cell = ({ text, avatar, width, children, style }) => {
	return (
		<div style={{
			overflow: "hidden",
			width: width ? `calc(${width}%)` : 'calc( 100% / 5 )',
			textAlign: 'left',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			paddingRight: "10px",
			...style
		}}>
			{children}
		</div>
	)
}


const corporationCompanies = gql`
    query corporationCompanies($filters: [FilterInput], $options: OptionsInput, $corporationId: Int){
        corporationCompanies(filters: $filters, options: $options, corporationId: $corporationId){
            list{
                id
                businessName
				logo
            }
            total
        }
    }
`;

export default withApollo(withSharedProps()(withRouter(TablaCompanies)));
