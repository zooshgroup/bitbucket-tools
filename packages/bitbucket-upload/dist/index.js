"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const command_line_args_1 = __importDefault(require("command-line-args"));
const zoosh_publish_report_1 = __importDefault(require("zoosh-publish-report"));
const optionDefinitions = [
    { name: 'name', alias: 'n', type: String },
    { name: 'path', alias: 'p', type: String },
];
const args = (0, command_line_args_1.default)(optionDefinitions);
function uploadReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, path: reportPath } = args;
            if (!name || !reportPath) {
                throw new Error('Usage: uploadReport -n <report-name> -p <report-path>');
            }
            const coverageResults = JSON.parse(yield promises_1.default.readFile(reportPath, 'utf8'));
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
            yield (0, zoosh_publish_report_1.default)(name, body);
        }
        catch (error) {
            console.error('Error uploading report:', error);
            process.exit(1);
        }
    });
}
uploadReport();
