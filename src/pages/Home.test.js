import { getAdjStations } from './Home';

jest.mock('../utils/stations.json', () => ({
  Admiralty: { NS: 10 },
  Aljunied: { EW: 9 },
  'Ang Mo Kio': { NS: 16 },
  'Bahar Junction': { JS: 7 },
  Bakau: { SE: 3 },
  Bangkit: { BP: 9 },
  Bartley: { CC: 12, CE: 12 },
  Bayfront: { CE: 3, DT: 16 },
}));

describe('getAdjStations', () => {
  it('should return empty adjacent stations when there is no station contains source line', () => {
    const allStations = { Admiralty: { NS: 10 } };
    const srcLine = 'EW';
    const visitedStations = [];

    const { adjStations } = getAdjStations(allStations, srcLine, visitedStations);

    expect(adjStations).toHaveLength(0);
  });

  it('should return empty adjacent stations when visitedStations contains one station has source line', () => {
    const allStations = { Admiralty: { NS: 10, EW: 1 } };
    const srcLine = 'NS';
    const visitedStations = ['Admiralty'];

    const { adjStations } = getAdjStations(allStations, srcLine, visitedStations);

    expect(adjStations).toHaveLength(0);
  });

  it('should return empty adjacent stations when station contains only source line', () => {
    const allStations = { Admiralty: { NS: 10 } };
    const srcLine = 'NS';
    const visitedStations = [];

    const { adjStations } = getAdjStations(allStations, srcLine, visitedStations);

    expect(adjStations).toHaveLength(0);
  });
});
