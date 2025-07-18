const Steps = ({
  stepsItems,
  currentStep,
}: {
  stepsItems: string[];
  currentStep: number;
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0">
      <ul
        aria-label="Steps"
        className="items-center text-gray-300 font-medium md:flex"
      >
        {stepsItems.map((item, idx) => (
          <li
            key={idx}
            aria-current={currentStep == idx + 1 ? "step" : false}
            className="flex-1 last:flex-none flex md:items-center"
          >
            <div className="flex gap-x-3">
              <div className="flex items-center flex-col gap-x-2">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${
                    currentStep > idx + 1
                      ? "bg-amber-500 border-amber-500"
                      : currentStep == idx + 1
                      ? "border-amber-500"
                      : ""
                  }`}
                >
                  <span
                    className={` ${
                      currentStep > idx + 1
                        ? "hidden"
                        : currentStep == idx + 1
                        ? "text-amber-500"
                        : ""
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {currentStep > idx + 1 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`h-12 flex items-center md:hidden ${
                    idx + 1 == stepsItems.length ? "hidden" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="h-8 flex items-center md:h-auto">
                <h3
                  className={`text-sm ${
                    currentStep == idx + 1 ? "text-amber-500" : ""
                  }`}
                >
                  {item}
                </h3>
              </div>
            </div>
            <div
              className={`flex-1 hidden md:block ${
                idx + 1 == stepsItems.length ? "md:hidden" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mx-auto text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Steps;
