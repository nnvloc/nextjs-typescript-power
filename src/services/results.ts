import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import Http from 'src/http';

import { IResult } from 'src/redux/reducers/resultsSlice'

export const getAllResults = async () : Promise<IResult[]> => {
  try {
    const response = await Http.get('/data');
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getLatestStt = async () : Promise<number | null> => {
  try {
    const response = await Http.get('/latest-stt');
    return response.data.stt;
  } catch(err) {
    console.log('err: ', err);
    return null;
  }
}
