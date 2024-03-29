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
    className="w-4 h-4"
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
    className="w-4 h-4"
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
    className="w-6 h-6"
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
  let changeIcon: React.ReactElement | null = null;
  let isLoading = true;

  if (props.currentValue !== undefined) {
    isLoading = false;
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
    <div className="p-4 border rounded">
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
      <div className="flex justify-between h-4 mt-1 text-xs">
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
  format: (value: number | undefined) => (value ? value.toString() : ""),
};

export default DashboardStatisticCard;
