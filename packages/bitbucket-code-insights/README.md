# Zoosh Bitbucket Code Insights

The Zoosh Bitbucket Code Insights is designed for uploading reports to Bitbucket Pull Requests. It constructs the URL for the Bitbucket API based on the provided external ID (which represents the name of the report), and then sends a PUT request to update the report. The report body is formatted as JSON and includes details such as title, report type, details, result, and data. Upon successful upload, the script logs the response from Bitbucket.

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

The project offers a function named `uploadReportToBitbucket`, allowing you to upload the provided reports to Bitbucket using the Bitbucket API.

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

More details about this format can be found in the Bitbucket API official documentation [here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-reports/#api-repositories-workspace-repo-slug-commit-commit-reports-reportid-put).

## Example

To use the `uploadReportToBitbucket` function in your project, you can access it like this:

```typescript
import uploadReportToBitbucket from '@zooshdigital/bitbucket-code-insights';

const externalId = 'your_external_id';
const body = {
  // Report body
};

await uploadReportToBitbucket(externalId, body)
```

## Running within a Docker Container

You have the option to run the script inside a Docker container if needed. Ensure you pass the required environment variables **BITBUCKET_REPO_FULL_NAME** and **BITBUCKET_COMMIT**. Additionally, to enable the container to resolve host.docker.internal to the host machine's address, you need to add the **--add-host=host.docker.internal:host-gateway** flag when running the container.

Below is an example of how to run the container:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -e BITBUCKET_REPO_FULL_NAME=<repo_full_name> \
  -e BITBUCKET_COMMIT=<commit_hash> \
  <docker_image_name>
```

Replace <repo_full_name> with the full name of your Bitbucket repository, <commit_hash> with the commit hash you want to analyze, and <docker_image_name> with the name of the Docker image you built.

## Authentication

Your requests will automatically be routed through a proxy server running alongside every pipeline on 'localhost:29418'. This proxy server adds a valid Auth-Header to your requests, eliminating the need for additional authentication configurations.

See more in the official Bitbucket documentation [here](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/).

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
