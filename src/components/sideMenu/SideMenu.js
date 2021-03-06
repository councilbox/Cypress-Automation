import React from 'react';
import CompanyMenu from './CompanyMenu';
import { LoadingMainApp } from '../../displayComponents';

class SideMenu extends React.Component {
openCompany = () => {
	this.setState({
		companies: false,
		company: true
	});
	this.props.toggleMenu();
};

constructor(props) {
	super(props);
	this.state = {
		company: false,
		companies: false
	};
}

render() {
	if (!this.props.companies) {
		return <LoadingMainApp />;
	}

	return (
		<div
			style={{
				width: `${this.props.width}%`,
				height: '100%',
				display: 'flex',
				overflow: 'hidden'
			}}
		>
			<CompanyMenu
				company={this.props.company}
				companies={this.props.companies}
				toggle={this.props.toggleMenu}
				open={this.state.company}
				toggled={this.props.open}
				translate={this.props.translate}
			/>
		</div>
	);
}
}

export default SideMenu;
