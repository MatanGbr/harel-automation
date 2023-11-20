import { Problems } from '../types/problems.type.js';
import { er } from './msg.js';
import { ps } from './ps.method.js';
import { now } from './time.method.js';
import { fullCommand } from './usr.method.js';

const getOsInfo = async () => {
    try {
        return await ps(`Get-ComputerInfo WindowsRegisteredOwner, CsDNSHostName, osName, BiosManufacturer, CsSystemSKUNumber, CsProcessors, CsNetworkAdapters`);
    } catch (err) {
        er(`Could not retrieve OS information.`);
        return null;
    }
};

const createProblemReport = async (problems) => {
    const osInfo = await getOsInfo();
    const report = {
        date: now(),
        os: osInfo,
        input: fullCommand.toString(),
        problems: problems
    };

    return report;
};

const reportProblems = async (problems) => {
    try {
        const report = await createProblemReport(problems);
        // Logic to send the report, if needed.
    } catch (err) {
        er(`Could not send a report.`);
    }
};

export const problems: Problems = {
    all: [],
    collect: (problem) => problems.all.push(problem.toString()),
    show: () => {
        problems.all.forEach(problem => er(problem));
        reportProblems(problems.all);
        problems.clear();
    },
    clear() {
        problems.all = [];
    },
    check: () => problems.all.length === 0
};
