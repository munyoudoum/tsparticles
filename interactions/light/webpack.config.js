const {loadParticlesInteraction} = require("@tsparticles/webpack-plugin");
const version = require("./package.json").version;

module.exports = loadParticlesInteraction("light", "Light", version, __dirname);
