import Image from 'next/image'
const AiProcessingpage = () => {
  return (
    <div><div>
    <section className="flex flex-col lg:flex-row items-center justify-between gap-8 py-16 px-4 md:px-10">
     {/* Content Section */}
     <div className="flex-1">
       <h2 className="text-heading md:text-4xl font-bold mb-4 text-secondary">Let AI Handle Your Documents</h2>
       <p className="text-primary text-lg mb-6">
         Upload, auto-organize, and intelligently process your files — accurate, fast, and effortless.
       </p>

       <ul className="list-disc pl-5 space-y-4 text-secondary-foreground">
         <li>
           <span className="font-semibold text-foreground">AI-Powered Classification</span><br />
           Files are automatically analyzed and categorized using intelligent algorithms.
         </li>
         <li>
           <span className="font-semibold text-foreground">Smart Tagging</span><br />
           AI assigns relevant tags to documents for easier search and organization.
         </li>
         <li>
           <span className="font-semibold text-foreground">Format Friendly</span><br />
           Works smoothly with PDF, DOCX, JPG, PNG, TXT & more.
         </li>
         <li>
           <span className="font-semibold text-foreground">Secure Cloud Storage</span><br />
           Documents are encrypted and available anytime you need them.
         </li>
         <li>
           <span className="font-semibold text-foreground">Instant Feedback</span><br />
           See file progress, status updates, and AI results in real-time.
         </li>
       </ul>
       </div>

     {/* Image Section */}
     <div className="flex-1 flex justify-center">
       <Image
         src="/stepimage2.png" // changed to image 2
         alt="AI Document Processing Illustration"
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

export default AiProcessingpage
