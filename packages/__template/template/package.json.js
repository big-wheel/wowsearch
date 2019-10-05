// @loader module?indent=2

module.exports = ({ _, name, description }) => {
  return {
    name: `${name}`,
    author: _.git.name,
    description: description,
    publishConfig: {
      access: 'public'
    },
    license: 'MIT',
    scripts: {
      dist: 'rimraf dist && tsc',
      test: 'jest',
      dev: 'npm run dist -- -w',
      prepublishOnly: 'npm run dist',
      version: 'npm test'
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/big-wheel/wowsearch.git'
    },
    keywords: [_.git.name].concat(name.split('.')).concat('wowsearch'),
    engines: {
      node: '>=6'
    },
    main: 'dist/index.js',
    typings: 'dist/index.d.js',
    version: require('../../../lerna').version
  }
}
