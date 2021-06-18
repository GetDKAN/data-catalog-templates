import {renderHook, act} from '@testing-library/react-hooks'
import '@testing-library/jest-dom/extend-expect';
import usePagination from './';

describe('usePagination custom hook', () => {
  test('returns pagination', () => {
    const { result } = renderHook(() => usePagination(0, 12, 5))
    expect(result.current.pageIndex).toEqual(0);
    expect(result.current.pages).toEqual(3);
    act(() => { result.current.setPageIndex(2) });
    expect(result.current.canGoToPrevious).toEqual(true);
    act(() => { result.current.setItemsPerPage(10) });
    expect(result.current.pages).toEqual(2);
    expect(result.current.pageIndex).toEqual(0);
    act(() => { result.current.setTotalItems(100) });
    expect(result.current.pages).toEqual(10);
    expect(result.current.pageIndex).toEqual(0);
  })
  test('canGoToPrevious is false when on first page', () => {
    const { result } = renderHook(() => usePagination(0, 12, 5))
    expect(result.current.canGoToPrevious).toEqual(false);
    expect(result.current.pageIndex).toEqual(0);
    act(() => { result.current.goToNext() });
    expect(result.current.canGoToPrevious).toEqual(true);
    act(() => { result.current.goToPrevious() });
    expect(result.current.canGoToPrevious).toEqual(false);
    act(() => { result.current.goToPrevious() });
    expect(result.current.pageIndex).toEqual(0);
  })
  test('canNextPage is false when on last page', () => {
    const { result } = renderHook(() => usePagination(0, 12, 5))
    expect(result.current.canGoToNext).toEqual(true);
    act(() => { result.current.setPageIndex(3) });
    expect(result.current.canGoToNext).toEqual(false);
    act(() => { result.current.goToNext() });
    expect(result.current.pageIndex).toEqual(3);
  })
});
