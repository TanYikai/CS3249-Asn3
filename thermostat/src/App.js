import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { CircleSlider } from "react-circle-slider";

class App extends Component {
  constructor(props) {
    super(props);

    // Set the initial state.
    this.state = {
      ambientTemperature: 74,
      targetTemperature: 68,
      hvacMode: 'off'
    };
  }
  
  getStyles() {
        // Determine if the thermostat is actively working to reach the target temperature.
        let dialColor = '#222';
        if (this.props.hvacMode === 'heating') {
          dialColor = '#E36304';
        } else if (this.props.hvacMode === 'cooling') {
          dialColor = '#007AF1';
        }
    
        return {
          dial: {
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            display: 'flex', //centering the thermostat
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
          },
          ambient: {
            fill: 'white',
            textAnchor: 'middle',
            fontFamily: 'Helvetica, sans-serif',
            alignmentBaseline: 'central',
            fontSize: '22px',
            fontWeight: 'bold'
          },
          leaf: {
            fill: '#13EB13',
            opacity: this.props.leaf ? '1' : '0',
            visibility: this.props.away ? 'hidden' : 'visible',
            WebkitTransition: 'opacity 0.5s',
            transition: 'opacity 0.5s',
            pointerEvents: 'none'
          }
    };
  }

  pointsToPath(points) {
    return [points.map((point, iPoint) => [iPoint > 0 ? 'L' : 'M', point[0], ' ', point[1]].join('')).join(' '), 'Z'].join('');
  }
    
  rotatePoint(point, angle, origin) {
    const radians = angle * Math.PI / 180;
    const x = point[0] - origin[0];
    const y = point[1] - origin[1];
    const x1 = x * Math.cos(radians) - y * Math.sin(radians) + origin[0];
    const y1 = x * Math.sin(radians) + y * Math.cos(radians) + origin[1];
    return [x1, y1];
  }

  rotatePoints(points, angle, origin) {
    const _self = this;
    return points.map(point => _self.rotatePoint(point, angle, origin));
  }
    
  restrictToRange(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }
  
  handleOnChange = (e) => {this.setState({ambientTemperature : e.target.value});}

  handleChange = ambientTemperature => this.setState({ ambientTemperature });

  render() {
    // const _self = this;

    // Local variables used for rendering.
    const diameter = 400;
    const radius = diameter / 2;
    const ticksOuterRadius = diameter / 30;
    const ticksInnerRadius = diameter / 8;
    const tickDegrees = 300;
    const rangeValue = this.props.maxValue - this.props.minValue;

    // Determine the maximum and minimum values to display.
    let actualMinValue;
    let actualMaxValue;
    if (this.props.away) {
      actualMinValue = this.props.ambientTemperature;
      actualMaxValue = actualMinValue;
    } else {
      actualMinValue = Math.min(this.props.ambientTemperature, this.props.targetTemperature);
      actualMaxValue = Math.max(this.props.ambientTemperature, this.props.targetTemperature);
    }
    const min = this.restrictToRange(Math.round((actualMinValue - this.props.minValue) / rangeValue * this.props.numTicks), 0, this.props.numTicks - 1);
    const max = this.restrictToRange(Math.round((actualMaxValue - this.props.minValue) / rangeValue * this.props.numTicks), 0, this.props.numTicks - 1);

    // Renders the degree ticks around the outside of the thermostat.
    const tickPoints = [[radius - 1, ticksOuterRadius], [radius + 1, ticksOuterRadius], [radius + 1, ticksInnerRadius], [radius - 1, ticksInnerRadius]];
    const tickPointsLarge = [[radius - 1.5, ticksOuterRadius], [radius + 1.5, ticksOuterRadius], [radius + 1.5, ticksInnerRadius + 20], [radius - 1.5, ticksInnerRadius + 20]];
    const theta = tickDegrees / this.props.numTicks;
    const offsetDegrees = 180 - (360 - tickDegrees) / 2;
    const tickArray = [];
    for (let iTick = 0; iTick < this.props.numTicks; iTick++) {
      const isLarge = iTick === min || iTick === max;
      const isActive = iTick >= min && iTick <= max;
      const tickElement = React.createElement('path', {
        key: ['tick-', iTick].join(''),
        d: this.pointsToPath(this.rotatePoints(isLarge ? tickPointsLarge : tickPoints, iTick * theta - offsetDegrees, [radius, radius])),
        style: {
          fill: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
        }
      });
      tickArray.push(tickElement);
    }

    // The styles change based on state.
    const styles = this.getStyles();
    
    return (
     <div className="App">
      <header className="App-header">     
        <svg width = {this.props.width} height = {this.props.height} style = {styles.dial} viewBox = {['0 0 ', diameter, ' ', diameter].join('')}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="50%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#00bc9b" />
              <stop offset="50%" stop-color="#5eaefd" />
            </linearGradient>
          </defs>          
          <circle cx = {radius} cy = {radius} r = {radius} stroke="url(#gradient)" stroke-width="6" stroke-dasharray="1300" style = {styles.circle}/>
          <g>{tickArray}</g>
          <text x = {radius} y = {radius * 1.1} style = {styles.target}>{Math.round(this.props.targetTemperature)}</text>
          <text x ={radius} y={radius * 1.3} style = {styles.current}>Current: {Math.round(this.props.targetTemperature)}</text>
          <svg x={radius * 0.95} y={radius * 1.5} fill="#808080" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32px" height="32px"><path d="M 15 3 L 15 8 L 17 8 L 17 3 Z M 7.5 6.09375 L 6.09375 7.5 L 9.625 11.0625 L 11.0625 9.625 Z M 24.5 6.09375 L 20.9375 9.625 L 22.375 11.0625 L 25.90625 7.5 Z M 16 9 C 12.144531 9 9 12.144531 9 16 C 9 19.855469 12.144531 23 16 23 C 19.855469 23 23 19.855469 23 16 C 23 12.144531 19.855469 9 16 9 Z M 16 11 C 18.773438 11 21 13.226563 21 16 C 21 18.773438 18.773438 21 16 21 C 13.226563 21 11 18.773438 11 16 C 11 13.226563 13.226563 11 16 11 Z M 3 15 L 3 17 L 8 17 L 8 15 Z M 24 15 L 24 17 L 29 17 L 29 15 Z M 9.625 20.9375 L 6.09375 24.5 L 7.5 25.90625 L 11.0625 22.375 Z M 22.375 20.9375 L 20.9375 22.375 L 24.5 25.90625 L 25.90625 24.5 Z M 15 24 L 15 29 L 17 29 L 17 24 Z"/></svg>          
        </svg>
        <label>
          <span>Set Current Temperature </span>
          <input type="text" id="input_target_temperature_text" maxlength="3" size="3"/>
          <input type='range' min={0} max= {200} value={Math.round(this.state.ambientTemperature)} id='input_target_temperature' onChange = {this.handleOnChange} />
          <div>{Math.round(this.state.ambientTemperature)}</div>
		    </label>

        <CircleSlider value={Math.round(this.state.ambientTemperature)} onChange={this.handleChange} />

        <a href="https://icons8.com/icon/16270/sun">Sun icon by Icons8</a>
      </header>
    </div>
    );
  }
}

App.defaultProps = {
  height: '30%',
  width: '30%',
  numTicks: 100,
  minValue: 50,
  maxValue: 85,
  ambientTemperature: 0,
  targetTemperature: 72,
  hvacMode: 'off' //cooling,heating,off
};

export default App;
