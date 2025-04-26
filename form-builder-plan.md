# Form Builder Implementation Plan

## Overview
Create a drag-and-drop form builder interface that allows users to:
- Drag input types from a right-side menu
- Drop them into a form preview area
- Reorder form fields
- Set a form name

## Technical Stack
- Next.js with TypeScript
- Tailwind CSS for styling
- @dnd-kit for drag and drop functionality

## Component Structure
```
src/
  app/
    form/
      new/
        page.tsx
        components/
          FormBuilder.tsx
          InputTypeMenu.tsx
          FormPreview.tsx
          DraggableInput.tsx
```

## State Management
```typescript
interface FormField {
  id: string;
  type: 'text' | 'password' | 'number';
  label: string;
  order: number;
}

interface FormState {
  name: string;
  fields: FormField[];
}
```

## Implementation Phases

### Phase 1: Basic Layout
- Create two-panel layout
- Implement responsive design with Tailwind
- Add form name input field

### Phase 2: Drag & Drop Setup
- Install @dnd-kit dependencies
- Configure DndContext
- Create basic draggable components

### Phase 3: Input Types Menu
- Create right panel with available input types
- Implement draggable input type components
- Add visual feedback for drag interactions

### Phase 4: Form Preview Area
- Create droppable form area
- Implement field placement logic
- Add field reordering functionality

### Phase 5: Field Customization
- Add field labels
- Implement field type-specific properties
- Add field deletion capability

## Libraries to Install
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities