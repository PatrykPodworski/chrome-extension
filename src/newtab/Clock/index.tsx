import { useCurrentTime } from "./useCurrentTime";

export const Clock = () => {
  const { time, date } = useCurrentTime();

  return (
    <div
      className={`h-full flex flex-col items-center justify-center text-center text-white`}
    >
      <div className="text-6xl tracking-wider mb-4">{time}</div>
      <div className="text-xl text-white/80 tracking-wide">{date}</div>
    </div>
  );
};
