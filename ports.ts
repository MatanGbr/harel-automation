import { color, spinnerPlus, spinnerQuestion } from './msg.js';
import { ps } from './ps.method.js';

const findPortAssignment = async (port) => {
    const assignment = await ps(`netstat -ano | findstr 300${port} | findstr LISTENING`);
    const assignmentCode = assignment.stdout.toLowerCase().replace(/\s+/g, '').trim().split('listening').pop();
    return parseInt(assignmentCode);
};

const killPort = async (port) => {
    try {
        const assignment = await findPortAssignment(port);
        await ps(`taskkill /f /pid ${assignment}`);
        spinnerPlus();
        return port;
    } catch (err) {
        spinnerQuestion();
        return null;
    }
};

export const killPorts = async (ports) => {
    const killed = [];
    for (const port of [ports].flat()) {
        const result = await killPort(port);
        if (result !== null) {
            killed.push(result);
        }
    }
    return killed;
};

export const getActivePorts = async () => {
    try {
        const data = await ps(`netstat -ano | findstr 300 | findstr LISTENING`);
        return data.stdout.split(':300').slice(1).map((p) => parseInt(p.slice(0, 1)));
    } catch (err) {
        return [];
    }
};

export const getLowestAvailablePort = async () => {
    const activePorts = await getActivePorts();
    if (activePorts.length < 10) {
        if (activePorts.length !== 0) {
            for (let i = 0; i < 11; i++) {
                if (!activePorts.includes(i)) {
                    return i;
                }
            }
        } else {
            return 0;
        }
    } else {
        throw new Error(
            `All 3000-9 sub-routes are occupied. Terminate sub-routes by commanding \`--${color(`kill`)} (number / "all")\``
        );
    }
};
