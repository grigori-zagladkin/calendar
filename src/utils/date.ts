export const isValidDate = (date: unknown): boolean =>
  //@ts-ignore
  date instanceof Date && !isNaN(date);

export const getDaysInCurrentMonth = (date: Date) => {
  const days: Date[] = [];
  for (let i = 1; i < 32; i++) {
    const _date = new Date(date.getFullYear(), date.getMonth(), i);
    if (date.getMonth() !== date.getMonth()) {
      break;
    }
    days.push(_date);
  }
  return days;
};

export const getCalendarView = (month: Date[]): Date[] => {
  let normalizeView: Date[] = [];
  const firstDay = month[0];
  if (firstDay.getDay() === 1) {
    normalizeView.concat(month);
  } else {
    for (let i = 0; i > -6; i--) {
      let _date = new Date(firstDay.getFullYear(), firstDay.getMonth(), i);
      if (_date.getDay() === 1) {
        normalizeView.push(_date);
        break;
      }
      normalizeView.push(_date);
    }
    normalizeView.reverse();
    normalizeView = [...normalizeView.concat(month)];
  }
  const lastDay = month[month.length - 1];
  if (lastDay.getDay() === 0) {
    return normalizeView;
  } else {
    for (let i = 2; i < 7; i++) {
      let _date = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, i);
      if (_date.getDay() === 0) {
        normalizeView.push(_date);
        break;
      }
      normalizeView.push(_date);
    }
  }
  return normalizeView;
};

const setCorrectTimeFormat = (num: number): String =>
  num < 10 ? `0${num}` : `${num}`;

export const getNormalizeHoursMinutes = (date: Date): String =>
  `${setCorrectTimeFormat(date.getHours())} : ${setCorrectTimeFormat(
    date.getMinutes()
  )}`;
