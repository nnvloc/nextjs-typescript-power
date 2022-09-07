import { NextPage } from 'next'
import dayjs from 'src/helpers/dateHelper';

import Link from 'next/link';

import styles from './styles.module.scss';
import * as DateHelpers from 'src/helpers/dateHelper';
import { IResult } from 'src/redux/reducers/resultsSlice';
interface Props {
  data: IResult,
  averageTotalAppear: number,
  averageTotalDiff: number,
}

const ResultInfo: NextPage<Props> = (props) => {
  const { data, averageTotalAppear, averageTotalDiff } = props;
  const { date, value, extra, stt } = data;
  const resultDate = dayjs(date, 'DD-MM-YYYY');

  return (
    <div className={`${styles['result-info-container']}`}>
      <div className={`flex flex-col sm:flex-row result-item}`}>
        <div className="flex result-stt flex-1">
          Stt: {stt}
        </div>
        
        <div className="flex result-date">
          Date: {DateHelpers.format(resultDate.toDate(), 'DD/MM/YYYY')}
        </div>
      </div>
      <div className={`flex flex-col sm:flex-row result-item}`}>
        <div className="flex result-value flex-1">
          Value: 
          {
            value.map(v => (
              <span key={`${stt}-${v}`}>
                <span><Link href={`number/${v}`}>{v}</Link></span>
                <span>, </span>
              </span>
            ))
          }
        </div>

        <div className="flex result-extra">
          Extra: {extra}
        </div>
      </div>

      <div className={`flex flex-col sm:flex-row result-item}`}>
        <div className="flex result-extra flex-1">
          <strong>Average total Appear: {averageTotalAppear}</strong>
        </div>
        <div className="flex result-extra">
          <strong>Average total Diff: {averageTotalDiff}</strong>
        </div>
      </div>
    </div>
  )
}

export default ResultInfo;
