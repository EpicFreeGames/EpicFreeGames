import { ComponentProps, forwardRef, ReactNode } from "react";

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
          className="bg-gray-600 rounded-md p-2 duration-200 outline-none focus:outline-none focus:ring-2 focus-within:ring-2 focus:ring-blue-500 focus-within:ring-blue-500"
          {...rest}
          ref={ref}
        />
      );

    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm" htmlFor={label}>
          {label}
          {!!required && <b className="text-red-500"> *</b>}
        </label>

        <input
          id={label}
          autoComplete="off"
          required={required}
          className="bg-gray-600 rounded-md p-2 duration-200 outline-none focus:outline-none focus:ring-2 focus-within:ring-2 focus:ring-blue-500 focus-within:ring-blue-500"
          {...rest}
          ref={ref}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
