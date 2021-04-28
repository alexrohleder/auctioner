type Props = {
  title: string;
  value?: string | number;
  change: -1 | 0 | 1;
  changeText?: string;
  annotation?: string;
  info?: string;
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

function DashboardCard(props: Props) {
  let changeContainerCN = "flex ";
  let changeIcon: JSX.Element | null = null;

  if (props.change === -1) {
    changeContainerCN += "text-red-600";
    changeIcon = <DecreaseIcon />;
  } else if (props.change === 1) {
    changeContainerCN += "text-green-600";
    changeIcon = <IncreaseIcon />;
  }

  const isLoading = typeof props.value === "undefined";

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between">
        <div className="font-semibold">{props.title}</div>
        {props.info && (
          <div className="text-gray-400" title={props.info}>
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
          </div>
        )}
      </div>
      <div className="flex items-center h-6">
        {isLoading ? (
          <div className="placeholder w-24 h-4" />
        ) : (
          <div className="text-lg">{props.value}</div>
        )}
      </div>
      <div className="text-xs mt-1 flex justify-between h-4">
        <div className={changeContainerCN}>
          {isLoading ? (
            <div className="placeholder w-16" />
          ) : (
            <>
              {changeIcon}
              {props.changeText}
            </>
          )}
        </div>
        <div className="text-gray-500">
          {isLoading ? <div className="placeholder w-12" /> : props.annotation}
        </div>
      </div>
    </div>
  );
}

DashboardCard.defaultProps = {
  change: 0,
};

export default DashboardCard;
