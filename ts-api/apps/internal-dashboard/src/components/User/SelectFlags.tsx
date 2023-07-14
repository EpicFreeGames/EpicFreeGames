import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

import { Flag, Flags } from "@efg/types";

type Option = { label: string; value: Flags };

type Props = {
  onChange: (newValues: Option[], newFlags: number) => void;
  defaultValue?: Option[];
};

export const SelectFlags = ({ onChange, defaultValue }: Props) => {
  const [value, setValue] = useState<Option[]>(defaultValue ?? []);

  const options = Object.keys(Flags)
    .filter((f) => !Number(f))
    .map((f) => ({
      label: f,
      value: Flags[f as Flag],
    }));

  return (
    <MultiSelect
      className="dark"
      options={options}
      value={value}
      onChange={(newValue: Option[]) => {
        setValue(newValue);
        onChange(
          newValue,
          newValue.map((v) => v.value).reduce((a, b) => a | b, 0)
        );
      }}
      labelledBy="Flags"
    />
  );
};
