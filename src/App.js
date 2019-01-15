import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import stations from './stations.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.visitedStation = [];
  }

  getRoutes = (srcLine, destLine) => {
    Object.keys(stations).forEach((stationName) => {
      const stationLines = Object.keys(stations[stationName]);
      if (!this.visitedStation.includes(stationName)
      && stationLines.includes(srcLine) && stationLines.includes(destLine)) {
        this.visitedStation.push(stationName);
      }
    });
  }

  render() {
    this.visitedStation = ['Bartley', 'Aljunied'];
    const srcLines = Object.keys(stations.Bartley);
    const destLines = Object.keys(stations.Aljunied);
    srcLines.forEach((srcLine) => {
      destLines.forEach((destLine) => {
        this.getRoutes(srcLine, destLine);
      });
    });
    console.log(this.visitedStation);
    return (
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className={styles.appLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
