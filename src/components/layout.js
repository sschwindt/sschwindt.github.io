import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import CookieConsent from "react-cookie-consent";

import '../assets/scss/main.scss'


const Layout = ({ children, location }) => {

  let content;

  if (location && location.pathname === '/') {
    content = (
      <div>
        {children}
      </div>
    )
  } else {
    content = (
      <div id="wrapper" className="page">
        <div>
          {children}
        </div>
      </div>
    )
  }

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: 'Sebastian Schwindt - Water Science' },
              { name: 'keywords', content: 'hydraulics, teaching, warem, stuttgart, morphodynamics, python, qgis, numerical modelling, ecohydraulics, yuba, inn, drance, lausanne, davis, sebastian, schwindt' },
            ]}
          >
            <html lang="en" />
          </Helmet>
          <CookieConsent
              location="bottom"
              buttonText="Accept"
              style={{ background: "#0e102e" }}
              enableDeclineButton="True"
              declineButtonText="Decline"
              cookieName="gatsby-gdpr-google-analytics"
              buttonStyle={{ color: "#33ffa5", background: "#09923d"}}
              declineButtonStyle={{ color: "#33ffa5", background: "#3f0573"}}
          >
              This website uses cookies to enhance the user experience.
          </CookieConsent>
          {content}
        </>
      )}
    />
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
