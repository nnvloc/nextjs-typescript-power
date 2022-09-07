import Head from 'next/head'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'

import '../styles/globals.css'

import store from '../redux/store'
import { selectLatestStt, setLatestStt, setNextStt, setResults } from 'src/redux/reducers/resultsSlice'
import { useEffect } from 'react'
import { getAllResults, getLatestStt } from 'src/services/results'
import { getAllNumbers } from 'src/services/number'
import { setNumbersData } from 'src/redux/reducers/numbersSlice'

export default function App({ Component, pageProps }: AppProps) {
  const dispatch = store.dispatch;
  const latestAppearStt = selectLatestStt(store.getState());

  useEffect(() => {
    async function fetchLatestStt() {
      const data = await getLatestStt();
      const results = await getAllResults();
      const numbers = await getAllNumbers();
      dispatch(setLatestStt(data ?? 0));
      dispatch(setNextStt((data ?? 0) + 1));
      dispatch(setResults(results));
      dispatch(setNumbersData(numbers));
    }

    if (!latestAppearStt) {
      fetchLatestStt();
    }
  }, [dispatch, latestAppearStt]);

  return (
    <Provider store={store}>
      <Head>
        <title>Loterry Winning</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto">
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}
