import React from "react";
import { useCurrentTime } from "../hooks/useCurrentTime";

const NewTab: React.FC = () => {
  const { time, date } = useCurrentTime();

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-900">
      <div className="text-center text-white">
        <div className="text-6xl tracking-wider mb-4">{time}</div>
        <div className="text-xl text-white/80 tracking-wide">{date}</div>
      </div>
    </div>
  );
};

export default NewTab;
