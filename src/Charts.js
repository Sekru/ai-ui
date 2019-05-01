import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import Chart from "react-google-charts";

const processWords = words => {
    var sortable = [];
    for (let word in words) {
        if (word !== "" && word !== "enron" && word !== "vince" && word !== "kaminski")
            sortable.push([word, words[word]]);
    }

    sortable = sortable.sort((a, b) => {
        return b[1] - a[1];
    });
    sortable = sortable.slice(0, 25);
    sortable.forEach(e => e.push("color: gray"));

    return sortable;
}

class Charts extends React.Component {
    constructor(props) {
        super(props)
        this.state = { spam: [], ham: [] }
      }
    
    componentDidMount() {
        axios.get(`http://145.239.95.7:5000/api/spam`)
        .then(res => {
            const words = res.data;
            var sortable = processWords(words);
            this.setState({ spam: [["Word", "Count", { role: "style" }], ...sortable] });
        })

        axios.get(`http://145.239.95.7:5000/api/ham`)
        .then(res => {
            const words = res.data;
            var sortable = processWords(words);
            this.setState({ ham: [["Word", "Count", { role: "style" }], ...sortable] });
        })
    }

    render() {
      return (
        <>
        <h1>Top 25 words of spam emails</h1>
        <Chart chartType="BarChart" width="100%" height="900px" data={this.state.spam} />
        <h1>Top 25 words of not spam emails</h1>
        <Chart chartType="BarChart" width="100%" height="900px" data={this.state.ham} />
        </>
      );
    }
}

export default Charts;