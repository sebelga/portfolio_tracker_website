rm -rf ./dist

echo "Building website..."
yarn website:build

echo "Building docs..."
yarn docs:build

echo "Moving files..."
mv ./documentation/build ./dist/docs
rm -rf ./dist/docs.html

echo "Build complete!"