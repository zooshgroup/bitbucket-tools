#!/usr/bin/env node

import fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import uploadReportToBitbucket from "@zooshdigital/bitbucket-code-insights";
import { createLogger } from 'utils/logger';

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String },
];

const args = commandLineArgs(optionDefinitions);

const log = createLogger('Zoosh Bitbucket v8 Coverage Report')

async function uploadReport() {
  try {
    const { name, path: reportPath } = args;

    if (!name || !reportPath) {
      throw new Error('Bitbucket v8 Coverage Report - Usage: uploadReport -n <report-name> -p <report-path>');
    }

    const coverageResults = JSON.parse(await fs.readFile(reportPath, 'utf8'));

    const body = {
      title: name,
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
    log('Report uploaded successfully', name);
  } catch (error) {
    log(`Error uploading report: ${error}`);
    process.exit(1);
  }
}

uploadReport();
