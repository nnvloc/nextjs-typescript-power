import { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { INumber } from 'src/redux/reducers/numbersSlice';

interface Props {
  data: INumber,
  latestStt: number,
  nextStt: number
}

const NumberInfo : NextPage<Props> = (props) => {
  const { data, latestStt, nextStt } = props;

  const { sttAppearsDiff } = data ?? {};
  const arrDiff = (sttAppearsDiff ?? []).filter(item => item > 0);
  const longestDiff : number = useMemo(() => Math.max(...arrDiff), [arrDiff]);
  const shortestDiff : number = useMemo(() => Math.min(...arrDiff), [arrDiff]);

  let { appearStt } = data;
  let latestAppear = data.latestAppearStt;
  let totalCount : number = 0;
  appearStt = appearStt?.filter(item => item < nextStt);
  if (appearStt && appearStt.length > 0) {
    totalCount = appearStt.length;
    latestAppear = appearStt[totalCount - 1];
  }

  if (!data) {
    return null;
  }

  return (
    <div className="number-information-wrapper flex flex-col sm:flex-row">
      <div className="information flex flex-col">
        <div><strong>Number: {data.key}</strong></div>
        <div>Total count: {totalCount}</div>
        <div>Tue: {data.tue}</div>
        <div>Thu: {data.thu}</div>
        <div>Sat: {data.sat}</div>
        <div>Latest Appear Stt: {latestAppear}</div>
      </div>
      <div className="appear flex flex-col">
        <div>Average diff: {data.averageDiff}</div>
        <div>Longest diff: {longestDiff}</div>
        <div>Shortes diff: {shortestDiff}</div>
        <div>Diff to next appear: {nextStt - latestAppear}</div>
      </div>
    </div>
  )
}

export default NumberInfo;
