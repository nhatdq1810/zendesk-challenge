import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import styles from './App.module.scss';
import stations from './stations.json';

export const getAdjStations = (allStations, originLine, visitedStations) => {
  const adjStations = [];
  const updatedVisitedStations = [...visitedStations];

  Object.keys(allStations).forEach((name) => {
    const stationLines = Object.keys(allStations[name]);
    if (!updatedVisitedStations.includes(name)
      && stationLines.length > 1 && stationLines.includes(originLine)) {
      updatedVisitedStations.push(name);
      adjStations.push(name);
    }
  });

  return { adjStations, visitedStations: updatedVisitedStations };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSrcStations: [],
      originStation: undefined,
      destStation: undefined,
    };
    this.routes = [];
    this.stationNames = Object.keys(stations);
  }


  searchStations = (value, oldState) => this.stationNames.filter(
    sName => sName !== oldState.originStation && sName !== oldState.destStation
      && sName.toLowerCase().includes(value.toLowerCase()),
  )

  updateStateAfterSearch = (value, key) => {
    this.setState(oldState => ({
      dataSrcStations: this.searchStations(value, oldState),
      [key]: value,
    }));
  }

  searchOriginStation = (value) => {
    this.updateStateAfterSearch(value, 'originStation');
  }

  searchDestStation = (value) => {
    this.updateStateAfterSearch(value, 'destStation');
  }

  setOriginStation = (value) => {
    this.setState({ originStation: value });
  }

  setDestStation = (value) => {
    this.setState({ destStation: value });
  }

  getRoutesUtil = (originLines, destLine) => {
    originLines.find((originLine) => {
      if (originLine === destLine) {
        this.routes.push([...this.currentRoute]);
        return true;
      }

      const { adjStations, visitedStations } = getAdjStations(stations, originLine, this.visitedStations);
      this.visitedStations = [...visitedStations];

      if (adjStations.length > 0) {
        adjStations.forEach((s) => {
          this.currentRoute.push({ station: s, ...stations[s] });
          const adjOriginLines = Object.keys(stations[s]);
          this.getRoutesUtil(adjOriginLines, destLine);
          this.currentRoute.pop();
        });
      }

      return false;
    });
  }

  getRoutes = (originStation, destStation) => {
    const originLines = Object.keys(stations[originStation]);
    this.routes = [];

    Object.keys(stations[destStation]).forEach((destLine) => {
      this.currentRoute = [{ station: originStation, ...stations[originStation] }];
      this.visitedStations = [originStation];
      this.getRoutesUtil(originLines, destLine);
    });

    console.log(this.routes);
  }

  render() {
    const { dataSrcStations, originStation, destStation } = this.state;

    if (originStation && destStation && stations[originStation] && stations[destStation]) {
      this.getRoutes(originStation, destStation);
    }

    return (
      <div className={styles.app}>
        <AutoComplete
          dataSource={dataSrcStations}
          onSearch={this.searchOriginStation}
          onSelect={this.setOriginStation}
          placeholder="Origin station"
        />
        <AutoComplete
          dataSource={dataSrcStations}
          onSearch={this.searchDestStation}
          onSelect={this.setDestStation}
          placeholder="Destination station"
        />
      </div>
    );
  }
}

export default App;
