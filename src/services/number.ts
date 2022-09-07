import Http from 'src/http';
import { INumber, INumbersState } from 'src/redux/reducers/numbersSlice';

interface IAllNumberResponose { [key: number]: INumber }

export const getNumberById = async (id: number) : Promise<any> => {
  try {
    const response = await Http.get(`/numbers/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getAllNumbers = async () : Promise<IAllNumberResponose> => {
  try {
    const response = await Http.get(`/numbers`);
    const data = response.data;
    return data.reduce((results : IAllNumberResponose, n: INumber) => {
      results[n.key] = n;
      return results;
    }, {})
  } catch (err) {
    console.error(err);
    return {};
  }
}
