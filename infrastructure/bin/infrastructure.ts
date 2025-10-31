#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

// Configuration: Prioritizes cdk.json context, then environment variables, then defaults
const siteDomain = process.env.DOMAIN_NAME 
  || app.node.tryGetContext('domainName') 
  || 'visionlab.aviralgarg.com';

const hostedZoneName = process.env.HOSTED_ZONE_NAME 
  || app.node.tryGetContext('hostedZoneName') 
  || 'aviralgarg.com';

new InfrastructureStack(app, 'VisionLabHostingStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
  },
  domainName: siteDomain,
  hostedZoneName: hostedZoneName,
  description: `Stack for Vision Lab application (${siteDomain}), deployed to ${process.env.CDK_DEFAULT_REGION || 'us-west-2'}`,
  tags: {
    Project: 'VisionLab',
    Environment: process.env.ENVIRONMENT || 'Production',
    Domain: siteDomain,
  },
});

