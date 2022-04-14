// @ts-check
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the fantabulous ${chalk.red(
          "generator-origins"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "packName",
        message: "What would you like to name your pack?"
      },
      {
        type: "input",
        name: "packDesc",
        message: "How would you describe your pack?"
      } /*
      {
        type: 'input',
        name: 'targetVersion',
        message: 'What version of Minecraft are you targeting?',

      }, */,
      {
        type: "confirm",
        name: "identOk",
        message: "Would you like credit for your work?",
        default: true
      }
    ];

    const choices = await this.prompt(prompts);
  }

  writing() {
    this.fs.copy(
      this.templatePath("dummyfile.txt"),
      this.destinationPath("dummyfile.txt")
    );
  }

  install() {
    this.installDependencies();
  }
};
