import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadialDisplayView extends Component {
    
    render() {
        const {viewboxCenter, radius, styles} = this.props;
    
        return (
            <React.Fragment>
                <circle cx={viewboxCenter} cy={viewboxCenter} r={radius * 1.1} stroke="#efefef" strokeWidth="9" fill="#fefdf9" />
                <defs>
                    <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#289beb" />
                        <stop offset="100%" stopColor="#ff6a63" />
                    </linearGradient>
                </defs>
                <circle cx={viewboxCenter} cy={viewboxCenter} r={radius} stroke="url(#gradient)" strokeWidth="6" style={styles.circle} />
                <path id="arc1" fill="none" stroke="#50575f" stroke-width="6" d="M 171.44247806269212 453.2088886237956 A 200 200 0 0 0 428.5575219373079 453.2088886237956" />
                <svg x={viewboxCenter * 0.95} y={viewboxCenter * 1.4} fill="#323c45" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32px" height="32px"><path d="M 15 3 L 15 8 L 17 8 L 17 3 Z M 7.5 6.09375 L 6.09375 7.5 L 9.625 11.0625 L 11.0625 9.625 Z M 24.5 6.09375 L 20.9375 9.625 L 22.375 11.0625 L 25.90625 7.5 Z M 16 9 C 12.144531 9 9 12.144531 9 16 C 9 19.855469 12.144531 23 16 23 C 19.855469 23 23 19.855469 23 16 C 23 12.144531 19.855469 9 16 9 Z M 16 11 C 18.773438 11 21 13.226563 21 16 C 21 18.773438 18.773438 21 16 21 C 13.226563 21 11 18.773438 11 16 C 11 13.226563 13.226563 11 16 11 Z M 3 15 L 3 17 L 8 17 L 8 15 Z M 24 15 L 24 17 L 29 17 L 29 15 Z M 9.625 20.9375 L 6.09375 24.5 L 7.5 25.90625 L 11.0625 22.375 Z M 22.375 20.9375 L 20.9375 22.375 L 24.5 25.90625 L 25.90625 24.5 Z M 15 24 L 15 29 L 17 29 L 17 24 Z" /></svg>
            </React.Fragment>
        );
    }
}

RadialDisplayView.propTypes = {
    viewboxCenter: PropTypes.number, 
    radius: PropTypes.number,
    styles: PropTypes.func
};

export default RadialDisplayView;