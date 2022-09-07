import { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { INumber } from 'src/redux/reducers/numbersSlice';

interface Props {
  data: INumber,
  latestStt: number,
  nextStt: number,
  resultStt: number,
}

const ResultNumberInfo : NextPage<Props> = (props) => {
  const { data, latestStt, nextStt, resultStt,  } = props;

  const { sttAppearsDiff } = data ?? {};
  const arrDiff = (sttAppearsDiff ?? []).filter(item => item > 0);
  const longestDiff : number = useMemo(() => Math.max(...arrDiff), [arrDiff]);
  const shortestDiff : number = useMemo(() => Math.min(...arrDiff), [arrDiff]);

  if (!data) {
    return null;
  }

  return (
    <div className="number-information-wrapper flex flex-col sm:flex-row">
      <div className="information flex flex-col">
        <div><strong>Number: {data.key}</strong></div>
        <div>Total count: {data.totalCount}</div>
        <div>Tue: {data.tue}</div>
        <div>Thu: {data.thu}</div>
        <div>Sat: {data.sat}</div>
        <div>Latest Appear Stt: {data.latestAppearStt}</div>
      </div>
      <div className="appear flex flex-col">
        <div>Average diff: {data.averageDiff}</div>
        <div>Longest diff: {longestDiff}</div>
        <div>Shortes diff: {shortestDiff}</div>
        <div>Diff to next appear: {nextStt - data.latestAppearStt}</div>
      </div>
    </div>
  )
}

export default ResultNumberInfo;
