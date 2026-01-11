import { Page, Block, Navbar } from 'framework7-react'
import React from 'react'

/**
 * Static informational page describing the application purpose and team members.
 */
function About() {
  return (
    <Page>
      <Navbar title="Über uns" backLink="Zurück" />
        <Block style={{fontSize: "110%"}}>
          <h3><u>Die Anwendung</u></h3>
          <p>
              Willkommen bei unserer innovativen Location-Based-Service Webanwendung! Diese Plattform kombiniert moderne Kartentechnologie mit intelligenter Ortsermittlung, um Ihnen ein einzigartiges Navigationserlebnis zu bieten.
              <br /><br />
              <u>Funktionen:</u>
              <br />
              <br />
              - <strong>Interaktive Karte:</strong> Wählen Sie einen Ort auf der Karte oder nutzen Sie Ihren aktuellen Standort mit präzisen Geo-Koordinaten.<br /><br />
              - <strong>Reverse-Geocoding:</strong> Die Anwendung ermittelt automatisch den Ortsnamen aus den Koordinaten.<br /><br />
              - <strong>Wikipedia-Integration:</strong> Erhalten Sie detaillierte Informationen zur ausgewählten Örtlichkeit direkt von Wikipedia.<br /><br />
              - <strong>Routenplanung:</strong> Visualisieren Sie die Fahrroute von Ihrem aktuellen Standort zum ausgewählten Ziel.<br /><br />

              Unser Ziel ist es, Ihnen eine benutzerfreundliche und intuitive Möglichkeit zu bieten, Orte zu erkunden und deren Bedeutung zu verstehen – alles in einer Anwendung!
              <br /><br />
          </p>
          <h3><u>Unser Team</u></h3>
          <div style={{display: 'flex', flexDirection: 'row', gap: '100px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', padding: '20px 0'}}>
              <a style={{display: 'flex', alignItems: 'center'}} href="https://www.ravensburg.dhbw.de/startseite" target="_blank" rel="noopener noreferrer"><img style={{height: '80px', width: 'auto'}} src="img/logos/DHBW_Ravensburg.png" alt="DHBW Ravensburg logo" /></a>
              <a style={{display: 'flex', alignItems: 'center'}} href="https://www.rolls-royce.com/" target="_blank" rel="noopener noreferrer"><img style={{height: '80px', width: 'auto'}} src="img/logos/Rolls-Royce_Group.png" alt="Rolls-Royce Group logo" /></a>
              <a style={{display: 'flex', alignItems: 'center'}} href="https://www.mtu-solutions.com/eu/de.html" target="_blank" rel="noopener noreferrer"><img style={{height: '80px', width: 'auto'}} src="img/logos/MTU_Friedrichshafen.png" alt="MTU Friedrichshafen logo" /></a>
          </div>
          <p>
              Hinter dieser innovativen Webanwendung steht ein engagiertes und leidenschaftliches Team von Entwicklern und Designern, das sich darauf konzentriert, ein stabiles und nutzerfreundliches Produkt zu schaffen.<br /><br />
              <u>Teammitglieder:</u> Linus Gerlach, Janne Nußbaum, Justin Lotwin und Nils Fleschhut<br />
              Wir sind vier bei Rolls-Royce angestellte duale Studenten im Studiengang Informatik - Informationstechnik (TIT23). Aktuell sind wir in der fünften Theoriephase und entwickeln diese Webanwendung als Projekt für das Modul "Webengineering II".
          </p>
        </Block>
    </Page>
  )
}

export default About