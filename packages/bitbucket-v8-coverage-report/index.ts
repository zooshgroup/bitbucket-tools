#!/usr/bin/env node

import fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import uploadReportToBitbucket from "@zooshdigital/bitbucket-code-insights";

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String },
];

const args = commandLineArgs(optionDefinitions);

async function uploadReport() {
  try {
    const { name, path: reportPath } = args;
    const reportName = `${name}-coverage-report`;

    if (!name || !reportPath) {
      throw new Error('Bitbucket v8 Coverage Report - Usage: uploadReport -n <report-name> -p <report-path>');
    }

    const coverageResults = JSON.parse(await fs.readFile(reportPath, 'utf8'));

    const body = {
      title: reportName,
      report_type: 'COVERAGE',
      details: `Coverage report for ${name}.`,
      result: 'PASSED',
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
    console.error('Bitbucket v8 Coverage Report - Error uploading report:', error);
    process.exit(1);
  }
}

uploadReport();
