import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import * as path from 'path';

export interface InfrastructureStackProps extends cdk.StackProps {
  /**
   * Domain name for the application (e.g., visionlab.aviralgarg.com)
   * Defaults to environment variable DOMAIN_NAME or 'visionlab.aviralgarg.com'
   */
  domainName?: string;
  
  /**
   * Hosted zone name (e.g., aviralgarg.com)
   * Defaults to environment variable HOSTED_ZONE_NAME or 'aviralgarg.com'
   */
  hostedZoneName?: string;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfrastructureStackProps) {
    super(scope, id, props);

    // Get configuration from props or environment variables with sensible defaults
    const domainName = props?.domainName || process.env.DOMAIN_NAME || 'visionlab.aviralgarg.com';
    const hostedZoneName = props?.hostedZoneName || process.env.HOSTED_ZONE_NAME || 'aviralgarg.com';

    // Backend Lambda - simple placeholder
    const backendLambda = new lambda.Function(this, 'BackendLambda', {
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      description: 'Vision Lab backend API handler - Placeholder',
      environment: {
        ENVIRONMENT: process.env.ENVIRONMENT || 'Production',
      },
    });

    // API Gateway HTTP API
    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: 'VisionLabHttpApi',
      description: 'HTTP API for Vision Lab backend',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [
          apigwv2.CorsHttpMethod.OPTIONS,
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
        ],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(1),
      },
    });

    const lambdaIntegration = new HttpLambdaIntegration('LambdaIntegration', backendLambda);
    
    // Add hello route
    httpApi.addRoutes({
      path: '/hello',
      methods: [apigwv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    // S3 bucket for frontend hosting
    const websiteBucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: `visionlab-frontend-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Route53 hosted zone lookup
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: hostedZoneName,
    });

    // Certificate for HTTPS (must be in us-east-1 for CloudFront)
    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName: domainName,
      hostedZone: hostedZone,
      region: 'us-east-1',
    });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domainName],
      certificate: certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Deploy frontend to S3
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../frontend/dist'))],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });

    // Route53 DNS record
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: httpApi.apiEndpoint,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${domainName}`,
      description: 'Website URL',
    });
  }
}

