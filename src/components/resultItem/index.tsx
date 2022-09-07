import { NextPage } from 'next'
import dayjs from 'src/helpers/dateHelper';

import Link from 'next/link';

import styles from './style.module.scss';
import * as DateHelpers from 'src/helpers/dateHelper';
interface Props {
  stt: number,
  date: string,
  value: number[],
  extra: number,
}

const ResultItem: NextPage<Props> = (props) => {
  const { date, value, extra, stt } = props;
  const resultDate = dayjs(date, 'DD-MM-YYYY');

  if (value.filter(v => !v).length > 0) {
    console.log('props: ', props);
  }

  return (
    <div className={`flex flex-col sm:justify-center sm:flex-row result-item ${styles['item-container']}`}>
      <div className="flex md:justify-center result-stt">
        <Link href={`/results/${stt}`}>
          {stt}
        </Link>
      </div>
      
      <div className="flex md:justify-center result-date">
        {DateHelpers.format(resultDate.toDate(), 'DD/MM/YYYY')}
      </div>

      <div className="flex flex-1 md:justify-center result-value">
        {/* {value.join(', ')} */}
        {
          value.map(v => (
            <span key={`${stt}-${v}`}>
              <span><Link href={`number/${v}`}>{v}</Link></span>
              <span>, </span>
            </span>
          ))
        }
      </div>

      <div className="flex md:justify-center result-extra">
        {extra}
      </div>
    </div>
  )
}

export default ResultItem;
