import React, { Component } from 'react';
import {
  AutoComplete, Timeline, Collapse, Icon,
} from 'antd';
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
      orderedRoutes: [],
      orderedRoutesByLines: [],
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

  getMinPoint = (originPoint, destPoint) => {
    const points = [];
    let originPoints = originPoint;
    let destPoints = destPoint;
    if (!originPoint.length) {
      originPoints = [originPoint];
    }
    if (!destPoint.length) {
      destPoints = [destPoint];
    }

    originPoints.forEach((originP) => {
      destPoints.forEach((destP) => {
        points.push(Math.abs(originP - destP));
      });
    });

    return Math.min(...points);
  }

  getRoutePoints = (routes, routesByLines, originStation, destStation) => {
    const routePoints = [];
    const changeLineBonus = 10;

    routes.forEach((route, i) => {
      if (route.length > 0) {
        route.forEach((station, j) => {
          if (j === 0) {
            routePoints[i] = this.getMinPoint(originStation[routesByLines[i][j]], station[routesByLines[i][j]]);
          } else {
            const prevStation = route[j - 1];
            routePoints[i] += changeLineBonus;
            routePoints[i] += this.getMinPoint(prevStation[routesByLines[i][j]], station[routesByLines[i][j]]);
          }

          if (j === route.length - 1) {
            routePoints[i] += this.getMinPoint(
              station[routesByLines[i][routesByLines[i].length - 1]],
              destStation[routesByLines[i][routesByLines[i].length - 1]],
            );
          }
        });
      }
    });

    return routePoints;
  }

  getOrderedRoutes = (routes, routesByLines, routePoints) => {
    const orderedRoutes = [];
    const orderedRoutesByLines = [];
    const visitedIdx = [];

    while (visitedIdx.length < routePoints.length) {
      let minPoint = 9999;
      let minPointIdx = -1;
      routePoints.forEach((p, idx) => {
        if (!visitedIdx.includes(idx) && p < minPoint) {
          minPointIdx = idx;
          minPoint = p;
        }
      });
      visitedIdx.push(minPointIdx);
      orderedRoutes.push(routes[minPointIdx]);
      orderedRoutesByLines.push(routesByLines[minPointIdx]);
    }

    return {
      orderedRoutes: orderedRoutes.slice(0, 9),
      orderedRoutesByLines: orderedRoutesByLines.slice(0, 9),
    };
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

  getRoutes = (originStation, destStation) => {
    const originLines = Object.keys(stations[originStation]);
    const routes = [];
    const routesByLines = [];

    Object.keys(stations[destStation]).forEach((destLine) => {
      this.currentRoute = [];
      this.currentRouteByLines = [];
      this.visitedStations = [originStation];
      this.getRoutesUtil(routes, routesByLines, originLines, destLine);
    });

    return this.getOrderedRoutes(
      routes,
      routesByLines,
      this.getRoutePoints(routes, routesByLines, stations[originStation], stations[destStation]),
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
        <div className={styles.searchStation}>
          <AutoComplete
            className={styles.searchStationInput}
            dataSource={dataSrcStations}
            onSearch={this.searchOriginStation}
            onSelect={this.setOriginStation}
            placeholder="Choose origin station"
          />
          <AutoComplete
            className={styles.searchStationInput}
            dataSource={dataSrcStations}
            onSearch={this.searchDestStation}
            onSelect={this.setDestStation}
            placeholder="Choose destination station"
          />
        </div>
        <div>
          <Collapse accordion bordered={false}>
            {orderedRoutes.map((route, i) => {
              const displayedRoute = [];
              let routeIntro = '';
              route.forEach((station, j) => {
                if (j === 0) {
                  routeIntro = `Via line ${orderedRoutesByLines[i][j]} in station ${station.name}`;
                  displayedRoute.push(
                    <Timeline.Item
                      color="red"
                      dot={<Icon type="login" />}
                      key={`${originStation} - ${station.name}`}
                    >
                      <b>
                        Take line {orderedRoutesByLines[i][j]}
                        &nbsp;from station {originStation} to station {station.name}
                      </b>
                    </Timeline.Item>,
                  );
                } else {
                  displayedRoute.push(
                    <Timeline.Item key={`${route[j - 1].name} - ${station.name}`}>
                      <b>
                        Take line {orderedRoutesByLines[i][j]}
                        &nbsp;from station {route[j - 1].name} to station {station.name}
                      </b>
                    </Timeline.Item>,
                  );
                }

                if (j === route.length - 1 && station.name !== destStation) {
                  displayedRoute.push(
                    <Timeline.Item
                      color="green"
                      dot={<Icon type="logout" />}
                      key={`${station.name} - ${destStation}`}
                    >
                      <b>
                        Take line {orderedRoutesByLines[i][orderedRoutesByLines[i].length - 1]}
                        &nbsp;from station {station.name} to station {destStation}
                      </b>
                    </Timeline.Item>,
                  );
                }
              });

              return (
                <Collapse.Panel header={routeIntro}>
                  <Timeline>
                    {displayedRoute}
                  </Timeline>
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default Home;
