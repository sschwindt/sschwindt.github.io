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
            <img src={pic01} alt="Sebastian Schwindt rivers Python" />
          </span>
          <p>
          Dr sc. (PhD) Sebastian Schwindt (he/him) is a researcher in river ecosystems and morphodynamics at the University of Stuttgart (<a href="https://www.iws.uni-stuttgart.de/en/institute/team/Schwindt/" target="_blank" rel="noreferrer">visit his institutional profile</a>). He leads the hydro-morphological modeling group at the <a href="https://www.iws.uni-stuttgart.de/" target="_blank" rel="noreferrer">Institute for Modelling Hydraulic and Environmental Systems (IWS)</a>. His research embraces numerical analyses, riverbed clogging, ecohydraulics, and ecosystem design with data-driven techniques.
          </p>
          <p>
            He completed his Bachelor's (2010) and Master's (2012) studies in Environmental Engineering at the Technical University of Munich (Germany). After a detour into the private hydropower sector, Sebastian accomplished his doctorate at the Ecole Polytechnique fédérale de Lausanne (EPFL, Switzerland) from 2013 to 2017 under the supervision of Prof. Anton J. Schleiss and Prof. Mário Franca. His PhD thesis entitled <em>Hydro-morphological processes through permeable sediment traps at mountain rivers</em> provides new insights into sediment transport for landscape dynamics and flood risk mitigation in Alpine regions (<a href="https://infoscience.epfl.ch/record/231182" target="_blank" rel="noreferrer">download at epfl.ch</a>).
          </p>
          <p>
            Between 2017 and 2019, Sebastian pursued postdoctoral research at the University of California, Davis (USA), with <a href="http://pasternack.ucdavis.edu/" target="_blank" rel="noreferrer">Prof. Greg Pasternack</a>. The emphasis of his postdoctoral research was on the ecohydraulic enhancement of the Yuba River (California, USA) based on aerial (lidar) imagery and numerical models. Find out more about Sebastian and his scientific career at <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID.org</a>.
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
            <li>Basics and advanced Python programming (including collaborative code design and documentation) for water resources engineering, ecohydraulic research, and (geospatial) data analysis</li>
            <li>Numerical modeling, sediment transport, and morphodynamics for hydraulic engineering</li>
            <li>Integrated flood protection management, river restoration, and river engineering</li>
            </ul>
            Sebastian also offers tutorials, supplemental materials, and practice-oriented exercises at <b><a href="https://hydro-informatics.com/" title="hydro-informatics.com" target="_blank" rel="noreferrer">hydro-informatics.com</a></b>.
          </p>
          <p>
            <b>Graduating students: Are you looking for an exciting Bachelor or Master Thesis?</b> Visit the <a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/" target="_blank" rel="noreferrer">IWS team website</a> to apply for one of the announcements. Currently, the following topics are waiting for motivated students:<br/>
            <ul>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/2021_MA_Proposal_Ering-FS-SSc.pdf" target="_blank" rel="noreferrer">Two-dimensional hydro-morphodynamic numerical modeling of a fish bypass</a> (coed with Federica Scolari)</li>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/2021_BA_MA_Unreal.pdf" target="_blank" rel="noreferrer">Virtual reality: digital river twins in the Unreal Engine </a></li>
            </ul><br/>
            <b>Do you already have an idea for an innovative research graduation project?</b> Contact Sebastian and get your creativity started. <br/>
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
            Sebastian focuses on sediment transport, (river) restoration ecology, ecohydraulics, water resources engineering, and the development of Python algorithms for workflow automation and numerical model (optimization). The <b>full record</b> of his scientific works is <b><a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">available at ORCID.org</a></b> and here is a list of <b>selected papers</b>:
            <ul>
                <li><a href="http://dx.doi.org/10.1007/s11368-022-03192-1" target="_blank" rel="noreferrer">Mouris, <b>Schwindt</b>, Haun, Wieprecht, 2022. Introducing seasonal snow memory into the RUSLE. Journal of Soils and Sediments. doi: 10.1007/s11368-022-03192-1</a></li>
                <li><a href="https://doi.org/10.1016/j.geomorph.2021.108106" target="_blank" rel="noreferrer">Diaz-Gomez, Pasternack, Guillon, Byrne, <b>Schwindt</b>, Larrieu, Sandoval-Solis, 2022. Mapping subaerial sand-gravel-cobble fluvial sediment facies using airborne lidar and machine learning. Geomorphology 401, 108106. doi: 10.1016/j.geomorph.2021.108106</a></li>
                <li><a href="https://onlinelibrary.wiley.com/doi/full/10.1002/esp.5285" target="_blank" rel="noreferrer">Negreiros, <b>Schwindt</b>, Haun, Wieprecht, 2021.Fuzzy Map Comparisons Enable Objective Hydro-morphodynamic Model Validation. Earth Surface Processes and Landforms. doi: 10.1002/esp.5285</a></li>
                <li><a href="http://dx.doi.org/10.1002/eco.2268" target="_blank" rel="noreferrer">Larrieu, Pasternack, <b>Schwindt</b>, 2020. Automated analysis of lateral river connectivity and fish stranding risks-Part 1: Review, theory and algorithm. Ecohydrology 14(2). doi:10.1002/eco.2268</a></li>
                <li><a href="https://doi.org/10.1016/j.ijsrc.2020.07.007" target="_blank" rel="noreferrer">Moldenhauer-Roth, Piton, <b>Schwindt</b>, Jafarnejad, Schleiss, 2021. Design of sediment detention basins: scaled model experiments and application. International Journal of Sediment Research. doi:10.1016/j.ijsrc.2020.07.007</a></li>
                <li><a href="https://doi.org/10.1016/j.softx.2020.100438" target="_blank" rel="noreferrer"><b>Schwindt</b>, Larrieu, Pasternack, Rabone, 2020. River Architect. SoftwareX 11. doi: 10.1016/j.softx.2020.100438</a> | <a href="https://www.sciencedirect.com/science/article/pii/S235271101930281X/pdfft?md5=f9175d220a3b766b6a43a0b70f613e1f&amp;pid=1-s2.0-S235271101930281X-main.pdf" target="_blank" rel="noreferrer">Download (open access)</a></li>
                <li><a href="http://www.sciencedirect.com/science/article/pii/S0301479718312751" target="_blank" rel="noreferrer"><b>Schwindt</b>, Pasternack, Bratovich, Rabone, Simodynes, 2019. Hydro-morphological parameters generate lifespan maps for stream restoration management. Journal of Environmental Management 232, 475-489. doi: 10.1016/j.jenvman.2018.11.010</a></li>
                <li><a href="https://www.nat-hazards-earth-syst-sci.net/18/647/2018/nhess-18-647-2018.html" target="_blank" rel="noreferrer"><b>Schwindt</b>, Franca, Reffo, Schleiss, 2018. Sediment traps with guiding channel and hybrid check dams improve controlled sediment retention. Natural Hazards and Earth System Science 18, 647-668. doi: 10.5194/nhess-18-647-2018</a> | <a href="https://www.nat-hazards-earth-syst-sci.net/18/647/2018/nhess-18-647-2018.pdf" target="_blank" rel="noreferrer">Download (open access)</a></li>
                <li><a href="https://ascelibrary.org/doi/abs/10.1061/(ASCE)HY.1943-7900.0001389" target="_blank" rel="noreferrer"><b>Schwindt</b>, Franca, Schleiss, 2017. Effects of lateral and vertical constrictions on flow in rough steep channels with bedload. Journal of Hydraulic Engineering 143 (12), 04017052-1-12. doi: 10.1061/(ASCE)HY.1943-7900.0001389</a></li>
                <li><a href="http://www.sciencedirect.com/science/article/pii/S0169555X17302969" target="_blank" rel="noreferrer"><b>Schwindt</b>, Franca, De Cesare, Schleiss, 2017. Analysis of mechanical-hydraulic deposition control measures. Geomorphology 295, 467–479. doi: 10.1016/j.geomorph.2017.07.020</a></li>
            </ul>
            </p>
            <p>
            <b>Codes, research algorithms, and Python</b> packages from Sebastian are mostly hosted on GitHub along with detailed docs. The following Python packages and programs are available:
            <ul>
            <li><a href="https://flusstools.readthedocs.io/" target="_blank" rel="noreferrer">FlussTools</a>: A Python3 package for river analyses, including geo-spatial analyst functions, numerical model uncertainty assessments (fuzzy set based), lidar data processing tools, and database tweaks for the application of plants in restoration science. Sebastian maintains this repository together with former and current undergrad and grad students.</li>
            <li><a href="https://riverarchitect.github.io/" target="_blank" rel="noreferrer">River Architect</a>: A Python-based back-end tool for river design and habitat enhancement with an extensive <a href="https://riverarchitect.github.io/RA_wiki/main_page" target="_blank" rel="noreferrer">Wiki</a>.</li>
            <li><a href="https://sschwindt.github.io/pydroscape/" target="_blank" rel="noreferrer">Pydroscape</a>: Basic Python3 tools primarily for (but not limited to) riverscape, sediment transport, geodata, and hydraulic analyses.</li>
            <li><a href="https://sschwindt.github.io/OpenScience/" target="_blank" rel="noreferrer">Open Science</a>: A repository that links to data and codes of Sebastian s PhD research.</li>
            <li><a href="https://github.com/sschwindt/hy2opt" target="_blank" rel="noreferrer">HY2OPT</a>: A Python3 interface for the optimization of numerical models including pre- and post-processing (development stage - private access only - send an inquiry to learn more).</li>
            </ul>
            </p>
            <p>
            <b>Awards and Distinctions</b><br/>
            <ul>
            <li><a href="https://iahr2020.pl/2021/02/22/iahr-gerhard-jirka-award-results/" target="_blank" rel="noreferrer">IAHR Gerhard Jirka Award for the presentation <i>Modelling and Design Automation of Nature-based River Engineering</i> at the IAHR Europe 2020 conference, Warsaw, Poland</a></li>
            <li><a href="https://connect.agu.org/epsp/spotlight/oct-2019" target="_blank" rel="noreferrer">American Geophysical Union (AGU) – Earth and Planetary Surface Processes’ Early Career Researcher Spotlight (October 2019)</a></li>
            </ul>
            </p>
            <p>
            Sebastian is currently working on the following <b>projects</b>:
            <ul>
            <li><a href="https://misti.mit.edu/germany-seed-funds" target="_blank" rel="noreferrer">The MITs MISTI Germany</a>: A global seed fund targetting the initiation of international collaboration. This project is a collaboration between the <a href="https://nepf.mit.edu/" target="_blank" rel="noreferrer">Nepf lab at MIT</a>, its research affiliate <a href="https://isabellaschalko.com/" target="_blank" rel="noreferrer">Isabella Schalko</a>, and the IWS to leverage healthy hyporheic zones though the introduction of large wood.</li>
            <li><a href="https://econnect.readthedocs.io/en/latest/" target="_blank" rel="noreferrer">Hydro-morphodynamic connectivity and ecosystem design in a changing environment</a> (funded by the <a href="https://www.dfg.de/" target="_blank" rel="noreferrer">DFG</a> and in collaboration with the NSFC).</li>
            <li><a href="https://www.iws.uni-stuttgart.de/en/institute/research/projects/lww/va/20190701/" target="_blank" rel="noreferrer">Ecosystem Analysis and Restoration of the Inn</a> (Bavaria, Germany).</li>
            <li><a href="https://dirtx-reservoirs4future.eu/" target="_blank" rel="noreferrer">DIRT-X</a>: Delivery Impacts on Reservoirs in changing climaTe and society aCROSS scales and sectors.</li>
            </ul>
          </p>
          <p> Finalized scientific and other projects:
          <ul>
            <li><a href="https://portal.nifa.usda.gov/web/crisprojectpages/1013705-californian-river-assessment-management-and-rehabilitation.html" target="_blank" rel="noreferrer">Best available science analysis of Habitat Enhancement of the lower Yuba River</a> (with University of California, Davis)</li>
            <li>Expertise for the revitalization of the Arbogne River, Fribourg, Switzerland</li>
            <li>Physical modelling optimization of a filter check dam at the Drance, Martigny, VS, Switzerland </li>
            <li><a href="https://www.rivermanagement.ch/" target="_blank" rel="noreferrer">Rivermanagement: Sediment and habitat dynamics in Switzerland</a> </li>
            <li>Restoration of the pumped storage hydro power station Happurg, Germany</li>
            <li>Physical model of the Rhône at Massongex for the installation of a run-of-river hydro power plant</li>
            <li>Preparation of the feasibility study for the Isimba hydro power plant in Uganda</li>
          </ul>
          </p>
          <b>Get more information or start a new project by sending an inquiry on the Contact form.</b>
          <p>
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
          <p>
          Find tutorials and short videos zooming into rivers and numerical models also on Sebastian&#39;s <a href="https://www.youtube.com/channel/UCGOMSGRrW5eLHiMn5Dfp7WQ" target="_blank" rel="noreferrer">@ Hydro-Morphodynamics channel on YouTube.</a>
          </p>
          <p>Meet Sebastian at the <a href="https://iahrworldcongress.org" target="_blank" rel="noreferrer">IAHR World Congress 2023 in Vienna</a>.
          </p>
          <p>More contact options are available at <a href="https://www.iws.uni-stuttgart.de/en/institute/team/Schwindt/" target="_blank" rel="noreferrer">iws.uni-stuttgart.de</a>.
          </p>
          <ul className="icons">
            <li>
              <a href="http://www.linkedin.com/in/sebastian-schwindt" target="_blank" rel="noreferrer" className="icon fa-linkedin">
                <span className="label">Linkedin</span>
              </a>
            </li>
            <li>
              <a href="hhttps://scholar.google.com/citations?user=246FKewAAAAJ&hl=en&citsig=AMD79oouG1nzUOL85fNl5zk00cmjothoLQ" target="_blank" rel="noreferrer" className="icon fa-google">
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
