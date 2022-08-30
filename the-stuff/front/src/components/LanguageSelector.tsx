import { Listbox, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Check } from "tabler-icons-react";

import { languages } from "~languages";

import { AnimatedChevron } from "./AnimatedChevron";

export const LanguageSelector = () => {
  const router = useRouter();
  const { locale, pathname, asPath } = router;

  const [selected, setSelected] = useState(locale || "en");

  const onChange = (newValue: string) => {
    if (!languages.has(newValue)) {
      console.warn(`Unknown language: ${newValue}`);
      return;
    }

    setSelected(newValue);
    router.push({ pathname }, asPath, { locale: newValue });
  };

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="focus relative flex w-[180px] cursor-default items-center rounded-lg border-[1px] border-gray-600 bg-gray-800 py-1 pl-3 text-left text-sm outline-none hover:border-gray-500 sm:text-base">
            <span>{languages.get(selected)?.nativeName}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <AnimatedChevron open={open} size={19} />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute mt-1 max-h-80 w-full overflow-auto rounded-lg border-[1px] border-gray-600 bg-gray-800 p-[0.4rem] text-sm outline-none sm:text-base"
            >
              {[...languages].map(([code, language]) => (
                <Listbox.Option
                  key={code}
                  value={code}
                  className={({ active }) =>
                    `relative cursor-default select-none rounded-md py-2 pl-8 pr-4 ${
                      active ? "bg-gray-700" : "bg-gray-800"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {language.nativeName}
                      </span>

                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-[0.55rem]">
                          <Check size={13} aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
