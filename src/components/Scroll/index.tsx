import {
  ComponentPropsWithoutRef,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Scroll.module.scss";
import clsx from "clsx";

const Scroll: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollStartPosition, setScrollStartPosition] = useState<number>(0);
  const [initialScrollTop, setInitialScrollTop] = useState(0);

  const handleResize = (ref: HTMLDivElement, trackSize: number) => {
    const { clientHeight, scrollHeight } = ref;
    setThumbHeight(Math.max((clientHeight / scrollHeight) * trackSize, 20));
  };

  useEffect(() => {
    if (contentRef.current && scrollTrackRef.current) {
      const ref = contentRef.current;
      const { clientHeight: trackSize } = scrollTrackRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize(ref, trackSize);
      });
      observer.current.observe(ref);
      ref.addEventListener("scroll", handleThumbPosition);
      return () => {
        observer.current?.unobserve(ref);
        ref.removeEventListener("scroll", handleThumbPosition);
      };
    }
  }, []);

  const handleThumbPosition = useCallback(() => {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return;
    }
    const { scrollTop: contentTop, scrollHeight: contentHeight } =
      contentRef.current;
    const { clientHeight: trackHeight } = scrollTrackRef.current;
    let newTop = (+contentTop / +contentHeight) * trackHeight;
    newTop = Math.min(newTop, trackHeight - thumbHeight);
    const thumb = scrollThumbRef.current;
    thumb.style.top = `${newTop}px`;
  }, []);

  const handleButtonScroll = (direction: "up" | "down") => {
    const { current } = contentRef;
    if (current) {
      const scrollAmount = direction === "down" ? 200 : -200;
      current.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  };

  const handleTrackClick = useCallback(
    //@ts-ignore
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { current: trackCurrent } = scrollTrackRef;
      const { current: contentCurrent } = contentRef;
      if (trackCurrent && contentCurrent) {
        const { clientY } = e;
        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const trackTop = rect.top;
        const thumbOffset = -(thumbHeight / 2);
        const clickRatio =
          (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight;
        const scrollAmount = Math.floor(
          clickRatio * contentCurrent.scrollHeight
        );
        contentCurrent.scrollTo({
          top: scrollAmount,
          behavior: "smooth",
        });
      }
    },
    [thumbHeight]
  );

  // @ts-ignore
  const handleThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollStartPosition(e.clientY);
    if (contentRef.current) {
      setInitialScrollTop(contentRef.current.scrollTop);
    }
    setIsDragging(true);
  }, []);

  const handleThumbMouseUp = useCallback(
    //@ts-ignore
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        setIsDragging(false);
      }
    },
    [isDragging]
  );

  const handleThumbMousemove = useCallback(
    //@ts-ignore
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDragging) {
        const {
          scrollHeight: contentScrollHeight,
          offsetHeight: contentOffsetHeight,
        } = contentRef.current as any;
        const deltaY =
          (e.clientY - scrollStartPosition) *
          (contentOffsetHeight / thumbHeight);
        const newScrollTop = Math.min(
          initialScrollTop + deltaY,
          contentScrollHeight - contentOffsetHeight
        );
        contentRef.current!.scrollTop = newScrollTop || 0;
      }
    },
    [isDragging, scrollStartPosition, thumbHeight]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMousemove);
    document.addEventListener("mouseup", handleThumbMouseUp);
    document.addEventListener("mouseleave", handleThumbMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove);
      document.removeEventListener("mouseup", handleThumbMouseUp);
      document.removeEventListener("mouseleave", handleThumbMouseUp);
    };
  }, [handleThumbMousemove, handleThumbMouseUp]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.scrollContent} {...props} ref={contentRef}>
        {children}
      </div>
      <div className={styles.scrollbar}>
        <button
          onClick={() => {
            handleButtonScroll("up");
          }}
        >
          ⇑
        </button>
        <div className={styles.scrollbarTrackThumb}>
          <div
            className={clsx(styles.scrollbarTrack, {
              ["cursor-pointer"]: !isDragging,
              ["cursor-grabbing"]: isDragging,
            })}
            onClick={handleTrackClick}
            ref={scrollTrackRef}
          />
          <div
            className={clsx(styles.scrollbarThumb, {
              ["cursor-pointer"]: !isDragging,
              ["cursor-grabbing"]: isDragging,
            })}
            onMouseDown={handleThumbMouseDown}
            ref={scrollThumbRef}
            style={{ height: `${thumbHeight}px` }}
          />
        </div>
        <button
          onClick={() => {
            handleButtonScroll("down");
          }}
        >
          ⇓
        </button>
      </div>
    </div>
  );
};

export default Scroll;
