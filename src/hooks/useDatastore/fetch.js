import axios from 'axios';

export async function fetchDataFromQuery(id, rootUrl, options) {
  const { keys, limit, offset, conditions, sort, prepareColumns, properties, setValues, setCount, setColumns, setLoading, setSchema } = options;
  if(!id) {
    // TODO: Throw error
    return false;
  }
  if(typeof setLoading === 'function') {
    setLoading(true);
  }
  return await axios.post(`${rootUrl}/datastore/query/?`, {
    resources: [{id: id, alias: 't'}],
    keys: keys,
    limit: limit,
    offset: offset,
    conditions: conditions,
    sorts: sort,
    properties: properties
  })
  .then((res) => {
    const { data } = res;
    setValues(data.results),
    setCount(data.count)
    if(data.results.length) {
      setColumns(prepareColumns ? prepareColumns(Object.keys(data.results[0])) : Object.keys(data.results[0]))
    }
    setSchema(data.schema)
    if(typeof setLoading === 'function') {
      setLoading(false);
    }
    return data;
  })
}
