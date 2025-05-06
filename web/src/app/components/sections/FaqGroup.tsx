import {FaQuestion} from "react-icons/fa";
import React from "react";
import {type BlocksContent, BlocksRenderer,} from "@strapi/blocks-react-renderer";

interface FAGProps {
  locale: string;
  data: {
    id: string;
    title: string;
    faqs: FAQ[];
  };
}

interface FAQ {
  id: string;
  question: string;
  answer: BlocksContent;
}

export default function FaqGroup({data}: FAGProps) {
  const {title, faqs} = data;

  // Process the answer to get plain text without using renderToString
  const getAnswerPlainText = (answer: BlocksContent) => {
    // Create a simple string representation of the content
    let plainText = '';

    if (answer && Array.isArray(answer)) {
      answer.forEach(block => {
        if (block.type === 'paragraph') {
          block.children.forEach(child => {
            if ("text" in child && child.text) {
              plainText += child.text + ' ';
            }
          });
          plainText += '\n';
        }
      });
    }
    return plainText.trim() || '';
  };

  return (
    <>
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {
              faqs.map((faq: FAQ) => {
                  return (
                    <div key={faq.id} className="bg-gray-700 p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold mb-2 flex items-center">
                        <FaQuestion className="text-violet-400 mr-2"/>
                        {faq.question}
                      </h3>
                      <div className="text-gray-300">
                        <BlocksRenderer content={faq.answer}/>
                      </div>
                    </div>
                  )
                }
              )
            }
          </div>
        </div>
      </section>
      <script type="application/ld+json">
        {
          JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": getAnswerPlainText(faq.answer)
                }
              }))
            }
          )
        }
      </script>
    </>
  );
}