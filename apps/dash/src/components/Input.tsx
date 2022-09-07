import { ComponentProps, ReactNode, forwardRef } from "react";

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
          className="focus rounded-md border-[1px] border-transparent bg-gray-600 p-2 duration-200"
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
          className="focus rounded-md border-[1px] border-transparent bg-gray-600 p-2 duration-200"
          {...rest}
          ref={ref}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };