import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface TextAreaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  type: "textarea";
}

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  type: "select";
}

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  type: "text" | "number" | "checkbox";
}

type Props = (TextAreaProps | SelectProps | InputProps) & {
  label: string;
  error?: FieldError;
};

const Input = forwardRef(
  ({ label, prefix, type, error, children, ...props }: Props, ref) => {
    const Element = type === "textarea" || type === "select" ? type : "input";

    let elementProps: any = {
      ...props,
      className: "block mt-1 rounded disabled:opacity-50",
    };

    if (Element === "input") {
      elementProps.type = type;
    }

    if (type !== "checkbox") {
      elementProps.className += " w-full";
    }

    if (error) {
      elementProps.className += " border-red-600 ring-red-500";
    }

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
          <Element {...elementProps} ref={ref}>
            {type === "select" ? children : null}
          </Element>
        </div>
        {error?.message && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </label>
    );
  }
);

export default Input;
