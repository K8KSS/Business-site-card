# 🚀 Edge Functions Deployment Guide

## Quick Start

Run the deployment script:
```bash
DEPLOY_EDGE_FUNCTIONS.bat
```

## What This Does

1. ✅ Checks if Supabase CLI is installed
2. 🔐 Logs you into Supabase (if needed)
3. 🔗 Links your local project to Supabase Cloud
4. 📤 Deploys the Edge Function `make-server-322de762`

## Prerequisites

### Install Supabase CLI

Choose one option:

**Option 1: Using Scoop (Recommended for Windows)**
```bash
scoop install supabase
```

**Option 2: Using npm**
```bash
npm install -g supabase
```

**Option 3: Direct Download**
Download from: https://github.com/supabase/cli/releases

## Step-by-Step Process

### 1. Run the Deploy Script

Double-click `DEPLOY_EDGE_FUNCTIONS.bat` or run:
```bash
DEPLOY_EDGE_FUNCTIONS.bat
```

### 2. Authorization (First Time Only)

If not logged in, the script will:
- Open your browser
- Ask you to authorize with Supabase
- Provide an access token
- Paste the token back in the command prompt

### 3. Link to Project

The script automatically links to project:
```
Project ID: oqazxfewxttctehgftuy
```

### 4. Deploy Function

The Edge Function will be deployed and available at:
```
https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762
```

## Testing Deployment

### Health Check

Visit this URL to check if deployment succeeded:
```
https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T..."
}
```

### Test with Website

After successful deployment:
1. Run `START.bat`
2. Choose option `2` (Run development server)
3. Open http://localhost:5173
4. Try admin features (should work without 404 errors)

## Troubleshooting

### Error: "Supabase CLI not installed"

Install Supabase CLI using one of the methods above, then try again.

### Error: "Authorization failed"

1. Make sure you have access to the Supabase project
2. Check your internet connection
3. Try logging in manually:
   ```bash
   supabase login
   ```

### Error: "Project linking failed"

Check that the Project ID is correct:
```
oqazxfewxttctehgftuy
```

You can find your Project ID in Supabase Dashboard → Project Settings → General

### Error: "Deployment failed"

Possible causes:
1. Missing files in `/supabase/functions/server/`
2. Syntax errors in Edge Function code
3. Network issues
4. Insufficient permissions

Check the deployment logs for specific error messages.

## Manual Deployment (Alternative)

If the bat script doesn't work, you can deploy manually:

### 1. Login
```bash
supabase login
```

### 2. Link Project
```bash
supabase link --project-ref oqazxfewxttctehgftuy
```

### 3. Deploy
```bash
supabase functions deploy make-server-322de762 --project-ref oqazxfewxttctehgftuy
```

## After Successful Deployment

✅ The HTTP 404 errors in admin panel will be fixed
✅ Photo upload will work correctly
✅ All admin features will function properly
✅ The website can be deployed to Netlify/Vercel

## Files Deployed

The deployment includes these files:
```
/supabase/functions/server/
├── index.tsx          - Main Edge Function handler
├── init-demo-data.tsx - Demo data initialization
└── kv_store.tsx       - Key-value storage utilities
```

## Environment Variables

The Edge Function uses these Supabase environment variables (automatically configured):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

No manual configuration needed!

## Next Steps

After deployment:
1. ✅ Test admin panel functionality
2. ✅ Upload test photos
3. ✅ Deploy website to Netlify/Vercel
4. ✅ Set up custom domain (optional)

## Support

If you encounter issues:
1. Check `/supabase/functions/server/` files exist
2. Review Supabase Dashboard → Edge Functions section
3. Check function logs in Supabase Dashboard
4. Ensure you have Owner/Admin access to the project

---

**Last Updated:** October 22, 2025
**Project ID:** oqazxfewxttctehgftuy
**Function Name:** make-server-322de762
