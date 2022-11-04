import PropTypes from 'prop-types'
import React from 'react'

const Header = props => (
  <header id="header" style={props.timeout ? { display: 'none' } : {}}>
    <ul className="icons">
            <li>
              <a href="http://www.linkedin.com/in/sebastian-schwindt" target="_blank" rel="noreferrer" className="icon fa-linkedin">
                <span className="label">Linkedin</span>
              </a>
            </li>
            <li>
              <a href="https://scholar.google.com/citations?user=246FKewAAAAJ&hl=en&citsig=AMD79oouG1nzUOL85fNl5zk00cmjothoLQ" target="_blank" rel="noreferrer" className="icon fa-google">
                <span className="label">Google Scholar</span>
              </a>
            </li>
            <li>
              <a href="https://www.researchgate.net/profile/Sebastian_Schwindt" target="_blank" rel="noreferrer" className="data-icon fa-brands:researchgate">
                <span className="label">R<sup>G</sup></span>
              </a>
            </li>
            <li>
              <a href="https://github.com/sschwindt" target="_blank" rel="noreferrer" className="icon fa-github">
                <span className="label">GitHub</span>
              </a>
            </li>
          </ul>
    <div className="content">
      <div className="inner">
        <h1>Sebastian Schwindt</h1>
        <p>
          Water Science{' '}
          <br/>
          {' '}
          <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer"><b>ORCID</b></a>
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
              props.onOpenArticle('teaching')
            }}
          >
            Teaching
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
