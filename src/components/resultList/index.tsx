import { NextPage } from 'next'
import ResultItem from '../resultItem';

import styles from './style.module.scss'

interface Props {
  data: {
    stt: number,
    date: string,
    value: number[],
    extra: number,
  }[],
}

const ResultList: NextPage<Props> = (props) => {
  const { data } = props;

  const renderData = () => {
    if (!data || data.length === 0) {
      return <></>;
    }

    return data.map(({date, value, extra, stt}) => <ResultItem key={`stt-${stt}`} stt={stt} date={date} value={value} extra={extra} /> )
  }  
  return (
    <div className={`flex-col ${styles['result-list']}`}>
      {renderData()}
    </div>
  )
}

export default ResultList;
