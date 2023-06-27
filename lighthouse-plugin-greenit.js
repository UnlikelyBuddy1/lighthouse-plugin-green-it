console.log(__dirname);
module.exports = {
        audits: [
                { path: `${__dirname}/audits/greenit-audit.js` },
        ],
        category: {
                title: 'Green IT',
                description: 'Measures the eco-friendliness of the page.',
                auditRefs: [{ id: 'greenit-audit', weight: 1, group: 'greenit' }],
        },
        groups: {
                greenit: {
                        title: 'Green IT'
                }
        }
};