import React from 'react';
import Iframe from 'react-iframe'
import FancyPlot from './plot.js'

// get api endpoint from environment variable
const api_endpoint = process.env.API_URL + '/';

class Insight extends React.Component {
    constructor(props) {
       super(props);
       this.state = {
           insight_content: this.extract_insight(this.props.insight_data),
       }
    } 

    extract_image_data(insight_data) {
        console.log('Insight: checking image data') 

        try {
            var image_data = "";
            // extract base64 image data from our jupyter cell
            image_data = insight_data.data["image/png"];
            console.log('Insight: returning valid insight ✅')

            return <img src={`data:image/png;base64,${image_data}`} />            
        }
        catch(err) {
            console.log('Insight: invalid insight 🛎')
            return undefined
        }
    };

    extract_text_data(insight_data) {
        console.log('Insight: checking text')
        console.log(insight_data)

        return <p>{insight_data.text}</p>
    }
    
    extract_kepler_data(insight_data) {
        console.log('Insight: checking kepler')
        console.log(insight_data.text[1])
        var url = insight_data.text[1]

        return <Iframe url={api_endpoint+url}
            width="100%"
            height="450px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"/>
    }

    extract_plotly_data(insight_data) {
        console.log('Insight: checking heatmap')
        // extract the data from the right place
        var fudgeData = insight_data['text'][0]

        // parse json
        var parsedHeatmap = JSON.parse(fudgeData);

        // return component with data and layout
        return <FancyPlot data={parsedHeatmap.data} layout={parsedHeatmap.layout} />
    }

    extract_insight(insight_data) {
        console.log('Insight: about to process insight')
        console.log(insight_data)
        if (insight_data.metadata.tags.includes('image')) {
            console.log('Insight: processing as image 📸')
            return this.extract_image_data(insight_data.outputs[0])
        }
        if (insight_data.metadata.tags.includes('text')) {
            console.log('Insight: processing as text 📝')
            return this.extract_text_data(insight_data.outputs[0])
        }
        if (insight_data.metadata.tags.includes('kepler')) {
            console.log('Insight: processing as kepler 🗺')
            return this.extract_kepler_data(insight_data.outputs[0])
        }
        if (insight_data.metadata.tags.includes('plotly')) {
            console.log('Insight: processing as plotly 🔥')
            return this.extract_plotly_data(insight_data.outputs[0])
        }
    }

    render() {
        return ( 
            <div>
                {this.state.insight_content}
            </div>
        );
    }
}

export default Insight 
