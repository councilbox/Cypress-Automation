/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { isMobile } from '../utils/screen';

if (isMobile) {
	const updateHeights = () => {
		const html = document.getElementsByTagName('html');
		for (const el of html) {
			el.style.height = `${window.innerHeight}px`;
		}
		const body = document.getElementsByTagName('body');
		for (const el of body) {
			el.style.height = `${window.innerHeight}px`;
		}

		document.getElementById('root').height = `${window.innerHeight}px`;
	};

	window.addEventListener('resize', updateHeights);
	updateHeights();
}

const withWindowSize = WrappedComponent => class WithWindowSize extends Component {
state = {
	size: 'lg',
	innerHeight: window.innerHeight,
	innerWidth: window.innerWidth
}

updateSize = () => {
	const state = { ...this.state };
	state.innerWidth = window.innerWidth;
	if (window.innerWidth < 960) {
		state.size = 'xs';
	} else if (window.innerWidth < 1200) {
		state.size = 'md';
	} else if (window.innerWidth < 1600) {
		state.size = 'lg';
	} else {
		state.size = 'xl';
	}

	if (window.innerWidth < window.innerHeight) {
		state.orientation = 'portrait';
	} else if (window.innerWidth > window.innerHeight) {
		state.orientation = 'landscape';
	}

	if (isMobile) {
		if (state.innerHeight !== window.innerHeight) {
			if ((state.innerHeight - window.innerHeight) > (state.innerHeight * 0.3)) {
				return;
			}
			state.innerHeight = window.innerHeight;

			const element = document.getElementById('root');
			const html = document.getElementsByTagName('html');
			if (element) {
				// element.style.height = window.innerHeight + 'px';
				for (const el of html) {
					el.style.height = `${window.innerHeight}px`;
				}
			}
			const body = document.getElementsByTagName('body');
			if (body) {
				for (const el of body) {
					el.style.height = `${window.innerHeight}px`;
				}
			}
			document.getElementById('root').height = `${window.innerHeight}px`;
		}

		if (state.size !== this.state.size || state.innerHeight !== this.state.innerHeight || state.innerWidth !== this.state.innerWidth || state.orientation !== this.state.orientation) {
			this.setState({
				...state,
			});
		}
	} else if (state.size !== this.state.size) {
		this.setState({
			...state,
		});
	}
};

componentDidMount() {
	this.updateSize();
	window.addEventListener('resize', this.updateSize);
}

componentWillUnmount() {
	window.removeEventListener('resize', this.updateSize);
}

render() {
	return (
		<WrappedComponent
			updateSize={this.updateSize}
			orientation={this.state.orientation}
			innherHeight={this.state.innerHeight}
			innerWidth={this.state.innerWidth}
			windowSize={this.state.size}
			{...this.props}
		/>
	);
}
};

export default withWindowSize;
