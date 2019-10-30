import React from 'react';

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
