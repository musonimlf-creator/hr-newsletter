# Quick Start Guide - HR Newsletter System

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

The database will be **automatically created** when you first access the app!

### Step 3: Open Your Browser
Navigate to: **http://localhost:3019**

### Step 4: Test the System

#### As Staff (Preview Mode):
- You'll see the newsletter in **read-only preview mode**
- No editing buttons visible
- Perfect for viewing content

#### As HR/Admin (Edit Mode):
1. Click **"HR / Admin Login"** button (top right)
2. Enter passcode: `HR-ADMIN-2026`
3. You'll now see **Editor Mode** with all controls
4. Add test data:
   - Click "Add" on any section
   - Fill in employee/event details
   - Click **"Save"** to store in database
5. Switch to **Preview** to see how staff will view it

## 📊 Database Location

The SQLite database is stored at:
```
hr-newsletter/newsletter.db
```

**Backup**: Simply copy this file to backup your data!

## ✅ What's Working

- ✅ SQLite database (persistent storage)
- ✅ Role-based access (Staff = Preview, HR = Edit)
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Undo/Redo functionality
- ✅ Comments on entries
- ✅ Export to PDF
- ✅ Beautiful purple/gold branding
- ✅ Responsive design

## 🧪 Test with Real Data

Try adding:
- **New Hires**: John Doe, Software Developer, IT Department
- **Promotions**: Jane Smith, Senior Manager, Operations
- **Events**: Company Meeting, 2026-02-15, "Quarterly Review"
- **Best Employee**: Select someone with an achievement

All data is saved to the SQLite database and persists between sessions!

## 🔧 Troubleshooting

**Database not found?**
- The database is created automatically on first API call
- Check that the app has write permissions in the project folder

**Port 3019 in use?**
- Change port in `package.json` scripts
- Or: `npm run dev -- -p 3020`

**Need to reset?**
- Delete `newsletter.db` file
- Restart server (database recreates automatically)

## 📝 Next Steps

1. **Test with real content** - Add actual newsletter entries
2. **Share with staff** - They can view preview at the same URL
3. **Backup database** - Copy `newsletter.db` regularly
4. **Customize passcode** - Edit `utils/constants.ts` if needed

---

**Ready to use!** The system is production-ready for your organization. 🎉

