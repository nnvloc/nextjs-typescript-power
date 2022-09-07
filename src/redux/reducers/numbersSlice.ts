import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../store'

export interface INumber {
  key: number,
  appearStt?: number[],
  averageDiff: number,
  sttAppearsDiff?: number[],
  tue?: number,
  thu?: number,
  sat?: number,
  totalCount: number,
  latestAppearStt: number,
}

export interface INumberObject {
  [key: number]: INumber,
}

export interface INumbersState {
  data: INumberObject
}

const initialState: INumbersState = {
  data: {}
}

export const numbersSlice = createSlice({
  name: 'numbers',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNumberByKey: (state, action: PayloadAction<INumber>) => {
      const number: INumber = action.payload
      state.data[number.key] = action.payload;
    },
    setNumbersData: (state, action: PayloadAction<INumberObject>) => {
      state.data = {...action.payload};
    }
  }
});

export const { setNumberByKey, setNumbersData } = numbersSlice.actions

export const selectAllNumber = (state: AppState) => state.numbers.data;
export const selectNumber = (state: AppState, key: number) => state.numbers.data[key]

export default numbersSlice.reducer
