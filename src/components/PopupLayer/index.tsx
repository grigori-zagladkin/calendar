import { FC, PropsWithChildren, ReactElement } from "react";
import { create } from "zustand";
import styles from "./Popuplayer.module.scss";
import clsx from "clsx";

interface IPopupProps {
  template: ReactElement | null;
  heading?: string | ReactElement;
}

interface IPopupStore extends IPopupProps {
  isOpenPopup: boolean;
  openPopup: (
    template: IPopupProps["template"],
    heading: IPopupProps["heading"]
  ) => void;
  closePopup: () => void;
}

export const usePopupStore = create<IPopupStore>((set) => ({
  isOpenPopup: false,
  openPopup: (template, heading) =>
    set(() => ({
      isOpenPopup: true,
      template,
      heading,
    })),
  templateOptions: null,
  template: null,
  closePopup: () =>
    set(() => ({
      isOpenPopup: false,
      template: null,
    })),
  heading: undefined,
}));

const PopupLayer: FC<PropsWithChildren> = ({ children }) => {
  const { isOpenPopup, template, closePopup, heading } = usePopupStore();
  return (
    <div className="overflow-hidden">
      {children}{" "}
      <div
        className={clsx({
          [styles.popupWrapper]: !isOpenPopup,
          [`${styles.popupWrapperActive} ${styles.popupWrapper}`]: isOpenPopup,
        })}
      >
        <div
          className={styles.popupInner}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex items-center mb-4 w-full justify-between">
            {heading && (
              <div className="font-semibold text-lg w-fit justify-start">
                {heading}
              </div>
            )}
            <div className={styles.closeButton} onClick={() => closePopup()} />
          </div>
          <>{template}</>
        </div>
      </div>
    </div>
  );
};

export default PopupLayer;
