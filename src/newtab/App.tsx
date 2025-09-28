import { Clock } from "./Clock";
import { Sessions } from "./Sessions";
import { Version } from "./Version";

// TODO: P1 Add import alias
export const App = () => {
  return (
    <div className="h-dvh flex bg-slate-900">
      <div className="flex-1 relative">
        <Clock />
        <Version />
      </div>
      <Sessions />
    </div>
  );
};
