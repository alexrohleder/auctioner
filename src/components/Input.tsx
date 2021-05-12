import { ReactNode } from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  as?: "input" | "textarea" | "select";
  prefix?: string;
  rows?: number;
  children?: ReactNode;
}

function Input({ label, prefix, as = "input", ...props }: Props) {
  const Element = as as string;

  return (
    <label className="block">
      <span className="text-gray-700">
        {label}
        {props.required && (
          <span className="ml-1 text-red-600" title="This field is required">
            *
          </span>
        )}
      </span>
      <div className="flex items-center gap-2">
        {prefix}
        <Element
          {...{
            ...props,
            className:
              "block w-full mt-1 rounded invalid:border-red-600 invalid:ring-red-500 disabled:opacity-50",
          }}
        />
      </div>
    </label>
  );
}

export default Input;
