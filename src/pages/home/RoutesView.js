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
          }
          if (j === route.length - 1) {
            if (station.name !== destStation) {
              if (route.length > 1) {
                displayedRoute.push(
                  <Timeline.Item key={`${route[j - 1].name} - ${station.name}`}>
                    {getDirection(orderedRoutesByLines[i][j], route[j - 1].name, station.name)}
                  </Timeline.Item>,
                );
              }
              displayedRoute.push(
                <Timeline.Item
                  color="green"
                  dot={<Icon type="logout" />}
                  key={`${station.name} - ${destStation}`}
                >
                  {getDirection(orderedRoutesByLines[i][orderedRoutesByLines[i].length - 1], station.name, destStation)}
                </Timeline.Item>,
              );
            }
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
  );
}

RoutesView.propTypes = {
  orderedRoutes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  orderedRoutesByLines: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  originStation: PropTypes.string.isRequired,
  destStation: PropTypes.string.isRequired,
};
