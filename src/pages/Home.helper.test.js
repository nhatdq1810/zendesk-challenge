import {
  getAdjStations, getMinPoint, searchStations, getRoutePoints, getOrderedRoutes,
} from './Home.helper';

describe('getAdjStations', () => {
  it('should return empty adjacent stations when there is no station contains source line', () => {
    const allStations = { A: { NS: 10 } };
    const srcLine = 'EW';
    const visitedStations = [];

    const { adjStations } = getAdjStations(allStations, srcLine, visitedStations);

    expect(adjStations).toHaveLength(0);
  });

  it('should return empty adjacent stations when visitedStations contains one station has source line', () => {
    const allStations = { A: { NS: 10, EW: 1 } };
    const srcLine = 'NS';
    const visitedStations = ['A'];

    const { adjStations } = getAdjStations(allStations, srcLine, visitedStations);

    expect(adjStations).toHaveLength(0);
  });

  it('should return empty adjacent stations when station contains only source line', () => {
    const allStations = { A: { NS: 10 } };
    const srcLine = 'NS';
    const visitedStations = [];

    const { adjStations } = getAdjStations(allStations, srcLine, visitedStations);

    expect(adjStations).toHaveLength(0);
  });

  it('should return empty adjacent stations when all stations contain only source line', () => {
    const allStations = { A: { NS: 10 }, B: { NS: 1 } };
    const srcLine = 'NS';
    const initialVisitedStations = [];

    const { adjStations, visitedStations } = getAdjStations(allStations, srcLine, initialVisitedStations);

    expect(adjStations).toHaveLength(0);
    expect(visitedStations).toHaveLength(0);
  });

  it('should return one adjacent station', () => {
    const allStations = { A: { NS: 10 }, B: { NS: 1, EW: 1 } };
    const srcLine = 'NS';
    const initialVisitedStations = [];

    const { adjStations, visitedStations } = getAdjStations(allStations, srcLine, initialVisitedStations);

    expect(adjStations).toEqual(['B']);
    expect(visitedStations).toEqual(['B']);
  });
});

describe('searchStations', () => {
  it('should return empty when there are no station names', () => {
    const stationNames = [];
    const value = 'A';

    const stations = searchStations(stationNames, value);

    expect(stations).toHaveLength(0);
  });

  it('should return empty when there are no station names match search value', () => {
    const stationNames = ['B', 'C'];
    const value = 'A';

    const stations = searchStations(stationNames, value);

    expect(stations).toHaveLength(0);
  });

  it('should return correctly when there are station names match search value', () => {
    const stationNames = ['A', 'b aC', 'A B', 'B a C', 'C'];
    const value = 'A';
    const expectedStations = ['A', 'b aC', 'A B', 'B a C'];

    const stations = searchStations(stationNames, value);

    expect(stations).toEqual(expectedStations);
  });
});

describe('getMinPoint', () => {
  it('should return min point when both origin and destination have only one point', () => {
    const originPoint = 1;
    const destPoint = 2;
    const expectedPoint = 1;

    const minPoint = getMinPoint(originPoint, destPoint);

    expect(minPoint).toBe(expectedPoint);
  });

  it('should return min point when both origin and destination have multiple points', () => {
    const originPoint = [1, 11];
    const destPoint = [20, 5];
    const expectedPoint = 4;

    const minPoint = getMinPoint(originPoint, destPoint);

    expect(minPoint).toBe(expectedPoint);
  });
});

describe('getRoutePoints', () => {
  it('should return empty when routes contain only empty element', () => {
    const routes = [[]];
    const routesByLines = [['NS']];
    const originStation = { NS: 4 };
    const destStation = { NS: 10 };

    const routePoints = getRoutePoints(routes, routesByLines, originStation, destStation);

    expect(routePoints).toEqual([6]);
  });

  it('should return correctly when origin station has same line with destination station', () => {
    const routes = [[{ NS: 1 }]];
    const routesByLines = [['NS']];
    const originStation = { NS: 2 };
    const destStation = { NS: 1 };
    const expectedRoutePoints = [1];

    const routePoints = getRoutePoints(routes, routesByLines, originStation, destStation);

    expect(routePoints).toEqual(expectedRoutePoints);
  });

  it('should return correctly when route has more than one station', () => {
    const routes = [
      [{ NS: [1, 10], EW: 4 }, { EW: 2, DT: 15 }, { DT: 5 }],
      [{ NS: [1, 10], EW: 4 }, { EW: 22, ST: 15 }, { ST: 16, DT: 5 }],
    ];
    const routesByLines = [['NS', 'EW', 'DT'], ['NS', 'EW', 'ST', 'DT']];
    const originStation = { NS: 2 };
    const destStation = { DT: 1 };
    const expectedRoutePoints = [37, 44];

    const routePoints = getRoutePoints(routes, routesByLines, originStation, destStation);

    expect(routePoints).toEqual(expectedRoutePoints);
  });
});

describe('getOrderedRoutes', () => {
  it('should return empty when there is no route points', () => {
    const routes = [];
    const routesByLines = [];
    const routePoints = [];

    const { orderedRoutes, orderedRoutesByLines } = getOrderedRoutes(routes, routesByLines, routePoints);

    expect(orderedRoutes).toHaveLength(0);
    expect(orderedRoutesByLines).toHaveLength(0);
  });

  it('should remain order when all routes have same point', () => {
    const routes = [[{ name: 'A', CC: 1 }], [{ name: 'B', CC: 1 }]];
    const routesByLines = [['CC'], ['CC']];
    const routePoints = [1, 1];

    const { orderedRoutes, orderedRoutesByLines } = getOrderedRoutes(routes, routesByLines, routePoints);

    expect(orderedRoutes).toEqual(routes);
    expect(orderedRoutesByLines).toEqual(routesByLines);
  });

  it('should return correctly', () => {
    const routes = [
      [{ name: 'A', CC: 1 }],
      [{ name: 'B', CE: 10 }, { name: 'B1', CC: 10, CE: 9 }],
      [{ name: 'C', CC: 2 }],
      [{ name: 'D', DT: 12 }, { name: 'D1', DT: 1, SE: 20 }, { name: 'D2', SE: 19, CC: 4 }],
      [{ name: 'E', CE: 1 }, { name: 'E1', CE: 2, CC: 1 }],
      [{ name: 'F', CC: 1 }],
    ];
    const routesByLines = [['CC'], ['CE', 'CC'], ['CC'], ['DT', 'SE', 'CC'], ['CE', 'CC'], ['CC']];
    const routePoints = [1, 10, 2, 11, 2, 1];
    const expectedRoutes = [
      [{ name: 'A', CC: 1 }],
      [{ name: 'F', CC: 1 }],
      [{ name: 'C', CC: 2 }],
      [{ name: 'E', CE: 1 }, { name: 'E1', CE: 2, CC: 1 }],
      [{ name: 'B', CE: 10 }, { name: 'B1', CC: 10, CE: 9 }],
      [{ name: 'D', DT: 12 }, { name: 'D1', DT: 1, SE: 20 }, { name: 'D2', SE: 19, CC: 4 }],
    ];
    const expectedRoutesByLines = [['CC'], ['CC'], ['CC'], ['CE', 'CC'], ['CE', 'CC'], ['DT', 'SE', 'CC']];

    const { orderedRoutes, orderedRoutesByLines } = getOrderedRoutes(routes, routesByLines, routePoints);

    expect(orderedRoutes).toEqual(expectedRoutes);
    expect(orderedRoutesByLines).toEqual(expectedRoutesByLines);
  });
});
