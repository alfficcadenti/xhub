let isVersionValid = false;
const path = require('path');

const logVersion = version => {
  const fs = require('fs');
  const dir = 'reports';

  if (!version || version.length === 0) {
    console.info('[info] Build Info was not found');

    return;
  }

  const versionFile = path.resolve(dir, 'version.txt');
  const deployedVersion = version.substring(0, 8);

  console.info(`[info] Version: ${deployedVersion}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(versionFile, deployedVersion, err => {
    if (err) {
      console.error(err);

      return;
    }
    console.info(`[info] ${deployedVersion} is created on ${versionFile}`);
  });

  return;
};

process.argv.forEach(val => {
  if (val.includes('version:')) {
    const argument = val.split(':');
    logVersion(argument[1]);
    isVersionValid = true;
  }
});

if (!isVersionValid) {
  console.info('[info] Build Info was not found');
}
