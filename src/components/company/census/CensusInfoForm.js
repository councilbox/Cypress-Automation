import React from 'react';
import { MenuItem } from 'material-ui';
import {
	TextInput, SelectInput, Grid, GridItem
} from '../../../displayComponents';

const CensusInfoForm = ({
	translate, census, updateState, errors
}) => (
	<Grid>
		<GridItem xs={12} md={6} lg={6}>
			<TextInput
				floatingText={translate.name}
				id="census-name"
				required
				type="text"
				errorText={errors.censusName}
				value={census.censusName}
				onChange={event => {
					updateState({
						censusName: event.target.value
					});
				}}
			/>
		</GridItem>
		<GridItem xs={12} md={6} lg={6}>
			<SelectInput
				floatingText={translate.census_type}
				id="census-type"
				value={census.quorumPrototype}
				onChange={event => {
					updateState({
						quorumPrototype: event.target.value
					});
				}}
			>
				<MenuItem value={0} id="census-type-attendants">
					{translate.census_type_assistants}
				</MenuItem>
				<MenuItem value={1} id="census-type-social-capital">
					{translate.social_capital}
				</MenuItem>
			</SelectInput>
		</GridItem>
		<GridItem xs={12} md={12} lg={12}>
			<TextInput
				floatingText={translate.description}
				type="text"
				id="census-description"
				errorText={errors.censusDescription}
				value={census.censusDescription}
				onChange={event => {
					updateState({
						censusDescription: event.target.value
					});
				}}
			/>
		</GridItem>
	</Grid>
);

export default CensusInfoForm;
