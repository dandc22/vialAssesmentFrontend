'use client'

import Link from 'next/link'
import { FormList } from './components/FormList'

export default function FormsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Forms</h1>
          <Link
            href="/form/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Form
          </Link>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <FormList />
        </div>
      </div>
    </div>
  )
}