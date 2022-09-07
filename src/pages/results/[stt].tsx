import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';
import { IResult, IResultData, selectLatestStt, selectNextStt, selectResultByStt, selectResultsData } from 'src/redux/reducers/resultsSlice';

import { getNumberById } from 'src/services/number';

import TopMenu from 'src/components/topMenu';
import ResultInfo from 'src/components/resultInfo';
import ResultNumberInfo from 'src/components/resultInfo/resultNumberInfo';
import { INumber, INumbersState, selectNumber, INumberObject, selectAllNumber } from 'src/redux/reducers/numbersSlice';


const NumberPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const stt : number = +(router.query.stt as string);

  const allRsults : IResultData = useAppSelector(selectResultsData);
  const resultsData : IResult = useAppSelector((state) => selectResultByStt(state, stt));
  const latestStt : number = useAppSelector(selectLatestStt);
  const nextStt : number = useAppSelector(selectNextStt);
  const allNumbers : INumberObject = useAppSelector(selectAllNumber);
  let [ valueNumbers, setValueNumbers ] = useState<INumber[]>([]);

  useEffect(() => {
    if (resultsData) {
      const { value } = resultsData;
      const numbers = value.map(v => allNumbers[+v]);
      setValueNumbers(numbers);
    }
  }, [resultsData, allNumbers]);

  // Recaculate data for number until the date of results
  valueNumbers = valueNumbers.map((n: INumber) => {
    const {
      key,
      tue,
      thu,
      sat,
      totalCount,
      appearStt = [],
      averageDiff = 0,
      sttAppearsDiff = [],
    } = n;

    console.log('appear stt: ', appearStt);
    const indexOfResultStt = appearStt.indexOf(stt);
    const latestAppear = appearStt[indexOfResultStt - 1];
    console.log('latestAppear: ', latestAppear);

    const totalCountByKey: number = Object.values(allRsults).filter(result => {
      if (result.stt > stt) {
        return false;
      }
      const { value } = result;
      return value.indexOf(key) >= 0;
    }).length;

    return {
      key,
      totalCount: totalCountByKey,
      averageDiff,
      latestAppearStt: latestAppear
    };
  })

  if (!resultsData) {
    return <TopMenu />
  }

  const renderNumberInfo = () => {
    return valueNumbers.map(v => (
      <ResultNumberInfo key={`${v.key}`} data={v} latestStt={stt-1} nextStt={stt} resultStt={stt} />
    ))
  }

  return (
    <>
      <TopMenu />
      <ResultInfo
        data={resultsData}
        averageTotalAppear={0}
        averageTotalDiff={0}
      />
      {renderNumberInfo()}
    </>
  )
}

export default NumberPage
