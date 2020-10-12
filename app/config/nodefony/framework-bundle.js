/**
 *    OVERRIDE framework-bundle config
 *
 *    see FRAMEWORK BUNDLE config for more options
 *
 */
module.exports = {
  webpack: {
    cache: true,
    outputFileSystem: "file-system", // memory-fs not implemented yet
    stats: {
      colors: true,
      verbose: true,
      maxModules: 16 // Infinity
    }
  }
};