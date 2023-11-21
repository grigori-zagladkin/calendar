// @ts-nocheck
import clsx from "clsx";
import { FC, useId, useState } from "react";
import styles from "./Calendar.module.scss";
import {
  getCalendarView,
  getDaysInCurrentMonth,
  getNormalizeHoursMinutes,
} from "../../utils/date";
import data from "./PopupCalendarData";
import { usePopupStore } from "../PopupLayer";
import Scroll from "../Scroll";

const ClassesTemplate: FC = () => {
  return (
    <Scroll>
      <div className="py-4">
        {data.map((item) => {
          const id = useId();
          return (
            <div key={id}>
              <div className="flex items-center justify-center gap-6">
                <div className="font-semibold">
                  {getNormalizeHoursMinutes(item.time)}
                </div>
                <div>{item.couch}</div>
              </div>
              <div>
                <span
                  className={clsx("font-semibold flex justify-center", {
                    ["text-red-500"]: item.isCrowded,
                    ["text-green-500"]: !item.isCrowded,
                  })}
                >
                  {item.isCrowded ? "Нет мест" : "Есть свободные места"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Scroll>
  );
};

const Calendar: FC = () => {
  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    months.push(new Date(0, i).toLocaleString("ru", { month: "long" }));
  }
  const dayWeeks = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
  const [isShowMonths, setIsShowMonths] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const NormalizeMonthView: FC = () => {
    const normalizeArray = getCalendarView(
      getDaysInCurrentMonth(currentDate)
    ).map((item) => {
      return {
        item,
        class:
          item.getMonth() === currentDate.getMonth()
            ? Math.round(Math.random())
            : -1,
      };
    });
    const { openPopup } = usePopupStore();
    return (
      <div className="flex items-center gap-0 flex-wrap">
        {normalizeArray.map((item) => {
          const id = useId();
          return (
            <div
              key={id}
              onClick={() => {
                openPopup(<ClassesTemplate />, "Расписание занятий");
              }}
              className={clsx(
                "w-[90px] h-[90px] m-0 p-0 justify-between flex-col flex text-lg cursor-pointer font-light border",
                {
                  ["bg-stone-200 hover:bg-stone-100"]:
                    item.item.getMonth() !== currentDate.getMonth(),
                  ["bg-slate-300 hover:bg-slate-200"]:
                    item.item.getMonth() === currentDate.getMonth(),
                }
              )}
            >
              <div className="self-end mr-3 mt-3">{item.item.getDate()}</div>
              {item.class !== -1 && (
                <div
                  className={clsx("w-full h-5 self-end", {
                    ["bg-red-500"]: item.class === 0,
                    ["bg-green-500"]: item.class === 1,
                  })}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <div className="flex flex-col items-start gap-4">
        <div className="w-[630px] outline-slate-400 relative">
          <div
            className={clsx(styles.arrow, styles.next)}
            onClick={() =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
              )
            }
          />
          <div
            className={clsx(styles.arrow, styles.prev)}
            onClick={() =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
              )
            }
          />
          <div className="flex items-center justify-between">
            {dayWeeks.map((item) => {
              const id = useId();
              return (
                <div
                  key={id}
                  className="w-[90px] bg-slate-100 text-md font-light h-10 flex items-center justify-center"
                >
                  {item}
                </div>
              );
            })}
          </div>
          <NormalizeMonthView />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
