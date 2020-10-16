import PropTypes from 'prop-types'
import React from 'react'
import pic01 from '../images/ssc.png'
import pic02 from '../images/under-water.png'
import pic03 from '../images/trout.jpg'

class Main extends React.Component {
  render() {
    let close = (
      <div
        className="close"
        onClick={() => {
          this.props.onCloseArticle()
        }}
      ></div>
    )

    return (
      <div
        ref={this.props.setWrapperRef}
        id="main"
        style={this.props.timeout ? { display: 'flex' } : { display: 'none' }}
      >
        <article
          id="about"
          className={`${this.props.article === 'about' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">About</h2>
          <span className="image main">
            <img src={pic01} alt="" />
          </span>
          <p>
            Dr. sc. Sebastian Schwindt is a researcher in the field of fluvial hydraulics and morphodynamics. His research focuses on numerical analyses, sediment transport, ecohydraulics, and ecosystem design. The latest research focus is on the implementation of efficient data analyses and computational methods.<br/>
            He completed his Bachelor (2010) and Master (2012) studies at the Technical University of Munich (Germany) in Environmental Engineering. After a short detour into the private sector, Sebastian Schwindt accomplished his doctorate at the Ecole Polytechnique fédérale de Lausanne (EPFL, Switzerland) from 2013 to 2017 under the supervision of Prof. Anton J. Schleiss and Prof. Mário Franca. The title of his PhD thesis is <em>Hydro-morphological processes through permeable sediment traps at mountain rivers</em> that sheds light on hazardous morphodynamic processes in mountain rivers (<a href="https://infoscience.epfl.ch/record/231182">download</a>).<br/>
            Between 2017 and December 2019, Sebastian Schwindt pursued postdoctoral research at the University of California, Davis (USA) with Prof. Greg Pasternack. The emphasis of his postdoctoral research was on the ecohydraulic enhancement of Californias Yuba River.<br/>More information about Sebastian Schwindt and his scientific career can be found on <a href="https://orcid.org/0000-0002-7206-0542">ORCID.org</a>.
          </p>
          {close}
        </article>

        <article
          id="students"
          className={`${this.props.article === 'students' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Students <span className="icon fa-graduation-cap"></span></h2>
          <span className="image main">
            <img src={pic02} alt="" />
          </span>
          <p>
            Digital teaching is now and this is why our online learning website <b><a href="https://hydro-informatics.github.io/" title="https://hydro-informatics.github.io/">hydro-informatics.github.io</a></b> offers easily accessible e-textbook, materials (such as Python scripts), and interesting exercises. Get ready with virtual machines to leverage powerful numerical simulation tools, manage Python environments, and perform efficient geo-spatial analyses.<br/>
            <b>Are you looking for an exciting Bachelor or Master Thesis?</b> Visit our <a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/">team website</a> to apply for one of our anouncements in the fields of hydro-morphodynamic modelling, restoration science, and computational hydraulics. We also offer interdisciplinary theses with links to psychology (human recognition), agriculture, and statistical methods.<br/>
            <b>You already have an idea for developing novel research or a practice (applied) project?</b> Use the contact page to write us a message and get your creativity started.
          </p>
          {close}
        </article>

        <article
          id="research"
          className={`${this.props.article === 'research' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Research</h2>
          <span className="image main">
            <img src={pic03} alt="" />
          </span>
          <p>
            Sebastian Schwindt made a fundamental contribution to restoration science with an algorithmic approach to the estimation of lifespans of river engineering features. The outcome is the software River Architect, which is freely available and thoroughly documented on <a href="https://riverarchitect.github.io/">riverarchitect.github.io</a>. 
          </p>
          {close}
        </article>

        <article
          id="contact"
          className={`${this.props.article === 'contact' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Contact</h2>
          <form method="post" action="#">
            <div className="field half first">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" />
            </div>
            <div className="field half">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message" rows="4"></textarea>
            </div>
            <ul className="actions">
              <li>
                <input type="submit" value="Send Message" className="special" />
              </li>
              <li>
                <input type="reset" value="Reset" />
              </li>
            </ul>
          </form>
          <ul className="icons">
            <li>
              <a href="http://www.linkedin.com/in/sebastian-schwindt" target="_blank" className="icon fa-linkedin">
                <span className="label">Linkedin</span>
              </a>
            </li>
            <li>
              <a href="https://scholar.google.ch/citations?user=GdmFKPgAAAAJ&hl=de&oi=ao" target="_blank" className="icon fa-google">
                <span className="label">Google Scholar</span>
              </a>
            </li>
            <li>
              <a href="https://www.researchgate.net/profile/Sebastian_Schwindt" target="_blank" className="data-icon fa-brands:researchgate">
                <span className="label">R<sup>G</sup></span>
              </a>
            </li>
            <li>
              <a href="https://github.com/sschwindt" target="_blank" className="icon fa-github">
                <span className="label">GitHub</span>
              </a>
            </li>
          </ul>
          {close}
        </article>
      </div>
    )
  }
}

Main.propTypes = {
  route: PropTypes.object,
  article: PropTypes.string,
  articleTimeout: PropTypes.bool,
  onCloseArticle: PropTypes.func,
  timeout: PropTypes.bool,
  setWrapperRef: PropTypes.func.isRequired,
}

export default Main
