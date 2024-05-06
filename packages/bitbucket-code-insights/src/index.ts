import { lookup } from 'dns';
import fetch from 'node-fetch'
import fs from 'fs';
import { HttpProxyAgent } from 'http-proxy-agent';
import { BitbucketReportBody } from "./types"
import { createLogger } from './utils/logger';

const log = createLogger('Bitbucket Code Insights')

async function lookupAddress(address: string): Promise<string> {
  return new Promise((resolve, reject) => {
    lookup(address, (err) => {
      if (err) {
        reject({
          message: `Unable to resolve ${address}. 
          You may need to add the "--add-host=host.docker.internal:host-gateway" option to your Bitbucket Pipeline configuration`,
        });
      }
      resolve(address);
    });
  });
}

async function uploadReportToBitbucket(externalId: string, body: BitbucketReportBody){

  const bitbucketProxyAddress = 'localhost';
  const bitbucketProxyPort = 29418; 

  const url = `http://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_REPO_FULL_NAME}/commit/${process.env.BITBUCKET_COMMIT}/reports/${externalId}`;

  log(url, 'URL:');

  let proxyAddress = bitbucketProxyAddress;

  const isRunningInDockerContainer = fs.readFileSync('/proc/self/cgroup', 'utf8').indexOf('docker') !== -1;

  if(isRunningInDockerContainer){
    
    proxyAddress = 'host.docker.internal';
    await lookupAddress(proxyAddress);
    
  }

  const response = await fetch(url, {
    agent: new HttpProxyAgent(`http://${proxyAddress}:${bitbucketProxyPort}`),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  log(await response.text());
}

export default uploadReportToBitbucket;
