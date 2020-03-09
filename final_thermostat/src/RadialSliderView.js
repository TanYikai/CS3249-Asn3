import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RadialSliderView extends Component {
    render() {
        const { viewboxCenter, thumbRadFrmCtr, styles, posX, posY, mouseDown, toRad } = this.props;

        //instantiate an ellipse object every 5 deg to create the radial slider ticks
        const tickArray = [];
        for (let tickAngle = 120; tickAngle <= 420; tickAngle += 5) {
            var cx = viewboxCenter + thumbRadFrmCtr * Math.cos(toRad(tickAngle));
            var cy = viewboxCenter + thumbRadFrmCtr * Math.sin(toRad(tickAngle));
            const tickElement = React.createElement('ellipse', {
                key: ['tick-', tickAngle].join(''),
                cx: cx,
                cy: cy,
                rx: '17',
                ry: '2',
                style: {
                    fill: "#c5cacd",
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: `rotate(${tickAngle}deg)`
                }
            });

            tickArray.push(tickElement);
        }

        return (
            <React.Fragment>
                <g>{tickArray}</g>
                <ellipse cx={posX} cy={posY} rx={17} ry={7} onMouseDown={mouseDown} stroke="white" strokeWidth="2" style={styles.ellipse} />
            </React.Fragment>
        );
    }
}

RadialSliderView.propTypes = { 
    viewboxCenter: PropTypes.number, 
    thumbRadFrmCtr: PropTypes.number,
    styles: PropTypes.func, 
    posX: PropTypes.number,
    posY: PropTypes.number, 
    mouseDown: PropTypes.func, 
    toRad: PropTypes.func
};

export default RadialSliderView;