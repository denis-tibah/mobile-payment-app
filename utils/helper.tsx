export const arrayChecker = (arr: any): boolean => {
  return arr && Array.isArray(arr) && arr.length > 0 ? true : false;
};