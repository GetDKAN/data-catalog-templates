/**
 * @jest-environment jsdom
 */
import React from 'react';
import axios from 'axios';
import {act} from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect';
import Resource from './index';
import { ResourceDispatch } from './helpers';
import { transformTableFilterToQueryCondition } from '../hooks/useDatastore/transformConditions';

jest.mock('axios');
const rootUrl = 'http://dkan.com/api/1';
const data = {
  data: {
    results: [{record_id: '1', column_1: 'fizz', column_2: 'dkan'}],
    count: '1'
  }
}
const distribution = {
  identifier: "1234-1234",
  data: {
    downloadURL: `${rootUrl}/files/file.csv`,
    format: "csv",
    title: "Dist Title"
  }
}

const MyTestComponent = () => {
  const { totalRows, items, actions, limit, offset } = React.useContext(ResourceDispatch)
  const { setLimit, setOffset } = actions;
  // console.log(ResourceDispatch)
  return (
    <div>
      <p>{items[0].column_1} and {totalRows} and {limit} and {offset}</p>
      <button onClick={() => setLimit(25)}>Up Limit</button>
      <button onClick={() => setOffset(10)}>Up Offset</button>
    </div>
  )
}

describe.skip('<Resource />', () => {
  test('renders data', async () => {
    await axios.post.mockImplementation(() => Promise.resolve(data));
    render(
        <Resource
          distribution={distribution}
          rootUrl={rootUrl}
        >
          <MyTestComponent />
        </Resource>
      );
    await act(async () => {});
    expect(axios.post).toHaveBeenCalledWith(
      "http://dkan.com/api/1/datastore/query/?",
    {
      conditions: undefined,
      keys: true,
      limit: 20, 
      offset: 0, 
      resources: [{"alias": "t", "id": "1234-1234"}],
      sort: undefined
    });
    expect(screen.getByText('fizz and 1 and 20 and 0')).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByText('Up Limit'));
    });
    expect(screen.getByText('fizz and 1 and 25 and 0')).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByText('Up Offset'));
    });
    expect(screen.getByText('fizz and 1 and 25 and 10')).toBeInTheDocument();
  });

  // test('renders data using initial conditions', async () => {
  //   await axios.post.mockImplementation(() => Promise.resolve(data));
  //   render(
  //     <Resource
  //       distribution={distribution}
  //       rootUrl={rootUrl}
  //       options={{
  //         conditions: transformTableFilterToQueryCondition([{id: 'foo', value: 'bar'}])
  //       }}
  //     >
  //       <MyTestComponent />
  //     </Resource>
  //   );
  //   await act(async () => {});
  //   expect(axios.post).toHaveBeenCalledWith(
  //     "http://dkan.com/api/1/datastore/query/?",
  //     {
  //       conditions: [{
  //         resource: 't',
  //         property: 'foo',
  //         value: `%bar%`,
  //         operator: 'LIKE',
  //       }],
  //       keys: true,
  //       limit: 20, 
  //       offset: 0, 
  //       resources: [{"alias": "t", "id": "1234-1234"}],
  //       sort: undefined
  //     });
  //   })
});