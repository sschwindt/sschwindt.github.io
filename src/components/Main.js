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
            <img src={pic01} alt="Sebastian Schwindt river hydraulics connectivity Python optimization" />
          </span>
          <p>
          Dr. sc. (PhD) Sebastian Schwindt (he/him) is a researcher focusing on the growing biodiversity and climate crises, applied to hydraulic systems, and using hydro-morphodynamic simulations, field data, and remote sensing. He leads the hydro-morphodynamics group at the <a href="https://www.iws.uni-stuttgart.de/" target="_blank" rel="noreferrer">Institute for Modelling Hydraulic and Environmental Systems (IWS)</a> at the University of Stuttgart (<a href="https://www.iws.uni-stuttgart.de/en/institute/team/Schwindt/" target="_blank" rel="noreferrer">visit his institutional profile</a>). Beyond his core focus, he remains dedicated to hydropower-related challenges, including reservoir sedimentation and mitigating impacts in residual river stretches governed by environmental flows (e-flows).
          </p>
          <p>
            He completed his Bachelor's (2010) and Master's (2012) studies in Environmental Engineering at the Technical University of Munich (Germany). After a detour into the private hydropower sector, Sebastian accomplished his doctorate in Civil Engineering at the Ecole Polytechnique fédérale de Lausanne (EPFL, Switzerland) from 2013 to 2017 under the supervision of Prof. Anton J. Schleiss and Prof. Mário Franca. His PhD thesis entitled <em>Hydro-morphological processes through permeable sediment traps at mountain rivers</em> provides new insights into fluid-sediment-structure interactions and flood risk mitigation with minimmized longitudinal connectivity interruptions (<a href="https://infoscience.epfl.ch/record/231182" target="_blank" rel="noreferrer">download at epfl.ch</a>).
          </p>
          <p>
            Later, Sebastian pursued postdoctoral research at the University of California, Davis (USA), with <a href="http://pasternack.ucdavis.edu/" target="_blank" rel="noreferrer">Prof. Greg Pasternack</a>. The emphasis of his postdoctoral research was on the lateral connectivity and ecohydraulic enhancement of the Yuba River (California, USA) based on remote sensing (lidar) imagery and numerical models. Find the full scientific record at <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID.org</a>.
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
            <li>Geospatial data processing with QGIS and Python</li>
            <li>Numerical modeling, sediment transport, and morphodynamics for hydraulic engineering</li>
            <li>Integrated flood protection management, river restoration, and river engineering</li>
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
          Restoring fluvial systems is increasingly recognized as a critical strategy for addressing the growing biodiversity and climate crises. While most restoration efforts prioritize flagship fish species, evidence suggests that smaller aquatic organisms play an outsized role in maintaining ecosystem services and regulating greenhouse gas fluxes in rivers. Sebastian's research centers on the fundamental water-driven processes that underpin these vital functions, tackling a broad spectrum of ecologically and climatologically urgent questions.
          Recent investigations span rivers, ecohydraulics, fluvial geomorphology, AI-optimized numerical modeling, vertical connectivity, and riverbed clogging (also known as "colmation"). By integrating hydro-morphodynamic simulations, field data, and remote sensing, Sebastian's group assesses river dynamics, ecological integrity, and flood hazards to support science-backed restoration. Beyond this core focus, his research remains dedicated to hydropower-related challenges, including reservoir sedimentation and mitigating impacts in residual river stretches governed by environmental flows (e-flows).
          </p>
          <p>For a comprehensive list of publications, please visit Sebastian's <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID</a> or <a href="https://scholar.google.com/citations?user=246FKewAAAAJ&hl=en&citsig=AMD79oouG1nzUOL85fNl5zk00cmjothoLQ" target="_blank" rel="noreferrer">Google Scholar</a> profiles.
            </p>
            <p>
            <b>Codes, research algorithms, and Python</b> packages from Sebastian are mostly hosted on GitHub along with detailed docs. The following Python packages and programs are available (among others):
            <ul>
            <li><a href="https://flusstools.readthedocs.io/" target="_blank" rel="noreferrer">FlussTools</a>: A Python3 package for river analyses, including geo-spatial analyst functions, numerical model uncertainty assessments (fuzzy set based), lidar data processing tools, and database tweaks for the application of plants in restoration science. Sebastian maintains this repository together with former and current undergrad and grad students.</li>
            <li><a href="https://riverarchitect.github.io/" target="_blank" rel="noreferrer">River Architect</a>: A Python-based back-end tool for river design and habitat enhancement with an extensive <a href="https://riverarchitect.github.io/RA_wiki/main_page" target="_blank" rel="noreferrer">Wiki</a>.</li>
            <li><a href="https://sschwindt.github.io/OpenScience/" target="_blank" rel="noreferrer">Open Science</a>: A repository that links to data and codes of Sebastian s PhD research.</li>
            </ul>
            </p>
            <p>
            <b>Awards and Distinctions</b><br/>
            <ul>
            <li><a href="https://ascelibrary.org/journal/jhend8" target="_blank" rel="noreferrer">Best Reviewer Award from the Journal of Hydraulic Engineering (ASCE, 2024)</a></li>
            <li><a href="https://www.iahr.org/index/dawards/12" target="_blank" rel="noreferrer">IAHR Gerhard Jirka Award for the presentation <i>Modelling and Design Automation of Nature-based River Engineering</i> at the IAHR Europe 2020 conference, Warsaw, Poland</a></li>
            <li><a href="https://connect.agu.org/epsp/spotlight/oct-2019" target="_blank" rel="noreferrer">American Geophysical Union (AGU) – Earth and Planetary Surface Processes&#39; Early Career Researcher Spotlight (October 2019)</a></li>
            </ul>
            </p>
            <p>
            Sebastian's scientific projects are mostly listed on <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID</a>. 
          </p>
          <p> Finalized/non-scientific include:
          <ul>
            <li>Hybrid (physical and numerical) design of a slot fisway</li>
            <li><a href="https://dirtx-reservoirs4future.eu/" target="_blank" rel="noreferrer">DIRT-X</a>: Delivery Impacts on Reservoirs in changing climaTe and society aCROSS scales and sectors.</li>
            <li><a href="https://www.verbund.com/de-de/ueber-verbund/kraftwerke/unsere-kraftwerke/toeging-neu" target="_blank" rel="noreferrer">Numerical modeling of a 31-km river stretch bypassing a hydropower plant at the Inn River</a> (Germany).</li>
            <li><a href="https://portal.nifa.usda.gov/web/crisprojectpages/1013705-californian-river-assessment-management-and-rehabilitation.html" target="_blank" rel="noreferrer">Best available science analysis of Habitat Enhancement of the lower Yuba River</a> (with University of California, Davis, USA)</li>
            <li>Expertise for the revitalization of the Arbogne River, Fribourg, Switzerland</li>
            <li>Physical modelling optimization of a filter check dam at the Drance, Martigny, VS, Switzerland </li>
            <li><a href="https://www.rivermanagement.ch/" target="_blank" rel="noreferrer">Rivermanagement: Sediment and habitat dynamics in Switzerland</a> </li>
            <li>Restoration of the pumped storage hydropower plant Happurg, Germany</li>
            <li>Physical model of the Rhône at Massongex for the installation of a run-of-river hydropower plant</li>
            <li>Preparation of the feasibility study for the Isimba hydropower plant in Uganda</li>
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
