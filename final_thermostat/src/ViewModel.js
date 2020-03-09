import React, { Component } from 'react';
import { Machine, interpret } from 'xstate';
import RadialDisplayView from './RadialDisplayView';
import RadialSliderView from './RadialSliderView';
import { checkMode } from './Model';

//xstate machine
const isHot = ({ currTemp, targetTemp }) => currTemp > targetTemp;
const isCold = ({ currTemp, targetTemp }) => currTemp < targetTemp;
const isOk = ({ currTemp, targetTemp }) => currTemp === targetTemp;

const thermostatMachine = Machine({
    id: 'thermostat',
    context: {
        currTemp: 0,
        targetTemp: 0
    },
    initial: 'off',
    states: {
        off: {
            on: {
                '': [
                    { target: 'cooling', cond: isHot },
                    { target: 'heating', cond: isCold }
                ]
            }
        },
        cooling: {
            on: {
                '': [
                    { target: 'off', cond: isOk },
                    { target: 'cooling', cond: isHot }
                ]
            }
        },
        heating: {
            on: {
                '': [
                    { target: 'off', cond: isOk },
                    { target: 'heating', cond: isCold }
                ]
            }
        }
    }
});

class ViewModel extends Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.thumbRadFrmCtr = 170;
        this.viewboxWidth = 400 * 1.5;
        this.viewboxCenter = this.viewboxWidth / 2;
        this.radius = 200;

        this.state = {
            currentTemperature: 72,//range from 32-100
            targetTemperature: 72,//range from 50-80
            mode: 'off',
            angle: 220,
            posX: this.viewboxCenter + (this.thumbRadFrmCtr) * Math.cos(this.toRad(220+120)), // posX is the x coord of the slider selector
            posY: this.viewboxCenter + (this.thumbRadFrmCtr) * Math.sin(this.toRad(220+120)), // posY is the y coord of the slider selector

            current: thermostatMachine.initialState
        };

        document.addEventListener('mouseup', this.handleMouseUp);
    }

    //xstate methods begin
    service = interpret(thermostatMachine).onTransition(current =>
        this.setState({ current })
    );

    componentDidMount() {
        this.service.start();
    }

    componentWillUnmount() {
        this.service.stop();
    }
    //xstate methods end

    getStyles() {
        // Determine if the thermostat is actively working to reach the target temperature.
        let dialColor = '#586369';
        if (this.state.mode === 'heating') {
            dialColor = '#ff6a63';
        } else if (this.state.mode === 'cooling') {
            dialColor = '#289beb';
        }

        return {
            dial: {
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '7%',
                marginBottom: '7%'
            },
            circle: {
                fill: dialColor,
                WebkitTransition: 'fill 0.5s',
                transition: 'fill 0.5s'
            },
            ellipse: {
                fill: "yellow",
                WebkitTransition: 'fill 0.5s',
                transition: 'fill 0.5s',
                transformOrigin: `${this.state.posX}px ${this.state.posY}px`,
                transform: `rotate(${this.state.angle + 120}deg)`
            },
            target: {
                fill: 'white',
                textAnchor: 'middle',
                fontFamily: 'Helvetica, sans-serif',
                alignmentBaseline: 'central',
                fontSize: '120px',
                fontWeight: 'bold',
                visibility: this.props.away ? 'hidden' : 'visible'
            },
            current: {
                fill: 'white',
                textAnchor: 'middle',
                fontFamily: 'Helvetica, sans-serif',
                alignmentBaseline: 'central',
                fontSize: '40px',
                fontWeight: 'bold'
            }
        };
    }

    //utility methods begin
    restrictToRange(val, min, max) {
        if (val < min) return min;
        if (val > max) return max;
        return Math.round(val);
    }

    toDeg(rad) {
        return rad * 180 / Math.PI
    }

    toRad(deg) {
        return deg * Math.PI / 180
    }
    //utility methods end

    //event handlers methods begin
    handleOnChange = (e) => {
        this.setState({
            currentTemperature: e.target.value,
        });

        this.handleModechange();
    }

    handleMouseDown = () => {
        document.addEventListener('mousemove', this.handleMouseMove)
    }

    handleMouseMove = (e) => {
        this.handleUpdateTargetTemp(e);
        this.handleModechange();
    }

    handleMouseUp = () => {
        document.removeEventListener('mousemove', this.handleMouseMove)
    }

    handleUpdateTargetTemp = (e) => {
        //calculate the angle made between the target to center of circle and the horizontal axis
        const offset = (2 * Math.PI / 3); //120 deg in rad
        const minDeg = 0;
        const maxDeg = 300
        const rect = this.ref.current.getBoundingClientRect();
        this.center = rect.width / 2;
        let angle = this.restrictToRange(this.toDeg((Math.atan2(e.clientY - rect.top - this.center, e.clientX - rect.left - this.center) - offset + 2 * Math.PI) % (2 * Math.PI)), minDeg, maxDeg);
        
        //convert the angle from 0 - 300 deg to values of 50 - 80
        let targetTemperature = angle / 10 + 50;

        this.setState({
            angle: angle,
            targetTemperature: targetTemperature,
            posX: this.viewboxCenter + (this.thumbRadFrmCtr) * Math.cos(this.toRad(angle) + offset),
            posY: this.viewboxCenter + (this.thumbRadFrmCtr) * Math.sin(this.toRad(angle) + offset),
        });
    }

    handleModechange = () => {
        const mode = checkMode(this.state.currentTemperature, this.state.targetTemperature, this.state.mode);
        this.setState({
            mode: mode,
        });
    }
    //event handlers methods end

    render() {
        const styles = this.getStyles();

        const { current } = this.state;
        const { send } = this.service;

        return (
            <React.Fragment>
                <svg ref={this.ref} width={'30%'} height={'30%'} style={styles.dial} viewBox={`0 0 ${this.viewboxWidth} ${this.viewboxWidth}`}>
                    <RadialDisplayView
                        viewboxCenter={this.viewboxCenter}
                        radius={this.radius}
                        styles={styles} />

                    <RadialSliderView
                        viewboxCenter={this.viewboxCenter}
                        thumbRadFrmCtr={this.thumbRadFrmCtr}
                        styles={styles}
                        posX={this.state.posX}
                        posY={this.state.posY}
                        mouseDown={this.handleMouseDown}
                        toRad={this.toRad}
                    />

                    <text x={this.viewboxCenter} y={this.viewboxCenter * 1.1} style={styles.target}>{Math.round(this.state.targetTemperature)}</text>

                    <text x={this.viewboxCenter} y={this.viewboxCenter * 1.3} style={styles.current}>Current: {Math.round(this.state.currentTemperature)}</text>
                </svg>

                <label id="test_UI">
                    <span>Set Current Temperature </span>
                    <input type='range' min={32} max={100} value={Math.round(this.state.currentTemperature)} id='input_target_temperature' onChange={this.handleOnChange} />
                </label>

                <a href="https://icons8.com/icon/16270/sun">Sun icon by Icons8</a>
            </React.Fragment>
        );
    }
}

export default ViewModel;