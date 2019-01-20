import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete } from 'antd';
import styles from './SearchStation.module.scss';

export default function SearchStation({
  dataSrcStations, searchOriginStation, setOriginStation,
  searchDestStation, setDestStation,
}) {
  return (
    <div className={styles.wrapper}>
      <AutoComplete
        autoFocus
        className={styles.input}
        dataSource={dataSrcStations}
        onSearch={searchOriginStation}
        onSelect={setOriginStation}
        placeholder="Choose origin station"
      />
      <AutoComplete
        className={styles.input}
        dataSource={dataSrcStations}
        onSearch={searchDestStation}
        onSelect={setDestStation}
        placeholder="Choose destination station"
      />
    </div>
  );
}

SearchStation.propTypes = {
  dataSrcStations: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchOriginStation: PropTypes.func.isRequired,
  setOriginStation: PropTypes.func.isRequired,
  searchDestStation: PropTypes.func.isRequired,
  setDestStation: PropTypes.func.isRequired,
};
