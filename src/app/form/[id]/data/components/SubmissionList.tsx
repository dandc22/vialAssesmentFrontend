'use client'

import { FormSubmission } from '@/types/submission'

interface SubmissionListProps {
  submissions: FormSubmission[]
}

export default function SubmissionList({ submissions }: SubmissionListProps) {
  const formatAnswer = (answer: string) => {
    if (answer.includes('T00:00:00.000Z')) {
      return new Date(answer).toLocaleDateString()
    }
    return answer
  }

  return (
    <div className="space-y-8">
      {submissions.map((submission) => (
        <div key={submission.id} className="border rounded-lg p-4">
          <div className="border-b pb-2 mb-4">
            <p className="text-sm text-gray-500">Submission ID</p>
            <p className="text-gray-900">{submission.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Responses</p>
            <div className="space-y-2">
              {submission.sourceData.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-700">{item.question}</p>
                  <p className="text-gray-900">{formatAnswer(item.answer)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}