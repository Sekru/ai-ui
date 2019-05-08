import React from 'react';
import axios from 'axios';
import Charts from './Charts'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      content: '', 
      pHResult: null, 
      pSResult: null, 
      pNResult: null,
      total: 0, totalHam: 0, totalSpam: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    axios.get(`http://145.239.95.7:5000/api/generals`)
    .then(res => {
        const {total, totalHam, totalSpam} = res.data;
        this.setState({ total, totalHam, totalSpam });
    })
}

  handleChange(event) {
    this.setState({ content: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    axios.post(`http://145.239.95.7:5000/api/think`, {
      data: this.state.content
    }).then(res => {
      this.setState(
        { pHResult: res.data.pHResult, 
          pSResult: res.data.pSResult
        })
    })
  }

  render() {
    return (
      <>
      <h2>Training data info</h2>
      <div class="form-group">
      <div>Total emails: {this.state.total}</div>
      <div>Spam emails: {this.state.totalSpam}</div>
      <div>Not spam emails: {this.state.totalHam}</div>
      </div>
      <div class="form-group">
      <h2>Test your email content</h2>
      <form onSubmit={this.handleSubmit}>
        <textarea class="form-control" value={this.state.content} onChange={this.handleChange} />
        <input type="submit" value="Test" />
      </form>
      </div>
      <div class="form-group">
        {this.state.pHResult !== null && this.state.pSResult !== null ?
        <>
        <p class="alert alert-danger">Probability of spam: {(this.state.pSResult * 100).toFixed(2)} %</p>
        <p class="alert alert-success">Probability of not spam: {(this.state.pHResult * 100).toFixed(2)} %</p>
        </>
        : null}
      </div>
      <Charts></Charts>
      </>
    )
  }
}

export default App;
