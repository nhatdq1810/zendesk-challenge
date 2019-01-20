import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Home from './Home';
import SearchStation from './home/SearchStation';

const createNodeMock = (el) => {
  if (el.type === 'input') {
    return { focus: jest.fn() };
  }
  return null;
};

jest.mock('../utils/stations.json', () => ({
  A: { NS: 1, CC: 2 },
  A1: { NS: 3 },
  B: { NS: 2, DT: 5 },
  C: { DT: 10, SE: [2, 15] },
  D: { SE: 3, EW: 4 },
  E: { EW: 3, CC: 5 },
}));

describe('Home', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Home />);
  });

  it('should render correctly when orderedRoutes is empty', () => {
    const snapshot = renderer.create(<Home />, { createNodeMock }).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('should pass prop searchOriginStation correctly to SearchStation', () => {
    const searchStationComp = wrapper.find(SearchStation);
    const expectedOriginStation = 'expectedOriginStation';

    searchStationComp.prop('searchOriginStation')(expectedOriginStation);

    expect(wrapper.state('originStation')).toBe(expectedOriginStation);
  });

  it('should pass prop searchDestStation correctly to SearchStation', () => {
    const searchStationComp = wrapper.find(SearchStation);
    const expectedDestStation = 'expectedDestStation';

    searchStationComp.prop('searchDestStation')(expectedDestStation);

    expect(wrapper.state('destStation')).toBe(expectedDestStation);
  });

  it('should pass prop setOriginStation correctly to SearchStation', () => {
    const searchStationComp = wrapper.find(SearchStation);
    const expectedOriginStation = 'A1';

    searchStationComp.prop('setOriginStation')(expectedOriginStation);

    expect(wrapper.state('originStation')).toBe(expectedOriginStation);
    expect(wrapper.state('orderedRoutes')).toEqual([]);

    wrapper.setState({ destStation: 'B' });
    searchStationComp.prop('setOriginStation')(expectedOriginStation);

    expect(wrapper.state('originStation')).toBe(expectedOriginStation);
  });

  it('should pass prop setDestStation correctly to SearchStation', () => {
    const searchStationComp = wrapper.find(SearchStation);
    const expectedDestStation = 'A1';

    searchStationComp.prop('setDestStation')(expectedDestStation);

    expect(wrapper.state('destStation')).toBe(expectedDestStation);
    expect(wrapper.state('orderedRoutes')).toEqual([]);

    wrapper.setState({ originStation: 'B' });
    searchStationComp.prop('setDestStation')(expectedDestStation);

    expect(wrapper.state('destStation')).toBe(expectedDestStation);
  });
});

describe('getRoutes', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Home />);
  });

  it('should return correct routes when origin and destination have same line', () => {
    const originStation = 'A';
    const destStation = 'A1';

    const routes = wrapper.instance().getRoutes(originStation, destStation);

    expect(routes).toEqual({ orderedRoutes: [[]], orderedRoutesByLines: [['NS']] });
  });

  it('should return correct routes when origin and destination do not have same line', () => {
    const originStation = 'A';
    const destStation = 'E';

    const routes = wrapper.instance().getRoutes(originStation, destStation);

    expect(routes).toEqual({
      orderedRoutes: [
        [{ EW: 3, CC: 5, name: 'E' }],
        [],
        [{ DT: 5, NS: 2, name: 'B' }, { DT: 10, SE: [2, 15], name: 'C' }, { EW: 4, SE: 3, name: 'D' }]],
      orderedRoutesByLines: [
        ['CC', 'EW'],
        ['CC'],
        ['NS', 'DT', 'SE', 'EW'],
      ],
    });
  });
});
