#!/bin/bash

SELF_DIR=`dirname $0`

GAIA_BRANCH=master
if [ ! -z "$1" ]; then
  GAIA_BRANCH=$1
fi
echo "Fetching branch: $GAIA_BRANCH"

if [ ! -d gaia-$GAIA_BRANCH ] ; then
  echo "Cloning Gaia"
  git clone --depth=1 --branch $GAIA_BRANCH https://github.com/mozilla-b2g/gaia.git gaia-$GAIA_BRANCH
fi

rm gaia
ln -s gaia-$GAIA_BRANCH gaia

echo "Updating Gaia"
pushd gaia
git pull
popd

if [ ! -L gaia/apps/buddyup ] ; then
  echo "Creating symlink"
  pushd gaia/apps
  ln -sf ../../app buddyup
  popd

  echo "Deleting profiles to make sure buddyup is picked up"
  rm -rf profile*
fi
