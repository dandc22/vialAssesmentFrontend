export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="flex-1 bg-white rounded-lg shadow-lg min-h-[600px] p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}