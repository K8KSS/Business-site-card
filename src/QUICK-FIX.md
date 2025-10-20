# ⚡ QUICK FIX GUIDE

## 🎯 Error: "Failed to resolve import @radix-ui/react-slot@1.1.2"

### ✅ SOLUTION:

**This has been FIXED!** All import statements in UI components have been corrected.

**What to do:**
1. **Refresh browser** (if server is running)
2. Or **restart server**: `npm run dev`

**Why it happened:**
- Import statements had version numbers (wrong syntax)
- Changed from: `"@radix-ui/react-slot@1.1.2"`
- To correct: `"@radix-ui/react-slot"`

See: **FIX-IMPORT-ERROR.txt** for details

---

## 🎯 Error: "ERESOLVE unable to resolve dependency tree"

### ✅ SOLUTION (2 methods):

**Method 1 - Use Alternative Installer (Recommended):**

1. **Find and run:**
   ```
   install-alternative.bat
   ```

2. **Wait 2-5 minutes**

3. **Done!** Project installed

---

**Method 2 - Manual Command Line:**

Open Command Prompt in project folder and run:

```bash
npm cache clean --force
npm install --legacy-peer-deps
npm run setup
npm run dev
```

---

## 🎯 Error: "Missing script: setup"

### ✅ SOLUTION (1 minute):

1. **Find and run:**
   ```
   INSTALL-NOW.bat
   ```

2. **Wait 2-5 minutes**

3. **Done!** Project installed

---

## 🖥️ Alternative Manual Solution

### Open CMD in project folder:

**Method 1:**
1. Open project folder in File Explorer
2. Click on address bar
3. Type: `cmd`
4. Press Enter

**Method 2:**
1. Open project folder
2. Shift + Right-click on empty space
3. "Open PowerShell window here"

### Then run commands:

```cmd
REM 1. Clean cache
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json

REM 2. Install with legacy peer deps
npm install --legacy-peer-deps

REM 3. Create database
node server/setup-db.js

REM 4. Start project
npm run dev
```

---

## 🔍 Check if you're in the right folder

Make sure you're in the project directory:

```cmd
dir
```

You should see:
- ✅ package.json
- ✅ App.tsx
- ✅ server/ folder
- ✅ components/ folder

If these files are NOT there - you're in the wrong folder!

---

## 💡 Why errors occur?

### Cause #1: Dependency version conflict
**Solution:** Run `install-alternative.bat`

### Cause #2: npm cache corrupted
**Solution:** `npm cache clean --force`

### Cause #3: Wrong directory
**Solution:** Navigate to correct project folder

### Cause #4: package.json damaged
**Solution:** Re-download project

---

## 🎬 What install-alternative.bat does:

```
1. ✅ Checks package.json exists
2. ✅ Cleans npm cache
3. 🗑️ Removes old installations
4. 📥 Installs with --legacy-peer-deps
5. 🗄️ Creates database
6. ✅ Ready to use!
```

---

## ⚠️ Common Errors

### ❌ "npm is not recognized"
**Cause:** Node.js not installed  
**Solution:** https://nodejs.org/ → download LTS → install → restart PC

### ❌ "Access denied"
**Cause:** No administrator rights  
**Solution:** Right-click on .bat file → "Run as administrator"

### ❌ "Network timeout"
**Cause:** Slow internet or firewall blocking  
**Solution:** Wait or disable antivirus temporarily

### ❌ "ERESOLVE unable to resolve"
**Cause:** Package version conflicts  
**Solution:** Use `npm install --legacy-peer-deps`

---

## 📞 If scripts don't help

Run in CMD:

```cmd
echo %CD%
dir package.json
node --version
npm --version
npm install --legacy-peer-deps
```

Copy the output and send to developer.

---

## ✨ After Installation

Start project:
```cmd
npm run dev
```

Open in browser:
```
http://localhost:5173
```

Admin panel access:
1. Click logo 3 times
2. Password: `admin`

---

## 🚀 Available Installation Scripts

| Script | Description |
|--------|-------------|
| `INSTALL-NOW.bat` | Main installer (automatic) |
| `install-alternative.bat` | Uses --legacy-peer-deps flag |
| `install-fix.bat` | Fixes common issues |
| `diagnose.bat` | Shows what's wrong |

---

**The `install-alternative.bat` file solves 99% of dependency issues!**

🎵 **Good luck!**
