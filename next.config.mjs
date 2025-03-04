import process from "process";

export default {
    webpack: (config) => {
      config.resolve.fallback = { process: require.resolve("process/browser") };
      return config;
    },
  };
  