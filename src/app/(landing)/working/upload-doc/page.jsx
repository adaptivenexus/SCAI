
import Image from 'next/image'

const UploadDocument = () => {
  return (
    <div>
     <section className="flex flex-col lg:flex-row items-center justify-between gap-8 py-16 px-4 md:px-10">
      {/* Content Section */}
      <div className="flex-1">
        <h2 className="text-heading md:text-4xl font-bold mb-4 text-secondary">Upload Your Documents</h2>
        <p className="text-primary text-lg mb-6">
          Add, organize, and begin processing your files in seconds — fast, secure, and hassle-free.
        </p>

        <ul className="list-disc pl-5 space-y-4 text-secondary-foreground">
          <li>
            <span className="font-semibold text-foreground">Drag & Drop Interface</span><br />
            Just drag your documents into the upload area — super easy and quick.
          </li>
          <li>
            <span className="font-semibold text-foreground">Bulk Upload Support</span><br />
            Upload multiple files in one go, no need to wait or repeat.
          </li>
          <li>
            <span className="font-semibold text-foreground">Universal File Compatibility</span><br />
            Works with PDF, DOCX, JPG, PNG, TXT & more.
          </li>
          <li>
            <span className="font-semibold text-foreground">Secure Cloud Storage</span><br />
            Documents are encrypted and available anytime you need them.
          </li>
          <li>
            <span className="font-semibold text-foreground">Real-Time Upload Feedback</span><br />
            Track upload progress, file status, and confirmations live.
          </li>
        </ul>
        </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/stepimage1.jpg" // move your image to public/images folder
          alt="Upload Documents Illustration"
          width={600}
          height={600}
          className="w-full max-w-md h-auto"
          priority
        />
      </div>
    </section>
    </div>
  )
}

export default UploadDocument
