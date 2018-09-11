import React from "react";
import { Grid, GridItem, TextInput } from "./index";
import * as CBX from "../utils/CBX";

const MajorityInput = ({
	type,
	value,
	divider,
	onChange,
	onChangeDivider,
	style,
	majorityError,
	dividerError
}) => {
	if (CBX.isMajorityPercentage(type)) {
		return (
			<div style={{ width: "100%", ...style }}>
				<TextInput
					type={"number"}
					value={value}
					errorText={majorityError}
					min="1"
					max="100"
					adornment={"%"}
					onChange={event => onChange(event.nativeEvent.target.value)}
				/>
			</div>
		);
	}

	if (CBX.isMajorityFraction(type)) {
		return (
			<div style={{ width: "100%", ...style }}>
				<Grid>
					<div style={{width: '5em'}}>
						<TextInput
							type={"number"}
							value={value}
							min="1"

							errorText={majorityError}
							adornment={"/"}
							onChange={event =>
								onChange(event.nativeEvent.target.value)
							}
						/>
					</div>
					<div style={{width: '5em', marginLeft: '0.8em'}}>
						<TextInput
							type={"number"}
							value={divider}
							min="1"
							errorText={dividerError}
							onChange={event =>
								onChangeDivider(event.nativeEvent.target.value)
							}
						/>
					</div>
					<br />
				</Grid>
			</div>
		);
	}

	if (CBX.isMajorityNumber(type)) {
		return (
			<div style={{ width: '6em', ...style }}>
				<TextInput
					type={"number"}
					min="1"
					value={value}
					errorText={majorityError}
					onChange={event => onChange(event.nativeEvent.target.value)}
				/>
			</div>
		);
	}

	return <div />;
};

export default MajorityInput;
