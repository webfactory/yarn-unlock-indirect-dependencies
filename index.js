#!/usr/bin/env node
const fs = require('fs');
const path = require('path')
const lockfile = require('@yarnpkg/lockfile');

const directory = process.argv[2] || ''
const package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf-8'));
const lock = lockfile.parse(fs.readFileSync(path.join(directory, 'yarn.lock'), 'utf-8')).object;
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

fs.writeFileSync(path.join(directory, 'yarn.lock'), newLockString);

console.log("Done. Don't forget to run 'yarn install'!");
