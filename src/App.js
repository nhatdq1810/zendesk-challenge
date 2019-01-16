import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import stations from './stations.json';

class App extends Component {
  getAdjStations = (srcLine) => {
    const adjStations = [];
    Object.keys(stations).forEach((name) => {
      const stationLines = Object.keys(stations[name]);
      if (!this.visitedStations.includes(name) && stationLines.length > 1
        && stationLines.includes(srcLine) && !adjStations.includes(name)) {
        this.visitedStations.push(name);
        adjStations.push(name);
      }
    });
    return adjStations;
  }

  getRoutes = (srcLines, destLine) => {
    srcLines.find((srcLine) => {
      if (srcLine === destLine) {
        this.routes.push([...this.currentRoute]);
        return true;
      }
      if (!this.visitedLines.includes(srcLine)) {
        this.visitedLines.push(srcLine);
        const adjStations = this.getAdjStations(srcLine);
        if (adjStations.length > 0) {
          adjStations.forEach((s) => {
            this.currentRoute.push(s);
            const nextSrcLines = Object.keys(stations[s]);
            this.getRoutes(nextSrcLines, destLine);
            this.currentRoute.pop();
          });
        }
      }
      return false;
    });
  }

  render() {
    this.routes = [];
    const srcLines = Object.keys(stations.Admiralty);
    Object.keys(stations['Boon Lay']).forEach((destLine) => {
      this.currentRoute = ['Admiralty'];
      this.visitedStations = ['Admiralty'];
      this.visitedLines = [];
      this.getRoutes(srcLines, destLine);
    });
    console.log(this.routes);
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
