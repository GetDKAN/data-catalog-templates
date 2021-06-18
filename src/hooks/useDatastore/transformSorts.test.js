import { transformTableSortToQuerySort } from './transformSorts';

describe('transformTableSortToQuerySort', () => {
  test('transform an array from of sorts from React Table into DKAN query format', async () => {
    const testArray1 = [{id: "my_label", desc: true}]
    const testArray2 = [{id: "another_label", desc: false}]

    expect(transformTableSortToQuerySort(testArray1)).toEqual([{order: 'desc', property: 'my_label'}]);
    expect(transformTableSortToQuerySort(testArray2)).toEqual([{order: 'asc', property: 'another_label'}]);
    expect(transformTableSortToQuerySort(testArray1.concat(testArray2))).toEqual([{order: 'desc', property: 'my_label'}, {order: 'asc', property: 'another_label'}]);
  });
});
