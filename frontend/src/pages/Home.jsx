import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to the Learning Management System</h1>
        <p className="text-gray-600 mb-8">Your one-stop solution for managing courses, students, and resources.</p>
        <a href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          Get Started
        </a>
      </div>
    </div>
  )
}

export default Home