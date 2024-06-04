# Bitbucket Tools

This repository includes helpful tools that enhance the experience of working with Bitbucket Pipelines.

## Zoosh Bitbucket Code Insights

The **Zoosh Bitbucket Code Insights** is designed for uploading reports to Bitbucket repositories. It constructs the URL for the Bitbucket API based on the provided external ID (representing the report's name) and sends a PUT request to update the report. The report body is formatted as JSON and includes details such as title, report type, details, result, and data. Upon successful upload, the script logs the response from Bitbucket.

For more details, please refer to the [Zoosh Bitbucket Code Insights README](packages/bitbucket-code-insights/README.md)

## Zoosh bitbucket-v8-coverage-report

The **Zoosh bitbucket-v8-coverage-report** is designed to facilitate the upload of V8 test coverage reports to Bitbucket. It provides functions to automate the process of uploading reports generated during build processes.

For more details, please refer to the [Zoosh bitbucket-v8-coverage-report README](packages/bitbucket-v8-coverage-report/README.md).

## License

Projects are licensed under the **GNU General Public License v3.0.** See the LICENSE file for details.

Thank you for using these tools to streamline your Bitbucket report management. For more information, visit the respective repository READMEs.