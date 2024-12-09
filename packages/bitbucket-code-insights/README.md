# Zoosh Bitbucket Code Insights

The Zoosh Bitbucket Code Insights is designed for uploading builds, reports or other metadata to Bitbucket Pull Requests. It constructs the URL for the Bitbucket API based on the provided external ID (which represents the name of the report), and then sends REST API requests to publish the information. The request body is formatted as JSON and includes necessary details such as title, report type, details, result, and data. Upon successful upload, the script logs the response from Bitbucket.

The project is fully typed, so information about what and how can be uploaded is documented by types.

## Installation

To install Zoosh Bitbucket Code Insights, simply include it as a dependency in your project's `package.json` file:

```bash
npm install @zooshdigital/bitbucket-code-insights
```

or

```bash
yarn add @zooshdigital/bitbucket-code-insights
```

## Prerequisites

### Authentication

While some requests could be automatically authenticated running in a pipeline, Bitbucket doesn't allow that for all endpoints. Thus, for simplicity, the library expects an access token for all API calls. This can be a repository, project or workspace access token in the BITBUCKET_BUILD_TOKEN environment variable. Create a token and make it available as a repository or deployment variable to the pipeline.

### Other identifiers

Since information is attached to a commit (even in case of a pull request), the library needs the BITBUCKET_REPO_FULL_NAME and BITBUCKET_COMMIT environment variables to do that. These two are standard Bitbucket pipeline variables, so there is no need to set them explicitly if running the script in a pipeline.

## Usage

The project offers the following function to easily upload metadata to our commits or pull requests:

- `uploadReportToBitbucket`: Creates a "report" with the given metrics. This is best used for attaching useful information to a pull requests (for example coverage metrics).
- `uploadAnnotationsToBitbucket`: Attaches "annotations" to a report created by the previous command (these annotations can be shown in the diff view of the pull request)
- `createBuildOnBitbucket`: Creates a "build" with the given details. This is useful to show the result of a specific build or test step explicitly in the list of builds, besides the main pipeline build.

More details can be found in the Bitbucket API documentation [here](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-reports/#api-repositories-workspace-repo-slug-commit-commit-reports-reportid-put).

## Example

To use the `uploadReportToBitbucket` function in your project, you can access it like this:

```typescript
import uploadReportToBitbucket from '@zooshdigital/bitbucket-code-insights';

const externalId = 'your_external_id';
const body = {
  // Report body
};

await uploadReportToBitbucket(externalId, body);
```

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
