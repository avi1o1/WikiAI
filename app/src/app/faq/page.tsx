"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is WikiAI?",
      answer: "WikiAI is an intelligent research assistant that leverages advanced AI technology to provide precise and relevant answers from Wikipedia's vast knowledge base. It simplifies the process of finding and understanding information by delivering concise and accurate responses to your queries; along with the article sources for credibility."
    },
    {
      question: "How do I use WikiAI?",
      answer: "Using WikiAI is simple. Just navigate to the Chat page (you'll need to sign-up) and you are all set to ask your question. You can begin with a general query or a specific topic, and WikiAI will provide you with a detailed and context-aware response."
    },
    {
      question: "What features does WikiAI offer?",
      answer: "WikiAI offers a range of features including AI-powered search, context retention, source attribution, simplified navigation, custom summaries, and relevant article search. These features work together to provide a seamless and efficient research experience."
    },
    {
      question: "What makes WikiAI different from other research tools?",
      answer: "WikiAI stands out due to its advanced AI capabilities, which provide precise and context-aware answers. Unlike traditional search engines, WikiAI synthesizes information from multiple sources, ensuring that you get comprehensive and accurate responses without the need to sift through numerous articles."
    },
    {
      question: "How often is the information updated?",
      answer: "WikiAI fetches information from Wikipedia, which is constantly updated by a global community of contributors. This ensures that the information provided by WikiAI is up-to-date and accurate. However, the frequency of updates depends on Wikipedia's update cycle."
    },
    {
      question: "Can I use WikiAI for academic research?",
      answer: "Absolutely! WikiAI is designed to be a valuable tool for students, researchers, and academicians. Its ability to provide concise and accurate information makes it an excellent resource for academic research and study."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, we prioritize your privacy and security. WikiAI does not store any personal data and ensures that all interactions are masked and secure."
    },
    {
      question: "Is WikiAI free to use?",
      answer: "Yes, we at WikiAI believe in making knowledge accessible to everyone. That's why WikiAI is completely free to use, with no hidden charges!"
    },
    {
      question: "Does WikiAI support multiple languages?",
      answer: "Not currently :(. But we are working on expanding our language support to cater to a global audience. Currently, WikiAI primarily supports English, but we plan to add more languages in the near future."
    },
    {
      question: "Who built WikiAI?",
      answer: "WikiAI was built by an enthusiastic student from the International Institute of Information Technology, Hyderabad, to simplify the research process for students and professionals."
    },
    {
      question: "Can I contribute to WikiAI?",
      answer: "Yes, WikiAI is an open-source project. Anyone can access the codebase at https://github.com/avi1o1/WikiAI. Interested collaborators are welcome to help develop and maintain the project."
    },
    {
      question: "How can I get support?",
      answer: "While there is no active support team, you may raise your issues at https://github.com/avi1o1/WikiAI. And the community will try to help you out."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-bg-dark text-text-light min-h-screen flex flex-col font-sans">
      {/* Header Section */}
      <Header />

      <main className="flex-grow px-4 py-8 sm:px-8 md:px-12 lg:px-20">
        {/* Hero Section */}
        <div className="text-center mb-24 mt-8">
          <h1 className="text-5xl font-bold mb-6 page-heading">Frequently Asked Questions</h1>
          <p className="text-text-muted text-2xl max-w-5xl mx-auto page-subheadings">
            Find answers to the most common questions about WikiAI.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-bg-accent p-6 rounded-lg border border-gray-700 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {expandedIndex === index && (
                  <p className="text-lg text-text-muted mt-4">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}