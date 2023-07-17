export const getTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1;
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  return `${year}-${month}-${day}`;
};

export const dateFormatter = (date: Date) => {
  const dateFormatted = new Date(date).toISOString().split('T')[0];
  return dateFormatted;
}