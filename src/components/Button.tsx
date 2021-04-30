import { forwardRef } from "react";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  as: any;
  isLoading?: boolean;
  isPrimary?: boolean;
}

const Button = forwardRef((props: Props, ref) => {
  const {
    as: Component = "Button",
    className = "",
    isLoading = false,
    isPrimary = false,
    ...rest
  } = props;

  let cn =
    "inline-flex items-center px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 border text-base leading-6 font-medium rounded transition ease-in-out duration-150 cursor-pointer disabled:cursor-not-allowed ";

  cn += isPrimary
    ? "text-white bg-gray-800 hover:bg-gray-900 border-transparent focus:border-gray-800 active:bg-gray-900"
    : "text-black bg-white hover:bg-gray-50 border-gray-300 active:bg-gray-100";

  return (
    <Component className={`${cn} ${className}`} {...rest} ref={ref}>
      {isLoading && (
        <svg
          className="animate-spin w-5 h-5 mr-3 -ml-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {props.children}
    </Component>
  );
});

export default Button;
