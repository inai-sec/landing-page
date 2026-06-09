# InaiSec Landing Page

Standalone static marketing page for investors, grant reviewers, and design partners.

## Local preview

```bash
cd landing-page
npx serve . -l 4173
```

Then open `http://localhost:4173`.

Alternate marketing-page redesign: `http://localhost:4173/marketing.html`.

## Recommended deployment

Use **Vercel** first. It is the lowest-friction fit for this page:

- deploys this static directory directly
- gives preview URLs for investor/grant review
- supports HTTPS and custom domains without CloudFront setup
- can add a serverless function later for the design partner form

AWS is a good second step if you want everything under AWS:

- simplest static path: S3 + CloudFront + Route 53 + ACM
- managed path: AWS Amplify Hosting connected to the repo
- best when you already want AWS ownership, logging, WAF, or tighter infra control

## Vercel deployment

Set the Vercel project root to `landing-page`.

Build command: leave empty.

Output directory: `.`.

Install command: leave empty unless you want to use the `serve` dev dependency.

## AWS deployment

For S3 and CloudFront:

1. Upload the contents of `landing-page/` to an S3 static website bucket.
2. Put CloudFront in front of the bucket.
3. Attach an ACM certificate.
4. Point Route 53 to the CloudFront distribution.
5. Set `index.html` as the default root object.

For Amplify Hosting:

1. Connect the repo.
2. Set app root to `landing-page`.
3. Use no build command.
4. Use `.` as the output directory.

## Production form note

The current form opens a prefilled email draft to the founder. Before paid traffic, replace it with one of:

- Vercel Function writing to Loops, HubSpot, Airtable, or a CRM
- Formspree or Basin
- AWS Lambda + API Gateway + SES or DynamoDB

Keep the visible fields minimal: work email and short context.
