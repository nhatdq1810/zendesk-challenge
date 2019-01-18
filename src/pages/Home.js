import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import styles from './Home.module.scss';
import stations from '../utils/stations.json';

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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSrcStations: [],
      originStation: undefined,
      destStation: undefined,
      routes: [],
    };
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
    this.setState(({ destStation }) => {
      let newState = { originStation: value };

      if (value && destStation && stations[value] && stations[destStation]) {
        newState = { ...newState, routes: this.getRoutes(value, destStation) };
      }

      return newState;
    });
  }

  setDestStation = (value) => {
    this.setState(({ originStation }) => {
      let newState = { destStation: value };

      if (value && originStation && stations[value] && stations[originStation]) {
        newState = { ...newState, routes: this.getRoutes(originStation, value) };
      }

      return newState;
    });
  }

  getRoutesUtil = (routes, originLines, destLine) => {
    if (originLines.some((originLine) => {
      if (originLine === destLine) {
        routes.push([...this.currentRoute]);
        return true;
      }
      return false;
    })) { return; }

    originLines.forEach((originLine) => {
      const { adjStations, visitedStations } = getAdjStations(stations, originLine, this.visitedStations);
      this.visitedStations = [...visitedStations];

      if (adjStations.length > 0) {
        adjStations.forEach((s) => {
          this.currentRoute.push({ station: s, ...stations[s] });
          const adjOriginLines = Object.keys(stations[s]);
          this.getRoutesUtil(routes, adjOriginLines, destLine);
          this.currentRoute.pop();
        });
      }
    });
  }

  getRoutes = (originStation, destStation) => {
    const originLines = Object.keys(stations[originStation]);
    const routes = [];

    Object.keys(stations[destStation]).forEach((destLine) => {
      this.currentRoute = [{ station: originStation, ...stations[originStation] }];
      this.visitedStations = [originStation];
      this.getRoutesUtil(routes, originLines, destLine);
    });

    return routes;
  }

  render() {
    const { dataSrcStations, routes } = this.state;
    console.log(routes);

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

export default Home;
