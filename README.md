# Cây Gia Phả Nguyễn - Family Genealogy Web App

A modern Vietnamese family genealogy web application built with Next.js, React, TypeScript, and React Flow. This application allows family members to view, search, and manage information about their family tree.

## 🌳 Features

- **Interactive Family Tree** - Visual representation of family relationships with zoom and pan capabilities
- **Person Profiles** - Detailed information about each family member
- **Search Functionality** - Find family members by name
- **Family Management** - Add, edit, and manage family member information
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Vietnamese Language Support** - UI and content in Vietnamese

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 16+ with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Visualization**: React Flow
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router routes
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout with header
│   ├── tree/           # Family tree page
│   ├── search/         # Search page
│   ├── people/[id]/    # Individual person profile
│   └── admin/          # Admin/management page
├── components/          # Shared UI components
│   ├── Header.tsx
│   └── FamilyTreeNode.tsx
├── features/            # Feature-specific components
│   ├── family-tree/    # Family tree components
│   ├── person/         # Person profile components
│   ├── search/         # Search feature components
│   └── admin/          # Admin feature components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   └── family-utils.ts
├── types/              # TypeScript types and interfaces
│   └── index.ts
└── data/               # Mock data
    └── mock-family.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd familytree-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the optimized production version:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## 📄 Pages and Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with introduction and feature overview |
| `/tree` | Interactive family tree visualization |
| `/people/[id]` | Individual person's profile and family relationships |
| `/search` | Search for family members |
| `/admin` | Management interface to add/edit members |

## 📊 Data Model

### Person Type
```typescript
interface Person {
  id: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string; // YYYY-MM-DD
  deathDate?: string;
  birthPlace?: string;
  biography?: string;
  avatarUrl?: string;
  fatherId?: string;
  motherId?: string;
  spouseIds: string[];
  childIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Design Features

- **Clean, Modern Layout** - Minimal and organized interface
- **Light Color Scheme** - Amber and slate colors for good readability
- **Responsive Components** - Works seamlessly on all screen sizes
- **Accessible Navigation** - Easy-to-use header and navigation
- **Visual Hierarchy** - Clear organization of information

## 📝 Mock Data

The application comes with sample Vietnamese family data for demonstration. This includes:

- Multiple generations (grandparents, parents, children)
- Family relationships (parents, spouses, children)
- Biographical information
- Birth and death dates

To modify the mock data, edit the file at `src/data/mock-family.ts`.

## 🔄 Form Validation

Forms use Zod for schema validation and React Hook Form for form state management:

- Required field validation
- Date format validation
- Optional field support
- Real-time error messages

## 🚦 Current Progress

✅ **Completed:**
- Project structure and setup
- TypeScript types definition
- Mock family data
- Home page
- Family tree page with React Flow
- Person profile pages
- Search functionality
- Admin/management interface with forms

## 📋 Next Steps / TODO

- [ ] Backend API integration
- [ ] Database setup (choose: PostgreSQL, MongoDB, etc.)
- [ ] User authentication
- [ ] Image upload for avatars
- [ ] Advanced filtering and sorting
- [ ] Export family tree as PDF
- [ ] Multiple language support
- [ ] Dark mode support
- [ ] Unit tests
- [ ] E2E tests
- [ ] Deployment

## 🎯 Future Enhancements

- **Advanced Search** - Filter by age, birthplace, etc.
- **Relationship Mapping** - Visual connections between family members
- **Timeline View** - Historical view of family events
- **Photo Gallery** - Family photo collection
- **Statistical Analysis** - Family statistics and insights
- **Multi-user Support** - Role-based access control
- **Activity Feed** - Track changes and updates

## 📄 License

This project is created for personal/family use.

## 👨‍💻 Development Notes

- Uses Next.js 16+ with Turbopack for fast builds
- TypeScript strict mode enabled
- Tailwind CSS for styling
- ESLint configured for code quality
- Git initialized and ready for version control

## 🤝 Contributing

This is a family project. Contributions are welcome to improve features and functionality.

## 📧 Support

For issues or suggestions, please create an issue or contact the project maintainer.

