import { Clock } from "./Clock";
import { Sessions } from "./Sessions";

// TODO: P1 Add import alias
export const App = () => {
  return (
    <div className="h-dvh flex bg-slate-900">
      <Clock />
      <Sessions />
    </div>
  );
};
