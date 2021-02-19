# Unlock 🔓 indirect `yarn` dependencies 🧶

### Motivation

According to the feature request in [yarnpkg/yarn#4986](https://github.com/yarnpkg/yarn#4986) (opened 11/2017), `yarn` seems to install (of course) "indirect" or "transitive" dependencies for packages it installs, and it also writes these dependencies to the `yarn.lock` file. 

However, a later `yarn upgrade` will only check _direct_ dependencies. Only when a _direct_ dependency is upgraded, its transitive dependencies are upgraded as well.

> To-Do: Check if this even has the additional requirement that the previously installed version of the transitive dependency no longer matches the requirements of the new package?

This means, for example, that
* when you install a package A that has a dependency on some other package B,
* and B fixes a security issue and creates a new version for the fix,
* `yarn` is _not_ going to update B for you 
* _unless_ A releases a new version (with possibly increased version requirements in B?).

### The Workaround

The script in this repository tries to work around this situation.

It will **remove all packages from the `yarn.lock` file** that are **not specified as direct dependencies**, i. e. in `dependencies`, `devDependencies`, `peerDependencies` or `optionalDependencies` of your `package.json` file.

The idea is that for packages that you don't specify as your own (direct) dependencies, you generally don't care what version gets installed.

### Usage

In the directory containing your `yarn.lock` file, run 

```bash
node ../path/to/unlock-indirect-yarn-dependencies/dist/index.js
(... prints unlocked packages ...)
yarn install
```

The first step will remove indirect dependencies from the `yarn.lock` file, and the subsequent `yarn install` will take care of resolving and updating the indirect dependencies again.

Don't forget to commit the updated `yarn.lock` file to version control.

### Credits, Copyright and License

This script was initially suggested by @dacioromero in [this comment](https://github.com/yarnpkg/yarn/issues/4986#issuecomment-598746788).

This repository is provided by webfactory GmbH, Bonn, Germany. We're a software development agency with a focus on PHP (mostly [Symfony](http://github.com/symfony/symfony)). If you're a developer looking for new challenges, we'd like to hear from you!

- <https://www.webfactory.de>
- <https://twitter.com/webfactory>

Copyright 2021 webfactory GmbH, Bonn. Code released under [the MIT license](LICENSE).
