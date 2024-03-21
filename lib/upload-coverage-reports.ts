import fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import uploadReportToBitbucket from "./upload-report-to-bitbucket";

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String },
];

const args = commandLineArgs(optionDefinitions);

async function uploadReport() {
  try {
    const { name, path: reportPath } = args;

    if (!name || !reportPath) {
      throw new Error('Usage: uploadReport -n <report-name> -p <report-path>');
    }

    const coverageResults = JSON.parse(await fs.readFile(reportPath, 'utf8'));

    const body = {
      title: 'Coverage',
      report_type: 'COVERAGE',
      details: 'Coverage report for the build.',
      result: 'FAILED',
      data: [
        {
          title: 'Lines',
          type: 'PERCENTAGE',
          value: coverageResults.total.lines.pct,
        },
        {
          title: 'Statements',
          type: 'PERCENTAGE',
          value: coverageResults.total.statements.pct,
        },
        {
          title: 'Functions',
          type: 'PERCENTAGE',
          value: coverageResults.total.functions.pct,
        },
        {
          title: 'Branches',
          type: 'PERCENTAGE',
          value: coverageResults.total.branches.pct,
        },
      ],
    };

    await uploadReportToBitbucket(name, body);
  } catch (error) {
    console.error('Error uploading report:', error);
    process.exit(1);
  }
}

export default uploadReport;
