import React, { Fragment } from "react";
import {
	Checkbox,
	Grid,
	GridItem,
	SelectInput,
	TextInput
} from "../../../../displayComponents";
import { MenuItem } from "material-ui";

const RepresentativeForm = ({
	updateState,
	translate,
	state,
	checkEmail,
	errors,
	languages
}) => {
	const representative = state;
	return (
		<Grid>
			<GridItem xs={12} lg={12} md={12}>
				<Checkbox
					label={translate.add_representative}
					value={state.hasRepresentative}
					onChange={(event, isInputChecked) =>
						updateState({
							hasRepresentative: isInputChecked
						})
					}
				/>
			</GridItem>
			{state.hasRepresentative && (
				<Fragment>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={translate.name}
							type="text"
							errorText={errors.name}
							value={representative.name || ''}
							onChange={event =>
								updateState({
									name: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={translate.surname}
							type="text"
							errorText={errors.surname}
							value={representative.surname || ''}
							onChange={event =>
								updateState({
									surname: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={translate.new_dni}
							type="text"
							errorText={errors.dni}
							value={representative.dni || ''}
							onChange={event =>
								updateState({
									dni: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={8} lg={3} md={3}>
						<TextInput
							floatingText={translate.position}
							type="text"
							errorText={errors.position}
							value={representative.position || ''}
							onChange={event =>
								updateState({
									position: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							{...(checkEmail? {onKeyUp: (event) => checkEmail(event, 'representative')} : {})}
							floatingText={translate.email}
							type="text"
							errorText={errors.email}
							value={representative.email || ''}
							onChange={event =>
								updateState({
									email: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={'Email para notificación administrativa'}
							min={1}
							errorText={errors.secondaryEmail}
							value={representative.secondaryEmail}
							onChange={event => {
								updateState({
									secondaryEmail: event.target.value
								})
							}}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<TextInput
							floatingText={translate.phone}
							type="text"
							errorText={errors.phone}
							value={representative.phone || ''}
							onChange={event =>
								updateState({
									phone: event.nativeEvent.target.value
								})
							}
						/>
					</GridItem>
					<GridItem xs={6} md={4} lg={3}>
						<SelectInput
							floatingText={translate.language}
							value={representative.language}
							onChange={event =>
								updateState({
									language: event.target.value
								})
							}
						>
							{languages.map(language => {
								return (
									<MenuItem
										value={language.columnName}
										key={`languagerepresentative_${
											language.columnName
										}`}
									>
										{language.desc}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
				</Fragment>
			)}
		</Grid>
	);
};

export default RepresentativeForm;
