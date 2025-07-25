# Vercel Deployment Guide for Rockdrill

This guide provides step-by-step instructions to deploy the Rockdrill React application to Vercel using their CLI.

## Prerequisites

✅ **Completed Setup:**
- Vercel CLI is available via `npx vercel`
- Build process tested and working (`npm run build`)
- `vercel.json` configuration file created
- All code committed and pushed to GitHub

## Deployment Steps

### 1. Login to Vercel

Run the following command and follow the prompts:

```bash
npx vercel login
```

**Choose your preferred login method:**
- **Recommended**: "Continue with GitHub" (since your code is on GitHub)
- Follow the browser authentication flow
- Grant necessary permissions to Vercel

### 2. Initialize Vercel Project

```bash
npx vercel
```

**Configuration Prompts:**
- **Set up and deploy**: Choose "Yes"
- **Which scope**: Select your personal account or team
- **Link to existing project**: Choose "No" (first deployment)
- **Project name**: Accept default "rockdrill" or customize
- **Directory**: Accept default "./" (current directory)
- **Override settings**: Choose "No" (use vercel.json config)

### 3. Deploy to Production

After the initial setup, deploy to production:

```bash
npx vercel --prod
```

This will:
- Build your application using `npm run build`
- Upload the `dist` folder to Vercel
- Provide you with a production URL

## Configuration Details

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Key Features:**
- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Asset Caching**: Static assets cached for 1 year
- **Vite Framework**: Optimized for Vite build process
- **Production Environment**: Sets NODE_ENV to production

### Environment Variables (Optional)

If you need to set environment variables:

1. **Via Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add variables like `REACT_APP_API_BASE_URL`

2. **Via CLI:**
   ```bash
   npx vercel env add REACT_APP_API_BASE_URL
   ```

## Build Verification

### Local Build Test
```bash
npm run build
npm run preview
```

**Expected Output:**
- ✅ Build completes successfully
- ✅ `dist` folder contains optimized files
- ✅ Preview server runs without errors

### Build Assets
- `dist/index.html` - Main HTML file
- `dist/assets/` - Optimized CSS and JS bundles
- `dist/favicon.ico` - Application icon

## Deployment Commands Reference

### Initial Deployment
```bash
# Login to Vercel
npx vercel login

# Initialize and deploy
npx vercel

# Deploy to production
npx vercel --prod
```

### Subsequent Deployments
```bash
# Deploy latest changes
npx vercel --prod
```

### Project Management
```bash
# List projects
npx vercel ls

# Get project info
npx vercel inspect

# View deployment logs
npx vercel logs
```

## Expected Results

### Successful Deployment
After running `npx vercel --prod`, you should see:

```
✅ Production: https://rockdrill-xyz.vercel.app [copied to clipboard]
📝 Deployed to production. Run `vercel --prod` to overwrite later.
```

### Application Features
Your deployed application will include:
- 🔐 **Authentication System**: Login/register forms
- 📊 **Lead Management**: CSV import/export functionality
- 🎯 **Campaign Builder**: Email automation tools
- 📈 **Analytics Dashboard**: Metrics and charts
- 📧 **Email Templates**: Variable-based templates
- 🎨 **Responsive UI**: Mobile-optimized design

## Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Routing Issues:**
- Ensure `vercel.json` includes SPA rewrites
- Check that all routes use client-side routing

**Environment Variables:**
- Prefix React env vars with `REACT_APP_`
- Set variables in Vercel dashboard
- Redeploy after adding env vars

**CSS Warnings:**
- Template literal warnings in CSS are non-critical
- Build still succeeds with these warnings

### Vercel CLI Issues
```bash
# Update Vercel CLI
npm i -g vercel@latest

# Clear Vercel cache
npx vercel logout
npx vercel login
```

## Post-Deployment Steps

### 1. Test Deployment
- ✅ Visit the production URL
- ✅ Test authentication flows
- ✅ Verify all pages load correctly
- ✅ Check responsive design on mobile

### 2. Custom Domain (Optional)
```bash
# Add custom domain
npx vercel domains add yourdomain.com
```

### 3. SSL Certificate
- ✅ Automatically provided by Vercel
- ✅ HTTPS enforced by default

### 4. Performance Monitoring
- View analytics in Vercel dashboard
- Monitor Core Web Vitals
- Check deployment frequency

## Integration with Backend

### API Configuration
When you have a backend API:

1. **Update Environment Variables:**
   ```bash
   npx vercel env add REACT_APP_API_BASE_URL
   # Enter: https://your-api-domain.com/api
   ```

2. **CORS Configuration:**
   - Add your Vercel domain to backend CORS settings
   - Include both preview and production URLs

3. **Authentication:**
   - Ensure JWT tokens work across domains
   - Configure secure cookie settings if needed

## Continuous Deployment

### GitHub Integration
1. Connect your GitHub repository in Vercel dashboard
2. Enable automatic deployments on push to main
3. Configure branch deployments for staging

### Automatic Deployments
- **Main Branch**: Deploys to production
- **Feature Branches**: Creates preview deployments
- **Pull Requests**: Generates preview URLs

## Security Considerations

### Environment Variables
- Never commit sensitive data to Git
- Use Vercel environment variables for secrets
- Prefix client-side vars with `REACT_APP_`

### HTTPS
- ✅ Enforced by default
- ✅ Automatic SSL certificates
- ✅ HTTP redirects to HTTPS

## Next Steps

1. **Complete the deployment** using the commands above
2. **Test the live application** thoroughly
3. **Set up custom domain** if desired
4. **Configure backend integration** when ready
5. **Set up monitoring and analytics**

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router with Vercel](https://vercel.com/guides/deploying-react-with-vercel)

Your Rockdrill application is now ready for production deployment! 🚀
