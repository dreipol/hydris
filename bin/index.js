#!/usr/bin/env node
const IS_MAIN = require.main === module;
const minimist = require('minimist');
const pkg = require('../package.json');
const { scrape } = require('../');

/**
 * Generate the help text
 * @return {number} exit code
 */
function help() {
    console.log(`Options:
  --url, -u     Url you want to render
  --node, -n    The DOM node to query
  --outer       If set we will get the outerHTML of the selector

  version - ${ pkg.version }`);

    return 0;
}

/**
 * Generate the result of the scraping
 * @param   {string} options.url  - url to scrape
 * @param   {string} options.node - DOM node to filter
 * @param   {string} options.outer - If truthy it will get the outerHTML of the selector
 * @param   {string} options.u - alias for options.url
 * @param   {string} options.n - alias for options.node
 * @return {number} exit code
 */
async function exec({ url, node, outer, u, n }) {
    try {
        const html = await scrape(
            url || u,
            node || n,
            { outer: Boolean(outer) }
        );

        console.log(html);

        return 0;
    } catch (e) {
        console.error(e.message);
        return 1;
    }
}

/**
 * Run the cli and returns the exit code if it's executed as main node process
 * @param  {Array} args - process arguments
 * @return {number} exit code
 */
async function run(args) {
    const argv = minimist(args);
    let exitCode = 0;

    if (args.length) {
        exitCode = await exec(argv);
    } else {
        // help
        exitCode = help();
    }

    /* istanbul ignore next */
    if (IS_MAIN) {
        process.exit(exitCode);
    }

    return exitCode;
}

module.exports = {
    help,
    run,
    exec,
};

// if it's called directly we run it right the way
/* istanbul ignore next */
if (IS_MAIN) {
    run(process.argv.slice(2));
}

