import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CouncilsDashboard from './councils/CouncilsDashboard';
import CompaniesDashboard from './companies/CompaniesDashboard';
import DraftsDashboard from './drafts/DraftsDashboard';
import UsersDashboard from './users/UsersDashboard';
import CompanyEditPage from './companies/CompanyEditPage';
import { LoadingMainApp } from '../../displayComponents';
import Header from '../Header';
import { graphql } from 'react-apollo';
import { getCorporation } from '../../queries/corporation';
import image from "../../assets/img/sidebar-2.jpg";
import Sidebar from "./menus/Sidebar";
import appStyle from "../../styles/appStyle.jsx";
import { withStyles } from 'material-ui';
import { lightGrey } from '../../styles/colors';
import CorporationDrafts from './drafts/CorporationDrafts';
import CorporationUsers from './users/CorporationUsers';

const Router = ({ user, translate, location, data, classes }) => {
    if(data.loading){
        return <LoadingMainApp />;
    }
    
    return(
        <div>
            <Sidebar
                company={data.corporation}
                image={image}
                translate={translate}
                color="blue"
            />
            <div className={classes.mainPanel} style={{backgroundColor: lightGrey}}>
                <Header
                    user={user}
                    translate={translate}
                    backButton={location.pathname !== `/`}
                />
                <Switch>
                    <Route exact path="/" component={() => <Redirect to="/councils" />} />
                    <Route path="/councils" component={() => <CouncilsDashboard corporation={data.corporation} />} />
                    <Route exact path="/companies" component={() => <CompaniesDashboard />} />
                    <Route path="/companies/edit/:id" component={CompanyEditPage} />
                    <Route path="/users" component={() => <CorporationUsers />} />
                    <Route path="/drafts" component={() => <CorporationDrafts />} />
                    <Route path="*" component={() => <Redirect to="/" />} />
                </Switch>
            </div>
        </div>
	)
		// return (
	// 	<div>
	// 		<Sidebar
	// 			company={data.corporation}
	// 			image={image}
	// 			translate={translate}
	// 			color="blue"
	// 		/>
	// 		<div className={classes.mainPanel}>
	// 			<Header
	// 				user={user}
	// 				translate={translate}
	// 				backButton={location.pathname !== `/`}
	// 			/>
	// 			<div
	// 				style={{
	// 					height: "calc(100vh - 3em)",
	// 					display: "flex",
	// 					width: "100%"
	// 				}}
	// 			>
	// 				<Switch>
	// 					<Route
	// 						exact
	// 						path="/"
	// 						component={() => <Redirect to="/councils" />}
	// 					/>
	// 					<Route
	// 						path="/councils"
	// 						component={() => (
	// 							<CouncilsDashboard
	// 								corporation={data.corporation}
	// 							/>
	// 						)}
	// 					/>
	// 					<Route
	// 						path="/companies"
	// 						component={() => <CompaniesDashboard />}
	// 					/>
	// 					<Route
	// 						path="/users"
	// 						component={() => <UsersDashboard />}
	// 					/>
	// 					<Route
	// 						path="/drafts"
	// 						component={() => <CorporationDrafts />}
	// 					/>
	// 					<Route path="*" component={() => <Redirect to="/" />} />
	// 				</Switch>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
};

export default graphql(getCorporation)(withStyles(appStyle)(Router));
