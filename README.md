# HR Newsletter System

A professional HR Newsletter management system for MicroLoan Foundation, built with Next.js, React, TypeScript, and SQLite.

## Features

- **Role-Based Access Control**: Staff see preview-only, HR/Admin can edit content
- **Database-Backed**: SQLite database for reliable data persistence
- **Modern UI**: Beautiful purple and gold branding matching organization colors
- **Complete CRUD Operations**: Add, edit, delete newsletter entries
- **Multiple Categories**: New Hires, Promotions, Transfers, Birthdays, Anniversaries, Events, Best Employee/Performer, Exiting Employees
- **Undo/Redo**: Full history tracking for safe editing
- **Comments System**: Internal notes on entries for collaboration
- **Export to PDF**: Print-ready newsletter export
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: SQLite (better-sqlite3)
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd hr-newsletter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project** (this will initialize the database)
   ```bash
   npm run build
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3019`
   - The database will be automatically created at `newsletter.db` in the project root

## Usage

### For Staff (Preview Mode)

1. Open the application
2. You'll see the newsletter in **Preview Mode** - read-only
3. No editing controls are visible

### For HR/Admin (Edit Mode)

1. Click the **"HR / Admin Login"** button in the header
2. Enter the passcode: `HR-ADMIN-2026`
3. You'll be switched to **Editor Mode** with full editing capabilities
4. Make your changes and click **Save** to persist to the database
5. Switch to **Preview** to see how staff will view the newsletter

## Database

The system uses SQLite database (`newsletter.db`) stored in the project root.

### Database Schema

- **newsletters**: Stores newsletter periods (month, year)
- **newsletter_entries**: Stores all newsletter content (employees, events)
- **entry_comments**: Stores comments on entries

### Backup

To backup your database:
```bash
# Copy the database file
cp newsletter.db newsletter_backup.db
```

To restore:
```bash
# Replace the database file
cp newsletter_backup.db newsletter.db
```

## Project Structure

```
hr-newsletter/
├── app/
│   ├── api/              # API routes for database operations
│   ├── page.tsx          # Main application page
│   └── globals.css       # Global styles
├── components/
│   ├── editor/           # Editor components
│   ├── preview/          # Preview components
│   └── ...               # Other UI components
├── hooks/
│   └── useNewsletterData.ts  # Data management hook
├── lib/
│   └── db.ts             # Database initialization and utilities
├── types/
│   └── newsletter.ts     # TypeScript type definitions
└── utils/
    └── constants.ts      # Constants and configuration
```

## API Endpoints

- `GET /api/newsletter?month={month}&year={year}` - Fetch newsletter data
- `POST /api/newsletter` - Save newsletter data
- `POST /api/newsletter/comments` - Add comment to entry

## Security Notes

- The current passcode is stored in `utils/constants.ts`
- For production, consider:
  - Moving passcode to environment variables
  - Implementing proper authentication (JWT, OAuth, etc.)
  - Adding rate limiting to API routes
  - Implementing proper user management

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Delete `newsletter.db` and restart the server (database will be recreated)
2. Check file permissions on the database file
3. Ensure no other process is using the database

### Port Already in Use

If port 3019 is already in use:
- Change the port in `package.json` scripts
- Or kill the process using port 3019

## Support

For issues or questions, contact your IT department or HR.

## License

Internal use only - MicroLoan Foundation
# hr-newsletter
# hr-newsletter
