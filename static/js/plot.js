import React from 'react';
import Plot from 'react-plotly.js';

class FancyPlot extends React.Component {
    constructor(props) {
        super(props);
        console.log('-----')
        console.log(props)
        console.log('------')
     } 
    render() {
    return (
        <div width="100%">
            <Plot
                data={ this.props.data }
                layout={ this.props.layout }
                useResizeHandler
                style={{ width: '100%' }}
                config={{displayModeBar: false}}
            />
        </div>
    );
  }
}

export default FancyPlot;