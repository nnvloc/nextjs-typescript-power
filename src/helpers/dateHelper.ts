import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat)
export const format = (date: Date, format: string) : string => {
  return dayjs(date).format(format);
}

export default dayjs;
