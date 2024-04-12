# Zoosh Bitbucket Coverage Report Uploader

This script, uploadReportToBitbucket, is responsible for uploading coverage reports to Bitbucket repositories. It constructs the URL for the Bitbucket API based on the provided external ID (which represents the name of the report), and then sends a PUT request to update the report. The report body is formatted as JSON and includes details such as title, report type, details, result, and data. Upon successful upload, the script logs the response from Bitbucket.

## Installation

To install Zoosh Bitbucket Code Insights, simply include it as a dependency in your project's `package.json` file:

```bash
npm install @zooshdigital/bitbucket-code-insights
```

or

```bash
yarn add @zooshdigital/bitbucket-code-insights
```

## Usage

### uploadReportToBitbucket Function

The uploadReport function provided by Zoosh Bitbucket Tools enables you to upload coverage reports to Bitbucket pipelines. Below is an example of how to use this function.

### Report Body Format

The `uploadReportToBitbucket` function accepts a report body in the following format:

```typescript
interface BitbucketReportData {
  title: string;
  type: string;
  value: number;
}

interface BitbucketReportBody {
  title: string;
  report_type: string;
  details: string;
  result: string;
  data: BitbucketReportData[];
}
```

Where data is an array of objects, each containing the title, type, and value fields.

## Example

```typescript
import uploadReportToBitbucket from '@zooshdigital/bitbucket-code-insights';

const externalId = 'your_external_id';
const body = {
  // Report body
};

uploadReportToBitbucket(externalId, body)
  .then(() => {
    console.log('Report uploaded successfully.');
  })
  .catch((error) => {
    console.error('Error uploading report:', error);
  });
```

Your requests will automatically be routed through a proxy server running alongside every pipeline on 'localhost:29418'. This proxy server adds a valid Auth-Header to your requests, eliminating the need for additional authentication configurations.
 
See more in the official Bitbucket documentation [here](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/).


## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.