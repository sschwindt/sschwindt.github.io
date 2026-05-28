import PropTypes from 'prop-types'
import React from 'react'
import pic01 from '../images/ssc.png'
import pic02 from '../images/under-water.png'
import pic03 from '../images/lidar-wide.jpg'

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
            <img src={pic01} alt="Sebastian Schwindt river data ecohydraulics numerical simulations connectivity Python" />
          </span>
          <p>
          PD Dr. sc. (PhD) Sebastian Schwindt (he/him) is a researcher specializing in ecohydraulics and hydro-morphodynamics under global change pressure, and earned his habilitation with the venia legendi in ecohydraulics in July 2025. He leads the hydro-morphodynamics group at the <a href="https://www.iws.uni-stuttgart.de/" target="_blank" rel="noreferrer">Institute for Modelling Hydraulic and Environmental Systems (IWS)</a> at the University of Stuttgart (<a href="https://www.iws.uni-stuttgart.de/en/institute/team/Schwindt/" target="_blank" rel="noreferrer">visit his institutional profile</a>).
          </p>
          <p>
            He completed his Bachelor's (2010) and Master's (2012) studies in Environmental Engineering at the Technical University of Munich (Germany). After a detour into the private hydropower sector, Sebastian accomplished his doctorate in Civil Engineering at the Ecole Polytechnique fédérale de Lausanne (EPFL, Switzerland) from 2013 to 2017 under the supervision of Prof. Anton J. Schleiss and Prof. Mário Franca.
          </p>
          <p>
            Later, Sebastian pursued postdoctoral research at the University of California, Davis (USA), with <a href="http://pasternack.ucdavis.edu/" target="_blank" rel="noreferrer">Prof. Greg Pasternack</a>. The emphasis of his postdoctoral research was on the flood-safe restoration and ecohydraulic enhancement of the Yuba River (California, USA) based on remote sensing (lidar) imagery and numerical models. Find the full scientific record at <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID.org</a>.
          </p>
          <p>
            Passionate about "black screens," Sebastian helps administer the web presences of the <a href="https://units.fisheries.org/fishpassagejointcommittee/" target="_blank" rel="noreferrer">AFS-BES/ASCE-EWRI Joint Committee on Fisheries Engineering and Science</a> and the Ecohydraulics community (<a href="https://ecohydraulics.org" target="_blank" rel="noreferrer">ecohydraulics.org</a>), where he also regularly contributes blog posts.
            Additionally, Sebastian contributes to several groups and divisions within the <a href="https://en.dwa.de/en/" target="_blank" rel="noreferrer">Deutsche Vereinigung für Wasserwirtschaft, Abwasser und Abfall (DWA) </a>.
          </p>
          {close}
        </article>

        <article
          id="teaching"
          className={`${this.props.article === 'teaching' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Teaching <span className="icon fa-graduation-cap"></span></h2>
          <span className="image main">
            <img src={pic02} alt="study water resources engineering management research" />
          </span>
          <p>
             Sebastian offers classes, workshops, and courses covering the following topics:
            <ul>
            <li>Basic and advanced Python programming (including collaborative code design and documentation) for water resources engineering, research, and (geospatial) data analysis</li>
            <li>Numerical surface water simulations</li>
            <li>Integrated flood protection planning, river restoration, and river engineering</li>
            </ul>
            Sebastian also offers tutorials, supplemental materials, and practice-oriented exercises at <b><a href="https://hydro-informatics.com/" title="hydro-informatics.com" target="_blank" rel="noreferrer">hydro-informatics.com</a></b>.
          </p>
          <p>
            <b>Graduating students: Are you looking for an exciting Bachelor or Master Thesis?</b> Visit the <a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/" target="_blank" rel="noreferrer">IWS team website</a> to apply for one of the announcements. If your are curious about virtual worlds: Contact Sebastian for topics related to numerical simulations with video engines<br/>
            <b>Do you already have an idea for an innovative research graduation project?</b> Contact Sebastian and get your creativity started. <br/>
            For thesis templates, visit <a href="https://github.com/Ecohydraulics/latex-thesis-template/" target="_blank" rel="noreferrer">the Ecohydraulics Github pages</a>.
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
            <img src={pic03} alt="river sciences" />
          </span>
          <p>
          Restoring aquatic ecosystems is increasingly recognized as a critical strategy for addressing the growing biodiversity and climate crises. While many restoration efforts prioritize flagship species, evidence suggests that smaller aquatic organisms play an outsized role in maintaining ecosystem services and regulating greenhouse gas fluxes in rivers. Sebastian's research is centered on lab-sizes, field-scale, and numerical analyses to gain insights into water-driven processes that underpin vital functions, tackling a broad spectrum of ecologically and climatologically urgent questions for the broader society. Recent investigations span AI-optimized numerical modeling, data-driven ecohydraulic site analysis, and riverbed clogging (also referred to as "colmation" in Europe).
          </p>
          <p>For a comprehensive list of publications and projects, please visit Sebastian's <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID</a> or <a href="https://scholar.google.com/citations?user=246FKewAAAAJ&hl=en&citsig=AMD79oouG1nzUOL85fNl5zk00cmjothoLQ" target="_blank" rel="noreferrer">Google Scholar</a> profiles.
            </p>
            <p>
            <b>Codes, research algorithms, and Python</b> packages from Sebastian are mostly hosted on GitHub along with detailed docs: <a href="https://github.com/sschwindt/" target="_blank" rel="noreferrer">https://github.com/sschwindt/</a>
            </p>
            <p>
            <b>Awards and Distinctions</b><br/>
            <ul>
            <li><a href="https://ascelibrary.org/journal/jhend8" target="_blank" rel="noreferrer">Best Reviewer Award from the Journal of Hydraulic Engineering (ASCE, 2024)</a></li>
            <li><a href="https://www.iahr.org/index/dawards/12" target="_blank" rel="noreferrer">IAHR Gerhard Jirka Award for the presentation <i>Modelling and Design Automation of Nature-based River Engineering</i> at the IAHR Europe 2020 conference, Warsaw, Poland</a></li>
            <li><a href="https://connect.agu.org/epsp/spotlight/oct-2019" target="_blank" rel="noreferrer">American Geophysical Union (AGU) – Earth and Planetary Surface Processes&#39; Early Career Researcher Spotlight (October 2019)</a></li>
            </ul>
            </p>
          <b>Get more information or start a new project by sending an inquiry (see contact options in the Outreach section).</b>
          <p>
          </p>
          {close}
        </article>

        <article
          id="outreach"
          className={`${this.props.article === 'outreach' ? 'active' : ''} ${
            this.props.articleTimeout ? 'timeout' : ''
          }`}
          style={{ display: 'none' }}
        >
          <h2 className="major">Outreach</h2>
          <p>
          Find tutorials and short videos zooming into water resources and numerical tools also on Sebastian&#39;s <a href="https://www.youtube.com/@hydroinformatics" target="_blank" rel="noreferrer">@hydroinformatics (Hydro-Morphodynamics) channel on YouTube.</a>
          </p>
          <p>Read Sebastian in the Ecohydraulics community blog at <a href="https://ecohydraulics.org/about/web-dev-blog/" target="_blank" rel="noreferrer">https://ecohydraulics.org</a>, where he also is a site admin.
          </p>
          <p>For contact options visit <a href="https://www.iws.uni-stuttgart.de/en/institute/team/Schwindt/" target="_blank" rel="noreferrer">iws.uni-stuttgart.de</a> or check out social media like <a href="https://www.linkedin.com/in/sebastian-schwindt" target="_blank" rel="noreferrer">Linkedin</a> and <a href="https://www.researchgate.net/profile/Sebastian_Schwindt" target="_blank" rel="noreferrer">ResearchGate</a>.
          </p>
          <ul className="icons">
            <li>
              <a href="https://www.linkedin.com/in/sebastian-schwindt" target="_blank" rel="noreferrer" className="icon fa-linkedin">
                <span className="label">Linkedin</span>
              </a>
            </li>
            <li>
              <a href="https://scholar.google.com/citations?user=246FKewAAAAJ&hl=en" target="_blank" rel="noreferrer" className="icon fa-google">
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
