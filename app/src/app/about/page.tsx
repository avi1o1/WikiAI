"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Book, Globe, Search, Archive, Layers, Cpu, List, Eye, FileText, BarChart, Mic } from "lucide-react";

export default function About() {
  const missionPoints = [
    {
      icon: <Book className="w-8 h-8" />,
      title: "Accessible Knowledge",
      description: "Bringing the vast resources of Wikipedia to your fingertips in an intuitive way."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Connecting you to a world of information seamlessly."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Focused Research",
      description: "Eliminating distractions to provide the exact data you need."
    },
    {
      icon: <Archive className="w-8 h-8" />,
      title: "Structured Information",
      description: "Organizing knowledge to make it easily digestible and practical."
    }
  ];

  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI-Powered Search",
      description: "Leverage cutting-edge AI to find precise and relevant answers."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Context Retention",
      description: "Our AI retains context to provide coherent and relevant answers across multiple queries."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Source Attribution",
      description: "Provides sources for the information to ensure credibility and transparency."
    },
    {
      icon: <List className="w-8 h-8" />,
      title: "Simplified Navigation",
      description: "Navigate through complex topics effortlessly."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Custom Summaries",
      description: "Get tailored, concise answers based on your queries."
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Relevant Article Search",
      description: "Searches relevant articles to give the best possible answer."
    }
  ];

  const upcomingFeatures = [
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Gain insights from trends and patterns in your research."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Personalized Recommendations",
      description: "Tailoring content based on your preferences and interests."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Search Filters",
      description: "Refine your search results with powerful filters."
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Search Integration",
      description: "Making information access even more convenient with voice commands."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Expanding our reach to cater to a global audience."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Enhanced Knowledge Graphs",
      description: "Visualize interconnections between concepts for better comprehension."
    }
  ];

  return (
    <div className="bg-bg-dark text-text-light min-h-screen flex flex-col font-sans">
      {/* Header Section */}
      <Header />

      <main className="flex-grow px-4 py-8 sm:px-8 md:px-12 lg:px-20">
        {/* Hero Section */}
        <div className="text-center mb-24 mt-8">
          <h1 className="text-5xl font-bold mb-6 page-heading">About WikiAI</h1>
          <p className="text-text-muted text-2xl max-w-5xl mx-auto">
            Revolutionizing how you explore and understand knowledge with AI-driven precision and clarity.
          </p>
        </div>

        {/* Our Goal Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-6 page-subheadings">Our Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {missionPoints.map((point, index) => (
              <div 
                key={index}
                className="bg-bg-accent p-6 rounded-lg border border-gray-700 hover:border-primary-blue transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-primary-blue mb-4 flex justify-center">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {point.title}
                </h3>
                <p className="text-text-muted text-center text-sm">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="mb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-6 page-subheadings page-subheadings">Our State of the Art Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-bg-accent p-8 rounded-lg border border-gray-700 hover:border-primary-blue transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-primary-blue mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-6 page-subheadings">Upcoming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
              {upcomingFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-bg-accent p-6 rounded-lg border border-gray-700 hover:border-primary-blue transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="text-primary-blue mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-text-muted text-center text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}