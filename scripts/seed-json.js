const fs = require('fs');
const path = require('path');

const seed = {
  newsletters: [
    { id: 1, month: 'January', year: '2026', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  newsletter_entries: [
    {
      id: 1,
      newsletter_id: 1,
      category: 'new_hires',
      entry_type: 'employee',
      name: 'Alice Example',
      position: 'Software Engineer',
      department: 'Engineering',
      date: '2026-01-05',
      achievement: 'Joined the backend team',
      photo_url: 'https://images.example.com/alice.jpg',
      entry_order: 10
    },
    {
      id: 2,
      newsletter_id: 1,
      category: 'promotions',
      entry_type: 'employee',
      name: 'Bob Example',
      position: 'Senior PM',
      department: 'Products',
      date: '2026-01-15',
      achievement: 'Promoted from PM to Senior PM',
      photo_url: '/assets/bob.png',
      entry_order: 20
    },
    {
      id: 3,
      newsletter_id: 1,
      category: 'transfers',
      entry_type: 'employee',
      name: 'Chris Example',
      position: 'Analyst',
      department: 'Finance',
      date: '2026-01-20',
      photo_url: 'javascript:alert(1)',
      entry_order: 30
    }
  ],
  entry_comments: [
    { id: 1, entry_id: 1, user: 'Admin', content: 'Welcome to the team, Alice!', created_at: new Date().toISOString() }
  ],
  _newsId: 2,
  _entryId: 4,
  _commentId: 2
};

const out = path.join(process.cwd(), 'newsletter.seed.json');
fs.writeFileSync(out, JSON.stringify(seed, null, 2));
console.log('Wrote seed file:', out);
