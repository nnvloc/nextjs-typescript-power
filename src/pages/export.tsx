import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useAppSelector } from 'src/redux/hooks';
import { selectLatestStt, selectResultsData } from 'src/redux/reducers/resultsSlice';
import { INumber, selectAllNumber } from 'src/redux/reducers/numbersSlice';
import TopMenu from 'src/components/topMenu';

import { calculateAvgSttDiff } from 'src/helpers/number';

interface IValueNumber extends INumber {
  nextAppearDiff?: number,
}

interface ISearchResult {
  stt: number,
  value: number[],
  numbers: IValueNumber[],
  totalAvgDiffs: number | string,
}

const Export: NextPage = () => {
  const allResults = useAppSelector(selectResultsData);
  const latestStt = useAppSelector(selectLatestStt);
  const allNumbers = useAppSelector(selectAllNumber);

  const [ startStt, setStartStt ] = useState<number>(0);
  const [ endStt, setEndStt ] = useState<number>(0);
  const [ searchResults, setSearchResult ] = useState<ISearchResult[]>();

  const onChangeStartStt = (e: any) => {
    setStartStt(e.target.value);
  }

  const onChangeEndStt = (e: any) => {
    setEndStt(e.target.value);
  }

  const handleSearch = () => {
    console.log('start: ', startStt);
    console.log('end: ', endStt);
    const calculatedResults = [];
    for (let curStt = startStt; curStt <= endStt; curStt++) {
      const result = allResults[curStt] ?? {};
      const resultValue = result.value ?? [];
      let numbers : IValueNumber[] = [...Object.values(allNumbers)].filter(n => resultValue.includes(n.key));
      // Start calculate
      numbers = numbers = numbers.map(n => {
        const { appearStt = [] } = n;
        const stts : number[] = appearStt.filter(i=> i < curStt);
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
          nextAppearDiff: curStt - latestStt,
        };
      });

      const totalAvgDiffs = getTotalAvgDiff(curStt, numbers);

      const tempResult = {
        stt: curStt,
        value: resultValue,
        numbers,
        totalAvgDiffs, 
      }

      calculatedResults.push(tempResult);
    }

    setSearchResult(calculatedResults);
  }

  const getTotalAvgDiff = (stt: number, numbers: INumber[]) => {
    const diffs : number[] = numbers.map(item => stt - item.latestAppearStt);
    const length = diffs.length;
    const totalDiffs = diffs.reduce((total, d) => total + d, 0);
    return (totalDiffs / length).toFixed(2);
  }

  const renderSearchResults = () => {
    return searchResults?.map(item => (
      <div key={item.stt} className="flex flex-row pb-3">
        <div className="flex">{item.stt}</div>
        <div className="flex flex-1 justify-center items-center">{item.value.join(', ')}</div>
        <div className="flex flex-1 justify-center items-center">{item.numbers.map(n => n.nextAppearDiff).sort((a = 0,b = 0) => a -b).join(', ')}</div>
        <div className="flex">{item.totalAvgDiffs}</div>
      </div>
    ))
  }

  return (
    <>
      <TopMenu />
      <div className="w-full py-3">
        <form className="flex sm:flex-row w-full">
          <input
            className="max-w-xs appearance-none border rounded w-full py-2 px-3 mx-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startStt}
            placeholder="Start Stt"
            onChange={onChangeStartStt}
          />

          <input
            className="max-w-xs appearance-none border rounded w-full py-2 px-3 mx-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={endStt}
            placeholder="End stt"
            onChange={onChangeEndStt}
          />

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-3"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </form>
      </div>
      <div className="w-full">
        <div className="flex flex-row pb-3">
          <div className="flex justify-center items-center">Stt</div>
          <div className="flex flex-1 justify-center items-center">Value</div>
          <div className="flex flex-1 justify-center items-center">Number diff</div>
          <div className="flex justify-center items-center">Total AVG Diff</div>
        </div>
        {renderSearchResults()}
      </div>
    </>
  )
}

export default Export;
