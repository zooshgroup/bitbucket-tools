export interface BitbucketReportData {
  title: string;
  type: 'BOOLEAN' | 'DATE' | 'DURATION' | 'LINK' | 'NUMBER' | 'PERCENTAGE' | 'TEXT';
  value: number;
}

export type BitbucketSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface BitbucketAnnotation {
  external_id: string;
  annotation_type: 'VULNERABILITY' | 'CODE_SMELL' | 'BUG';
  severity: BitbucketSeverity;
  path: string;
  line: number;
  title: string;
  summary: string;
  details?: string;
  result?: 'PASSED' | 'FAILED' | 'SKIPPED' | 'IGNORED';
  link?: string;
}

export interface BitbucketReportBody {
  title: string;
  report_type: 'SECURITY' | 'COVERAGE' | 'TEST' | 'BUG';
  details: string;
  result: 'PASSED' | 'FAILED' | 'PENDING';
  data: BitbucketReportData[];
}

export interface BitbucketBuildBody {
  key: string;
  state: 'FAILED' | 'INPROGRESS' | 'STOPPED' | 'SUCCESSFUL';
  name?: string;
  description: string;
  url: string;
}

export interface BitbucketPrCommentBody {
  content: {
    raw: string;
  };
}
