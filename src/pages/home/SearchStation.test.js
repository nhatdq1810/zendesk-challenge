import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { AutoComplete } from 'antd';
import SearchStation from './SearchStation';

describe('SearchStation', () => {
  const searchOriginStation = jest.fn();
  const setOriginStation = jest.fn();
  const searchDestStation = jest.fn();
  const setDestStation = jest.fn();

  beforeEach(() => {
    searchOriginStation.mockReset();
    setOriginStation.mockReset();
    searchDestStation.mockReset();
    setDestStation.mockReset();
  });

  it('should render 2 AutoComplete comps', () => {
    const snapshot = renderer.create(
      <SearchStation
        dataSrcStations={[]}
        searchOriginStation={searchOriginStation}
        setOriginStation={setOriginStation}
        searchDestStation={searchDestStation}
        setDestStation={setDestStation}
      />,
    ).toJSON();

    expect(snapshot).toMatchSnapshot();
  });

  it('should call searchOriginStation when origin station AutoComplete handles search event', () => {
    const wrapper = shallow(<SearchStation
      dataSrcStations={[]}
      searchOriginStation={searchOriginStation}
      setOriginStation={setOriginStation}
      searchDestStation={searchDestStation}
      setDestStation={setDestStation}
    />);
    const originStationInput = wrapper.find(AutoComplete).at(0);

    originStationInput.simulate('search');

    expect(searchOriginStation).toHaveBeenCalledTimes(1);
  });

  it('should call setOriginStation when origin station AutoComplete handles select event', () => {
    const wrapper = shallow(<SearchStation
      dataSrcStations={[]}
      searchOriginStation={searchOriginStation}
      setOriginStation={setOriginStation}
      searchDestStation={searchDestStation}
      setDestStation={setDestStation}
    />);
    const originStationInput = wrapper.find(AutoComplete).at(0);

    originStationInput.simulate('select');

    expect(setOriginStation).toHaveBeenCalledTimes(1);
  });

  it('should call searchDestStation when destination station AutoComplete handles search event', () => {
    const wrapper = shallow(<SearchStation
      dataSrcStations={[]}
      searchOriginStation={searchOriginStation}
      setOriginStation={setOriginStation}
      searchDestStation={searchDestStation}
      setDestStation={setDestStation}
    />);
    const destStationInput = wrapper.find(AutoComplete).at(1);

    destStationInput.simulate('search');

    expect(searchDestStation).toHaveBeenCalledTimes(1);
  });

  it('should call setDestStation when destination station AutoComplete handles select event', () => {
    const wrapper = shallow(<SearchStation
      dataSrcStations={[]}
      searchOriginStation={searchOriginStation}
      setOriginStation={setOriginStation}
      searchDestStation={searchDestStation}
      setDestStation={setDestStation}
    />);
    const destStationInput = wrapper.find(AutoComplete).at(1);

    destStationInput.simulate('select');

    expect(setDestStation).toHaveBeenCalledTimes(1);
  });
});
