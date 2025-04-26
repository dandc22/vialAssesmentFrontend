'use client'

import { useDraggable } from '@dnd-kit/core'

interface DraggableItemProps {
  id: string
  type: string
}

function DraggableItem({ id, type }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 mb-2 bg-white rounded-md shadow-sm border border-gray-200 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={style}
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">{type}</span>
      </div>
    </div>
  )
}

export default function InputTypeMenu() {
  const inputTypes = [
    { id: 'new-text', type: 'Text' },
    { id: 'new-password', type: 'Password' },
    { id: 'new-number', type: 'Number' },
  ]

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Input Types</h2>
      <div>
        {inputTypes.map((input) => (
          <DraggableItem key={input.id} id={input.id} type={input.type} />
        ))}
      </div>
    </div>
  )
}