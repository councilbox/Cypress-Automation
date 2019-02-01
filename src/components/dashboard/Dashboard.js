import React from "react";
import TopSectionBlocks from "./TopSectionBlocks";
import { darkGrey, lightGrey, primary, getSecondary } from "../../styles/colors";
import withSharedProps from '../../HOCs/withSharedProps';
import { Scrollbar, CBXFooter, Block, Icon, BasicButton, ButtonIcon, AlertConfirm, GridItem, Grid } from '../../displayComponents';
import { moment } from '../../containers/App';
import { TRIAL_DAYS } from '../../config';
import { trialDaysLeft } from '../../utils/CBX';
import { ButtonBase } from "material-ui";
import { isMobile } from "react-device-detect";
import ModalEditDash from "./ModalEditDash";



const json = [
	{	///// visible //////
		"buttons": true,
		"sectionReuniones": true,
		"lastActions": true,
		"reuniones": true,
		"noSession": true,
		"calendar": true,
	},
	[	///// info //////
		{ i: 'buttons', x: 0, y: 0, w: 12, h: 2},
		{ i: 'sectionReuniones', x: 0, y: 0, w: 2, h: 2, },
		{ i: 'calendar', x: 0, y: 0, w: 12, h: 5, },
	],
	[
		{ i: 'reuniones', x: 0, y: 0, w: 2.2, h: 2.3 },
		{ i: 'lastActions', x: 3, y: 0, w: 3.9, h: 3.5  },
		{ i: 'noSession', x: 3, y: 0, w: 2, h: 2.3 },
	]
]

if (!localStorage.getItem("items")) {
	localStorage.setItem("items", JSON.stringify(json));
}

class Dashboard extends React.Component {

	state = {
		edit: false,
		modalEdit: false,
		items: JSON.parse(localStorage.getItem("items"))
	}

	editMode = () => {
		this.setState({
			edit: this.state.edit ? false : true,
		})
	}

	modalEditClick = () => {
		this.setState({
			modalEdit: true,
		})
	}

	modalEditClickClose = () => {
		this.setState({
			modalEdit: false,
		})
	}

	resetDash = () => {
		localStorage.removeItem("items")
		localStorage.setItem("items", JSON.stringify(json));
		this.setState({
			items: JSON.parse(localStorage.getItem("items"))
		})
	}

	itemStorage = (item, value, object, grid) => {
		let objectItems = {};
		console.log("===================================================")
		console.log(item)
		console.log(value)
		console.log(object)
		console.log(grid)
		console.log("===================================================")
		if (!localStorage.getItem("items")) {
			localStorage.setItem("items", JSON.stringify({}))
		}
		objectItems = JSON.parse(localStorage.getItem("items"));
		if (value) {
			objectItems[0][item] = value;
		} else if(grid){
			// console.log(objectItems[])
			objectItems.splice(grid, grid, object)
		}
		localStorage.setItem("items", JSON.stringify(objectItems))
		this.setState({
			items: JSON.parse(localStorage.getItem("items"))
		})
	}

	render() {
		const { translate, company, user } = this.props;
		const trialDays = trialDaysLeft(company, moment, TRIAL_DAYS);
		const secondary = getSecondary();

		return (
			<div
				style={{
					overflowY: "hidden",
					width: "100%",
					backgroundColor: lightGrey,
					padding: 0,
					height: "100%",
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
				}}
				className="container-fluid"
			>
				<Scrollbar>
					{!isMobile && (
						<div style={{ marginTop: '0.5em', position: 'absolute', right: '1.35em', display: "flex" }}>
							{this.state.edit && (
								<div style={{ display: "flex" }}>
									<BasicButton
										text="Reset Dashboard"  //TRADUCCION
										onClick={this.resetDash}
										buttonStyle={{ marginRight: "1em", zIndex: "3" }}
									/>
									<BasicButton
										text="Select Items"  //TRADUCCION
										onClick={this.modalEditClick}
										buttonStyle={{ marginRight: "1em", zIndex: "3" }}
									/>
								</div>
							)}
							<BasicButton
								buttonStyle={{ zIndex: "3" }}
								text="Edit Dashboard"  //TRADUCCION
								onClick={this.editMode}
								icon={this.state.edit ? <ButtonIcon type="lock_open" color={"red"} /> : <ButtonIcon type="lock" color={"black"} />}
							/>
						</div>
					)}
					<ModalEditDash
						translate={translate}
						itemStorage={this.itemStorage}
						requestClose={this.modalEditClickClose}
						open={this.state.modalEdit}
						title={"Items Dashboard"}//TRADUCCION
						items={this.state.items}
					/>

					<div
						style={{
							width: "100%",
							backgroundColor: lightGrey,
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
							padding: '1em',
							textAlign: 'center',
							paddingBottom: "4em",
							// marginLeft:"2%"
						}}
					>
						<div
							style={{
								display: "inline-flex",
								fontWeight: "700",
								color: darkGrey,
								fontSize: "1em",
								marginBottom: '1em'
							}}
						>
						</div>
						{/* <div style={{ display: 'flex', flexDirection: 'column', fontWeight: '700', alignItems: 'center' }}>
						<div>
							{company.logo &&
								<img src={company.logo} alt="company-logo" style={{ height: '4.5em', width: 'auto' }} />
							}
						</div>
						<div>
							{company.businessName}
							{company.demo === 1 && ` (${translate.free_trial_remaining} ${trialDays <= 0 ? 0 : trialDays} ${translate.input_group_days})`}
						</div>
					</div> */}
						<TopSectionBlocks
							translate={translate}
							company={company}
							user={user}
							editMode={this.state.edit}
							itemStorage={this.itemStorage}
							statesItems={this.state.items}
						/>
					</div>
					<CBXFooter />
				</Scrollbar>

			</div>
		)
	}
}


export default withSharedProps()(Dashboard);
