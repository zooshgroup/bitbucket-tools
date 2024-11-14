import { lookup } from 'dns';
import fetch from 'node-fetch';
import fs from 'fs';
import { HttpProxyAgent } from 'http-proxy-agent';
import { BitbucketReportBody } from './types';
import { createLogger } from 'utils/logger';

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
    const cgroupContent = fs.readFileSync('/proc/self/cgroup', 'utf8');
    const isDocker = cgroupContent.includes('docker') || fs.existsSync('/.dockerenv') || fs.existsSync('/.dockerinit');
    return isDocker;
  } catch (err) {
    logger.error(
      'Failed to determine if running in Docker. Proceeding with localhost as the default proxy address.',
      (err as Error).message
    );
    return false;
  }
}

async function uploadReportToBitbucket(externalId: string, body: BitbucketReportBody) {
  const bitbucketProxyAddress = 'localhost';
  const bitbucketProxyPort = 29418;

  const repoFullName = process.env.BITBUCKET_REPO_FULL_NAME;
  const commitHash = process.env.BITBUCKET_COMMIT;

  if (!repoFullName || !commitHash) {
    logger.error(
      `Environment variables BITBUCKET_REPO_FULL_NAME and BITBUCKET_COMMIT must be set. If you are running this script in Docker, check the README for setup.`
    );
    process.exit(1);
  }

  const url = `http://api.bitbucket.org/2.0/repositories/${repoFullName}/commit/${commitHash}/reports/${externalId}`;
  logger.log(`Constructed API URL: ${url}`);

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

  let response;
  try {
    logger.log(`Sending PUT request to Bitbucket API...`);
    response = await fetch(url, {
      agent: new HttpProxyAgent(`http://${proxyAddress}:${bitbucketProxyPort}`),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    logger.log(`Received response with status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`API request failed. Status: ${response.status}, Message: ${errorText}`);
    } else {
      logger.log(`Report uploaded successfully.`);
    }
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

export default uploadReportToBitbucket;
