# TradeGist website

[![Netlify Status](https://api.netlify.com/api/v1/badges/896e8642-aab3-4e65-a31f-899ca437284b/deploy-status)](https://app.netlify.com/projects/tradegist/deploys)

This is the repo for the TradeGist website.

## Resize images for the Gallery

Use the `resize_images.py` python script. The output will be generated in a `resized` folder inside the input folder.

```py
python3 ./scripts/resize_images.py <maxImageWidth> <folderWithImages>

# example
python3 ./scripts/resize_images.py 1600 /Users/seb/Desktop/gallery/originals
```

## Favicon

Favicons where generated from https://realfavicongenerator.net/

If we need to update it, upload there a 512x512 svg or png and they will generate all the different versions.
