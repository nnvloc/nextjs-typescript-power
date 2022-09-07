import type { NextPage } from 'next'
import Image from 'next/image';

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';

import TopMenu from '../components/topMenu';
import styles from '../styles/Home.module.css'

import ResultList from '../components/resultList';
import { useEffect, useState } from 'react';

import { getAllResults } from 'src/services/results';
import { selectResultsData, setResults, IResult, IResultData, setLatestStt, setNextStt } from 'src/redux/reducers/resultsSlice';

const IndexPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const results : IResultData = useAppSelector(selectResultsData);
  const [data, setData] = useState(Object.values(results));

  useEffect(() => {
    if (results && Object.keys(results).length > 0) {
      setData(Object.values(results));
    }
  }, [results]);

  return (
    <>
      <TopMenu />
      <ResultList data={data.sort((a,b) => b.stt - a.stt )} />
    </>
  )
}

export default IndexPage
