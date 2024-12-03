import { lookup } from 'dns';
import fetch from 'node-fetch';
import fs from 'fs';
import { HttpProxyAgent } from 'http-proxy-agent';

import { createLogger } from 'utils/logger';
import { BitbucketAnnotation, BitbucketReportBody } from './types';

const logger = createLogger('Bitbucket Code Insights');

async function lookupAddress(address: string): Promise<string> {
  logger.log(`Attempting to resolve address: ${address}`);
  return new Promise((resolve, reject) => {
    lookup(address, (err) => {
      if (err) {
        const errorMessage = `Unable to resolve ${address}. 
          You may need to add the "--add-host=host.docker.internal:host-gateway" option to your Bitbucket Pipeline configuration.`;
        logger.error(errorMessage);
        reject(new Error(errorMessage));
      }
      logger.log(`Successfully resolved address: ${address}`);
      resolve(address);
    });
  });
}

function isRunningInDocker(): boolean {
  try {
    const cgroupContent = fs.existsSync('/proc/1/cgroup') ? fs.readFileSync('/proc/1/cgroup', 'utf8') : '';
    const isCgroupDocker = cgroupContent.includes('docker');
    const isDockerenvPresent = fs.existsSync('/.dockerenv');
    const isDockerinitPresent = fs.existsSync('/.dockerinit');
    const mountinfoContent = fs.existsSync('/proc/1/mountinfo') ? fs.readFileSync('/proc/1/mountinfo', 'utf8') : '';
    const isMountinfoDocker = mountinfoContent.includes('/var/lib/docker/');
    const isDocker = isCgroupDocker || isDockerenvPresent || isDockerinitPresent || isMountinfoDocker;
    return isDocker;
  } catch (err) {
    logger.error(
      'Failed to determine if running in Docker. Proceeding with localhost as the default proxy address.',
      (err as Error).message,
    );
    return false;
  }
}

function assertEnvVars() {
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME;
  const commitHash = process.env.BITBUCKET_COMMIT;

  if (!repoFullName || !commitHash) {
    logger.error(
      `Environment variables BITBUCKET_REPO_FULL_NAME and BITBUCKET_COMMIT must be set. If you are running this script in Docker, check the README for setup.`,
    );
    process.exit(1);
  }
}

async function callApi(url: string, method: string, body: any) {
  logger.log(`Constructed API URL: ${url}`);

  const bitbucketProxyAddress = 'localhost';
  const bitbucketProxyPort = 29418;

  let proxyAddress = bitbucketProxyAddress;
  const isRunningInDockerContainer = isRunningInDocker();
  logger.log(`Running in Docker container: ${isRunningInDockerContainer}`);

  if (isRunningInDockerContainer) {
    proxyAddress = 'host.docker.internal';
    try {
      await lookupAddress(proxyAddress);
    } catch (err) {
      logger.error(`Failed to resolve Docker proxy address: ${proxyAddress}`);
      logger.error((err as Error).message);
      process.exit(1);
    }
  }

  logger.log(`Using proxy address: ${proxyAddress}:${bitbucketProxyPort}`);

  try {
    logger.log(`Sending ${method} request to Bitbucket API...`);
    const response = await fetch(url, {
      agent: new HttpProxyAgent(`http://${proxyAddress}:${bitbucketProxyPort}`),
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    logger.log(`Received response with status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`API request failed. Status: ${response.status}, Message: ${errorText}`);
    }
    return response;
  } catch (err) {
    logger.error(`Error while communicating with Bitbucket API.`);
    logger.error(`Potential causes: 
    1. Proxy server is not running or unreachable at ${proxyAddress}:${bitbucketProxyPort}.
    2. Incorrect API URL: ${url}.
    3. Network issues or pipeline misconfiguration.`);
    logger.error((err as Error).message);
    process.exit(1);
  }
}

export async function uploadAnnotationsToBitbucket(externalId: string, body: BitbucketAnnotation[]) {
  assertEnvVars();
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME;
  const commitHash = process.env.BITBUCKET_COMMIT;

  const url = `http://api.bitbucket.org/2.0/repositories/${repoFullName}/commit/${commitHash}/reports/${externalId}/annotations`;

  const response = await callApi(url, 'POST', body);
  if (response.ok) {
    logger.log(`Annotations uploaded successfully.`);
  }
}

export async function uploadReportToBitbucket(externalId: string, body: BitbucketReportBody) {
  assertEnvVars();
  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME;
  const commitHash = process.env.BITBUCKET_COMMIT;

  const url = `http://api.bitbucket.org/2.0/repositories/${repoFullName}/commit/${commitHash}/reports/${externalId}`;

  const response = await callApi(url, 'PUT', body);
  if (response.ok) {
    logger.log(`Report uploaded successfully.`);
  }
}
