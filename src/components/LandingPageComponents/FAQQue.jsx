"use client";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";

const FAQQue = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2 py-6 select-none">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer"
      >
        <h5 className="heading-5">{question}</h5>
        {!open ? (
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="text-primary "
          >
            <IoMdAdd size={32} />
          </button>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="text-primary "
          >
            <RiSubtractFill size={32} />
          </button>
        )}
      </div>
      {open && <p className="text-secondary-foreground">{answer}</p>}
    </div>
  );
};
export default FAQQue;
