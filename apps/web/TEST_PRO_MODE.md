# 🧪 ALIGN Pro Test Mode

## Quick Start

### Option 1: URL Parameter (Easiest)
Add `?testPro=true` to your URL:
```
http://localhost:3000?testPro=true
```

This will:
- Enable test mode
- Show "Test Pro" button in header
- Allow you to toggle Pro on/off

### Option 2: Manual Enable
1. Open browser console
2. Run:
```javascript
localStorage.setItem('align_test_mode', 'true');
location.reload();
```

3. You'll see "Test Pro" button in header
4. Click it to enable Pro mode

---

## Testing Pro Features

Once Pro is enabled, you can test:

### 1. **Plan Builder**
- Go to: `/pro/create-plan`
- Or click "Unlock My Plan" in chat
- Fill out the 5-step wizard
- Generate a 30-day plan

### 2. **Dashboard**
- Go to: `/pro/dashboard?planId=<plan-id>`
- View progress, daily tasks, milestones

### 3. **Daily Tasks**
- Go to: `/pro/day/1?planId=<plan-id>`
- View task details
- Mark as completed

### 4. **Weekly Reviews**
- Go to: `/pro/weekly-review?planId=<plan-id>&week=1`
- Generate AI-powered weekly review

### 5. **Save Routine**
- In chat, after Action mode response
- "Save routine" button should be active (no lock icon)

---

## Test Controls

When test mode is enabled, you'll see a button in the header:

- **"Test Pro"** (green) - Click to enable Pro mode
- **"Pro ✓"** (red) - Click to disable Pro mode

---

## Reset Test Mode

To disable test mode:
```javascript
localStorage.removeItem('align_test_mode');
localStorage.removeItem('align_subscription');
location.reload();
```

---

## Notes

- Test mode uses localStorage (not real subscriptions)
- Pro status persists until you disable it
- All Pro features are accessible in test mode
- No payment required for testing

---

**Ready to test!** 🚀


