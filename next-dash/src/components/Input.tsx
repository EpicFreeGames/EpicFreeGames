import { ComponentProps, forwardRef, ReactNode } from "react";
import { Label } from "./Label";

type Props = ComponentProps<"input"> & {
  label?: string;
  error?: string | ReactNode;
  required?: boolean;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, required, id, error, ...rest }, ref) => {
    if (!label)
      return (
        <input
          id={id}
          autoComplete="off"
          required={required}
          className="bg-gray-600 rounded-md p-2 duration-200 focus"
          {...rest}
          ref={ref}
        />
      );

    return (
      <div className="flex flex-col gap-1">
        <Label required={required} htmlFor={label}>
          {label}
        </Label>

        <input
          id={label}
          autoComplete="off"
          required={required}
          className="bg-gray-600 rounded-md p-2 duration-200 focus"
          {...rest}
          ref={ref}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
