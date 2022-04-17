# Projet 3

# Alyra - Project 3

## Table of contents

- [TOC](#Table-of-contents)
- [Subject](#Subject)
    - [Your DApp must allow](#Your-DApp-must-allow)
    - [Recommendations and requirements](#Recommendations-and-requirements)
    - [To give back](#To-give-back)
- [Getting Started](#Getting-Started)
    - [Set node version](#Set-node-version)
    - [Setup front-end environnement](#Setup-front-end-environnement)
    - [Setup back-end environnement](#Setup-back-end-environnement)
- [Supports](#Supports)
- [TODO](#Todo)
- [Questions](#Questions)

---

---

## Subject

> Create a DApp that meets the specifications listed below and deploy it on [**Heroku**](https://www.heroku.com/) and [**Github Pages**](https://pages.github.com/)
> 

### **Your DApp must allow:**

- registration of a white list of voters.
- the administrator to start the recording session of the proposal.
- registered voters to register their proposals.
- the administrator to end the proposal recording session.
- the administrator to start the voting session.
- registered voters to vote for their favorite proposals.
- the administrator to end the voting session.
- administrator to count the votes.
- everyone to see the result.

### **Recommendations and requirements:**

- Your code must be optimal.
- Your Dapp must be secure.
- You must use Truffle's react box.

### **To give back :**

- Demo video of your Front features.
- Link to your Github repository.
- The Heroku Link
- The Github Pages link

## Getting Started:

### **Set node version:**

> Using node v14 for the project
> 

```bash
nvm use 14
```

### **Setup front-end environnement:**

[Truffle unbox read](https://trufflesuite.com/boxes/react/)

```bash
npx truffle unbox react
```

Additional dependencies in front-end:

- [dotenv](https://www.npmjs.com/package/dotenv)
- [@truffle/hdwallet-provider](https://www.npmjs.com/package/@truffle/hdwallet-provider)

```bash
cd client
npm install dotenv @truffle/hdwallet-provider
```

client/package.json:

```json
{
...
	"dependencies": {
	    "@truffle/hdwallet-provider": "^2.0.6",
	    "dotenv": "^16.0.0",
	    "react": "^17.0.2",
	    "react-dom": "^17.0.2",
	    "react-scripts": "3.2.0",
	    "web3": "^1.6.1"
	  },
...
}
```

### **Setup back-end environnement:**

> At the root of the project
> 

Dependencies:

- [chai](https://www.npmjs.com/package/chai)
- [truffle@5.4.29](https://www.npmjs.com/package/truffle/v/5.4.29)
- [solidity-coverage](https://www.npmjs.com/package/solidity-coverage)
- [eth-gas-reporter](https://www.npmjs.com/package/eth-gas-reporter)
- [@openzeppelin/contracts](https://www.npmjs.com/package/@openzeppelin/contracts)
- [@openzeppelin/test-helpers](https://www.npmjs.com/package/@openzeppelin/test-helpers)

```bash
npm init
npm i --save-dev chai truffle@5.4.29 solidity-coverage eth-gas-reporter @openzeppelin/contracts @openzeppelin/test-helpers
```

client/package.json:

```json
{
...
	"devDependencies": {
    "@openzeppelin/contracts": "^4.5.0",
    "@openzeppelin/test-helpers": "^0.5.15",
    "chai": "^4.3.6",
    "eth-gas-reporter": "^0.2.25",
    "solidity-coverage": "^0.7.20",
    "truffle": "^5.4.29"
  }
...
}
```

## Supports:

## TODO:

- [ ]  Setup environnement:
    - [x]  Install modules
    - [ ]  Clean project before starting:
    - [ ]  Configure `truffle-config.js`
    - [ ]  Add file voting.sol
    - [ ]  Add file test_voting.sol

## Questions:

- Qu'elle va être l'utilité de github pages?