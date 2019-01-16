import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import stations from './stations.json';

export const getAdjStations = (allStations, srcLine, visitedStations) => {
  const adjStations = [];
  const newVisitedStations = [...visitedStations];

  Object.keys(allStations).forEach((name) => {
    const stationLines = Object.keys(allStations[name]);
    if (!newVisitedStations.includes(name) && stationLines.length > 1
      && stationLines.includes(srcLine) && !adjStations.includes(name)) {
      newVisitedStations.push(name);
      adjStations.push(name);
    }
  });

  return { adjStations, visitedStations: newVisitedStations };
};

class App extends Component {
  getRoutes = (srcLines, destLine) => {
    srcLines.find((srcLine) => {
      if (srcLine === destLine) {
        this.routes.push([...this.currentRoute]);
        return true;
      }
      if (!this.visitedLines.includes(srcLine)) {
        this.visitedLines.push(srcLine);
        const { adjStations, visitedStations } = getAdjStations(stations, srcLine, this.visitedStations);
        this.visitedStations = [...visitedStations];
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
    const srcLines = Object.keys(stations['Boon Lay']);

    Object.keys(stations.Admiralty).forEach((destLine) => {
      this.currentRoute = ['Boon Lay'];
      this.visitedStations = ['Boon Lay'];
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
