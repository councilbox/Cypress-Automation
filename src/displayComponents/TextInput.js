import React from "react";
import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField
} from "material-ui";
import Visibility from "material-ui-icons/Visibility";
import VisibilityOff from "material-ui-icons/VisibilityOff";
import FontAwesome from 'react-fontawesome';

const TextInput = ({
	floatingText = "",
	type,
	passwordToggler,
	showPassword,
	adornment,
	value,
	onChange,
	errorText,
	classes,
	onKeyUp,
	placeholder,
	required,
	min,
	id,
	max,
	disabled
}) => (
	<FormControl
		style={{
			width: "100%",
			marginTop: 0
		}}
	>
		<TextField
			label={
				<React.Fragment>
					{`${floatingText}${required ? "*" : ""}` }
					{!!errorText &&
						<FontAwesome
							name={"times"}
							style={{
								fontSize: "17px",
								color: 'red',
								marginLeft: '0.2em'
							}}
						/>
					}
				</React.Fragment>
			}
			value={value}
			style={{
				marginTop: 0,
				width: "100%"
			}}
			placeholder={placeholder}
			InputLabelProps={{
				shrink: true
			}}
			InputProps={{
				startAdornment: adornment ? (
					<InputAdornment position="start">
						{adornment}
					</InputAdornment>
				) : (
					""
				),
				inputProps: {
					min: min,
					id: id,
					max: max
				},
				endAdornment: passwordToggler ? (
					<InputAdornment position="end">
						<IconButton
							aria-label="Toggle password visibility"
							style={{
								outline: 0
							}}
							onClick={event => {
								event.stopPropagation();
								passwordToggler();
							}}
						>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				) : (
					""
				)
			}}
			FormHelperTextProps={{
				error: !!errorText
			}}
			color="secondary"
			type={type}
			disabled={!!disabled}
			onKeyUp={onKeyUp}
			onChange={onChange}
			margin="normal"
			helperText={errorText}
			error={!!errorText}
		/>
	</FormControl>
);

export default TextInput;
