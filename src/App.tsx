import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  private interval: NodeJS.Timeout | null = null; // Store the interval ID

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false, // Set the initial value of showGraph to false
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    } else {
      return null;
    }
  }

  /**
   * Get new data from the server and update the state with the new data
   * continuously until the app is closed or the server does not return any more data.
   */
  getDataFromServer() {
    // Clear any existing interval before starting a new one
    this.stopStreaming(); // Clear any existing interval before starting a new one

    // Start a new interval to fetch data every 100ms
    this.interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Check if there is any data returned from the server
        if (serverResponds.length > 0) {
          // Update the state with the new data
          this.setState((prevState) => ({
            data: [...prevState.data, ...serverResponds],
            showGraph: true,
          }));
        } else {
          // If there is no data returned from the server, stop streaming
          this.stopStreaming();
        }
      });
    }, 100);
  }

  /**
   * Stop streaming data by clearing the interval.
   */
  stopStreaming() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
