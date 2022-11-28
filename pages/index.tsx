export default function Page() {
  return (
    <main className="p-6 max-w-3xl flex flex-col gap-3">
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
          <p className="text-sm flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="region" value="global" /> Use global
              function
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="region" value="regional" /> Use regional
              (IAD) function
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
          <p className="text-sm flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="queries" value="1" /> Single query (no
              waterfall)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="queries" value="2" /> 2 serial queries
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="queries" value="5" /> 5 serial queries
            </label>
          </p>
        </div>

        <p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded">
            Run test
          </button>
        </p>
      </form>
    </main>
  );
}

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
