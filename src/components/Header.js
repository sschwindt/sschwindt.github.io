import PropTypes from 'prop-types'
import React from 'react'

const Header = props => (
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <div className="content">
      <div className="inner">
        <h1>Sebastian Schwindt</h1>
        <p>
          hydro-morphodynamics and fluvial ecosystems{' '}
          <br />
          {' '}
          <a href="https://orcid.org/0000-0002-7206-0542">ORCID</a>
        </p>
      </div>
    </div>
    <nav>
      <ul>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('about')
            }}
          >
            About
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('students')
            }}
          >
            Students
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('research')
            }}
          >
            Research
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              props.onOpenArticle('contact')
            }}
          >
            Contact
          </button>
        </li>
      </ul>
    </nav>
  </header>
)

Header.propTypes = {
  onOpenArticle: PropTypes.func,
  timeout: PropTypes.bool,
}

export default Header
