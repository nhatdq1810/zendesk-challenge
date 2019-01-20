import React, { Component } from 'react';
import { Empty } from 'antd';
import styles from './Home.module.scss';
import stations from '../utils/stations.json';
import {
  getAdjStations, searchStations, getRoutePoints, getOrderedRoutes,
} from './Home.helper';
import SearchStation from './home/SearchStation';
import RoutesView from './home/RoutesView';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSrcStations: [],
      originStation: undefined,
      destStation: undefined,
      orderedRoutes: [],
      orderedRoutesByLines: [],
    };
    this.stationNames = Object.keys(stations);
  }

  updateStateAfterSearch = (value, key) => {
    this.setState({
      dataSrcStations: searchStations(this.stationNames, value),
      [key]: value,
    });
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
        newState = { ...newState, ...this.getRoutes(value, destStation) };
      }

      return newState;
    });
  }

  setDestStation = (value) => {
    this.setState(({ originStation }) => {
      let newState = { destStation: value };

      if (value && originStation && stations[value] && stations[originStation]) {
        newState = { ...newState, ...this.getRoutes(originStation, value) };
      }

      return newState;
    });
  }

  getRoutesUtil = (routes, routesByLines, originLines, destLine) => {
    if (originLines.some((originLine) => {
      if (originLine === destLine) {
        routes.push([...this.currentRoute]);
        routesByLines.push([...this.currentRouteByLines, destLine]);
        return true;
      }
      return false;
    })) { return; }

    originLines.forEach((originLine) => {
      const { adjStations, visitedStations } = getAdjStations(stations, originLine, this.visitedStations);
      this.visitedStations = [...visitedStations];
      this.currentRouteByLines.push(originLine);

      if (adjStations.length > 0) {
        adjStations.forEach((s) => {
          this.currentRoute.push({ name: s, ...stations[s] });
          const adjOriginLines = Object.keys(stations[s]);
          this.getRoutesUtil(routes, routesByLines, adjOriginLines, destLine);
          this.currentRoute.pop();
        });
      }

      this.currentRouteByLines.pop();
    });
  }

  getRoutes = (originStationName, destStationName) => {
    const originLines = Object.keys(stations[originStationName]);
    const routes = [];
    const routesByLines = [];
    this.visitedStations = [originStationName];

    Object.keys(stations[destStationName]).forEach((destLine) => {
      this.currentRoute = [];
      this.currentRouteByLines = [];
      this.getRoutesUtil(routes, routesByLines, originLines, destLine);
    });

    return getOrderedRoutes(
      routes,
      routesByLines,
      getRoutePoints(routes, routesByLines, stations[originStationName], stations[destStationName]),
    );
  }

  render() {
    const {
      dataSrcStations,
      orderedRoutes, orderedRoutesByLines,
      originStation, destStation,
    } = this.state;
    return (
      <div className={styles.wrapper}>
        <SearchStation
          dataSrcStations={dataSrcStations}
          searchOriginStation={this.searchOriginStation}
          setOriginStation={this.setOriginStation}
          searchDestStation={this.searchDestStation}
          setDestStation={this.setDestStation}
        />
        <div className={styles.routes}>
          {orderedRoutes.length === 0
            ? <Empty description="Please choose origin station and destination station" />
            : (
              <RoutesView
                orderedRoutes={orderedRoutes}
                orderedRoutesByLines={orderedRoutesByLines}
                originStation={originStation}
                destStation={destStation}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default Home;
