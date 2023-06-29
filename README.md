# Lighthouse Plugin - Green IT
This Lighthouse plugin utilizes EcoIndex's and The Green Web Foundation's methodologies to assess the eco-friendliness of webpages. The 'Green IT' score is determined based on a webpage's total weight, number of requests made, and DOM size. 

![lighthouse-plugin-green-it](https://github.com/UnlikelyBuddy1/lighthouse-plugin-green-it/assets/52712038/7d3922fc-8699-41e8-aa88-59d3fb22120a)

## Features
- EcoIndex Calculations: Incorporates EcoIndex's well-regarded approaches to eco-friendliness assessment, providing a reliable metric of a webpage's environmental impact.
- The Green Web Foundation's Techniques: Utilizes the proven methodologies from The Green Web Foundation, adding another layer of robustness to the evaluation.

## Usage
- install the package
```bash
npm i lighthouse-plugin-green-it
```
- use it with the lighthouse CLI
```bash
lighthouse --plugins=lighthouse-plugin-green-it <URL>
```
or integrate it into your code like so:
```typescript
const runnerResult = await lighthouse(url, {
      output: ['html', 'json'],
      port: chrome.port,
      plugins: ['lighthouse-plugin-green-it']
});
```
## Credit
This project builds upon the foundational work done by EcoIndex and The Green Web Foundation.
- EcoIndex: You can find their repositories [here](https://github.com/cnumr) and the [original calculations](https://github.com/cnumr/ecoindex_python/blob/main/ecoindex/ecoindex.py) that have been integrated into this plugin.
- The Green Web Foundation: Portions of their [Lighthouse plugin](https://github.com/thegreenwebfoundation/lighthouse-plugin-greenhouse) have been reused in the development of this plugin.

## Important modifications to Eco index
The EcoIndex scoring algorithm has been adjusted in this context to address perceived shortcomings in its original form. The initial approach appeared to disproportionately penalize scores based on the quantity of DOM elements. This adjustment is aimed at rectifying this perceived imbalance.
A key requirement of this modification was to ensure that it had no impact on the calculations for CO2 emissions and water usage. As such, the modification involves a simple addition of 10 points to the score.
This adjustment is justified with the case study of a webpage such as 'example.com'. Despite its efficient characteristics, such as a weight of 1kb, the presence of only 5 DOM elements, and a single request, the original EcoIndex scoring failed to award it the optimal score of 100. This modification seeks to address and correct such instances.


