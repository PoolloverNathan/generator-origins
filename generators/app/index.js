// @ts-check
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const commandExists = require("command-exists");
const { exec } = require("child_process");
const { promisify } = require("util");
const { basename, normalize } = require("path");
const execP = promisify(exec);

module.exports = class extends Generator {
  async initializing() {
    try {
      await commandExists("gpg");
      const keyAry = [];
      const gpgOutput = await execP("gpg -K --with-colons --keyid-format=long");
      for (let line of gpgOutput.stdout.split("\n")) {
        const [type, , , , , , , fingerprint, , uid] = line.split(":");
        if (type === "uid") {
          keyAry.push({
            name: `${chalk.blue(fingerprint.substr(-8))}: ${uid}`,
            value: fingerprint,
            short: fingerprint.substr(-8)
          });
          // The above line was written in 2022, i don't know why something as good as substr would be depreciated
        }
      }

      this.keys = keyAry;
      console.log(keyAry);
    } catch {}
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
        name: "generatedMeta.pack.namespace",
        message: "What should the ID of your pack be?",
        default: ans => ans.generatedMeta.pack.name.replace(/\s+|-/, "_").replace(/\W/, "").toLowerCase()
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
        name: "temp.identOk",
        message: "Would you like credit for your work?",
        default: true
      },

      /// IDENTIFICATION ///

      {
        when: ans => ans.temp.identOk,
        type: "checkbox",
        name: "temp.identTypes",
        message: "What types of identification do you want?",
        choices: [
          { name: "Use my Github username", value: "github", short: "GitHub" },
          {
            name: "Use an ident-string",
            value: "ident",
            short: "Ident-string",
          },
          {
            name: "Use a separated user/email",
            value: "json",
            short: "Separated"
          }
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
        when: this.keys && (ans => ans.build.enabled),
        name: "build.signingKey",
        message: "Which GPG key do you want to sign the releases with?",
        choices: [{ name: chalk.red("Do not sign"), value: null }, ...this.keys]
      }
    ];

    const choices = await this.prompt(prompts);
    delete choices.temp;
    this.fs.writeJSON("choices.dump", choices);
    this.choices = choices;
  }

  async createIdFolder() {
    // Checks if the namespace is different then the cwd name
    if (basename(normalize(".")) !== this.choices.generatedMeta.pack.namespace /* wow, that's long */) {
      
    }
  }

  writing() {
    this.fs.copy(
      this.templatePath("dummyfile.txt"),
      this.destinationPath("dummyfile.txt")
    );
  }
};
