export interface BitbucketReportData {
  title: string;
  type:
    | "BOOLEAN"
    | "DATE"
    | "DURATION"
    | "LINK"
    | "NUMBER"
    | "PERCENTAGE"
    | "TEXT";
  value: number;
}

export interface BitbucketReportBody {
  title: string;
  report_type: "SECURITY" | "COVERAGE" | "TEST" | "BUG";
  details: string;
  result: "PASSED" | "FAILED" | "PENDING";
  data: BitbucketReportData[];
}
