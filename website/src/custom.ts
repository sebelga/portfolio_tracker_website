/**
 * This file is just to test that we can inject a custom script into a page
 * by passing an array to the layout_bottom.ejs partial.
 * Example:
 * 
 <%- include('./src/partials/layout_bottom.ejs', {
  extraScripts: ['/src/custom.ts']
 }) %>
 */

console.log("This is a custom script injected into the page!");
