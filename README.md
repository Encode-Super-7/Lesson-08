# Lesson 5 - Vscode setup and code quality

## Environment setup

* Tooling:
  * [Node](https://nodejs.org/en/docs/guides/getting-started-guide/)
  * [NPM](https://docs.npmjs.com/cli/v9/configuring-npm/install)
  * [Yarn](https://yarnpkg.com/getting-started/install)
  * [Git CLI](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
  * [VS Code](https://code.visualstudio.com/docs/setup/setup-overview)
* Services
  * [infura](https://infura.io/)
  * [alchemy](https://www.alchemy.com/)
  * [etherscan](https://etherscan.io/register)

## Programming setup

* Reference repository
* NPM and Yarn
* VS Code
* VS Code plugins
* source control
* unit tests
* scripts
* Testing passing
* Breaking tests

---
References

<https://github.com/OpenZeppelin/openzeppelin-contracts>

<https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line>

<https://yarnpkg.com/getting-started>

<https://yarnpkg.com/getting-started/usage>

<https://code.visualstudio.com/docs>

### Instructions

Recommendation:

* Use [Node Version Manager](https://github.com/nvm-sh/nvm) to install and use Node LTS version to avoid problems

      nvm use lts
      ...
      node -v
      v18.14.0

Cloning a reference project:

      git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git
      cd .\openzeppelin-contracts\
      npm install

### Output example

      npm run compile
      ...
      > openzeppelin-solidity@4.8.0 compile
      > hardhat compile
      ...
      Compiled 249 Solidity files successfully

### Package.json scripts

    "scripts": {
      "compile": "hardhat compile",
      "coverage": "env COVERAGE=true hardhat coverage",
      "docs": "npm run prepare-docs && oz-docs",
      "docs:watch": "oz-docs watch contracts docs/templates docs/config.js",
      "prepare-docs": "scripts/prepare-docs.sh",
      "lint": "npm run lint:js && npm run lint:sol",
      "lint:fix": "npm run lint:js:fix && npm run lint:sol:fix",
      "lint:js": "prettier --loglevel warn --ignore-path .gitignore '**/*.{js,ts}' --check && eslint --ignore-path .gitignore .",
      "lint:js:fix": "prettier --loglevel warn --ignore-path .gitignore '**/*.{js,ts}' --write && eslint --ignore-path .gitignore . --fix",
      "lint:sol": "prettier --loglevel warn --ignore-path .gitignore '{contracts,test}/**/*.sol' --check && solhint '{contracts,test}/**/*.sol'",
      "lint:sol:fix": "prettier --loglevel warn --ignore-path .gitignore '{contracts,test}/**/*.sol' --write",
      "clean": "hardhat clean && rimraf build contracts/build",
      "prepare": "scripts/prepare.sh",
      "prepack": "scripts/prepack.sh",
      "generate": "scripts/generate/run.js",
      "release": "scripts/release/release.sh",
      "version": "scripts/release/version.sh",
      "test": "hardhat test",
      "test:inheritance": "scripts/checks/inheritance-ordering.js artifacts/build-info/*",
      "test:generation": "scripts/checks/generation.sh",
      "gas-report": "env ENABLE_GAS_REPORT=true npm run test",
      "slither": "npm run clean && slither . --detect reentrancy-eth,reentrancy-no-eth,reentrancy-unlimited-gas"
    },

### Test example

      npm run test .\test\token\ERC20\ERC20.test.js
      ...
      > openzeppelin-solidity@4.8.0 test
      > hardhat test .\test\token\ERC20\ERC20.test.js
      ...
        76 passing (11s)

### Breaking change

Open a file to edit:

    code .\contracts\token\ERC20\ERC20.sol

Change a line:

    function decimals() public view virtual override returns (uint8) {
        return 42;
    }

Run the test:

      npm run test .\test\token\ERC20\ERC20.test.js
      ...
       75 passing (7s)
        1 failing
        1) Contract: ERC20
             has 18 decimals:
            AssertionError: expected '42' to equal '18'
            + expected - actual
            -42
            +18

## Quality of code

* Composability
* Upgradeability
* Maintainability and readability
* Managing work flow and progress
* Reaching peace of mind

## Hardhat setup

* Creating a base repository
* Setup hardhat with typescript
* Configure VS Code
* Hardhat scripts and tasks
* VS Code extensions recommended

### References

<https://hardhat.org/getting-started/>

<https://hardhat.org/guides/typescript.html>

<https://hardhat.org/guides/vscode-tests.html>

### Steps

* Creating a new project named `project`:

      // Exit your working folder:
      cd ..
      // Alternatively you could pick a directory in another place, like "cd ~/desktop"

      // Create a new folder called "project"
      mkdir project

      // Enter that folder

      cd project

* Starting a new project using Yarn Berry:

      yarn init -2
          ...
      yarn config set nodeLinker node-modules
      yarn add hardhat --dev
      rm .\README.md
      yarn hardhat init
          "Create a TypeScript project"
          ...
          .gitignore? Y
      yarn add --dev [list of suggested dev dependencies above]
      yarn add mocha --dev
      code .

### Recommended extensions

[Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)

[Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) or [Hardhat](https://hardhat.org/hardhat-vscode/docs/overview)

### Environment setup

Suggested renaming:

    // Renaming "test" folder
    mv test tests

_.mocharc.json_ file:

    {
      "require": "hardhat/register",
      "timeout": 40000,
      "_": ["tests/**/*.ts"]
    }

_hardhat.config.ts_ file:

    {
    const config: HardhatUserConfig = {
    ...
      paths: { tests: "tests" },
    ...
      }
    }

_tsconfig.json_ file:

    ...
      "include": ["./scripts", "./tests", "./typechain-types"],
      "files": ["./hardhat.config.ts"],
    ...

Create env file in root project folder:

_.env_ file:

    MNEMONIC="here is where your twelve words mnemonic should be put my friend"
    PRIVATE_KEY="<your private key here if you don't have a mnemonic seed>"
    INFURA_API_KEY="********************************"
    INFURA_API_SECRET="********************************"
    ALCHEMY_API_KEY="********************************"
    ETHERSCAN_API_KEY="********************************"

Edit the environment with your keys:

    code .env

Test it out:

     yarn hardhat compile 
     yarn hardhat test 

Accounts task:

    task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
      const accounts = await hre.ethers.getSigners();

      for (const account of accounts) {
        console.log(account.address);
      }
    });

Test it out:

    yarn hardhat accounts 

## Coding in VS Code

* Syntax for typescript scripts
* How the project operates
* Writing a test file
* Using Ethers.js library
* Using Hardhat toolbox
* Using Typechain library
* Testing syntax
* Running a test file

### References

<https://docs.ethers.io/v5/>

<https://mochajs.org/>

<https://hardhat.org/hardhat-chai-matchers/docs/overview>

<https://www.chaijs.com/guide/>

<https://github.com/dethcrypto/TypeChain>

### Clearing template files

    rm .\contracts\*
    rm .\scripts\*
    rm .\tests\*
    yarn hardhat clean

---

## Homework

* Create Github Issues with your questions about this lesson
* Read the references
* Get to know Hardhat and Ethers.js documentation
