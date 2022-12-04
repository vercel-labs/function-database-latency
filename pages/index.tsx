import { Button, Card, Title, AreaChart, ColGrid, Text } from "@tremor/react";
import { useCallback, useState } from "react";

const ATTEMPTS = 10;

type Region = "regional" | "global";

export default function Page() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [shouldTestGlobal, setShouldTestGlobal] = useState(true);
  const [shouldTestRegional, setShouldTestRegional] = useState(true);
  const [queryCount, setQueryCount] = useState(1);
  const [data, setData] = useState({
    regional: [],
    global: [],
  });

  const runTest = useCallback(async (type: Region, queryCount: number) => {
    try {
      const start = Date.now();
      const res = await fetch(`/api/${type}?count=${queryCount}`);
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
        regionalValue = await runTest("regional", queryCount);
      }

      if (shouldTestGlobal) {
        globalValue = await runTest("global", queryCount);
      }

      setData((data) => {
        return {
          ...data,
          regional: [...data.regional, regionalValue],
          global: [...data.global, globalValue],
        };
      });
    }

    setIsTestRunning(false);
  }, [runTest, queryCount, shouldTestGlobal, shouldTestRegional]);

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
        dialect. Check the{" "}
        <ExternalLink href="https://github.com/vercel-labs/planetscale-test">
          <GitHubLogo /> source code
        </ExternalLink>{" "}
        here.
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
                type="radio"
                name="queries"
                value="1"
                onChange={() => setQueryCount(1)}
                checked={queryCount === 1}
              />{" "}
              Single query (no waterfall)
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="2"
                onChange={() => setQueryCount(2)}
                checked={queryCount === 2}
              />{" "}
              2 serial queries
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="5"
                onChange={() => setQueryCount(5)}
                checked={queryCount === 5}
              />{" "}
              5 serial queries
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
          <ColGrid numCols={1} numColsMd={2} gapX="gap-x-5" gapY="gap-y-5">
            <Card>
              <Title truncate={true}>
                Latency distribution (processing time)
              </Title>
              <Text height="h-14">
                This is how long it takes for the edge function to run the
                queries and return the result. Your internet connections{" "}
                <b>will not</b> influence these results.
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
              <Title truncate={true}>Latency distribution (end-to-end)</Title>
              <Text height="h-14">
                This is the total latency from the client&apos;s perspective. It
                considers the total roundtrip between browser and edge. Your
                internet connection and location <b>will</b> influence these
                results.
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

// 16px github svg icon
const GitHubLogo = ({ width = 16, height = 16 }) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      width={width}
      height={height}
      fill="currentColor"
      style={{ display: "inline-block" }}
    >
      <path d="M512 0C229.25 0 0 229.25 0 512c0 226.25 146.688 418.125 350.156 485.812 25.594 4.688 34.938-11.125 34.938-24.625 0-12.188-0.469-52.562-0.719-95.312C242 908.812 211.906 817.5 211.906 817.5c-23.312-59.125-56.844-74.875-56.844-74.875-46.531-31.75 3.53-31.125 3.53-31.125 51.406 3.562 78.47 52.75 78.47 52.75 45.688 78.25 119.875 55.625 149 42.5 4.654-33 17.904-55.625 32.5-68.375C304.906 725.438 185.344 681.5 185.344 485.312c0-55.938 19.969-101.562 52.656-137.406-5.219-13-22.844-65.094 5.062-135.562 0 0 42.938-13.75 140.812 52.5 40.812-11.406 84.594-17.031 128.125-17.219 43.5 0.188 87.312 5.875 128.188 17.281 97.688-66.312 140.688-52.5 140.688-52.5 28 70.531 10.375 122.562 5.125 135.5 32.812 35.844 52.625 81.469 52.625 137.406 0 196.688-119.75 240-233.812 252.688 18.438 15.875 34.75 47 34.75 94.75 0 68.438-0.688 123.625-0.688 140.5 0 13.625 9.312 29.562 35.25 24.562 203.5-67.688 349.5-259.375 349.5-485.5 0-282.75-229.25-512-512-512z" />
    </svg>
  );
};

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
