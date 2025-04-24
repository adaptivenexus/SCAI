import Image from "next/image";
const EasyAcessPage = () => {
  return (
    <div>
        <div>
     <section className="flex flex-col lg:flex-row items-center justify-between gap-8 py-16 px-4 md:px-10">
      {/* Content Section */}
      <div className="flex-1">
        <h2 className="text-heading md:text-4xl font-bold mb-4 text-secondary">Easy Access, Always</h2>
        <p className="text-primary text-lg mb-6">
          Your documents, whenever and wherever — zero delay, zero stress.
        </p>

        <ul className="list-disc pl-5 space-y-4 text-secondary-foreground">
          <li>
            <span className="font-semibold text-foreground">Quick Search</span><br />
            Instantly find files using smart search powered by file name, type, or tags.
          </li>
          <li>
            <span className="font-semibold text-foreground">Anytime, Anywhere</span><br />
            Access documents from any browser or desktop setup — no extra installs.
          </li>
          <li>
            <span className="font-semibold text-foreground">Optimized for Desktop MVPs</span><br />
            Lightweight yet powerful, tailored for performance on MVP apps.
          </li>
          <li>
            <span className="font-semibold text-foreground">Favorites & Pinning</span><br />
            Mark important documents for one-click access when needed.
          </li>
          <li>
            <span className="font-semibold text-foreground">Offline-Ready Sync</span><br />
            View recently opened files even without internet.
          </li>
        </ul>
        </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/stepimage4.png"
          alt="Easy Access Illustration"
          width={600}
          height={600}
          className="w-full max-w-md h-auto"
          priority
        />
      </div>
    </section>
    </div>
    </div>
  )
}

export default EasyAcessPage
