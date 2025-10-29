"use client";

import Link from "next/link";
import { useState } from "react";
import { MdOutlinePhoneInTalk, MdEmail, MdFeedback, MdSend } from "react-icons/md";

const ContactUs = () => {
  const [subject, setSubject] = useState("general");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setResultMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phoneNumber: form.phoneNumber,
          subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResultMsg("Your message has been sent successfully!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      } else {
        setResultMsg(
          data.message || "Failed to send message. Please try again."
        );
      }
    } catch (err) {
      setResultMsg("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen text-black mt-8">
      <div className="mx-auto max-w-[1280px] 2xl:max-w-[1600px] px-4 space-y-8">
        {/* Keep existing header */}
        <div className="space-y-3 text-center">
          <h4 className="heading-4 text-primary">Contact Us</h4>
          <p className="subtitle-text text-secondary-foreground">
            Get in touch with our team for assistance, we're here for you!
          </p>
        </div>

        {/* Main Content Grid - Updated to match dashboard design */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-8">
                <h3 className="heading-4 text-white mb-2">Send us a Message</h3>
                <p className="text-white/90">Fill out the form below and we'll respond within 24 hours</p>
              </div>
              
              <div className="p-8 lg:p-12">
                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Contact Information Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="firstName" className="block label-text font-semibold text-foreground">
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          placeholder="Enter your first name"
                          className="w-full outline-none border-2 border-gray-200 focus:border-primary font-medium rounded-xl py-4 px-5 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                          value={form.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="lastName" className="block label-text font-semibold text-foreground">
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          placeholder="Enter your last name"
                          className="w-full outline-none border-2 border-gray-200 focus:border-primary font-medium rounded-xl py-4 px-5 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                          value={form.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="email" className="block label-text font-semibold text-foreground">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          placeholder="Enter your email"
                          className="w-full outline-none border-2 border-gray-200 focus:border-primary font-medium rounded-xl py-4 px-5 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                          value={form.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="phoneNumber" className="block label-text font-semibold text-foreground">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="phoneNumber"
                          placeholder="+1 234-567-890"
                          className="w-full outline-none border-2 border-gray-200 focus:border-primary font-medium rounded-xl py-4 px-5 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
                          value={form.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-3">
                    <label htmlFor="subject" className="block label-text font-semibold text-foreground">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full outline-none border-2 border-gray-200 focus:border-primary font-medium rounded-xl py-4 px-5 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 appearance-none cursor-pointer"
                      >
                        <option value="General query">General query</option>
                        <option value="Service Details">Service Details</option>
                        <option value="Request a Quote">Request a Quote</option>
                        <option value="Project Consultation">Project Consultation</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-3">
                    <label htmlFor="message" className="block label-text font-semibold text-foreground">
                      Message
                    </label>
                    <div className="relative">
                      <textarea
                        name="message"
                        id="message"
                        placeholder="Tell us how we can help you..."
                        className="w-full outline-none border-2 border-gray-200 focus:border-primary font-medium rounded-xl py-4 px-5 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 resize-none"
                        rows={6}
                        value={form.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Result Message */}
                  {resultMsg && (
                    <div
                      className={`rounded-xl p-4 text-center font-medium ${
                        resultMsg.includes("success")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {resultMsg}
                    </div>
                  )}

                  {/* Terms and Submit */}
                  <div className="space-y-6">
                    <p className="text-sm text-secondary-foreground leading-relaxed">
                      By submitting your inquiry, you acknowledge and agree to our{" "}
                      <Link href={"/terms-and-conditions"} className="text-primary hover:underline font-medium">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href={"/privacy-policy"} className="text-primary hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <MdSend className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* Phone Contact Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MdOutlinePhoneInTalk className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="heading-5 text-foreground">Speak with Our Team</h4>
                </div>
                <div className="space-y-3">
                  <p className="text-secondary-foreground">Ready to talk? Give us a call</p>
                  <p className="heading-5 text-primary font-bold">(904) 800-9254</p>
                  <p className="text-sm text-secondary-foreground">Monday - Friday, 9AM - 6PM EST</p>
                </div>
              </div>
            </div>

            {/* Feedback Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MdFeedback className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="heading-5 text-foreground">We Value Your Feedback!</h4>
                </div>
                <div className="space-y-4">
                  <p className="text-secondary-foreground">
                    Your feedback matters! Let's make things even better together.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-br from-accent-secondary/30 to-accent-primary/30 p-6">
                <h4 className="heading-5 text-foreground mb-4">Quick Tips</h4>
                <ul className="space-y-3 text-sm text-secondary-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include specific details about your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide your contact information for faster support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>We typically respond within 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactUs;
