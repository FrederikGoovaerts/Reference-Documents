module.exports = {
  title: "Tutoring guides and how-to's",
  // tagline: "The tagline of my site",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "FrederikGoovaerts", // Usually your GitHub org/user name.
  projectName: "Guides", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Tutoring",
      items: [
        {
          to: "docs/",
          activeBasePath: "Documentation",
          label: "Docs",
          position: "left",
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
