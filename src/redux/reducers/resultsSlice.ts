import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../store'

export interface IResult {
  value: number[],
  date: string,
  extra: number,
  stt: number,
}

export interface IResultData {
  [stt: number]: IResult
}

export interface IResultState {
  data: IResultData,
  latestStt: number,
  nextStt: number,
}

const initialState: IResultState = {
  data: {},
  latestStt: 0,
  nextStt: 0,
}

export const resultsSlice = createSlice({
  name: 'results',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setResults: (state, action: PayloadAction<IResultData>) => {
      state.data = action.payload;
    },
    setLatestStt: (state, action: PayloadAction<number>) => {
      state.latestStt = action.payload;
    },
    setNextStt: (state, action: PayloadAction<number>) => {
      state.nextStt = action.payload;
    }
  }
});

export const { setResults, setLatestStt, setNextStt } = resultsSlice.actions

export const selectResultsData = (state: AppState) : IResultData  => state.results.data;
export const selectLatestStt = (state: AppState) : number => state.results.latestStt;
export const selectNextStt = (state: AppState) : number => state.results.nextStt;
export const selectResultByStt = (state: AppState, stt: number): IResult => state.results.data[stt];

export default resultsSlice.reducer
