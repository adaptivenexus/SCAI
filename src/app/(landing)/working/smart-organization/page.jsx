import Image from "next/image";
const SmartOrganizationPage = () => {
  return (
    <div>
       <div>
     <section className="flex flex-col lg:flex-row items-center justify-between gap-8 py-16 px-4 md:px-10">
      {/* Content Section */}
      <div className="flex-1">
        <h2 className="text-heading md:text-4xl font-bold mb-4 text-secondary">Smart Organization</h2>
        <p className="text-primary text-lg mb-6">
          Let your documents arrange themselves — no more manual sorting or folders.
        </p>

        <ul className="list-disc pl-5 space-y-4 text-secondary-foreground">
          <li>
            <span className="font-semibold text-foreground">Auto-Folders by Type</span><br />
            Automatically groups invoices, forms, IDs, and more into relevant folders.
          </li>
          <li>
            <span className="font-semibold text-foreground">Context-Aware Sorting</span><br />
            Organizes documents based on content and usage patterns.
          </li>
          <li>
            <span className="font-semibold text-foreground">Optimized for Desktop MVPs</span><br />
            Tailored for focused desktop-based productivity tools.
          </li>
          <li>
            <span className="font-semibold text-foreground">Smart Duplicate Detection</span><br />
            Spots and suggests removal of duplicate documents instantly.
          </li>
          <li>
            <span className="font-semibold text-foreground">Dynamic Folder Updates</span><br />
            Files automatically shift as context or document type changes.
          </li>
        </ul>
        </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/stepimage3.png"
          alt="Smart Organization Illustration"
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

export default SmartOrganizationPage
