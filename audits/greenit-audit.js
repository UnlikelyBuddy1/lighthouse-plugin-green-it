const Audit = require('lighthouse').Audit;
const NetworkRequest = require('lighthouse/lighthouse-core/lib/network-request.js');
const NetworkRecords = require('lighthouse/lighthouse-core/computed/network-records.js');

class GreenItAudit extends Audit {
        static get meta() {
                return {
                        id: 'greenit-audit',
                        title: 'Page is eco-friendly',
                        description: 'Check if the page is optimized for eco-friendly practices.',
                        requiredArtifacts: ['DOMStats', 'devtoolsLogs'],
                        failureTitle: 'Page is not eco-friendly'
                };
        }

        static async audit(artifacts, context) {
                const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
                try {
                        const networkRecords = await NetworkRecords.request(devtoolsLog, context);
                        const domSize = artifacts.DOMStats.totalBodyElements;
                        const totalPageSize = +((networkRecords.reduce((totalSize, record) => totalSize + record.transferSize, 0)) / 1000).toFixed(1);
                        const numberOfRequests = networkRecords.length;
                        const results = analyzeWebCarbon({ 'dom': domSize, 'req': numberOfRequests, 'size': totalPageSize });
                        const details = {
                                type: 'table',
                                headings: [
                                        { key: 'field', itemType: 'text', text: 'Measurement' },
                                        { key: 'value', itemType: 'text', text: 'Value' },
                                ],
                                items: [
                                        { field: 'Grade', value: results.grade },
                                        { field: 'Greenhouse Gas Emissions (per 1000 visits)', value: `${results.ghg} kgC02e` },
                                        { field: 'Water Consumption (per 1000 visits)', value: `${results.water} L` },
                                ],
                        };
                        return {
                                score: results.score / 100,
                                numericValue: results.score / 100,
                                details: details,
                        };
                } catch (error) {
                        console.error(`Failed to get network records: ${error}`);
                        throw error;
                }
        }
}
module.exports = GreenItAudit;

/**
 * Analyzes the web carbon metrics and returns related data.
 * 
 * @param {Object} metrics - The metrics containing dom, req, and size.
 * @returns {Object} An object containing the dom, requests, size, ecoIndex score, grade, greenhouse gases, and water consumption.
 */
function analyzeWebCarbon(metrics) {
        const domSize = metrics.dom;
        const totalRequests = metrics.req;
        const totalPageSize = metrics.size;
        const ecoIndex = +(computeEcoIndex(domSize, totalRequests, totalPageSize)).toFixed(0);
        const grade = getEcoIndexGrade(ecoIndex);
        const ghg = computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex);
        const water = computeWaterConsumptionfromEcoIndex(ecoIndex);
        return { dom: domSize, requests: totalRequests, size: totalPageSize, score: ecoIndex, grade: grade, ghg: ghg, water: water };
}

/**
 * Computes Eco Index based on given DOM, requests and page size.
 *
 * @param {number} dom - The number of DOM elements.
 * @param {number} req - The number of requests.
 * @param {number} size - The page size in kB.
 * @returns {number} - The computed Eco Index.
 */
function computeEcoIndex(dom, req, size) {
        const quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
        const quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
        const quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];
        const q_dom = computeQuantile(quantiles_dom, dom);
        const q_req = computeQuantile(quantiles_req, req);
        const q_size = computeQuantile(quantiles_size, size);
        return 100 - 5 * (3 * q_dom + 2 * q_req + q_size) / 6;
}

/**
 * Computes the quantile for a given value within a set of quantiles.
 *
 * @param {number[]} quantiles - The set of quantiles.
 * @param {number} value - The value to find the quantile for.
 * @returns {number} - The computed quantile.
 */
function computeQuantile(quantiles, value) {
        for (let i = 1; i < quantiles.length; i++) {
                if (value < quantiles[i]) return (i - 1 + (value - quantiles[i - 1]) / (quantiles[i] - quantiles[i - 1]));
        }
        return quantiles.length - 1;
}

/**
 * Maps an Eco Index score to a grade (A - G).
 *
 * @param {number} ecoIndex - The Eco Index score.
 * @returns {string} - The corresponding grade.
 */
function getEcoIndexGrade(ecoIndex) {
        if (ecoIndex >= 80) return "A";
        if (ecoIndex >= 70) return "B";
        if (ecoIndex >= 55) return "C";
        if (ecoIndex >= 40) return "D";
        if (ecoIndex >= 25) return "E";
        if (ecoIndex >= 10) return "F";
        return "G";
}

/**
 * Computes greenhouse gases emission from an Eco Index score.
 *
 * @param {number} ecoIndex - The Eco Index score.
 * @returns {number} - The computed greenhouse gases emission in kg for 1000 visits.
 */
function computeGreenhouseGasesEmissionfromEcoIndex(ecoIndex) {
        return (2 + 2 * (50 - ecoIndex) / 100).toFixed(2); // kg for 1000 visits
}

/**
 * Computes water consumption from an Eco Index score.
 *
 * @param {number} ecoIndex - The Eco Index score.
 * @returns {number} - The computed water consumption in L for 1000 visits.
 */
function computeWaterConsumptionfromEcoIndex(ecoIndex) {
        return ((3 + 3 * (50 - ecoIndex) / 100) * 10).toFixed(2); // L for 1000 visits
}
