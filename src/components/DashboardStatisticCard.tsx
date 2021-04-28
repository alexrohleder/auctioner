type Props = {
  title: string;
  description?: string;
  info?: string;

  currentValue?: number;
  previousValue?: number;

  format: (value: number) => string;
};

const IncreaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M7 11l5-5m0 0l5 5m-5-5v12"
    />
  </svg>
);

const DecreaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M17 13l-5 5m0 0l-5-5m5 5V6"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function DashboardStatisticCard(props: Props) {
  let formattedCurrentValue = "";
  let formattedPreviousValue = "";
  let changeColor = "";
  let changeIcon = null;

  const isLoading = typeof props.currentValue === "undefined";

  if (!isLoading) {
    formattedCurrentValue = props.format(props.currentValue);

    if (typeof props.previousValue !== "undefined") {
      formattedPreviousValue = props.format(props.previousValue);

      if (props.currentValue < props.previousValue) {
        changeColor = "text-red-500";
        changeIcon = <DecreaseIcon />;
      } else if (props.currentValue > props.previousValue) {
        changeColor = "text-green-500";
        changeIcon = <IncreaseIcon />;
      }
    }
  }

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between">
        <div className="font-semibold">{props.title}</div>
        {props.description && (
          <div className="text-gray-400" title={props.description}>
            <InfoIcon />
          </div>
        )}
      </div>
      <div className="flex items-center h-6">
        {isLoading && <div className="placeholder w-24 h-4" />}
        {!isLoading && <div className="text-lg">{formattedCurrentValue}</div>}
      </div>
      <div className="text-xs mt-1 flex justify-between h-4">
        <div className={`flex ${changeColor}`}>
          {isLoading ? (
            <div className="placeholder w-16" />
          ) : (
            <>
              {changeIcon}
              From {formattedPreviousValue}
            </>
          )}
        </div>
        <div className="text-gray-500">
          {isLoading ? <div className="placeholder w-12" /> : props.info}
        </div>
      </div>
    </div>
  );
}

DashboardStatisticCard.defaultProps = {
  format: (value: number) => value.toString(),
};

export default DashboardStatisticCard;
