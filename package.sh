#!/usr/bin/env sh

NODE_ABI="node-64"
VERSION=$(node -pe "require('./package.json').version")

rm -rf dist
mkdir dist
ls -l releases

mkdir releases/dcp-$VERSION-linux-x64
mkdir releases/dcp-$VERSION-macos-x64
mkdir releases/dcp-$VERSION-win-x64

mv releases/dcp-linux-x64 releases/dcp-$VERSION-linux-x64/dcp
mv releases/dcp-macos-x64 releases/dcp-$VERSION-macos-x64/dcp
mv releases/dcp-win-x64.exe releases/dcp-$VERSION-win-x64/dcp.exe

cp LICENSE.md releases/dcp-$VERSION-linux-x64/
cp LICENSE.md releases/dcp-$VERSION-macos-x64/
cp LICENSE.md releases/dcp-$VERSION-win-x64/

cp README.md releases/dcp-$VERSION-linux-x64/README
cp README.md releases/dcp-$VERSION-macos-x64/README
cp README.md releases/dcp-$VERSION-win-x64/README

cd releases
../node_modules/.bin/cross-zip dcp-$VERSION-linux-x64 ../dist/dcp-$VERSION-linux-x64.zip
../node_modules/.bin/cross-zip dcp-$VERSION-macos-x64 ../dist/dcp-$VERSION-macos-x64.zip
../node_modules/.bin/cross-zip dcp-$VERSION-win-x64 ../dist/dcp-$VERSION-win-x64.zip

cd ..
rm -rf releases
