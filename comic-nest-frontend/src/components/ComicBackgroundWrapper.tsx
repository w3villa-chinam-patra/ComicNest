import type { ReactNode } from "react";

const ComicBackgroundWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative bg-[url('/images/background.jpg')] bg-cover bg-center h-screen text-white">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative h-full overflow-y-auto">{children}</div>
    </div>
  );
};
export default ComicBackgroundWrapper;
