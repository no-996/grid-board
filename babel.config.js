const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        ie: '9',
      },
      useBuiltIns: 'usage',
      corejs: 2,
      debug: false,
    },
  ],
  '@vue/babel-preset-jsx',
]

const plugins = ['@babel/transform-runtime']

module.exports = {
  presets,
  plugins,
  sourceType: 'unambiguous',
}
