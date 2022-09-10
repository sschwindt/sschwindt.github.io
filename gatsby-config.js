module.exports = {
  siteMetadata: {
    title: 'Sebastian Schwindt',
    titleTemplate: "%s · Hydro-Logical Ecosystem Science",
    author: 'Sebastian Schwindt',
    description: 'Hydro-logical Restoration Ecology, Ecohydraulics, and Python Programming for Workflow Automation in Water Resources Engineering and Research',
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
          trackingId: "G-253790289", // leave empty if you want to disable the tracker
          cookieName: "gatsby-gdpr-google-analytics", // here can you change the cookie name
          anonymize: true, // default
        },
      // defines the environments where the tracking should be available  - default is ["production"]
        environments: ["production", "development"],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "G-LMMG1NJ3C3",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Defers execution of google analytics script after page load
        defer: false,
        // Any additional optional fields
        sampleRate: 5,
        siteSpeedSampleRate: 10,
      },
    },
  ],
}
