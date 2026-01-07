# Environment Variable Setup

## ✅ Admin Passcode Configuration

Your `.env.local` file should contain:
```
ADMIN_PASSCODE=HR-ADMIN-2026
```

**Important Notes:**
1. **No quotes needed** - Just: `ADMIN_PASSCODE=HR-ADMIN-2026`
2. **No spaces** around the `=` sign
3. **Restart dev server** after changing `.env.local`:
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## 🔍 Troubleshooting Login Issues

If login is failing:

1. **Check `.env.local` format:**
   ```
   ADMIN_PASSCODE=HR-ADMIN-2026
   ```
   (No quotes, no spaces around =)

2. **Restart your dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Verify API endpoint:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try logging in
   - Check `/api/admin-auth` request
   - Look at the response

4. **Check server logs:**
   - Look at terminal where `npm run dev` is running
   - Check for any error messages

## 🔐 Security

- `.env.local` is in `.gitignore` - never commit it
- Passcode is validated server-side only
- Client never sees the actual passcode value





