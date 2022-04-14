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
        name: "generatedMeta.pack.name",
        message: "What would you like to name your pack?"
      },
      {
        type: "input",
        name: "generatedMeta.pack.description",
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
      },
      {
        type: "checkbox",
        name: "building",
        message: "Would you like the pack to be packagable for distribution?",
        choices: [
          { name: "Yes", value: "build", checked: true },
          { name: "Compress distributed package", value: "compact", checked: true, disabled: ans => ans.building.includes("build") }
        ]
      },

      /// IDENTIFICATION ///

      {
        when: ans => ans.identOk,
        type: "checkbox",
        name: "identTypes",
        message: "What types of identification do you want?",
        choices: [
          { name: "Use my Github username", value: "github", short: "Github" },
          { name: "Use an ident-string", value: "ident", short: "Ident-string" },
          { name: "Use a separated user/email", value: "json", short: "Separated" }
        ]
      }
    ];

    const choices = await this.prompt(prompts);
    this.fs.writeJSON("choices.dump", choices)
    this.choices = choices;
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
