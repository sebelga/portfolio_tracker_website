rm -rf ./dist

echo "Building website..."
yarn website:build

echo "Building docs..."
yarn docs:build
mv ./documentation/build ./dist/docs
rm -rf ./dist/docs.html