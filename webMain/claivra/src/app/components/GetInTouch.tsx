"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

const GetInTouch: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSend = async () => {
    const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const public_key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    const date = Date.now();
    const time = new Date(date).toLocaleTimeString();

    setSending(true);
    try {
      await emailjs.send(
        service_id,
        template_id,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          topic: formData.topic,
          message: formData.message,
          to_email: "manyagupta.123.ag@gmail.com", 
          time : time,
        },
        public_key
      );
      setSent(true);
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
      });

    } catch (error) {
      console.error("Email send failed", error);
      alert("Failed to send message. Please try again later.");
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col justify-center items-center my-20 md:my-24">
      <h1 className="text-3xl font-bold text-primaryBlue">Get in Touch</h1>

      <div className="flex w-full mt-20 px-10 sm:px-16 md:px-28 gap-6 md:gap-28">
        <input
          placeholder="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-1/2 bg-[#f8f8f8] text-sm sm:text-base px-4 rounded-md border border-opacity-60 border-grey h-12"
        />
        <input
          placeholder="Email address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-1/2 bg-[#f8f8f8] text-sm sm:text-base px-4 rounded-md border border-opacity-60 border-grey h-12"
        />
      </div>

      <div className="flex w-full mt-10 px-10 sm:px-16 md:px-28 gap-6 md:gap-28">
        <input
          placeholder="Mobile Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-1/2 bg-[#f8f8f8] text-sm sm:text-base px-4 rounded-md border border-opacity-60 border-grey h-12"
        />
        <input
          placeholder="Topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="w-1/2 bg-[#f8f8f8] text-sm sm:text-base px-4 rounded-md border border-opacity-60 border-grey h-12"
        />
      </div>

      <div className="relative flex w-full sm:px-16 mt-10 px-10 md:px-28">
        <textarea
          placeholder="Message"
          name="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="w-full bg-[#f8f8f8] text-sm sm:text-base px-4 py-3 rounded-md border border-opacity-60 border-grey h-24 resize-none"
        />
      </div>

      <div className="flex justify-center mt-16">
        <button
          onClick={handleSend}
          disabled={sending}
          className="px-6 py-2 bg-primaryBlue text-primaryWhite rounded-md transition"
        >
          {sending ? "Sending..." : "Send Request"}
        </button>
      </div>
    </div>
  );
};

export default GetInTouch;
