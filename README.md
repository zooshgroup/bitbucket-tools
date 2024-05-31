# Bitbucket Tools

This repository contains tools designed to facilitate the upload of reports for your Bitbucket repositories. Below is a brief introduction to the two repositories included:

## Zoosh Bitbucket Code Insights
The **Zoosh Bitbucket Code Insights** tool is designed for uploading reports to Bitbucket repositories. It constructs the URL for the Bitbucket API based on the provided external ID (representing the report's name) and sends a PUT request to update the report. The report body is formatted as JSON and includes details such as title, report type, details, result, and data. Upon successful upload, the script logs the response from Bitbucket.

### Key Features:
- **Installation:** Install via npm or yarn.
- **Usage:** Offers a function named `uploadReportToBitbucket` to upload reports.
- **Report Body Format:** The function accepts a JSON-formatted report body.
- **Docker Integration:** Can be run within a Docker container.
- **Authentication:** Requests are routed through a proxy server for automatic authentication.

For more details, please refer to the [Zoosh Bitbucket Code Insights README](packages/bitbucket-code-insights/README.md)

## Zoosh bitbucket-v8-coverage-report
The **Zoosh bitbucket-v8-coverage-report** package is a boilerplate designed to facilitate the upload of V8 test coverage reports to Bitbucket. It provides functions to automate the process of uploading reports generated during build processes.

## Key Features:
- **Installation:** Easily install via npm or yarn.
- **Usage:** Includes a command-line utility `bitbucket-v8-coverage-report` for uploading coverage reports.
- **Arguments:** Requires report name (-n) and path to the coverage report file (-p).
- **Docker Integration:** Can be run within a Docker container.
- **Authentication:** Requests are routed through a proxy server for automatic authentication.

For more details, please refer to the [Zoosh bitbucket-v8-coverage-report README](packages/bitbucket-v8-coverage-report/README.md).

# Version Management
## Semantic Versioning
These projects adheres to [Semantic Versioning](https://semver.org/). For transparency into our release cycle and in striving to maintain backward compatibility, we will be documenting notable changes for each version in this section.

# License
Both projects are licensed under the **GNU General Public License v3.0.** See the LICENSE file for details.

Thank you for using these tools to streamline your Bitbucket report management. For more information, visit the respective repository READMEs.