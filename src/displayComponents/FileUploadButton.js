import React from 'react';
import { Button } from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';

const FileUploadButton = ({
	onChange,
	image,
	text,
	accept,
	color,
	textStyle,
	icon,
	disabled,
	id,
	buttonStyle,
	trigger,
	flat,
	loading,
	loadingColor = 'inherit',
	style
}) => (
	<React.Fragment>
		<input
			type="file"
			{...(image ? { accept: 'image/*' } : {})}
			{...(accept ? { accept } : {})}
			id={'raised-button-file'}
			onChange={async event => {
				await onChange(event);
				event.target.value = '';
			} }
			disabled={disabled}
			{...(loading ? { disabled: true } : {})}
			style={{
				cursor: 'pointer',
				position: 'absolute',
				top: 0,
				width: 0,
				bottom: 0,
				right: 0,
				left: 0,
				opacity: 0
			}}
		/>
		{trigger ?
			<label htmlFor="raised-button-file" style={style} id={id}>
				{trigger()}
			</label>
			: <label htmlFor="raised-button-file" style={style}>
				<Button
					variant={flat ? 'flat' : 'raised'}
					component="span"
					id={id}
					disableRipple={loading}
					disabled={loading}
					style={{
						...buttonStyle,
						...textStyle,
						backgroundColor: color
					}}
				>
					{text}
					{loading ? (
						<div
							style={{
								color: 'white',
								marginLeft: '0.3em'
							}}
						>
							<CircularProgress size={12} color={loadingColor} />
						</div>
					) : (
						icon
					)}
				</Button>
			</label>
		}
	</React.Fragment>
);

export default FileUploadButton;
