import { Button, Card, Title, AreaChart, Grid, Text } from '@tremor/react';
import { useCallback, useState } from 'react';
import { Select, SelectItem } from '@tremor/react';
import {
  ShoppingCartIcon,
  CircleStackIcon,
  BoltIcon
} from '@heroicons/react/16/solid';
import Head from 'next/head';
import GithubCorner from '@/components/github-corner';

const NODE_AVAILABLE = [
  ,
  'convex',
  'xata-sdk',
  'turso',
  'turso-drizzle',
  'turso-prisma',
  'upstash',
  'neon',
  'neon-drizzle',
  'neon-prisma',
  'shopify'
];
const NODE_ONLY = [
  'supabase-drizzle',
  'supabase-prisma',
  'xata-drizzle',
  'xata-prisma'
];

type Region = 'regional' | 'global' | 'node';

export default function Page() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [shouldTestGlobal, setShouldTestGlobal] = useState(true);
  const [shouldTestRegional, setShouldTestRegional] = useState(true);
  const [shouldTestNode, setShouldTestNode] = useState(true);
  const [queryCount, setQueryCount] = useState(1);
  const [sampleCount, setSampleCount] = useState(50);
  const [dataService, setDataService] = useState('');
  const [data, setData] = useState({
    regional: [],
    global: [],
    node: []
  });

  const runTest = useCallback(
    async (dataService: string, type: Region, queryCount: number) => {
      try {
        const start = Date.now();
        const res = await fetch(
          `/api/${dataService}-${type}?count=${queryCount}`
        );
        const data = await res.json();
        const end = Date.now();
        return {
          ...data,
          elapsed: end - start
        };
      } catch (e) {
        // instead of retrying we just give up
        return null;
      }
    },
    []
  );

  const onRunTest = useCallback(async () => {
    setIsTestRunning(true);
    setData({ regional: [], global: [], node: [] });

    for (let i = 0; i < sampleCount; i++) {
      let regionalValue = null;
      let globalValue = null;
      let nodeValue = null;

      if (shouldTestRegional) {
        regionalValue = await runTest(dataService, 'regional', queryCount);
      }

      if (shouldTestGlobal) {
        globalValue = await runTest(dataService, 'global', queryCount);
      }

      if (shouldTestNode) {
        nodeValue = await runTest(dataService, 'node', queryCount);
      }

      setData((data) => {
        return {
          ...data,
          regional: [...data.regional, regionalValue],
          global: [...data.global, globalValue],
          node: [...data.node, nodeValue]
        };
      });
    }

    setIsTestRunning(false);
  }, [
    runTest,
    queryCount,
    dataService,
    shouldTestGlobal,
    shouldTestRegional,
    shouldTestNode,
    sampleCount
  ]);

  return (
    <main className="p-6 max-w-5xl flex flex-col gap-3 m-auto">
      <Head>
        <title>Vercel Functions + Database Latency</title>
        <meta
          name="description"
          content="Observe the latency querying different data services from varying compute locations using the `edge` and `node` runtimes of Vercel Functions."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image:url" content="/og.png" />
        <meta name="twitter:image" content="/og.png" />
      </Head>
      <GithubCorner url="https://github.com/vercel-labs/function-database-latency" />

      <h1 className="text-2xl font-bold">
        Vercel Functions + Database Latency
      </h1>
      <p>
        Observe the latency querying different data services from varying
        compute locations using the <Code className="text-xs">edge</Code> and{' '}
        <Code className="text-xs">node</Code> runtimes of{' '}
        <a href="https://vercel.com/docs/functions">Vercel Functions</a>. We
        built this playground to demonstrate different data access patterns and
        how they can impact latency through sequential data requests (i.e.
        waterfalls).
      </p>
      <p>
        Learn more about{' '}
        <a
          href="https://vercel.com/docs/functions"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Vercel Functions
        </a>
        {' or '}
        <a
          href="https://vercel.com/templates"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          deploy a template
        </a>
        .
      </p>
      <form className="flex flex-col gap-5 bg-gray-100 dark:bg-gray-800 p-5 my-5 rounded">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Data service</p>
          <div className="py-1 inline-flex">
            <Select
              data-testid="database-dropdown"
              className="max-w-xs"
              placeholder="Select Database"
              onValueChange={(v) => {
                // Reset all checkbox values
                setShouldTestGlobal(!NODE_ONLY.includes(v));
                setShouldTestRegional(!NODE_ONLY.includes(v));
                setShouldTestNode(
                  NODE_ONLY.includes(v) || NODE_AVAILABLE.includes(v)
                );
                setDataService(v);
              }}
            >
              <SelectItem data-testid="convex" value="convex" icon={ConvexIcon}>
                Convex (SDK)
              </SelectItem>
              <SelectItem data-testid="neon" value="neon" icon={NeonIcon}>
                Neon (@neondatabase/serverless driver)
              </SelectItem>
              <SelectItem
                data-testid="neon-drizzle"
                value="neon-drizzle"
                icon={NeonIcon}
              >
                Neon (w/ Drizzle ORM)
              </SelectItem>
              <SelectItem
                data-testid="neon-prisma"
                value="neon-prisma"
                icon={NeonIcon}
              >
                Neon (w/ Prisma ORM)
              </SelectItem>
              {/* <SelectItem
                data-testid="planetscale"
                value="planetscale"
                icon={CircleStackIcon}
              >
                PlanetScale (w/ Kysely)
              </SelectItem>
              <SelectItem
                data-testid="planetscale-prisma"
                value="planetscale-prisma"
                icon={CircleStackIcon}
              >
                PlanetScale (w/ Prisma ORM)
              </SelectItem>
              <SelectItem
                data-testid="planetscale-drizzle"
                value="planetscale-drizzle"
                icon={CircleStackIcon}
              >
                PlanetScale (w/ Drizzle ORM)
              </SelectItem> */}
              <SelectItem
                data-testid="shopify"
                value="shopify"
                icon={ShoppingCartIcon}
              >
                Shopify (Storefront GraphQL API)
              </SelectItem>
              <SelectItem
                data-testid="supabase"
                value="supabase"
                icon={BoltIcon}
              >
                Supabase (supabase-js)
              </SelectItem>
              <SelectItem
                data-testid="supabase-prisma"
                value="supabase-prisma"
                icon={BoltIcon}
              >
                Supabase (w/ Prisma ORM)
              </SelectItem>
              <SelectItem
                data-testid="supabase-drizzle"
                value="supabase-drizzle"
                icon={BoltIcon}
              >
                Supabase (w/ Drizzle ORM)
              </SelectItem>
              <SelectItem
                data-testid="tidb-cloud"
                value="tidb-cloud"
                icon={TiDBCloudIcon}
              >
                TiDB Cloud (serverless driver)
              </SelectItem>
              {/* <SelectItem data-testid="tigris" value="tigris" icon={TigrisIcon}>
                Tigris (HTTP API)
              </SelectItem> */}
              <SelectItem data-testid="turso" value="turso" icon={TursoIcon}>
                Turso (@libsql/client)
              </SelectItem>
              <SelectItem
                data-testid="turso-drizzle"
                value="turso-drizzle"
                icon={TursoIcon}
              >
                Turso (w/ Drizzle ORM)
              </SelectItem>
              <SelectItem
                data-testid="turso-prisma"
                value="turso-prisma"
                icon={TursoIcon}
              >
                Turso (w/ Prisma ORM)
              </SelectItem>
              <SelectItem
                data-testid="upstash"
                value="upstash"
                icon={UpstashIcon}
              >
                Upstash (SDK)
              </SelectItem>
              <SelectItem
                data-testid="xata-sdk"
                value="xata-sdk"
                icon={XataIcon}
              >
                Xata (SDK)
              </SelectItem>
              <SelectItem
                data-testid="xata-drizzle"
                value="xata-drizzle"
                icon={XataIcon}
              >
                Xata (w/ Drizzle ORM)
              </SelectItem>
              <SelectItem
                data-testid="xata-prisma"
                value="xata-prisma"
                icon={XataIcon}
              >
                Xata (w/ Prisma ORM)
              </SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Location</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Vercel Functions run in Edge or Node runtimes. In Edge runtimes,
            multiple regions are supported (by default they&apos;re global, but
            it&apos;s possible to express a region preference via the{' '}
            <Code className="text-xs">region</Code> setting).
          </p>
          <p className="text-sm flex gap-3 flex-wrap gap-y-1">
            {!NODE_ONLY.includes(dataService) && (
              <label className="flex items-center gap-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  name="region"
                  value="global"
                  checked={shouldTestGlobal}
                  onChange={(e) => setShouldTestGlobal(e.target.checked)}
                />{' '}
                Global function (Edge)
              </label>
            )}
            {!NODE_ONLY.includes(dataService) && (
              <label className="flex items-center gap-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  name="region"
                  value="regional"
                  checked={shouldTestRegional}
                  onChange={(e) => setShouldTestRegional(e.target.checked)}
                />{' '}
                Regional function (Edge | US East)
              </label>
            )}
            {(NODE_AVAILABLE.includes(dataService) ||
              NODE_ONLY.includes(dataService)) && (
              <label className="flex items-center gap-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  name="node"
                  value="node"
                  checked={shouldTestNode}
                  onChange={(e) => setShouldTestNode(e.target.checked)}
                />{' '}
                Serverless function (Node | US East)
              </label>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Waterfall</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
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
              />{' '}
              Single query (no waterfall)
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="2"
                onChange={() => setQueryCount(2)}
                checked={queryCount === 2}
              />{' '}
              2 serial queries
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="5"
                onChange={() => setQueryCount(5)}
                checked={queryCount === 5}
              />{' '}
              5 serial queries
            </label>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Samples</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            The number of samples to run for each location. A larger number of
            samples provides a clearer pattern of the average latency.
          </p>
          <p className="text-sm flex gap-3 flex-wrap gap-y-1">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="samples"
                value="50"
                onChange={() => setSampleCount(50)}
                checked={sampleCount === 50}
              />{' '}
              50
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="samples"
                value="25"
                onChange={() => setSampleCount(25)}
                checked={sampleCount === 25}
              />{' '}
              25
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="samples"
                value="10"
                onChange={() => setSampleCount(10)}
                checked={sampleCount === 10}
              />{' '}
              10
            </label>
          </p>
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            data-testid="run-test"
            onClick={onRunTest}
            loading={isTestRunning}
            disabled={
              dataService === '' ||
              (!shouldTestGlobal && !shouldTestRegional && !shouldTestNode)
            }
          >
            Run Test
          </Button>
          {!shouldTestGlobal && !shouldTestRegional && !shouldTestNode && (
            <p className="text-gray-600 dark:text-gray-300 text-sm ml-4">
              You need to select at least one <strong>Location</strong> to run
              the benchmark.
            </p>
          )}
        </div>

        {data.regional.length || data.global.length || data.node.length ? (
          <Grid className="gap-5" numItems={1}>
            <Card>
              <Title>Latency distribution (processing time)</Title>
              <Text>
                This is how long it takes for the function to run the queries
                and return the result. Your internet connections <b>will not</b>{' '}
                influence these results.
              </Text>

              <AreaChart
                className="mt-6"
                data={new Array(sampleCount).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    'Regional Edge': data.regional[i]
                      ? data.regional[i].queryDuration
                      : null,
                    'Global Edge': data.global[i]
                      ? data.global[i].queryDuration
                      : null,
                    'Node.js': data.node[i] ? data.node[i].queryDuration : null
                  };
                })}
                index="attempt"
                categories={['Global Edge', 'Regional Edge', 'Node.js']}
                colors={['indigo', 'cyan', 'purple']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
              />
            </Card>
            <Card>
              <Title>Latency distribution (end-to-end)</Title>
              <Text>
                This is the total latency from the client&apos;s perspective. It
                considers the total roundtrip between browser and compute
                location. Your internet connection and location <b>will</b>{' '}
                influence these results.
              </Text>

              <AreaChart
                className="mt-6"
                data={new Array(sampleCount).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    'Regional Edge': data.regional[i]
                      ? data.regional[i].elapsed
                      : null,
                    'Global Edge': data.global[i]
                      ? data.global[i].elapsed
                      : null,
                    'Node.js': data.node[i] ? data.node[i].elapsed : null
                  };
                })}
                index="attempt"
                categories={['Global Edge', 'Regional Edge', 'Node.js']}
                colors={['indigo', 'cyan', 'purple']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
              />
            </Card>
          </Grid>
        ) : null}
      </form>
    </main>
  );
}

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}ms`;

function Code({ className = '', children }) {
  return (
    <code
      className={`bg-gray-200 dark:bg-gray-700 text-sm p-1 rounded ${className}`}
    >
      {children}
    </code>
  );
}

function ConvexIcon() {
  return (
    <svg
      width="20"
      height="20"
      className="flex-none h-5 w-5 mr-3"
      viewBox="0 0 45 45"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(156 163 175)"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.7062 34.7911C34.235 34.0809 40.39 30.6736 43.779 24.9866C42.1742 39.0527 26.4703 47.9433 13.6519 42.4847C12.4708 41.9831 11.4541 41.1487 10.7563 40.0758C7.8757 35.6454 6.92878 30.0081 8.28935 24.8923C12.1767 31.4634 20.081 35.4915 27.7062 34.7911Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.05071 20.7649C5.40431 26.7548 5.28968 33.768 8.53414 39.5394C-2.88375 31.1256 -2.75916 13.1209 8.39459 4.79158C9.42624 4.02172 10.6523 3.56477 11.9381 3.49524C17.2259 3.22206 22.5984 5.22369 26.3662 8.95377C18.7111 9.02827 11.2553 13.8312 8.05071 20.7649Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.0586 10.7968C26.1962 5.52206 20.1508 1.93105 13.5273 1.82178C26.3307 -3.87019 42.0795 5.35816 43.794 19.002C43.9535 20.2685 43.7441 21.5599 43.171 22.7023C40.7788 27.4605 36.3432 31.1508 31.16 32.5167C34.9577 25.6178 34.4892 17.1891 30.0586 10.7968Z"
      />
    </svg>
  );
}

function UpstashIcon() {
  return (
    <svg
      className="flex-none h-5 w-5 mr-3"
      viewBox="0 0 310 472"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(156 163 175)"
      aria-hidden="true"
    >
      <path d="M0.421875 412.975C78.5269 491.079 205.16 491.079 283.265 412.975C361.369 334.87 361.369 208.237 283.265 130.132L247.909 165.487C306.488 224.066 306.488 319.041 247.909 377.619C189.331 436.198 94.3559 436.198 35.7769 377.619L0.421875 412.975Z" />
      <path d="M71.1328 342.264C110.185 381.316 173.501 381.316 212.554 342.264C251.606 303.212 251.606 239.895 212.554 200.843L177.199 236.198C196.725 255.724 196.725 287.382 177.199 306.909C157.672 326.435 126.014 326.435 106.488 306.909L71.1328 342.264Z" />
      <path d="M353.974 59.421C275.869 -18.6835 149.236 -18.6835 71.1315 59.421C-6.97352 137.526 -6.97352 264.159 71.1315 342.264L106.486 306.909C47.9085 248.33 47.9085 153.355 106.486 94.777C165.065 36.198 260.04 36.198 318.618 94.777L353.974 59.421Z" />
      <path d="M283.264 130.132C244.212 91.08 180.894 91.08 141.842 130.132C102.789 169.185 102.789 232.501 141.842 271.553L177.197 236.198C157.671 216.672 157.671 185.014 177.197 165.487C196.723 145.961 228.381 145.961 247.908 165.487L283.264 130.132Z" />
    </svg>
  );
}

function XataIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none h-5 w-5 mr-3"
      width="20"
      height="20"
      viewBox="0 0 561 467"
      fill="rgb(156 163 175)"
      aria-hidden="true"
    >
      <path d="M439.428 465.611C471.671 433.443 493.244 393.222 499.401 353.796C505.558 314.369 495.795 278.966 472.26 255.376L350.688 376.663L439.428 465.611Z" />
      <path d="M121.572 466.305C89.3288 434.138 67.756 393.917 61.5989 354.49C55.4418 315.063 65.2047 279.66 88.74 256.07L210.312 377.357L121.572 466.305Z" />
      <path d="M50.6715 122.184C50.7248 167.729 68.8685 211.387 101.111 243.554L101.114 243.551L222.671 364.823C254.838 332.58 272.879 288.88 272.826 243.335C272.773 197.79 254.629 154.132 222.386 121.964L222.383 121.967L100.827 0.695312C68.6597 32.9381 50.6182 76.6388 50.6715 122.184Z" />
      <path d="M510.327 121.488C510.274 167.033 492.13 210.692 459.887 242.859L459.884 242.855L338.328 364.127C306.161 331.884 288.119 288.183 288.172 242.638C288.226 197.094 306.369 153.435 338.612 121.268L338.616 121.271L460.172 0C492.339 32.2428 510.38 75.9434 510.327 121.488Z" />
    </svg>
  );
}

function NeonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none h-5 w-5 mr-3"
      width="20"
      height="20"
      viewBox="0 0 36 36"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 6.207A6.207 6.207 0 0 1 6.207 0h23.586A6.207 6.207 0 0 1 36 6.207v20.06c0 3.546-4.488 5.085-6.664 2.286l-6.805-8.754v10.615A5.586 5.586 0 0 1 16.945 36H6.207A6.207 6.207 0 0 1 0 29.793V6.207Zm6.207-1.241c-.686 0-1.241.555-1.241 1.24v23.587c0 .686.555 1.242 1.24 1.242h10.925c.343 0 .434-.278.434-.621V16.18c0-3.547 4.488-5.086 6.665-2.286l6.805 8.753V6.207c0-.686.064-1.241-.621-1.241H6.207Z"
        fill="rgb(186 193 205)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 6.207A6.207 6.207 0 0 1 6.207 0h23.586A6.207 6.207 0 0 1 36 6.207v20.06c0 3.546-4.488 5.085-6.664 2.286l-6.805-8.754v10.615A5.586 5.586 0 0 1 16.945 36H6.207A6.207 6.207 0 0 1 0 29.793V6.207Zm6.207-1.241c-.686 0-1.241.555-1.241 1.24v23.587c0 .686.555 1.242 1.24 1.242h10.925c.343 0 .434-.278.434-.621V16.18c0-3.547 4.488-5.086 6.665-2.286l6.805 8.753V6.207c0-.686.064-1.241-.621-1.241H6.207Z"
        fill="rgb(186 193 205)"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 6.207A6.207 6.207 0 0 1 6.207 0h23.586A6.207 6.207 0 0 1 36 6.207v20.06c0 3.546-4.488 5.085-6.664 2.286l-6.805-8.754v10.615A5.586 5.586 0 0 1 16.945 36H6.207A6.207 6.207 0 0 1 0 29.793V6.207Zm6.207-1.241c-.686 0-1.241.555-1.241 1.24v23.587c0 .686.555 1.242 1.24 1.242h10.925c.343 0 .434-.278.434-.621V16.18c0-3.547 4.488-5.086 6.665-2.286l6.805 8.753V6.207c0-.686.064-1.241-.621-1.241H6.207Z"
        fill="rgb(186 193 205)"
      />
      <path
        d="M29.793 0A6.207 6.207 0 0 1 36 6.207v20.06c0 3.546-4.488 5.085-6.664 2.286l-6.805-8.754v10.615A5.586 5.586 0 0 1 16.945 36a.62.62 0 0 0 .62-.62v-19.2c0-3.547 4.488-5.086 6.665-2.286l6.805 8.753V1.241C31.035.556 30.479 0 29.793 0Z"
        fill="rgb(156 163 175)"
      />
    </svg>
  );
}

function TigrisIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none h-5 w-5 mr-3"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.2783 15.9231L19.6644 14.5753C19.3148 13.8042 18.6917 13.1916 17.9168 12.8572L16.5567 12.2685L17.9076 11.6516C18.6725 11.2999 19.2787 10.6735 19.6077 9.89552L20.1935 8.53845L20.8074 9.88625C21.157 10.6574 21.7802 11.2699 22.555 11.6044L23.9152 12.193L22.5644 12.8099C21.8023 13.1608 21.1965 13.7829 20.8641 14.5563L20.2783 15.9231Z"
        fill="#A2A3A8"
      />
      <path
        d="M10.4934 10.8246V4.86549H10.4045H15.3494V0H0V4.86549H4.78494V10.542C4.78494 10.6058 4.78494 10.6696 4.78494 10.7334V10.8517C4.78494 16.911 7.86547 24 16.5567 24V19.28C12.1178 19.2527 10.4934 15.7357 10.4934 10.8246Z"
        fill="#A2A3A8"
      />
    </svg>
  );
}

function TursoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="flex-none h-5 w-5 mr-3"
      viewBox="0 0 201 170"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M200.035 48.61C195.365 20.67 170.875 0 170.875 0V30.78L156.335 34.53L147.225 23.56L142.415 33.02C132.495 30.32 118.835 28.58 100.045 28.58C81.2549 28.58 67.5949 30.33 57.6749 33.02L52.8649 23.56L43.7549 34.53L29.2149 30.78V0C29.2149 0 4.72493 20.67 0.0549316 48.61L32.1949 59.73C33.2449 79.16 41.9849 131.61 44.4849 136.37C47.1449 141.44 61.2649 155.93 72.3149 161.5C72.3149 161.5 76.3149 157.27 78.7549 153.54C81.8549 157.19 97.8649 169.99 100.055 169.99C102.245 169.99 118.255 157.2 121.355 153.54C123.795 157.27 127.795 161.5 127.795 161.5C138.845 155.93 152.965 141.44 155.625 136.37C158.125 131.61 166.865 79.16 167.915 59.73L200.055 48.61H200.035ZM153.845 93.35L132.095 95.29L134.005 121.96C134.005 121.96 120.775 132.91 100.045 132.91C79.3149 132.91 66.0849 121.96 66.0849 121.96L67.9949 95.29L46.2449 93.35L42.5249 63.31L78.5749 75.79L75.7749 113.18C82.4749 114.88 89.5249 116.57 100.055 116.57C110.585 116.57 117.625 114.88 124.325 113.18L121.525 75.79L157.575 63.31L153.855 93.35H153.845Z"
        fill="#A2A3A8"
      />
    </svg>
  );
}

function TiDBCloudIcon() {
  return (
    <svg
      className="flex-none h-5 w-5 mr-3"
      viewBox="0 0 250.07 178.66"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(156 163 175)"
      aria-hidden="true"
    >
      <path d="M197.24,41.82h0C174.34,1.93,123.46-11.83,83.58,11.07c-21.46,12.32-36.32,33.55-40.56,57.92C13.13,75.92-5.48,105.77,1.45,135.65c5.84,25.19,28.28,43.02,54.14,43.01,1.88,0,3.76-.1,5.63-.29h113.79c1.86,.15,3.73,.29,5.63,.29,38.35,0,69.43-31.09,69.43-69.43,0-31.95-21.8-59.77-52.82-67.42Zm-72.28,26.46v74.81l-21.5-12.4v-49.99l-21.51,12.42v-24.83l43.01-24.84,21.5,12.41-21.5,12.41Zm43.22,49.93l-21.59,12.46v-49.84l21.59-12.48v49.86Z" />
    </svg>
  );
}
