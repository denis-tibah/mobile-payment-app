export const arrayChecker = (arr: any): boolean => {
  return arr && Array.isArray(arr) && arr.length > 0 ? true : false;
};

export function capitalizeFirstLetter(str: string): string {
  return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}