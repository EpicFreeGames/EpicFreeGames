import { Switch as HeadlessSwitch } from "@headlessui/react";

import { Label } from "./Label";

type SwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

export const Switch = ({ checked, onChange, label }: SwitchProps) => (
  <>
    <div className="my-2 flex items-center gap-3">
      <Label htmlFor={label}>{label}</Label>

      <HeadlessSwitch
        id={label}
        checked={checked}
        onChange={onChange}
        className={`${checked ? "bg-green-900" : "bg-red-700"}
relative inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`${checked ? "translate-x-[1.3rem]" : "translate-x-0"}
pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </HeadlessSwitch>
    </div>
  </>
);
