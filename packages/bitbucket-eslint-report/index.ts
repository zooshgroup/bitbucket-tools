#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import commandLineArgs from 'command-line-args';
import {
  uploadReportToBitbucket,
  uploadAnnotationsToBitbucket,
  createBuildOnBitbucket,
} from '@zooshdigital/bitbucket-code-insights';
import { BitbucketAnnotation, BitbucketSeverity } from '@zooshdigital/bitbucket-code-insights/dist/types';

import { createLogger } from 'utils/logger';

type LintMessage = {
  ruleId: string;
  severity: number;
  line: number;
  column: number;
  fix?: {
    text: string;
  };
};

type LintFile = {
  filePath: string;
  errorCount: number;
  fixableErrorCount: number;
  warningCount: number;
  fixableWarningCount: number;
  messages: LintMessage[];
};

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'path', alias: 'p', type: String, multiple: true },
  { name: 'add-build', alias: 'a', type: Boolean },
  { name: 'strict', alias: 's', type: Boolean },
];

const args = commandLineArgs(optionDefinitions);

const logger = createLogger('Zoosh Bitbucket Eslint Report');

const severities: Record<number, BitbucketSeverity> = {
  0: 'LOW',
  1: 'MEDIUM',
  2: 'HIGH',
};

async function uploadReport() {
  const items: BitbucketAnnotation[] = [];

  let counter = 0;
  let totalErrors = 0;
  let fixableErrors = 0;
  let totalWarnings = 0;
  let fixableWarnings = 0;

  try {
    const { name, path: reportPaths, 'add-build': addBuild, strict } = args;

    if (!name || !reportPaths || reportPaths.length === 0) {
      throw new Error(
        'Bitbucket Eslint Report - Usage: bitbucket-eslint-report -n <report-name> -p <report-path> [-b] [-s]',
      );
    }

    await Promise.all(
      reportPaths.map(async (reportPath: string) => {
        const lint: LintFile[] = JSON.parse(await fs.readFile(reportPath, 'utf8'));
        lint.forEach((file) => {
          // const filePath = file.filePath.replace(/^\/opt\/atlassian\/pipelines\/agent\/build\//, '');
          const filePath = path.relative(process.env.BITBUCKET_CLONE_DIR ?? process.cwd(), file.filePath);
          totalErrors = totalErrors + file.errorCount;
          fixableErrors = fixableErrors + file.fixableErrorCount;
          totalWarnings = totalWarnings + file.warningCount;
          fixableWarnings = fixableWarnings + file.fixableWarningCount;
          file.messages.forEach((message) => {
            counter++;
            items.push({
              external_id: `${name}.${process.env.BITBUCKET_COMMIT}.${counter}`,
              title: `Eslint: ${message.ruleId}`,
              annotation_type: 'CODE_SMELL',
              summary: `Eslint error: ${message.ruleId} ${message.fix ? `| fix: ${message.fix.text}` : ''}`,
              severity: severities[message.severity],
              path: filePath,
              line: message.line,
            });
          });
        });
      }),
    );

    const passed = strict ? totalErrors + totalWarnings === 0 : totalErrors === 0;

    await uploadReportToBitbucket('eslint', {
      title: name,
      report_type: 'TEST',
      details: `${name} report`,
      result: passed ? 'PASSED' : 'FAILED',
      data: [
        {
          title: 'Errors',
          type: 'NUMBER',
          value: totalErrors,
        },
        {
          title: 'Fixable Errors',
          type: 'NUMBER',
          value: fixableErrors,
        },
        {
          title: 'Warnings',
          type: 'NUMBER',
          value: totalWarnings,
        },
        {
          title: 'Fixable Warnings',
          type: 'NUMBER',
          value: fixableWarnings,
        },
      ],
    });

    if (items.length > 0) {
      const chunkSize = 100;
      const chunks = items.reduce((acc, _, i) => {
        if (i % chunkSize === 0) acc.push(items.slice(i, i + chunkSize));
        return acc;
      }, [] as BitbucketAnnotation[][]);
      await Promise.all(chunks.map((chunk) => uploadAnnotationsToBitbucket('eslint', chunk)));
    }
    logger.log('Report uploaded successfully', name);

    if (addBuild) {
      const url = process.env.BITBUCKET_PR_ID
        ? `https://bitbucket.org/${process.env.BITBUCKET_REPO_FULL_NAME}/pull-requests/${process.env.BITBUCKET_PR_ID}/diff`
        : `https://bitbucket.org/${process.env.BITBUCKET_REPO_FULL_NAME}/commit/${process.env.BITBUCKET_COMMIT}`;
      createBuildOnBitbucket({
        key: name,
        state: passed ? 'SUCCESSFUL' : 'FAILED',
        name,
        description: `${name} result`,
        url,
      });
    }
  } catch (error) {
    logger.log(`Error uploading report: ${error}`);
    process.exit(1);
  }
}

uploadReport();
