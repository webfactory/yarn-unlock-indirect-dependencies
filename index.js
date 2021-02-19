const fs = require('fs');
const lockfile = require('@yarnpkg/lockfile');
const package = require(process.cwd() + '/package.json');
const lock = lockfile.parse(fs.readFileSync('yarn.lock', 'utf-8')).object;

const allDeps = new Set();

const parseDep = ([name, version]) => {
  allDeps.add(`${name}@${version}`)
};

Object.entries(package.dependencies||[]).forEach(parseDep);
Object.entries(package.devDependencies||[]).forEach(parseDep);
Object.entries(package.peerDependencies||[]).forEach(parseDep);
Object.entries(package.optionalDependencies||[]).forEach(parseDep);

const newLock = Object.fromEntries(Object.entries(lock).filter(([dep]) => {
  if (allDeps.has(dep)) {
    return true;
  }
  
  console.log(`Unlocking ${dep}`);

  return false;
}));

const newLockString = lockfile.stringify(newLock);

fs.writeFileSync('yarn.lock', newLockString);

console.log("Done. Don't forget to run 'yarn install'!");
