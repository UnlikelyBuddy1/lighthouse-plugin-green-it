module.exports = {
        audits: [
                { path: `${__dirname}/audits/greenit-audit.js` },
                { path: `${__dirname}/audits/greenhouse-audit.js` },
        ],
        category: {
                title: 'Green IT & Sustainable Web',
                description: 'Measures the eco-friendliness of the page.',
                auditRefs: [{ id: 'greenit-audit', weight: 0.9, group: 'greenit' }, { id: 'greenhouse-id', weight: 0.1, group: 'greenit' }],
        },
        groups: {
                greenit: {
                        title: 'Green IT'
                }
        }
};