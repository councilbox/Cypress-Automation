import React, { Component } from 'react';

const withWindowSize = (WrappedComponent) => {
    return class WithWindowSize extends Component {
        constructor(props) {
            super(props);
            this.state = {
                size: 'lg'
            }
        }

        componentDidMount() {
            this.updateSize();
            window.addEventListener('resize', this.updateSize);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.updateSize);
        }

        updateSize = () => {
            if (window.innerWidth < 700) {
                this.setState({ size: 'xs' });
            } else if (window.innerWidth < 1024) {
                this.setState({ size: 'md' });
            }else if (window.innerWidth < 1400) {
                this.setState({ size: 'lg' });
            } else {
                this.setState({ size: 'xl' });
            }
        };

        render() {
            return (<WrappedComponent
                    updateSize={this.updateSize}
                    windowSize={this.state.size}
                    {...this.props}
                />)
        }
    }
};


export default withWindowSize;
