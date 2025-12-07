# Troubleshooting Connection Issues

## Quick Fixes

### 1. Check if server is running
Open a new terminal and run:
```bash
cd apps/web
npm run dev
```

You should see:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
```

### 2. Port already in use?
If port 3000 is busy, Next.js will try 3001, 3002, etc.
Check the terminal output for the actual port.

### 3. Kill existing processes
If port 3000 is stuck:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

### 4. Clear Next.js cache
```bash
cd apps/web
rm -rf .next
npm run dev
```

### 5. Check for errors
Look in the terminal for:
- Compilation errors
- Missing dependencies
- Environment variable warnings

### 6. Try a different port
```bash
cd apps/web
PORT=3001 npm run dev
```

## Environment Variables (Optional)

The app works without these, but for full functionality you need:

Create `apps/web/.env.local`:
```
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

## Still Not Working?

1. **Check Node.js version**: Should be 18+ 
   ```bash
   node --version
   ```

2. **Reinstall dependencies**:
   ```bash
   cd apps/web
   rm -rf node_modules
   npm install
   npm run dev
   ```

3. **Check firewall**: Windows Firewall might be blocking localhost:3000

4. **Try accessing**: http://127.0.0.1:3000 instead of localhost:3000



