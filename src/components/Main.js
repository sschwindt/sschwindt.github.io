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
            <img src={pic01} alt="" />
          </span>
          <p>
          Dr. sc. Sebastian Schwindt is a researcher in the field of fluvial hydraulics and morphodynamics at the University of Stuttgart (<a href="https://www.iws.uni-stuttgart.de/en/institute/team/Schwindt/" target="_blank" rel="noreferrer">see institutional profile</a>). He leads the hydro-morphodynamic modelling group at the <a href="https://www.iws.uni-stuttgart.de/" target="_blank" rel="noreferrer">Institute for Modelling Hydraulic and Environmental Systems (IWS)</a>. His research focuses on numerical analyses, sediment transport, ecohydraulics, and ecosystem design. The latest research focus is on the implementation of efficient data analyses and computational methods.
          </p>
          <p>
            He completed his Bachelor (2010) and Master (2012) studies at the Technical University of Munich (Germany) in Environmental Engineering. After a short detour into the private sector, Sebastian Schwindt accomplished his doctorate at the Ecole Polytechnique fédérale de Lausanne (EPFL, Switzerland) from 2013 to 2017 under the supervision of Prof. Anton J. Schleiss and Prof. Mário Franca. His PhD thesis with, entitled <em>Hydro-morphological processes through permeable sediment traps at mountain rivers</em>, sheds light on hazardous morphodynamic processes in mountain rivers (<a href="https://infoscience.epfl.ch/record/231182" target="_blank" rel="noreferrer">download</a>).
          </p>
          <p>
            Between 2017 and December 2019, Sebastian Schwindt pursued postdoctoral research at the University of California, Davis (USA) with Prof. Greg Pasternack. The emphasis of his postdoctoral research was on the ecohydraulic enhancement of the Yuba River (California, USA). Find out more about Sebastian Schwindt and his scientific career on <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID.org</a>.
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
          <h2 className="major">Students & Teaching <span className="icon fa-graduation-cap"></span></h2>
          <span className="image main">
            <img src={pic02} alt="" />
          </span>
          <p>
             <b>Teaching</b> - Sebastian Schwindt offers classes, workshops and courses with respect to the following subjects:
            <ul>
            <li>Basics and advanced Python programming (including collaborative code design and documentation) for Water Resources Engineering, Ecohydraulic Research, and Spatial Data Analysis</li>
            <li>Numerical Modelling, Sediment Transport and Morphodynamics for Hydraulic Engineers</li>
            <li>Integrated Flood Protection Management and River Engineering</li>
            </ul>
            More details, tutorials (e-textbooks), materials (sample scripts and datasets), and practice-oriented exercises are available at <b><a href="https://hydro-informatics.github.io/" title="hydro-informatics.github.io/" target="_blank" rel="noreferrer">hydro-informatics.github.io</a></b>.
          </p>
          <p>
            <b>Graduation students: Are you looking for an exciting Bachelor or Master Thesis?</b> Visit our <a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/" target="_blank" rel="noreferrer">team website</a> to apply for one of our announcements. Currently, the following topics are waiting for motivated students:<br/>
            <ul>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/MA_Banja_Reservoir_modelling_2D.PDF" target="_blank" rel="noreferrer">Building the future: A two-dimensional (2D) numerical model of morphodynamic processes in a large reservoir</a> (coed with Kilian Mouris)</li>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/2020_BA_MA_Colmation.pdf" target="_blank" rel="noreferrer">Colmation analysis across scales</a></li>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/BA_mesh_generators.pdf">Comparison of mesh generators for hydro-morphodynamic modelling</a> (coed with Maxiilian Kunz)</li>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/BA_was_ist_was_map_comparison_20200703_fin.pdf" target="_blank" rel="noreferrer">Psychologie der Präzision: Subjektive Korrelation morphodynamischen Wandels</a> (coed with Beatriz Negreiros)<br/>Note: The English title is <em>Cognitive precision: Subjective correlation of morphodynamic change</em></li>
            <li><a href="https://www.iws.uni-stuttgart.de/lww/lehre-und-weiterbildung/download/2020_06_25_MA_sediment_replenishments.pdf" target="_blank" rel="noreferrer">Make the Inn sustainable again – 2D Numerical Modelling of Sediment Replenishments in the River Inn</a> (coed with Maximilian Kunz)</li>
            </ul><br/>
            <b>You already have an idea for an innovative research or a practice (applied) project?</b> Use the contact page to write us a message and get your creativity started.
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
            The research of Sebastian Schwindt focuses on hyraulic engineering, restoration science, and the development of algorithms for spatial data analysis. The full record of his scientific papers is available at <a href="https://orcid.org/0000-0002-7206-0542" target="_blank" rel="noreferrer">ORCID.org</a> and here is a list of selected papers:
            <ul>
                <li>Moldenhauer (Roth), A., Piton, G., Schwindt, S., Schleiss, A. 2020. Design of sediment detention basins: scaled model experiments and application. International Journal of Sediment Research.</li>
                <li><a href="https://doi.org/10.1016/j.softx.2020.100438" target="_blank" rel="noreferrer">Schwindt, S., Larrieu, K., Pasternack G. B., Rabone, G.,  2020. River Architect. SoftwareX 11. doi: 10.1016/j.softx.2020.100438</a> | <a href="https://www.sciencedirect.com/science/article/pii/S235271101930281X/pdfft?md5=f9175d220a3b766b6a43a0b70f613e1f&amp;pid=1-s2.0-S235271101930281X-main.pdf" target="_blank" rel="noreferrer">Download (open access)</a></li>
                <li><a href="http://www.sciencedirect.com/science/article/pii/S0301479718312751" target="_blank" rel="noreferrer">Schwindt, S., Pasternack G. B., Bratovich, P.  M., Rabone, G., Simodynes, D. , 2019. Hydro-morphological parameters generate lifespan maps for stream restoration management. Journal of Environmental Management 232, 475-489. doi: 10.1016/j.jenvman.2018.11.010</a></li>
                <li><a href="https://www.nat-hazards-earth-syst-sci.net/18/647/2018/nhess-18-647-2018.html" target="_blank" rel="noreferrer">Schwindt, S., Franca, M. J., Reffo, A., Schleiss, A. J., 2018. Sediment traps with guiding channel and hybrid check dams improve controlled sediment retention. Natural Hazards and Earth System Science 18, 647-668. doi: 10.5194/nhess-18-647-2018</a> | <a href="https://www.nat-hazards-earth-syst-sci.net/18/647/2018/nhess-18-647-2018.pdf" target="_blank" rel="noreferrer">Download  (open access)</a></li>
                <li><a href="https://ascelibrary.org/doi/abs/10.1061/(ASCE)HY.1943-7900.0001389" target="_blank" rel="noreferrer">Schwindt, S., Franca, M. J., Schleiss, A. J., 2017. Effects of lateral and vertical constrictions on flow in rough steep channels with bedload. Journal of Hydraulic Engineering 143 (12), 04017052-1-12. doi: 10.1061/(ASCE)HY.1943-7900.0001389</a></li>
                <li><a href="http://www.sciencedirect.com/science/article/pii/S0169555X17302969" target="_blank" rel="noreferrer">Schwindt, S., Franca, M. J., De Cesare, G., Schleiss, A. J., 2017. Analysis of mechanical-hydraulic deposition control measures. Geomorphology 295, 467–479. doi: 10.1016/j.geomorph.2017.07.020</a></li>
            </ul>
            </p>
            <p>
            Codes, research algorithms, and Python packages of Sebastian Schwindt are hosted on GitHub, along with detailed documentations. The following programs are available:
            <ul>
            <li><a href="https://hylas.readthedocs.io/" target="_blank" rel="noreferrer">HYLAS</a>: A Python3 package for extracting data from <em>las</em> files (lidar data) - for example to create digital elevation models (DEM) or waveform GeoTIFF rasters for extended landscape analyses (e.g., random forest applications).</li>
            <li><a href="https://geo-utils.readthedocs.io/" target="_blank" rel="noreferrer">GEO-UTILS</a>: A Python3 package for geo-spatial analyses of fluvial ecosystems.</li>
            <li><a href="https://riverarchitect.github.io/" target="_blank" rel="noreferrer">River Architect</a>: A Python-based back-end tool for river design and habitat enhancement with an extensive <a href="https://riverarchitect.github.io/RA_wiki/main_page" target="_blank" rel="noreferrer">Wiki</a>.</li>
            <li><a href="https://sschwindt.github.io/pydroscape/" target="_blank" rel="noreferrer">Pydroscape</a>: Basic Python3 tools primarily for (but not limited to) riverscape, sediment transport, geodata, and hydraulic analyses.</li>
            <li><a href="https://sschwindt.github.io/OpenScience/" target="_blank" rel="noreferrer">Open Science</a>: A repository that links to data and codes of published research.</li>
            <li><a href="https://github.com/sschwindt/hy2opt" target="_blank" rel="noreferrer">HY2OPT</a>: A Python3 interface for the optimization of numerical models including pre- and post-processing (development stage - private access only - send an inquiry to learn more).</li>
            </ul>
            </p>
            <p>
            Currently ongoing projects of Sebastian Schwindt are:
            <ul>
            <li>Ecosystem Analysis and Restoration of the Inn River (Bavaria, Germany).</li>
            <li><a href="https://dirtx-reservoirs4future.eu/" target="_blank" rel="noreferrer">DIRT-X</a>: Delivery Impacts on Reservoirs in changing climaTe and society aCROSS scales and sectors.</li>
            </ul>
          </p>
          <p> Accomplished scientific and engineering projects:
          <ul>
            <li>Best available science analysis of Habitat Enhancement of the lower Yuba River (with University of California, Davis)</li>
            <li>Expertise for the revitalization of the Arbogne River, Fribourg, Switzerland (LCH – EPFL)</li>
            <li>Physical modelling optimization of a filter check dam at the Drance, Martigny, VS, Switzerland (with LCH – EPFL)</li>
            <li><a href="https://www.rivermanagement.ch/" target="_blank" rel="noreferrer">Rivermanagement</a>: Sediment and habitat dynamics in Switzerland (LCH – EPFL)</li>
            <li>Restoration of the pumped storage hydro power station Happurg, Germany (with Fichtner GmbH&amp;Co.KG)</li>
            <li>Physical model of the Rhône at Massongex for the installation of a run-of-river hydro power plant (with LCH – EPFL)</li>
            <li>Preparation of the feasibility study for the Isimba hydro power plant in Uganda (with Fichtner GmbH&amp;Co.KG)</li>
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
              <a href="http://www.linkedin.com/in/sebastian-schwindt" target="_blank" rel="noreferrer" className="icon fa-linkedin">
                <span className="label">Linkedin</span>
              </a>
            </li>
            <li>
              <a href="https://scholar.google.ch/citations?user=GdmFKPgAAAAJ&hl=de&oi=ao" target="_blank" rel="noreferrer" className="icon fa-google">
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
