import React from 'react';
import PropTypes from 'prop-types';
import { Timeline, Collapse, Icon } from 'antd';

const getDirection = (line, fromStation, toStation) => (
  <b>
    Take line {line}
    &nbsp;from station {fromStation} to station {toStation}
  </b>
);

export default function RoutesView({
  orderedRoutes, orderedRoutesByLines, originStation, destStation,
}) {
  return (
    <Collapse defaultActiveKey="0" bordered={false}>
      {orderedRoutes.map((route, i) => {
        const displayedRoute = [];
        let routeIntro = '';

        if (route.length === 1) {
          if (route[0].name === destStation) {
            routeIntro = `Via line ${orderedRoutesByLines[i][0]}, station ${destStation}`;
            displayedRoute.push(
              <Timeline.Item
                color="green"
                dot={<Icon type="logout" />}
                key={`${originStation} - ${destStation}`}
              >
                {getDirection(orderedRoutesByLines[i][0], originStation, destStation)}
              </Timeline.Item>,
            );
          } else {
            routeIntro = `Via line ${orderedRoutesByLines[i][0]}, station ${route[0].name}`;
            displayedRoute.push(
              <Timeline.Item
                color="red"
                dot={<Icon type="login" />}
                key={`${originStation} - ${route[0].name}`}
              >
                {getDirection(orderedRoutesByLines[i][0], originStation, route[0].name)}
              </Timeline.Item>,
              <Timeline.Item
                color="green"
                dot={<Icon type="logout" />}
                key={`${route[0].name} - ${destStation}`}
              >
                {getDirection(orderedRoutesByLines[i][1], route[0].name, destStation)}
              </Timeline.Item>,
            );
          }
        } else {
          route.forEach((station, j) => {
            if (j === 0) {
              routeIntro = `Via line ${orderedRoutesByLines[i][j]}, station ${station.name}`;
              displayedRoute.push(
                <Timeline.Item
                  color="red"
                  dot={<Icon type="login" />}
                  key={`${originStation} - ${station.name}`}
                >
                  {getDirection(orderedRoutesByLines[i][j], originStation, station.name)}
                </Timeline.Item>,
              );
            } else {
              displayedRoute.push(
                <Timeline.Item key={`${route[j - 1].name} - ${station.name}`}>
                  {getDirection(orderedRoutesByLines[i][j], route[j - 1].name, station.name)}
                </Timeline.Item>,
              );
            }

            if (j === route.length - 1) {
              displayedRoute.push(
                <Timeline.Item
                  color="green"
                  dot={<Icon type="logout" />}
                  key={`${station.name} - ${destStation}`}
                >
                  {getDirection(orderedRoutesByLines[i][j + 1], station.name, destStation)}
                </Timeline.Item>,
              );
            }
          });
        }

        return (
          <Collapse.Panel key={`${routeIntro}-${i}`} header={routeIntro}>
            <Timeline>
              {displayedRoute}
            </Timeline>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
}

RoutesView.propTypes = {
  orderedRoutes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  orderedRoutesByLines: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  originStation: PropTypes.string.isRequired,
  destStation: PropTypes.string.isRequired,
};
