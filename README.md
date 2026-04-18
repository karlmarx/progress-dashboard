# Progress Dashboard

Real-time status dashboard for parallel work (photo-memory, MLX-VLM, Google Account Migration).

## Setup

1. Create `.env.local` with GitHub OAuth:
   ```
   GITHUB_ID=<your_app_id>
   GITHUB_SECRET=<your_app_secret>
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generated_secret>
   EMAIL_USER=<gmail>
   EMAIL_PASS=<app_password>
   ```

2. Run: `npm run dev`

3. Visit: http://localhost:3000

## Deploy to Vercel

```bash
vercel --prod
```

Then add `GITHUB_*`, `NEXTAUTH_*`, `EMAIL_*` env vars in Vercel dashboard.
