# Vision Lab Infrastructure

AWS CDK infrastructure for deploying Vision Lab to AWS.

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ installed
- AWS CDK CLI installed: `npm install -g aws-cdk`
- Route53 hosted zone for `aviralgarg.com` configured

## Setup

1. Install dependencies:
```bash
cd infrastructure
npm install
```

2. Build TypeScript:
```bash
npm run build
```

3. Bootstrap CDK (first time only):
```bash
cdk bootstrap
```

## Configuration

Domain configuration is set via:
1. `cdk.json` context (default: `visionlab.aviralgarg.com`)
2. Environment variables (`DOMAIN_NAME`, `HOSTED_ZONE_NAME`)
3. CDK app props

## Deployment

1. Ensure frontend is built:
```bash
cd ../frontend
npm run build
```

2. Deploy infrastructure:
```bash
cd ../infrastructure
cdk deploy
```

## Stack Components

- **S3 Bucket**: Frontend static hosting
- **CloudFront Distribution**: CDN with HTTPS
- **Route53 DNS**: Domain configuration
- **ACM Certificate**: SSL/TLS certificate
- **API Gateway HTTP API**: Backend API
- **Lambda Function**: Backend placeholder

## Outputs

After deployment, the stack outputs:
- `WebsiteURL`: https://visionlab.aviralgarg.com
- `ApiGatewayUrl`: Backend API endpoint
- `DistributionDomainName`: CloudFront domain

## Environment Variables

- `DOMAIN_NAME`: Domain name (default: `visionlab.aviralgarg.com`)
- `HOSTED_ZONE_NAME`: Route53 hosted zone (default: `aviralgarg.com`)
- `CDK_DEFAULT_ACCOUNT`: AWS account ID
- `CDK_DEFAULT_REGION`: AWS region (default: `us-west-2`)
- `ENVIRONMENT`: Environment name (default: `Production`)

## Notes

- Certificate is created in `us-east-1` (required for CloudFront)
- Frontend build is automatically deployed to S3 on stack deployment
- CloudFront invalidates cache on deployment

