import Link from 'next/link';

// Metadata for SEO
export const metadata = {
  title: 'AI Visa Assistant | Simplify Your Visa Application Process',
  description: 'Use AI-powered tools to streamline your visa application process. Get personalized guidance, document preparation assistance, and increase your approval chances.',
  keywords: 'visa application, AI visa assistant, visa approval, immigration help, visa documents',
  openGraph: {
    title: 'AI Visa Assistant | Simplify Your Visa Application Process',
    description: 'Use AI-powered tools to streamline your visa application process. Get personalized guidance and increase approval chances.',
    images: [{url: '/images/ai-visa-banner.jpg', width: 1200, height: 630}],
  },
};

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simplify Your Visa Application with AI
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Our AI-powered platform guides you through every step of the visa application process, increasing your
              chances of approval.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/get-started" className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                Get Started
              </Link>
              <Link href="/how-it-works" className="px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 ">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How AI Visa Helps You</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Personalized Guidance",
                  description: "Get customized recommendations based on your specific situation and visa type.",
                  icon: "🧠",
                },
                {
                  title: "Document Preparation",
                  description: "Our AI helps you prepare all necessary documents with proper formatting and content.",
                  icon: "📄",
                },
                {
                  title: "Application Review",
                  description: "AI-powered review of your application to identify potential issues before submission.",
                  icon: "✅",
                },
              ].map((feature, index) => (
                <div key={index} className=" p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-16 ">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote: "AI Visa made my student visa application process so much easier. I got approved on my first try!",
                  author: "Sarah L., Student",
                  country: "Canada",
                },
                {
                  quote: "As a business professional, time is valuable. AI Visa saved me hours of research and stress.",
                  author: "Michael T., Business Executive",
                  country: "United Kingdom",
                },
              ].map((testimonial, index) => (
                <div key={index} className="p-6 rounded-xl">
                  <p className={"italic  mb-4"}>"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm">Visa to {testimonial.country}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 ">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Visa Application?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of successful applicants who used AI Visa to streamline their application process.
            </p>
            <Link href="/signup" className="px-8 py-3 rounded-lg font-semibold text-lg inline-block transition-colors">
              Start Your Application
            </Link>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="w-full py-16 ">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "How does AI improve visa application success rates?",
                  answer: "Our AI analyzes thousands of successful applications to identify patterns and best practices, then applies these insights to your specific situation, helping you avoid common mistakes and strengthen your application."
                },
                {
                  question: "Which countries' visa applications do you support?",
                  answer: "We currently support visa applications for major destinations including the US, UK, Canada, Australia, EU Schengen countries, and many more. Our system is regularly updated with the latest immigration requirements."
                },
                {
                  question: "Is my personal information secure?",
                  answer: "Absolutely. We employ bank-level encryption and strict data protection protocols to ensure your personal information remains completely secure and confidential."
                },
              ].map((faq, index) => (
                <div key={index} className="p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}