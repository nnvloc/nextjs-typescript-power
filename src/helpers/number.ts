export const calculateAvgSttDiff = (diffArr: number[]) : number => {
  const length = diffArr.length;
  if (!length || length < 0) {
    return 0;
  }
  const total = diffArr.reduce((t, n) => {
    return t+n;
  }, 0);
  return total / length;
}
