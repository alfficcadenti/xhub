import React, {PureComponent, Fragment} from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default class TotalChart extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/c1rLyqj1/';

  render() {
      return (
          <Fragment>
              <h3>{'Total bookings'}</h3>
              <ResponsiveContainer width="90%" height="80%">
                  <AreaChart width={730} height={250} data={this.props.data}
                      margin={{top: 10, right: 30, left: 0, bottom: 0}}
                  >
                      <defs>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1B5CAF" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#1B5CAF" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1478F7" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#1478F7" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorHcom" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F71414" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#F71414" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="BEX" stroke="#1B5CAF" fillOpacity={1} fill="url(#colorUv)" />
                      <Area type="monotone" dataKey="Vrbo" stroke="#1478F7" fillOpacity={1} fill="url(#colorPv)" />
                      <Area type="monotone" dataKey="Hotels.com" stroke="#F71414" fillOpacity={1} fill="url(#colorHcom)" />
                      <Legend onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />
                  </AreaChart>
              </ResponsiveContainer>
          </Fragment>
      );
  }
}
