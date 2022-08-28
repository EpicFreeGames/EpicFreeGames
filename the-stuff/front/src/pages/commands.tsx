import { InferGetStaticPropsType } from "next";
import { ReactNode } from "react";

import { Layout } from "~components/Layout";
import { Markdown } from "~components/Markdown";
import { Code } from "~components/Text";
import { t } from "~i18n/translate";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const CommandsPage = ({ translations }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout title="Commands">
    <div className="flex flex-col gap-2">
      <h1 className="pb-4 text-2xl font-bold">{t({ translations, key: "commands" })}</h1>

      <div className="flex flex-col gap-6">
        <table className="mt-2">
          <thead>
            <tr>
              <TH>{t({ translations, key: "command" })}</TH>
              <TH>{t({ translations, key: "description" })}</TH>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Command>
                <Code toCopy="/free">/free</Code>
              </Command>
              <TD>{t({ translations, key: "cmd_desc_free" })}</TD>
            </tr>
            <tr>
              <Command>
                <Code toCopy="/up">/up</Code>
              </Command>
              <TD>{t({ translations, key: "cmd_desc_up" })}</TD>
            </tr>
            <tr>
              <Command>
                <Code toCopy="/help">/help</Code>
              </Command>
              <TD>{t({ translations, key: "cmd_desc_help" })}</TD>
            </tr>
            <tr>
              <Command>
                <Code toCopy="/invite">/invite</Code>
              </Command>
              <TD>{t({ translations, key: "cmd_desc_invite" })}</TD>
            </tr>
            <tr>
              <Command>
                <Code toCopy="/vote">/vote</Code>
              </Command>
              <TD>{t({ translations, key: "cmd_desc_vote" })}</TD>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col gap-3">
          <div className="text-sm text-gray-400 sm:text-base">
            <Markdown>{t({ translations, key: "commands_modify_desc" })}</Markdown>
          </div>

          <table>
            <thead>
              <tr>
                <TH>{t({ translations, key: "command" })}</TH>
                <TH>{t({ translations, key: "description" })}</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Command>
                  <Code toCopy="/set channel">/set channel</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_set_channel" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/set thread">/set thread</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_set_thread" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/set role">/set role</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_set_role" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/set language">/set language</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_set_language" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/set currency">/set currency</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_set_currency" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/remove channel">/remove channel</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_remove_channel" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/remove role">/remove role</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_remove_role" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/settings">/settings</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_settings" })}</TD>
              </tr>
              <tr>
                <Command>
                  <Code toCopy="/test">/test</Code>
                </Command>
                <TD>{t({ translations, key: "cmd_desc_test" })}</TD>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
);

const Command = ({ children }: { children: ReactNode }) => (
  <td className="py-2 pr-6 text-left">{children}</td>
);
const TD = ({ children }: { children: ReactNode }) => (
  <td className="py-2 text-left text-sm sm:text-base">{children}</td>
);
const TH = ({ children }: { children: ReactNode }) => <th className="text-left">{children}</th>;

export default CommandsPage;
