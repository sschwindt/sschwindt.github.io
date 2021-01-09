module.exports = {
  siteMetadata: {
    title: 'Sebastian Schwindt',
    titleTemplate: "%s · Hydro-morphodynamics",
    author: 'Sebastian Schwindt',
    description: 'Hydraulics, Morphodynamics and Fluvial Ecosystems Science',
    url: 'https://www.sebastian-schwindt.org',
    siteUrl: 'https://sebastian-schwindt.org',
    image: "src/images/hycon.png",
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/hycon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-sitemap',
    {
      resolve: `gatsby-plugin-gdpr-cookies`,
      options: {
        googleAnalytics: {
          trackingId: "G-LMMG1NJ3C3", // leave empty if you want to disable the tracker
          cookieName: "gatsby-gdpr-google-analytics", // here can you change the cookie name
          anonymize: true, // default
        },
        // defines the environments where the tracking should be available  - default is ["production"]
        environments: ["production", "development"],
      },
    },
  ],
}
