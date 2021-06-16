# Contributing to Homely
Making contributing to this project is as easy and transparent as possible, whether it's:
- Reporting an issue.
- Discussing the current state of the code.
- Submitting a fix.
- Proposing new features.
- Becoming a maintainer.


**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request).


## Development Process
We chose the [shared repository model](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-collaborative-development-models). Contributors are invited to push changes by creating topic branches. Pull requests are later required to be raised for these changes <a href="https://github.com/dhruvshettty/homely-surveillance/pulls">here</a> for code review and general discussions, and after review, these can be merged into the main repository.


## Using the Project's Standard Commit Messages
This project is using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard. Various Tooling for Conventional Commits can be found <a href="https://www.conventionalcommits.org/en/v1.0.0/#tooling-for-conventional-commits">here</a>. Considering the project stack, we suggest: [Node.js Tool](https://github.com/commitizen/cz-cli) or [VSCode Tool](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits). 


## Using the Airbnb JavaSript Style Guide
This project is using the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). Enable the linting feature through the following steps ([courtesy](https://www.notion.so/ESLint-Pluggable-JavaScript-linter-325d79bd7ef34f0a8916a22727fa2491)):
1. Install ESLint as a development dependency by executing this in your main project folder: `npm install eslint --save-dev`.
2. Then, from the same folder set up a configuration file with the eslint --init command: `./node_modules/.bin/eslint --init`.
3. Finally, run ESLint and analyze code from your terminal with the following command: `./node_modules/.bin/eslint yourfile.js`.
4. Alternatively, you can add an [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) VSCode extension for editor level linting.


## Full Local Development
Follow the below steps to get a local testing environment for your application:
1. Install the latest Node.js LTS from [here](https://nodejs.org/en/download/).
2. Install the MongoDb Community Server for your OS by following the installation guide from [here](https://docs.mongodb.com/manual/installation/).
3. Clone this repository into your local project directory.
4. Install the package and dev dependencies using `npm install` from your local project directory.


## Pull Requests
1. Fork the repo and create your branch (usually named `patch-%the number of PRs you've already made%`) from `staging` (if using a forked repository).
2. Create a topic branch and push changes to this newly created branch (if directly pushing changes to upstream).
2. If you've added code that should be tested, add some test examples.
3. Ensure to describe your pull request using the template provided.

## Issues
We use GitHub issues to track public bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue. Report a bug by <a href="https://github.com/dhruvshettty/homely-surveillance/issues">opening a new issue</a>.

## License
By contributing to Homely, you agree that your contributions will be licensed under the [LICENSE file](LICENSE).
