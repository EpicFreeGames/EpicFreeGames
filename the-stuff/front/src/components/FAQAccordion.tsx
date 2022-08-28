import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { ChevronDown } from "tabler-icons-react";

import { t } from "~i18n/translate";
import { Translations } from "~i18n/types";

import { Markdown } from "./Markdown";
import { Text } from "./Text";

type AccordionItemProps = {
  title: ReactNode;
  children: ReactNode;
  value: string;
  currentValue: string;
  change: (open: boolean, value: string) => void;
};

const AccordionItem = ({ title, children, value, currentValue, change }: AccordionItemProps) => {
  const isOpen = currentValue === value;

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={(open) => change(open, value)}
      onClick={() => change(!isOpen, value)}
      className={`cursor-default rounded-md border-[1px] bg-gray-800 p-3 transition-all duration-200 ${
        isOpen ? "border-gray-500" : "border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Collapsible.Trigger className="cursor-default text-left">{title}</Collapsible.Trigger>

        <div className="rounded-md bg-gray-900/50 p-1">
          <motion.div
            key="chevron"
            initial={{ transform: "rotate(0deg)" }}
            animate={isOpen ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      <Collapsible.Content forceMount>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ opacity: { duration: 0.2 } }}
            >
              <div className="pt-2">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const FAQAccordion = ({ translations }: { translations: Translations }) => {
  const [value, setValue] = useState("");

  const change = (open: boolean, value: string) => (open ? setValue(value) : setValue(""));

  return (
    <div className="flex flex-col gap-2">
      <AccordionItem
        title={
          <h2 className="text-sm font-bold sm:text-base">
            <Markdown>{`${t({ translations, key: "faq_1_q" })}`}</Markdown>
          </h2>
        }
        value="1"
        currentValue={value}
        change={change}
      >
        <Markdown>
          {`${t({ translations, key: "faq_1_a", vars: { serverInvite: "/invite" } })}`}
        </Markdown>
      </AccordionItem>

      <AccordionItem
        title={
          <h2 className="text-sm font-bold sm:text-base">
            <Markdown>{`${t({ translations, key: "faq_2_q" })}`}</Markdown>
          </h2>
        }
        value="2"
        currentValue={value}
        change={change}
      >
        <Text>
          <Markdown>
            {`${t({ translations, key: "faq_2_a", vars: { serverInvite: "/invite" } })}`}
          </Markdown>
        </Text>
      </AccordionItem>

      <AccordionItem
        title={
          <h2 className="text-sm font-bold sm:text-base">{`${t({
            translations,
            key: "faq_3_a",
          })}`}</h2>
        }
        value="3"
        currentValue={value}
        change={change}
      >
        <Text>
          <Markdown>{t({ translations, key: "faq_3_a" })}</Markdown>
        </Text>
      </AccordionItem>

      <AccordionItem
        title={
          <h2 className="text-sm font-bold sm:text-base">{`${t({
            translations,
            key: "faq_4_q",
          })}`}</h2>
        }
        value="4"
        currentValue={value}
        change={change}
      >
        <Text>
          <Markdown>
            {`${t({
              translations,
              key: "faq_4_q",
            })}`}
          </Markdown>
        </Text>
      </AccordionItem>
    </div>
  );
};
