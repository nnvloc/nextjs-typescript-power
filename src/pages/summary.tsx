import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

import TopMenu from 'src/components/topMenu';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { INumber, INumberObject, selectAllNumber } from 'src/redux/reducers/numbersSlice';

import { IResultData, selectLatestStt, selectResultsData, setResults } from 'src/redux/reducers/resultsSlice';

import { calculateAvgSttDiff } from 'src/helpers/number';

import { EnumSortBy } from 'src/types';

const Summary : NextPage = () => {
  const allResults: IResultData = useAppSelector(selectResultsData);
  const allNumbers: INumberObject = useAppSelector(selectAllNumber);
  const latestStt : number = useAppSelector(selectLatestStt);

  const [ saiso, setSaiSo ] = useState(0);
  const [ stt, setStt ] = useState(latestStt);
  const [ searchResults, setSearchResult ] = useState<INumber[]>(Object.values(allNumbers));
  const [ resultByStt, setResultByStt] = useState(allResults[latestStt]);
  const [ sortBy, setSortBy ] = useState<EnumSortBy>(EnumSortBy.NUMBER);

  useEffect(() => {
    if (latestStt) {
      setStt(latestStt + 1);
    }
    if (allNumbers && Object.keys(allNumbers).length > 0) {
      setSearchResult(Object.values(allNumbers));
    }

    if (allResults && Object.keys(allResults).length > 0) {
      setResultByStt(allResults[latestStt + 1]);
    }
  }, [latestStt, allNumbers, allResults]);

  const onChangeSaiSo = (e : any) => {
    const v = e.target.value || 0;
    if (v < 0) {
      return;
    }
    setSaiSo(v);
  }

  const onChangeStt = (e: any) => {
    const v = e.target.value;
    setStt(v);
    setResultByStt(allResults[v]);
  }

  const onChangeSortBy = (e: any) => {
    const v = e.target.value;
    setSortBy(v);
    if (v === EnumSortBy.DIFF) {
      const results = searchResults.sort((a,b) => {
        const aDiffToNextAppear = stt - a.latestAppearStt;
        const bDiffToNextAppear = stt - b.latestAppearStt;
        return aDiffToNextAppear - bDiffToNextAppear;
      });
      setSearchResult(results);
    }

    if (v === EnumSortBy.NUMBER) {
      const results = searchResults.sort((a,b) => a.key - b.key);
      setSearchResult(results);
    }
  }

  const handleSearch = () => {
    let numbers : INumber[] = [...Object.values(allNumbers)];
    const { value = [] } = resultByStt ?? {};
    if (value.length) {
      numbers = numbers.filter(n => value.includes(n.key));
    }
    if (stt && stt !== latestStt) {
      numbers = numbers.map(n => {
        const { appearStt = [] } = n;
        const stts : number[] = appearStt.filter(i => i < stt);
        const length : number = stts.length;
        const latestStt : number = stts[length - 1];
        const arrDiffs : number[] = [0];
        for (let i: number = 1; i < length; i++) {
          const diff : number = stts[i] - stts[i-1];
          arrDiffs.push(diff);
        }
        const avgDiff = +(calculateAvgSttDiff(arrDiffs).toFixed(2));
        return {
          ...n,
          appearStt: stts,
          sttAppearsDiff: arrDiffs,
          averageDiff: avgDiff,
          latestAppearStt: latestStt,
        };
      });
      setSearchResult(numbers);
    }
  }

  const renderResults = () => {
    return searchResults.map(n => (
      <div key={n.key} className="flex flex-col number-wrapper mb-3">
        <div>Key: {n.key}</div>
        <div>Latest appear: {n.latestAppearStt}</div>
        <div>averageDiff: {n.averageDiff}</div>
        <div>diff to next appear if exist: {stt - n.latestAppearStt}</div>
        <div>Longest diff: { Math.max(...n.sttAppearsDiff ?? []) }</div>
        <div>Shortest diff: { Math.min(...(n.sttAppearsDiff?.filter(i => i >0)) ?? []) }</div>
      </div>
    ))
  }

  const getTotalAvgDiff = () => {
    const diffs : number[] = searchResults.map(item => stt - item.latestAppearStt);
    const length = diffs.length;
    const totalDiffs = diffs.reduce((total, d) => total + d, 0);
    return (totalDiffs / length).toFixed(2);
  }

  return (
    <>
      <TopMenu />
      <div className="w-full py-3">
        <form className="flex sm:flex-row w-full">
          <input
            className="max-w-xs appearance-none border rounded w-full py-2 px-3 mx-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={saiso}
            placeholder="Sai so"
            onChange={onChangeSaiSo}
          />

          <input
            className="max-w-xs appearance-none border rounded w-full py-2 px-3 mx-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={stt}
            placeholder="Stt for caculating"
            onChange={onChangeStt}
          />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-3"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
          <div className="flex sm:flex-row">
            <div className="mr-3 flex justify-center items-center">Sortby:</div>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={sortBy}
              onChange={onChangeSortBy}
            >
              <option value={EnumSortBy.NUMBER}>Number</option>
              <option value={EnumSortBy.DIFF}>Diff</option>
            </select>
          </div>
        </form>
      </div>
      {
        resultByStt && (
          <div className="result-container">
            <div>Results at {stt}: {resultByStt.value.join(', ')}</div>
            <div>Total avg diffs: {getTotalAvgDiff()}</div>
          </div>
        )
      }
      <div className="flex flex-col py-3">
        {renderResults()}
      </div>
    </>
  )
}

export default Summary;
