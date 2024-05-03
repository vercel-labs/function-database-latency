import { Button, Card, Title, AreaChart, Grid, Text } from '@tremor/react';
import { useCallback, useState } from 'react';
import { Select, SelectItem } from '@tremor/react';
import {
  ShoppingCartIcon,
  CircleStackIcon,
  BoltIcon,
} from '@heroicons/react/16/solid';
import Head from 'next/head';
import GithubCorner from '@/components/github-corner';

const ATTEMPTS = 10;
const NODE_AVAILABLE = [
  'planetscale-drizzle',
  'planetscale-prisma',
  'convex',
  'xata-sdk',
  'grafbase',
  'turso',
  'turso-drizzle',
  'turso-prisma',
];
const NODE_ONLY = [
  'supabase-drizzle',
  'supabase-prisma',
  'xata-drizzle',
  'xata-prisma',
];

type Region = 'regional' | 'global' | 'node';

export default function Page() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [shouldTestGlobal, setShouldTestGlobal] = useState(true);
  const [shouldTestRegional, setShouldTestRegional] = useState(true);
  const [shouldTestNode, setShouldTestNode] = useState(false);
  const [queryCount, setQueryCount] = useState(1);
  const [dataService, setDataService] = useState('');
  const [data, setData] = useState({
    regional: [],
    global: [],
    node: [],
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
          elapsed: end - start,
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

    for (let i = 0; i < ATTEMPTS; i++) {
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
          node: [...data.node, nodeValue],
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
  ]);

  return (
    <main className="p-6 max-w-5xl flex flex-col gap-3">
      <Head>
        <title>Vercel Functions + Database Latency</title>
        <meta
          name="description"
          content="Observe the latency querying different data services from varying compute locations using the `edge` and `node` runtimes of Vercel Functions."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image:url" content="/edge-data.png" />
        <meta name="twitter:image" content="/edge-data.png" />
      </Head>
      <GithubCorner url="https://github.com/vercel-labs/edge-data-latency" />

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
          href="https://vercel.com/templates/edge-functions"
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
              onValueChange={(v) => setDataService(v)}
            >
              <SelectItem
                data-testid="vercel-kv"
                value="vercel-kv"
                icon={VercelIcon}
              >
                Vercel KV
              </SelectItem>
              <SelectItem
                data-testid="vercel-postgres"
                value="vercel-postgres"
                icon={VercelIcon}
              >
                Vercel Postgres
              </SelectItem>
              <SelectItem data-testid="convex" value="convex" icon={ConvexIcon}>
                Convex (SDK)
              </SelectItem>
              <SelectItem data-testid="fauna" value="fauna" icon={FaunaIcon}>
                Fauna (faunadb.js)
              </SelectItem>
              <SelectItem
                data-testid="grafbase"
                value="grafbase"
                icon={GrafbaseIcon}
              >
                Grafbase (GraphQL)
              </SelectItem>
              <SelectItem data-testid="neon" value="neon" icon={NeonIcon}>
                Neon (@neondatabase/serverless driver)
              </SelectItem>
              <SelectItem
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
              </SelectItem>
              <SelectItem
                data-testid="polyscale"
                value="polyscale"
                icon={PolyScaleIcon}
              >
                PolyScale (@polyscale/serverless-js driver)
              </SelectItem>
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
                Supabase (w/ Drizzle)
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
              <SelectItem data-testid="turso-drizzle" value="turso-drizzle" icon={TursoIcon}>
                Turso (w/ Drizzle ORM)
              </SelectItem>
              <SelectItem data-testid="turso-prisma" value="turso-prisma" icon={TursoIcon}>
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
                Xata (w/ Drizzle)
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

        <div>
          <Button
            type="button"
            data-testid="run-test"
            onClick={onRunTest}
            loading={isTestRunning}
            disabled={dataService === ''}
          >
            Run Test
          </Button>
        </div>

        {data.regional.length || data.global.length || data.node.length ? (
          <Grid className="gap-5" numItems={1} numItemsMd={2}>
            <Card>
              <Title>Latency distribution (processing time)</Title>
              <Text>
                This is how long it takes for the function to run the queries
                and return the result. Your internet connections <b>will not</b>{' '}
                influence these results.
              </Text>

              <AreaChart
                className="mt-6"
                data={new Array(ATTEMPTS).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    'Regional Edge': data.regional[i]
                      ? data.regional[i].queryDuration
                      : null,
                    'Global Edge': data.global[i]
                      ? data.global[i].queryDuration
                      : null,
                    'Node.js': data.node[i] ? data.node[i].queryDuration : null,
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
                data={new Array(ATTEMPTS).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    'Regional Edge': data.regional[i]
                      ? data.regional[i].elapsed
                      : null,
                    'Global Edge': data.global[i]
                      ? data.global[i].elapsed
                      : null,
                    'Node.js': data.node[i] ? data.node[i].elapsed : null,
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

function VercelIcon() {
  return (
    <svg
      width="20"
      height="20"
      className="flex-none h-5 w-5 mr-3"
      aria-hidden="true"
      viewBox="0 0 76 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="rgb(156 163 175)" />
    </svg>
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

function GrafbaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      className="flex-none h-5 w-5 mr-3"
      viewBox="0 0 41 41"
      xmlns="http://www.w3.org/2000/svg"
      fill="rgb(156 163 175)"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.4873 0.875732C21.5804 1.06182 21.6359 1.26444 21.6507 1.47201C21.6655 1.67958 21.6393 1.88803 21.5735 2.08545C21.5077 2.28287 21.4037 2.46539 21.2673 2.62259C21.131 2.77978 20.965 2.90857 20.7788 3.0016L5.12736 10.8273L20.0897 18.3085L35.0492 10.8285L29.3335 7.97654L20.7879 12.2448C20.6013 12.342 20.3973 12.4011 20.1876 12.4186C19.978 12.4361 19.7669 12.4117 19.5668 12.3468C19.3667 12.2819 19.1815 12.1778 19.022 12.0405C18.8626 11.9033 18.732 11.7357 18.638 11.5475C18.5441 11.3592 18.4885 11.1542 18.4746 10.9443C18.4607 10.7344 18.4887 10.5238 18.557 10.3248C18.6254 10.1258 18.7326 9.94243 18.8726 9.78536C19.0126 9.62828 19.1824 9.50064 19.3722 9.4099L28.625 4.78803C28.8448 4.67832 29.087 4.62121 29.3326 4.62121C29.5782 4.62121 29.8204 4.67832 30.0402 4.78803L39.3027 9.40933C39.566 9.5408 39.7875 9.74302 39.9424 9.99331C40.0972 10.2436 40.1793 10.5321 40.1794 10.8264C40.1796 11.1207 40.0977 11.4093 39.943 11.6597C39.7884 11.9101 39.567 12.1125 39.3038 12.2442L20.8186 21.4868C20.5844 21.6039 20.3353 21.6574 20.0909 21.6545C19.8378 21.658 19.5877 21.6007 19.3614 21.4874L0.875635 12.2442C0.612505 12.1126 0.391221 11.9103 0.236568 11.66C0.0819143 11.4097 0 11.1213 0 10.827C0 10.5328 0.0819143 10.2444 0.236568 9.99412C0.391221 9.74383 0.612505 9.54153 0.875635 9.4099L19.3614 0.1673C19.7372 -0.0206339 20.1724 -0.0515769 20.571 0.0812772C20.9697 0.214131 21.2993 0.499902 21.4873 0.875732ZM0.19222 28.5978C0.28525 28.4117 0.414034 28.2457 0.571217 28.1093C0.7284 27.973 0.910905 27.8689 1.10831 27.803C1.30572 27.7372 1.51416 27.7109 1.72173 27.7256C1.9293 27.7403 2.13195 27.7958 2.31808 27.8888L20.0948 36.7778L37.8716 27.8888C38.2475 27.7009 38.6827 27.6699 39.0814 27.8029C39.4802 27.9358 39.8098 28.2216 39.9977 28.5975C40.1857 28.9735 40.2166 29.4087 40.0837 29.8074C39.9508 30.2061 39.665 30.5357 39.289 30.7237L20.8033 39.9663C20.5833 40.0763 20.3408 40.1335 20.0948 40.1335C19.8489 40.1335 19.6064 40.0763 19.3864 39.9663L0.900652 30.7237C0.714487 30.6306 0.548483 30.5018 0.412122 30.3445C0.275762 30.1873 0.171716 30.0047 0.105929 29.8072C0.040142 29.6098 0.0139019 29.4013 0.0287079 29.1937C0.0435138 28.9861 0.0990757 28.7834 0.19222 28.5973V28.5978Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.192691 19.3542C0.380675 18.9784 0.710247 18.6926 1.10892 18.5598C1.50758 18.4269 1.9427 18.4579 2.31855 18.6458L20.0953 27.5342L37.8721 18.6458C38.2472 18.4636 38.6791 18.4367 39.074 18.5708C39.4689 18.705 39.795 18.9894 39.9815 19.3624C40.1681 19.7355 40.2 20.167 40.0705 20.5634C39.9409 20.9599 39.6603 21.2892 39.2895 21.4801L20.8037 30.7227C20.5837 30.8326 20.3412 30.8897 20.0953 30.8897C19.8494 30.8897 19.6069 30.8326 19.3869 30.7227L0.901122 21.4801C0.525292 21.2921 0.239522 20.9626 0.106668 20.5639C-0.0261862 20.1652 0.00475674 19.7301 0.192691 19.3542Z"
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

function FaunaIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      className="flex-none h-5 w-5 mr-3"
      aria-hidden="true"
    >
      <path
        d="M269.537 130.232C254.133 135.374 246.716 144.596 241.662 158.96C240.358 162.795 237.098 167.039 233.431 169.896L246.064 183.443L205.964 155.369L95.2812 78C95.2812 78 103.269 129.906 106.04 149.003C107.996 162.469 111.338 168.508 121.933 174.629L126.171 176.914L144.428 186.545L133.588 180.913L183.632 208.254L183.306 208.988L129.431 184.015C132.284 193.808 137.826 212.661 140.19 220.985C142.717 229.963 145.569 233.227 154.29 236.41L170.346 242.286L180.29 238.369L167.657 246.775L104.491 327C146.466 287.989 182.002 274.115 208.001 262.771C241.173 248.407 261.142 239.185 274.183 206.05C283.474 182.791 290.728 153.002 299.938 141.495L319.58 116.358C319.58 116.358 278.91 127.131 269.537 130.232Z"
        fill="rgb(156 163 175)"
      />
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

function PolyScaleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 61 60"
      className="flex-none h-5 w-5 mr-3"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
    >
      <rect
        id="ArtBoard1"
        x="0"
        y="0"
        width="60.002"
        height="59.997"
        style={{ fill: 'none' }}
      />
      <clipPath id="_clip1">
        <rect x="0" y="0" width="60.002" height="59.997" />
      </clipPath>
      <g clip-path="url(#_clip1)">
        <g id="Artboard">
          <path
            id="Shape"
            d="M24.1,38.914l6.8,-0c0.3,-0 0.6,0.3 0.6,0.6l-0,4.3c-0,8.1 -5.9,15.2 -13.9,16.1c-9.5,1.1 -17.6,-6.4 -17.6,-15.7c0,-6.7 4.2,-12.4 10.1,-14.7c0.4,-0.1 0.8,0.2 0.8,0.6l0,7.8c0,0.2 -0.1,0.3 -0.2,0.4c-2,1.8 -3.2,4.5 -2.5,7.5c0.6,3 3,5.4 6,6c5,1 9.3,-2.8 9.3,-7.6l0,-4.7c0,-0.4 0.2,-0.6 0.6,-0.6Z"
            style={{ fill: '#9ca3ae', fillRule: 'nonzero' }}
          />
          <path
            id="Shape1"
            d="M15.7,36.414l4.7,-0c0.3,-0 0.6,-0.3 0.6,-0.6l-0,-2.1c-0,-2.9 -2.4,-5.3 -5.3,-5.3c-0.7,-0 -1.4,0.1 -2.1,0.2c-0.3,-0 -0.5,0.3 -0.5,0.6l-0,6.9c-0,0.4 0.4,0.7 0.7,0.6c0.6,-0.2 1.3,-0.3 1.9,-0.3Z"
            style={{ fill: '#9ca3ae', fillRule: 'nonzero' }}
          />
          <path
            id="Shape2"
            d="M33.9,29.014c0,4.1 3.3,7.4 7.3,7.4l0.1,-0c0.3,-0 0.6,-0.3 0.6,-0.6l0,-6.8c0,-0.3 -0.3,-0.6 -0.6,-0.6l-6.8,-0c-0.4,-0 -0.6,0.3 -0.6,0.6Z"
            style={{ fill: '#9ca3ae', fillRule: 'nonzero' }}
          />
          <path
            id="Shape3"
            d="M44.1,35.514l0,-7c0,-0.3 0.2,-0.5 0.4,-0.6c4.8,-1.4 8.1,-6.2 7.2,-11.6c-0.7,-4.1 -4,-7.5 -8.1,-8.2c-6.5,-1.2 -12.2,3.8 -12.2,10.1l0,7.4c0,0.3 -0.3,0.6 -0.6,0.6l-6.8,-0c-0.3,-0 -0.6,-0.3 -0.6,-0.6l0,-6.9c0,-9.9 7.7,-18.3 17.5,-18.7c10.4,-0.4 18.9,7.9 18.9,18.2c0,9 -6.5,16.5 -15.1,17.9c-0.2,0.1 -0.6,-0.2 -0.6,-0.6Z"
            style={{ fill: '#9ca3ae', fillRule: 'nonzero' }}
          />
          <path
            id="Shape4"
            d="M30.8,28.414l-6.8,-0c-0.3,-0 -0.6,0.3 -0.6,0.6l0,6.8c0,0.3 0.3,0.6 0.6,0.6l6.8,-0c0.3,-0 0.6,-0.3 0.6,-0.6l0,-6.8c0,-0.3 -0.2,-0.6 -0.6,-0.6Z"
            style={{ fill: '#9ca3ae', fillRule: 'nonzero' }}
          />
        </g>
      </g>
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
