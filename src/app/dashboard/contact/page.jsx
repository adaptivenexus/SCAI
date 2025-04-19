"use client";

import Link from "next/link";
import { useState } from "react";
import { MdOutlinePhoneInTalk } from "react-icons/md";

const ContactUs = () => {
  const [subject, setSubject] = useState("general");



  return (
    <section className="min-h-screen text-black mt-8">
      <div className="mx-auto max-w-[1280px] 2xl:max-w-[1600px] px-4 space-y-8">
        <div className="space-y-3 text-center">
          <h4 className="heading-4 text-primary">Contact Us</h4>
          <p className="subtitle-text text-secondary-foreground">
            Get in touch with our team for assistance, we're here for you!
          </p>
        </div>
        <div className="flex gap-10 flex-col lg:flex-row ">
          <div className="flex gap-8 rounded-2xl overflow-hidden p-4 bg-secondary-gradient shadow-xl flex-1">
            <div className="flex-1 p-4 md:p-8">
              <form className="space-y-6">
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter your first name "
                      className="outline-none border border-[#D1D1D1] font-medium rounded-md py-2 px-4"
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Enter your last name"
                      className="outline-none border border-[#D1D1D1] font-medium rounded-md py-2 px-4"
                    />
                  </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="firstName">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your Email"
                      className="outline-none border border-[#D1D1D1] font-medium rounded-md py-2 px-4"
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="lastName">Phone Number</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      placeholder="+1 234-567-890"
                      className="outline-none border border-[#D1D1D1] font-medium rounded-md py-2 px-4"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h6 className="subtitle-text font-semibold">
                    Select Subject
                  </h6>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full outline-none border border-[#D1D1D1] font-medium rounded-md py-2 px-4"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="service">Service Details</option>
                    <option value="quote">Request a Quote</option>
                    <option value="project">Project Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Write your message"
                    className="w-full outline-none border border-[#D1D1D1] font-medium rounded-md py-2 px-4"
                    rows={2}
                  ></textarea>
                </div>
                <p>
                  By submitting your inquiry, you acknowledge and agree to our{" "}
                  <Link href={"/terms-and-conditions"} className="text-primary">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href={"/privacy-policy"} className="text-primary">
                    Privacy Policy
                  </Link>
                  .
                </p>
                <button
                  type="submit"
                  className="block ml-auto w-max py-3 px-6 subtitle-text bg-primary rounded-md hover:opacity-80 transition-all duration-300 text-white"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="lg:w-2/5 space-y-3">
            <div className="bg-secondary-gradient shadow-xl p-5 rounded-2xl overflow-hidden space-y-5">
              <h4 className="heading-5">Speak with Our Team</h4>

              <p className="heading-5 flex items-center gap-2">
                <MdOutlinePhoneInTalk size={36} /> (904) 800-9254
              </p>
            </div>
            <div className="bg-secondary-gradient shadow-xl p-5 rounded-2xl overflow-hidden space-y-3">
              <h4 className="heading-5">We Value Your Feedback!</h4>
              <p className="subtitle-text">
                Your feedback matters! Let's make things even better together.
              </p>
              <button type="button" className="primary-btn">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactUs;
