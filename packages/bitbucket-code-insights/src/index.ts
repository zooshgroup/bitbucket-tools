import fetch from 'node-fetch'
import fs from 'fs';
import { HttpProxyAgent } from 'http-proxy-agent';
import { BitbucketReportBody } from "./types"

async function uploadReportToBitbucket(externalId: string, body: BitbucketReportBody){

  const bitbucketProxyAddress = 'http://localhost';
  const bitbucketProxyPort = 29418; 

  const url = `http://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_REPO_FULL_NAME}/commit/${process.env.BITBUCKET_COMMIT}/reports/${externalId}`;

  console.log('URL:', url);

  const isRunningInDockerContainer = fs.readFileSync('/proc/self/cgroup', 'utf8').indexOf('docker') !== -1;

  const proxyAddress = isRunningInDockerContainer ? 'host.docker.internal' : bitbucketProxyAddress;

  const response = await fetch(url, {
    agent: new HttpProxyAgent(`${proxyAddress}:${bitbucketProxyPort}`),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log(await response.text());
}

export default uploadReportToBitbucket;
