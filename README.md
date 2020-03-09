# CS3249-Asn3

Thermostat demo: https://TanYikai.github.io/CS3249-Asn3/

The main files are located in folder final_thermostat/src/

App.js - Host the main ModelView component for rendering. 

ModelView.js-Renders the view components and calls the model functions. This file also contains UI logic for calculating position and angle of the radial slider. It also contains the state for current temperature, target temperature and mode of the thermostat.

Model.js - contains the business logic function of determining the mode of the thermostat based on the current and target temperature.

RadialDisplayView.js - contains the view render of the radial display that changes colour according to the mode.

RadialSliderView.js - contains the vieew render of the radial slider used to set target temperature.
 