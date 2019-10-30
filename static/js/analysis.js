import React from 'react'
import Insight from './insight'
import { history } from "./index.js"
import { Skeleton, Result, Button } from 'antd'

// get current domain as api_endpoint
const api_endpoint = window.location.origin + '/';

class Analysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            fetched_insights: [],
            processed_insights: [],
            fetch_interval: 0,
            loading: true,
        };
        this.process_insight = this.process_insight.bind(this)
    }

	generate_url(id) {
        // set up url parameters and fetch data
        var url = new URL(api_endpoint+'data'),
        params = {jobId: id}
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

		return url
    }
    

    process_insight(data) {
        console.log('Analysis: starting to extract insights')
        const { cells } = data;

        // loop over every cell in resulting json
        cells.map((cell) => {
            // only look at cells which have output tag
            if (cell.metadata.tags.includes('output')) {
                // you must use setState in order for react to re-render!!
                this.setState({
                    processed_insights:[...this.state.processed_insights, cell]
                  });
                console.log('Analysis: pushed image insight 🌈')
            }
        });
    }

	fetch_insight(insight) {
        console.log(`Analysis: fetching insights from ${insight}`)
        fetch(api_endpoint+insight)
            .then(response => response.json())
            .then(data => {this.process_insight(data)});
    }

    go_home() {
        history.push(`/`);
    }

    end_loading(error) {
        // stop loading and set error
        this.setState({
            loading: false,
            error: error
        });

        // stop this loop by clearing interval
        clearInterval(this.state.fetch_interval);
    }

    componentDidMount() {
        console.log('Analysis: mounted')
		try {
			this.state.fetch_interval = setInterval(async () => {

                // get id of job from state
                const { id } = this.state;
                console.log(`Analysis: fetching data from ${id}`)

                // generate url and fetch data
                const url = this.generate_url(id);
                const res = await fetch(url);
                const data = await res.json();

                // extract key variables from received json
                const { insights, error, timestamp_completed } = data;

                // end loading if analysis is completed or if error
                if (error == true || timestamp_completed != null) {
                    this.end_loading(error)
                }

                // parse urls of insights from fetched data               
                insights.map((data) => {
                    // only fetch insights that haen't been fetched before
                    if (!this.state.fetched_insights.includes(data)) {
                        this.fetch_insight(data)
                        // add insight to list of fetched insights
                        this.state.fetched_insights.push(data)
                    }
                });
            // will run every 2 seconds, timeout in 60 seconds
            }, 2000);
            setTimeout(() => { this.end_loading(true); }, 60000);
		} catch(e) {
			console.log(e);
		}
    }

	componentWillUnmount() {
        // stop fetching new data if user navigates away from page
		clearInterval(this.state.fetch_interval);
	}

    render() {
        const { params } = this.props.match  

        return (
            <div>
                <h1>Analysis {params.id}</h1>

                {/* Map fetched insights to Insight component */}
                {this.state.processed_insights.map((insight) => 
                    <Insight insight_data={insight} id={insight.id}/>
                )}

                {/*  Show skeleton whilst analysis is being run */}
                <Skeleton loading={this.state.loading} title={false} active>

                    {/*  Show error if there are no insights to load */}
                    {this.state.processed_insights == 0 && <Result
                        status="warning"
                        title="We are unable to analyze this file"
                        extra={
                        <Button 
                            type="primary" 
                            key="console" 
                            onClick={this.go_home}>
                            Try a different file
                        </Button>
                        }
                    />}

                    
                </Skeleton>
            </div>
        );
    }
}

export default Analysis
