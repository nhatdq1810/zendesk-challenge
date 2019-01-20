import React, { Component } from 'react';
import {
  AutoComplete, Timeline, Collapse, Icon, Empty,
} from 'antd';
import styles from './Home.module.scss';
import stations from '../utils/stations.json';
import {
  getAdjStations, searchStations, getRoutePoints, getOrderedRoutes,
} from './Home.helper';

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

    Object.keys(stations[destStationName]).forEach((destLine) => {
      this.currentRoute = [];
      this.currentRouteByLines = [];
      this.visitedStations = [originStationName];
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
    console.log(orderedRoutes);
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
        <div className={styles.routes}>
          {orderedRoutes.length === 0
            && <Empty description="Please choose origin station and destination station" />
          }
          {orderedRoutes.length > 0
            && (
              <Collapse defaultActiveKey="0" bordered={false}>
                {orderedRoutes.map((route, i) => {
                  const displayedRoute = [];
                  let routeIntro = '';
                  route.forEach((station, j) => {
                    if (j === 0) {
                      routeIntro = `Via line ${orderedRoutesByLines[i][j]}, station ${station.name}`;
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
                    } else if (station.name !== destStation) {
                      displayedRoute.push(
                        <Timeline.Item key={`${route[j - 1].name} - ${station.name}`}>
                          <b>
                            Take line {orderedRoutesByLines[i][j]}
                            &nbsp;from station {route[j - 1].name} to station {station.name}
                          </b>
                        </Timeline.Item>,
                      );
                      console.log('station.name', station.name);
                      console.log('j === route.length - 1', j === route.length - 1);
                      if (j === route.length - 1) {
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
                    } else {
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
            )}
        </div>
      </div>
    );
  }
}

export default Home;
