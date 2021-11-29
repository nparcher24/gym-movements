export const DBConfig = {
  name: "VideoDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "videos",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "video", keypath: "video", options: { unique: false } },
      ],
    },
  ],
};
