import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import TopMenu from 'src/components/topMenu';

import styles from 'src/styles/NumberList.module.scss';

import { useAppSelector, useAppDispatch } from 'src/redux/hooks';
import { INumbersState, selectAllNumber, setNumbersData, } from 'src/redux/reducers/numbersSlice';
import { selectLatestStt, selectNextStt } from 'src/redux/reducers/resultsSlice';
import { getAllNumbers } from 'src/services/number';
import NumberInfo from 'src/components/numberInfo';

import { EnumSortBy } from 'src/types';

enum VIEW_TYPE {
  BY_DIFF = 'by_diff',
  NORMAL = 'normal',
}

const Numbers : NextPage = () => {

  const dispatch = useAppDispatch();
  const numbers  = useAppSelector(selectAllNumber);
  const latestStt : number = useAppSelector(selectLatestStt);
  const nextStt : number = useAppSelector(selectNextStt);
  const [ data, setData ] = useState(Object.values(numbers));
  const [ viewType, setViewType ] = useState<VIEW_TYPE>(VIEW_TYPE.NORMAL);
  const [ sortBy, setSortBy ] = useState<EnumSortBy>(EnumSortBy.NUMBER);
  const [ stt, setStt ] = useState<number>(0);

  useEffect(() => {
    async function fecthNumbers () {
      const data = await getAllNumbers();
      dispatch(setNumbersData(data));
    }

    if (!numbers || Object.keys(numbers).length < 55) {
      fecthNumbers();
    }

    if (numbers && Object.keys(numbers).length > 0) {
      setData(Object.values(numbers));
    }

    if (nextStt) {
      setStt(nextStt);
    }

  }, [dispatch, numbers, nextStt]);

  const onChangeViewType = (type: VIEW_TYPE) => {
    setViewType(type);
  }

  const renderNumbers = () => {
    return data.map(item => (
      <div key={`number-${item.key}`} className={styles['number-item-container']}>
        <NumberInfo data={item} nextStt={stt} latestStt={latestStt} />
      </div>
    ))
  }

  const renderNumbersByDiff = () => {
    const tempData = data.reduce((results, item) => {
      const { latestAppearStt, key } = item;
      const nextAppearDiff = nextStt - latestAppearStt;

      let resultByNextAppear = results[nextAppearDiff];
      if (!resultByNextAppear || resultByNextAppear.length === 0) {
        resultByNextAppear = [];
      }

      resultByNextAppear.push(key);
      results[nextAppearDiff] = resultByNextAppear

      return results;
    }, {});

    return Object.entries(tempData).map(item => {
      const diff = item[0];
      const val : number[] = item[1] as number[];
      return (
        <div key={diff} className={`${styles['number-item-container']} flex flex-row`}>
          <div className="mr-3">{diff}:</div>
          <div><strong>{val.join(', ')}</strong></div>
        </div>
      )
    });
  }

  const onChangeStt = (e: any) => {
    setStt(+(e.target.value));
  }

  const onChangeSortBy = (e: any) => {
    const v = e.target.value;
    setSortBy(v);
    if (v === EnumSortBy.DIFF) {
      const results = data.sort((a,b) => {
        const aDiffToNextAppear = (stt ?? nextStt) - a.latestAppearStt;
        const bDiffToNextAppear = (stt ?? nextStt) - b.latestAppearStt;
        return aDiffToNextAppear - bDiffToNextAppear;
      });
      setData(results);
    }

    if (v === EnumSortBy.NUMBER) {
      const results = data.sort((a,b) => a.key - b.key);
      setData(results);
    }
  }

  return (
    <>
      <TopMenu />
      <div className="w-full py-3">
        <form className="flex sm:flex-row w-full">
          <div className="mr-3 flex flex-row">
            <div className="mr-3 flex items-center">Stt: </div>
            <input
              className="max-w-xs appearance-none border rounded w-full py-2 px-3 mx-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={stt}
              placeholder="Sai so"
              onChange={onChangeStt}
            />
          </div>
          <div className="flex sm:flex-row sm:flex-1">
            <div className="mr-3 flex justify-center items-center">Sortby:</div>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline max-w-xs"
              value={sortBy}
              onChange={onChangeSortBy}
            >
              <option value={EnumSortBy.NUMBER}>Number</option>
              <option value={EnumSortBy.DIFF}>Diff</option>
            </select>
          </div>
          <div className="flex flex-row">
            <button type="button" className="button mr-3" onClick={() => onChangeViewType(VIEW_TYPE.NORMAL)}>Normal</button>
            <button type="button" onClick={() => onChangeViewType(VIEW_TYPE.BY_DIFF)}>Diff</button>
          </div>
        </form>
      </div>
      { viewType === VIEW_TYPE.NORMAL && (
        <div className="number-list-container">
          {renderNumbers()}
        </div>
      )}
      { viewType === VIEW_TYPE.BY_DIFF && (
        <div className="number-list-container">
          {renderNumbersByDiff()}
        </div>
      )}
    </>
  )
}

export default Numbers;

