module.exports = {
  siteMetadata: {
    title: 'Sebastian Schwindt',
    titleTemplate: "%s · Hydro-morphodynamics",
    author: 'Sebastian Schwindt',
    description: 'Hydraulic, Morphodymnamic and Fluvial Ecosystems Science',
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
  ],
}
