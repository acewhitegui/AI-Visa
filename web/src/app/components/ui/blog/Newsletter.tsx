"use client"
import React from "react";

export function Newsletter() {
  return (
    <section className="bg-indigo-50 rounded-lg p-8 text-center mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Stay updated with our latest articles, news, and tutorials. We&apos;ll never spam your inbox!
      </p>
      <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </section>
  )
}