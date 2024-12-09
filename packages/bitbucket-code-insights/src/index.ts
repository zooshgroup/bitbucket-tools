import fetch from 'node-fetch';

import { createLogger } from 'utils/logger';
import { BitbucketAnnotation, BitbucketBuildBody, BitbucketReportBody } from './types';

const logger = createLogger('Bitbucket Code Insights');

function assertEnvVars() {
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME;
  const commitHash = process.env.BITBUCKET_COMMIT;
  const token = process.env.BITBUCKET_BUILD_TOKEN;

  if (!repoFullName || !commitHash || !token) {
    logger.error(
      `Environment variables BITBUCKET_REPO_FULL_NAME, BITBUCKET_COMMIT and BITBUCKET_BUILD_TOKEN must be set.`,
    );
    process.exit(1);
  }
}

async function callApi(url: string, method: string, body: any, token: string) {
  console.log(`Constructed API URL: ${url}`);

  try {
    console.log(`Sending ${method} request to Bitbucket API...`);
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`Received response with status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`API request failed. Status: ${response.status}, Message: ${errorText}`);
    }
    return response;
  } catch (err) {
    console.log(`Error while communicating with Bitbucket API.`);
    console.log(`Potential causes: 
    1. Incorrect API URL: ${url}.
    2. Environment variable, access token or permission issues - check README.
    3. Network issues or pipeline misconfiguration.`);
    console.log((err as Error).message);
    process.exit(1);
  }
}

export async function uploadAnnotationsToBitbucket(externalId: string, body: BitbucketAnnotation[]) {
  assertEnvVars();
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME ?? '';
  const commitHash = process.env.BITBUCKET_COMMIT ?? '';
  const token = process.env.BITBUCKET_BUILD_TOKEN ?? '';

  const url = `https://api.bitbucket.org/2.0/repositories/${repoFullName}/commit/${commitHash}/reports/${externalId}/annotations`;

  const response = await callApi(url, 'POST', body, token);
  if (response.ok) {
    logger.log(`Annotations uploaded successfully.`);
  }
}

export async function uploadReportToBitbucket(externalId: string, body: BitbucketReportBody) {
  assertEnvVars();
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME ?? '';
  const commitHash = process.env.BITBUCKET_COMMIT ?? '';
  const token = process.env.BITBUCKET_BUILD_TOKEN ?? '';

  const url = `https://api.bitbucket.org/2.0/repositories/${repoFullName}/commit/${commitHash}/reports/${externalId}`;

  const response = await callApi(url, 'PUT', body, token);
  if (response.ok) {
    logger.log(`Report uploaded successfully.`);
  }
}

export async function createBuildOnBitbucket(body: BitbucketBuildBody) {
  assertEnvVars();
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME ?? '';
  const commitHash = process.env.BITBUCKET_COMMIT ?? '';
  const token = process.env.BITBUCKET_BUILD_TOKEN ?? '';

  const url = `https://api.bitbucket.org/2.0/repositories/${repoFullName}/commit/${commitHash}/statuses/build`;

  const response = await callApi(url, 'POST', body, token);
  if (response.ok) {
    logger.log(`Build created successfully.`);
  }
}
