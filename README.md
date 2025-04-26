# Form Builder Application

A Next.js application that allows users to create, manage, and collect data from custom forms. Built with modern web technologies, this application provides a drag-and-drop interface for form creation and a robust system for managing form submissions.

## Features

- **Dynamic Form Builder**: Drag-and-drop interface to create custom forms
- **Multiple Input Types**: Support for various form field types
- **Form Management**: View and manage all created forms
- **Data Collection**: Collect and view form submissions
- **Responsive Design**: Works seamlessly across different devices

## Tech Stack

- **Framework**: Next.js 15.3.1 with TypeScript
- **UI Components**: React 19
- **Styling**: Tailwind CSS
- **Drag and Drop**: @dnd-kit library
- **Development Tools**: ESLint, TypeScript

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

For development:
```bash
npm run dev
```
This will start the development server with Turbopack enabled.

For production:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Creating a Form**
   - Navigate to the "New Form" page
   - Drag input types from the right menu into the form preview area
   - Arrange fields in desired order
   - Set form name and save

2. **Managing Forms**
   - View all created forms in the forms list
   - Access individual forms to view or collect submissions

3. **Viewing Submissions**
   - Navigate to a form's data page to view all submissions
   - Access detailed submission information

## Project Structure

```
src/
  app/
    form/
      new/             # Form creation
      [id]/           # Form viewing
        data/         # Form submissions
    forms/           # Forms list
    api/            # API routes
  types/           # TypeScript definitions
