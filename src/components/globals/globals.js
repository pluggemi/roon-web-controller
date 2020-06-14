import Vue from "vue";

const requireComponent = require.context(
  // Look for files in the current directory
  ".",
  // Do not look in subdirectories
  false,
  // Only include .vue files
  /[\w-]+\.vue/
);

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  const componentName = fileName
    // Remove the "./" from the beginning
    .replace(/^\.\//, "")
    // Remove the file extension from the end
    .replace(/\.vue/, "");

  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig);
});
