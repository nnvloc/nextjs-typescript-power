import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';

import { getNumberById } from 'src/services/number';

import { setNumberByKey, selectNumber } from 'src/redux/reducers/numbersSlice';

import TopMenu from 'src/components/topMenu';
import { INumber } from 'src/redux/reducers/numbersSlice';
import { selectLatestStt, selectNextStt } from 'src/redux/reducers/resultsSlice';

import NumberInfo from 'src/components/numberInfo';

const NumberPage: NextPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const id : number = +(router.query.id as string);

  const numberData : INumber = useAppSelector((state) => selectNumber(state, id));
  const latestStt : number = useAppSelector(selectLatestStt);
  const nextStt : number = useAppSelector(selectNextStt);

  if (!numberData) {
    return <TopMenu />
  }

  return (
    <>
      <TopMenu />
      <div className="number-container flex flex-col sm:flex-row">
        <NumberInfo data={numberData} latestStt={latestStt} nextStt={nextStt} />
      </div>
      <div className="chart-wrapper">

      </div>
    </>
  )
}

export default NumberPage
