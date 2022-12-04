import { Button, Card, Title, AreaChart, ColGrid, Text } from "@tremor/react";
import { useCallback, useState } from "react";

const ATTEMPTS = 10;

type Region = "regional" | "global";

export default function Page() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [shouldTestGlobal, setShouldTestGlobal] = useState(true);
  const [shouldTestRegional, setShouldTestRegional] = useState(true);
  const [data, setData] = useState({
    regional: [],
    global: [],
  });

  const runTest = useCallback(async (type: Region) => {
    try {
      const start = Date.now();
      const res = await fetch(`/api/${type}`);
      const data = await res.json();
      const end = Date.now();
      return {
        ...data,
        elapsed: end - start,
      };
    } catch (e) {
      // instead of retrying we just give up
      return null;
    }
  }, []);

  const onRunTest = useCallback(async () => {
    setIsTestRunning(true);
    setData({ regional: [], global: [] });

    for (let i = 0; i < ATTEMPTS; i++) {
      let regionalValue = null;
      let globalValue = null;

      if (shouldTestRegional) {
        regionalValue = await runTest("regional");
      }

      if (shouldTestGlobal) {
        globalValue = await runTest("global");
      }

      console.log(globalValue, regionalValue);

      setData((data) => {
        return {
          ...data,
          regional: [...data.regional, regionalValue],
          global: [...data.global, globalValue],
        };
      });
    }

    setIsTestRunning(false);
  }, [runTest, shouldTestGlobal, shouldTestRegional]);

  return (
    <main className="p-6 max-w-5xl flex flex-col gap-3">
      <h1 className="text-2xl font-bold">PlanetScale Edge latency</h1>
      <p>
        This demo tries to show the different latency characteristics of using
        the PlanetScale SDK{" "}
        <Code>
          <ExternalLink href="https://github.com/planetscale/database-js">
            @planetscale/database
          </ExternalLink>
        </Code>{" "}
        in combination with{" "}
        <Code>
          <ExternalLink href="https://github.com/koskimas/kysely">
            kysely
          </ExternalLink>
        </Code>{" "}
        with the{" "}
        <Code>
          <ExternalLink href="https://github.com/depot/kysely-planetscale">
            kysely-planetscale
          </ExternalLink>
        </Code>{" "}
        dialect.
      </p>

      <form className="flex flex-col gap-5 bg-gray-100 p-5 my-5">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Location</p>
          <p className="text-gray-500 text-sm">
            Vercel Edge Functions support multiple regions. By default
            they&apos;re global, but it&apos;s possible to express a region
            preference via the <Code className="text-xs">region</Code> setting.
          </p>
          <p className="text-sm flex gap-3 flex-wrap gap-y-1">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                disabled
                name="region"
                value="global"
                checked={shouldTestGlobal}
                onChange={(e) => setShouldTestGlobal(e.target.checked)}
              />{" "}
              Test global function
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                disabled
                name="region"
                value="regional"
                checked={shouldTestRegional}
                onChange={(e) => setShouldTestRegional(e.target.checked)}
              />{" "}
              Test regional (IAD) function
            </label>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Waterfall</p>
          <p className="text-gray-500 text-sm">
            Executing complex API routes globally can be slow when the database
            is single-region, due to having multiple roundtrips to a single
            server that&apos;s distant from the user.
          </p>
          <p className="text-sm flex gap-3 flex-wrap gap-y-1">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                disabled
                type="radio"
                name="queries"
                value="1"
                defaultChecked
              />{" "}
              Single query (no waterfall)
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input disabled type="radio" name="queries" value="2" /> 2 serial
              queries
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input disabled type="radio" name="queries" value="5" /> 5 serial
              queries
            </label>
          </p>
        </div>

        <div>
          <Button
            text="Run Test"
            handleClick={onRunTest}
            loading={isTestRunning}
          />
        </div>

        {data.regional.length || data.global.length ? (
          <ColGrid numCols={ 1 } numColsMd={ 2 } gapX="gap-x-5" gapY="gap-y-5">
            <Card>
              <Title truncate={ true }>Latency distribution (processing time)</Title>
              <Text height="h-16">
                This is how long it takes for the serverless function to run the
                queries and return the result.
              </Text>

              <AreaChart
                data={new Array(ATTEMPTS).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    Regional: data.regional[i]
                      ? data.regional[i].queryDuration
                      : null,
                    Global: data.global[i]
                      ? data.global[i].queryDuration
                      : null,
                  };
                })}
                dataKey="attempt"
                categories={["Global", "Regional"]}
                colors={["indigo", "cyan"]}
                valueFormatter={dataFormatter}
                marginTop="mt-6"
                yAxisWidth="w-12"
              />
            </Card>
            <Card>
              <Title truncate={ true }>Latency distribution (end-to-end)</Title>
              <Text height="h-16">
                This is the total latency between
              </Text>

              <AreaChart
                data={new Array(ATTEMPTS).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    Regional: data.regional[i]
                      ? data.regional[i].elapsed
                      : null,
                    Global: data.global[i] ? data.global[i].elapsed : null,
                  };
                })}
                dataKey="attempt"
                categories={["Global", "Regional"]}
                colors={["indigo", "cyan"]}
                valueFormatter={dataFormatter}
                marginTop="mt-6"
                yAxisWidth="w-12"
              />
            </Card>
          </ColGrid>
        ) : null}
      </form>
    </main>
  );
}

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}ms`;

function Code({ className = "", children }) {
  return (
    <code className={`bg-gray-200 text-sm p-1 rounded ${className}`}>
      {children}
    </code>
  );
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-blue-500 hover:text-blue-800"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
