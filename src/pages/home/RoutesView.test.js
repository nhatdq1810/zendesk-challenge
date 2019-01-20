import React from 'react';
import renderer from 'react-test-renderer';
import RoutesView from './RoutesView';

describe('RoutesView', () => {
  it('should render one route contains only destination station', () => {
    const snapshot = renderer.create(<RoutesView
      orderedRoutes={[
        [{ name: 'final', CC: 2, DT: 1 }],
      ]}
      orderedRoutesByLines={[
        ['CC', 'DT'],
      ]}
      originStation="begin"
      destStation="final"
    />);

    expect(snapshot).toMatchSnapshot();
  });

  it('should render one route contains only one station', () => {
    const snapshot = renderer.create(<RoutesView
      orderedRoutes={[
        [{ name: 'A', CC: 2, DT: 1 }],
      ]}
      orderedRoutesByLines={[
        ['CC', 'DT'],
      ]}
      originStation="begin"
      destStation="final"
    />);

    expect(snapshot).toMatchSnapshot();
  });

  it('should render one route contains two interchange stations', () => {
    const snapshot = renderer.create(<RoutesView
      orderedRoutes={[
        [{ name: 'A', CC: 2, CE: 1 }, { name: 'B', CE: 4, DT: 2 }],
      ]}
      orderedRoutesByLines={[
        ['CC', 'CE', 'DT'],
      ]}
      originStation="begin"
      destStation="final"
    />);

    expect(snapshot).toMatchSnapshot();
  });
});
