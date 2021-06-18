import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useDatastore from '../hooks/useDatastore';
import { ResourceDispatch } from './helpers';

const Resource = ({ distribution, rootUrl, children, options }) => {
  const { identifier } = distribution;
  console.log(identifier)
  const { 
    loading,
    values,
    columns,
    count,
    limit,
    offset,
    schema,
    conditions,
    setResource,
    setLimit,
    setOffset,
    setConditions,
    setSort,
  } = useDatastore(identifier, rootUrl, options);
  const actions = {
    setResource,
    setLimit,
    setOffset,
    setConditions,
    setSort,
  };

  useEffect(() => {
    setOffset(0)
  }, [limit])
  console.log(values)
  return (
    <ResourceDispatch.Provider value={{
      loading: loading,
      items: values,
      columns: columns,
      actions: actions,
      totalRows: count,
      limit: limit,
      offset: offset,
      conditions: conditions,
      schema: schema,
    }}>
      {children}
    </ResourceDispatch.Provider>
  );
}

Resource.defaultProps = {
  options: {},
};

Resource.propTypes = {
  distribution: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    data: PropTypes.shape({
      downloadURL: PropTypes.string.isRequired,
      format: PropTypes.string,
      title: PropTypes.string,
      mediaType: PropTypes.string,
    })
  }).isRequired,
  rootUrl: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  options: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
    keys: PropTypes.bool,
    prepareColumns: PropTypes.func
  })
};

export default Resource;
