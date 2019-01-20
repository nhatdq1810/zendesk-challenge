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

export const searchStations = (stationNames, value) => stationNames.filter(
  sName => sName.toLowerCase().includes(value.toLowerCase()),
);

export const getMinPoint = (originPoint, destPoint) => {
  const points = [];
  const originPoints = originPoint.length ? originPoint : [originPoint];
  const destPoints = destPoint.length ? destPoint : [destPoint];

  originPoints.forEach((originP) => {
    destPoints.forEach((destP) => {
      points.push(Math.abs(originP - destP));
    });
  });

  return Math.min(...points);
};

export const getRoutePoints = (routes, routesByLines, originStation, destStation) => {
  const routePoints = [];
  const changeLineBonus = 10;

  routes.forEach((route, i) => {
    if (route.length > 0) {
      route.forEach((station, j) => {
        if (j === 0) {
          routePoints[i] = getMinPoint(originStation[routesByLines[i][j]], station[routesByLines[i][j]]);
        } else {
          const prevStation = route[j - 1];
          routePoints[i] += changeLineBonus;
          routePoints[i] += getMinPoint(prevStation[routesByLines[i][j]], station[routesByLines[i][j]]);
        }

        if (j === route.length - 1) {
          routePoints[i] += getMinPoint(
            station[routesByLines[i][routesByLines[i].length - 1]],
            destStation[routesByLines[i][routesByLines[i].length - 1]],
          );
        }
      });
    }
  });

  return routePoints;
};

export const getOrderedRoutes = (routes, routesByLines, routePoints) => {
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
};
