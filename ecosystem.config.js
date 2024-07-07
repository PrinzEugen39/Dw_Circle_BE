module.exports = {
  apps: [{
      name: "Circle BE",
      script: "npm",
      args: "start:prod -- -p 9902",
      watch: true,
  }]
}
