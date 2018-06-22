import React from "react";
import { graphql } from "react-apollo";
import { MenuItem, Typography } from "material-ui";
import { checkValidEmail } from "../../utils";
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	SelectInput,
	TextInput
} from "../../displayComponents";
import { updateUser } from "../../queries";
import { store } from "../../containers/App";
import { setUserData } from "../../actions/mainActions";
import { getPrimary } from "../../styles/colors";
import UserForm from './UserForm';

class UpdateUserForm extends React.Component {
	saveUser = async () => {
		if (!this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const { __typename, ...data } = this.state.data;

			const response = await this.props.updateUser({
				variables: {
					user: data
				}
			});
			if (response.errors) {
				this.setState({
					error: true,
					loading: false,
					success: false
				});
			} else {
				this.setState({
					success: true,
					error: false,
					loading: false
				});
				store.dispatch(setUserData(response.data.updateUser));
			}
		}
	};
	resetButtonStates = () => {
		this.setState({
			error: false,
			loading: false,
			success: false
		});
	};

	constructor(props) {
		super(props);
		this.state = {
			data: this.props.user,
			error: false,
			loading: false,
			success: false,
			errors: {}
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.user
		});
	}

	updateState(newValues) {
		this.setState({
			data: {
				...this.state.data,
				...newValues
			}
		});
	}

	checkRequiredFields() {
		const { translate } = this.props;

		let errors = {
			name: "",
			surname: "",
			phone: "",
			email: "",
			pwd: "",
			confirmPWD: ""
		};

		const data = this.state.data;
		let hasError = false;

		if (!data.name.length > 0) {
			hasError = true;
			errors.name = translate.field_required;
		}

		if (!checkValidEmail(data.email.toLowerCase())) {
			hasError = true;
			errors.email = "Por favor introduce un email válido";
		}

		if (!data.surname.length > 0) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		if (!data.phone.length > 0) {
			hasError = true;
			errors.phone = translate.field_required;
		}

		if (!data.email.length > 0) {
			hasError = true;
			errors.email = translate.field_required;
		}

		this.setState({
			errors: errors
		});
		return hasError;
	}

	render() {
		const { translate } = this.props;
		const { data, errors, error, success, loading } = this.state;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<Typography variant="title" style={{ color: primary }}>
					{translate.user_data}
				</Typography>
				<br />
				<UserForm
					data={data}
					updateState={this.updateState}
					errors={errors}
					languages={this.props.languages}
					translate={translate}
				/>
				<br />
				<BasicButton
					text={translate.save}
					color={getPrimary()}
					error={error}
					reset={this.resetButtonStates}
					success={success}
					loading={loading}
					floatRight
					textStyle={{
						color: "white",
						fontWeight: "700"
					}}
					onClick={this.saveUser}
					icon={<ButtonIcon type="save" color="white" />}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(updateUser, {
	name: "updateUser"
})(UpdateUserForm);