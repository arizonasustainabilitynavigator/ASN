import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";

// FAQ content
const faqs = [
  {
    question: "What types of waste can I find resources for?",
    answer: "Our directory includes verified partners for electronics, organic waste, construction debris, hazardous materials, recyclables, and industrial waste. Use the waste type filter on the Resource Vault to narrow your search."
  },
  {
    question: "Do I need to sign up to browse the resource directory?",
    answer: "Yes. Creating a free account lets us verify who's using the platform and gives you access to the full Resource Vault, including direct phone and email connections to waste management partners."
  },
  {
    question: "How do I contact a waste management resource?",
    answer: "Each resource card includes a 'Call Resource' button that reveals the phone number, and an 'Initiate Email' button that opens a pre-addressed email. Both connect you directly with the business — no forms or waiting."
  },
  {
    question: "Is my business required to follow Arizona waste disposal regulations?",
    answer: "Yes. Arizona businesses must comply with ADEQ (Arizona Department of Environmental Quality) regulations for hazardous waste, and many municipalities have additional rules for commercial recycling and organic waste. Our partner resources can help you understand what applies to your business."
  },
  {
    question: "What happens if I don't dispose of hazardous waste properly?",
    answer: "Improper disposal of hazardous waste can result in fines from ADEQ or the EPA, in addition to environmental harm. We recommend connecting with one of our licensed hazardous waste partners to ensure compliant handling and disposal."
  },
  {
    question: "How do I list my business in the Resource Vault?",
    answer: "After signing up, go to your Profile page to create a business listing. Upload your logo, add your contact details, and select the waste types you handle — your listing will then appear in the directory for other businesses to find."
  },
  {
    question: "Can I update my business profile after creating it?",
    answer: "Yes, you can edit your business name, description, contact information, and waste types at any time from your Profile page. Changes are saved instantly and reflected in the directory."
  },
  {
    question: "How do I find out about upcoming sustainability events?",
    answer: "Visit the Events page to browse our horizontal event timeline, featuring workshops, networking events, conferences, and community cleanups happening across Arizona. Click any event for full details."
  },
  {
    question: "Is there a cost to join the Arizona Sustainability Navigator?",
    answer: "Creating an account and listing your business in the directory is free. Our goal is to make sustainable waste management as accessible as possible for Arizona businesses of every size."
  }
];

// FAQ page
export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Support</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-foreground/70 text-lg max-w-xl">
            Answers to common questions about waste disposal regulations and using the platform.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="h-[0.5px] bg-border mb-8" />

        <div className="max-w-3xl mx-auto pb-24 md:pb-32">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}