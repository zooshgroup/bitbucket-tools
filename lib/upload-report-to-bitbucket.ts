import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';

async function uploadReportToBitbucket(externalId: string, body: {}){

  const url = `http://api.bitbucket.org/2.0/repositories/${process.env.BITBUCKET_REPO_FULL_NAME}/commit/${process.env.BITBUCKET_COMMIT}/reports/${externalId}`;

  console.log('url', url);

  const response = await fetch(url, {
    agent: new HttpProxyAgent('http://localhost:29418'),
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
