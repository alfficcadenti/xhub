# Contributing

* [How To Submit A Change](#how-to-submit-a-change)
* [How Your Change Gets Merged](#how-your-change-gets-merged)

## How To Submit A Change
### 0. File an issue
It's best to file a preliminary issue describing the problem and what kind of changes would fix it. After some discussion and architecting about the approach, proceed to step 1 below.

### 1. Fork this repo
You should create a fork of this project in your account and work from there. You can create a fork by clicking the fork button in GitHub.

### 2. One feature, one branch
Work for each new feature/issue should occur in its own branch.  To create a new branch from the command line:

    git checkout -b my-new-feature

where `my-new-feature` describes the ticket that you're working on.

### 3. Check code style
Before opening a pull request, your new code should conform to the style guide.  Projects scaffolded using Vrbo's generators will include `eslint`. Code style can be checked by running:

    npm run lint

### 4. Add tests for any bug fixes or new functionality
Our goal for framework code is to keep coverage above 95%. Tests can be run by executing:

    npm run test:unit

`jest` will execute your tests, and notify you of any errors in your code or in style. It will also prepare a coverage report, which can be found at `docs/reports/coverage/index.html`.

### 5. Squash commits
Your PR should only have a single, descriptive commit. This helps to keep the project commit history from becoming cluttered. The preferred way to do this is is to run

    git rebase -i HEAD~<n>

where <n> is the number of preceeding commits to squash.

Your commit message will be included in the generated changelog, so make sure the commit message includes any critical information about the change.

### 6. Submit PR and describe the change
Push your changes to your branch and open a pull request against the parent repo on GitHub. The project owner will review your pull request and respond with feedback.

## How Your Change Gets Merged
Upon PR submission, your code will be reviewed by maintainers.

They will confirm at least the following:
- Tests run successfully. (unit, coverage, integration, style)
- Contribution policy has been followed.

Two (human) reviewers will need to sign off on your project before it can be merged.