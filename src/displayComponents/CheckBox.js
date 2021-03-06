import React from 'react';
import { Checkbox } from 'material-ui';
import { FormControlLabel } from 'material-ui/Form';
import HelpPopover from './HelpPopover';
import LoadingSection from './LoadingSection';

const CheckBox = ({
	value, label, onChange, loading, disabled, helpPopover, helpTitle, helpDescription, styleLabel, id, styleInLabel, colorCheckbox
}) => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'row',
		}}
	>
		<FormControlLabel
			control={
				loading ?
					<LoadingSection />
					: <Checkbox checked={value} onChange={onChange} disabled={disabled} id={id} color={colorCheckbox} />
			}
			label={
				<React.Fragment>
					<span style={{ ...styleInLabel }}>{label}</span>
				</React.Fragment>
			}
			style={{ marginBottom: '0', marginRight: '0', ...styleLabel }}
		/>
		{helpPopover
			&& <HelpPopover
				title={helpTitle}
				content={helpDescription}
			/>
		}
	</div>
);

export default CheckBox;
