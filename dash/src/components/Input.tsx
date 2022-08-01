/** @jsx h */
import { ComponentProps, h } from "preact";
import { tw } from "twind";

type Props = Omit<ComponentProps<"input">, "class" | "id" | "name"> & {
  label?: string;
  name: string;
  required?: boolean;
};

export const Input = ({ label, className, name, required, ...rest }: Props) => {
  if (!label)
    return (
      <input
        name={name}
        autocomplete="off"
        required={required}
        className={tw`bg-gray-600 rounded-md p-2 focusStyles duration-200`}
        {...rest}
      />
    );

  return (
    <div className={tw`flex flex-col gap-2`}>
      <label className={tw`text-sm`} htmlFor={name}>
        {label}
        {!!required && <b className={tw`text-red-500`}> *</b>}
      </label>

      <input
        id={name}
        name={name}
        autocomplete="off"
        required={required}
        className={tw`bg-gray-600 rounded-md p-2 focusStyles duration-200`}
        {...rest}
      />
    </div>
  );
};
