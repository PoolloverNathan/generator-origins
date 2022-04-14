// @ts-check
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const commandExists = require("command-exists")
const { exec } = require("child_process")
const { promisify } = require("util")
const execP = promisify(exec)

module.exports = class extends Generator {
  async initializing() {
    const hasGpg = await commandExists("gpg")
    const keyAry = [];
    if (hasGpg) {
      const gpgOutput = await execP('gpg -K --with-colons --keyid-format=long')
      for (let line of gpgOutput.stdout.split("\n")) {
        const [type,,,,, nid,, fingerprint,, uid] = line.split(":");
        if (type === "uid") {
          keyAry.push({name: `${chalk.blue(fingerprint.substr(-8))}: ${uid}`, value: fingerprint, short: fingerprint.substr(-8)})
          // the above line was written in 2022, i don't know why something as good as substr would be depreciated
        }
      }
      console.log(keyList);
    }
  }
  async prompting() {
    // // Have Yeoman greet the user.
    // this.log(
    //   yosay(
    //     `Welcome to the fantabulous ${chalk.red(
    //       "generator-origins"
    //     )} generator!`
    //   )
    // );

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
      },

      /// BUILDING ///

      {
        type: "confirm",
        name: "build.enabled",
        message: "Would you like the pack to be packagable for distribution?"
      },
      {
        type: "list",
        name: "build.signingKey",
        message: "Which GPG key do you want to sign the releases with?"
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
