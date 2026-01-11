import { Block, Link, Navbar, Page } from 'framework7-react'
import React from 'react'

/**
 * Presents terms of service and privacy policy information for the application.
 */
function Agb() {
  return (
    <Page>
        <Navbar title="AGB & Datenschutzerklärung" backLink="Zurück" />
        <Block style={{fontSize: "110%"}}>
          <h2>Allgemeine Geschäftsbedingungen (AGB)</h2>
          
          <h3>1. Geltungsbereich</h3>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Location-Based-Service Webanwendung (nachfolgend "Anwendung"). 
            Mit der Nutzung der Anwendung akzeptieren Sie diese AGB vollständig an.
          </p>

          <h3>2. Nutzung der Anwendung</h3>
          <p>
            Die Anwendung bietet Ihnen die Möglichkeit, Ihre aktuelle Position zu ermitteln, Orte auf einer Karte auszuwählen und 
            Informationen zu diesen Orten abzurufen. Sie verpflichten sich, die Anwendung nur für legale Zwecke zu nutzen und keine 
            illegalen Aktivitäten durchzuführen.
          </p>

          <h3>3. Standortdaten</h3>
          <p>
            Die Anwendung benötigt Zugriff auf Ihre Standortdaten, um die beschriebenen Funktionen bereitzustellen. Der Zugriff auf 
            Ihre Standortdaten erfolgt nur mit Ihrer ausdrücklichen Zustimmung. Sie können diesen Zugriff jederzeit in den 
            Einstellungen Ihres Browsers oder Geräts deaktivieren.
          </p>

          <h3>4. Kartenservices und externe Dienste</h3>
          <p>
            Die Anwendung nutzt Leaflet als JavaScript-Kartenbibliotek und OpenStreetMap für die Kartendaten. Die Kartendaten 
            unterliegen den Lizenzbedingungen von OpenStreetMap (ODbL). Für die Routenplanung verwenden wir die Open Source Routing 
            Machine (OSRM). Wir sind nicht verantwortlich für die Genauigkeit, Vollständigkeit oder Aktualität dieser Daten.
          </p>

          <h3>5. Reverse-Geocoding und Wikipedia-Integration</h3>
          <p>
            Die Anwendung nutzt Reverse-Geocoding-Services, um Ortsinformationen zu ermitteln, und integriert Daten von Wikipedia. 
            Wir sind nicht verantwortlich für die Genauigkeit, Vollständigkeit oder Aktualität dieser Daten. Die Nutzung dieser 
            Services unterliegt deren jeweiligen Bedingungen.
          </p>

          <h3>6. Routenplanung</h3>
          <p>
            Die dargestellten Routen werden über die Open Source Routing Machine (OSRM) berechnet und dienen nur zu Informationszwecken. 
            Wir übernehmen keine Garantie für die Genauigkeit, Zuverlässigkeit oder Eignung der Routen für Ihre spezifische Situation. 
            Benutzer sollten zusätzliche Navigationsquellen konsultieren und alle geltenden Verkehrsregeln beachten.
          </p>

          <h3>6. Haftungsausschluss</h3>
          <p>
            Die Anwendung wird bereitgestellt "wie sie ist" und ohne jegliche Garantien. Wir haften nicht für Schäden, die durch die 
            Nutzung der Anwendung entstehen, einschließlich Datenverlust, unterbrochene Nutzung oder indirekte Schäden.
          </p>

          <h3>7. Änderungen der AGB</h3>
          <p>
            Wir behalten uns das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht. Die 
            fortgesetzte Nutzung der Anwendung nach Änderungen bedeutet Ihre Akzeptanz der neuen Bedingungen.
          </p>

          <h2>Datenschutzerklärung</h2>

          <h3>1. Datenverarbeitung</h3>
          <p>
            Wir verarbeiten Ihre Standortdaten ausschließlich zur Bereitstellung der Anwendungsfunktionen. Ihre Daten werden nicht an 
            Dritte weitergegeben, gespeichert oder für andere Zwecke verwendet.
          </p>

          <h3>2. Standortdaten</h3>
          <p>
            Ihre Standortdaten werden lokal in Ihrem Browser verarbeitet. Wir speichern diese Daten nicht auf unseren Servern. Der 
            Zugriff auf Ihre Standortdaten ist freiwillig und kann jederzeit widerrufen werden.
          </p>

          <h3>3. Externe Services</h3>
          <p>
            Die Anwendung nutzt folgende externe Services und deren Datenschutzrichtlinien:
            <br />
            - <strong>OpenStreetMap:</strong> Kartendaten unter der Open Data Commons Open Database License (ODbL) - 
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">https://www.openstreetmap.org/copyright</a>
            <br />
            - <strong>Leaflet:</strong> Open-Source JavaScript-Bibliothek für Kartenfunktionen
            <br />
            - <strong>OSRM (Open Source Routing Machine):</strong> Wird zur Berechnung von Fahrtrouten genutzt
            <br />
            - <strong>Wikipedia: </strong> 
            <a href="https://foundation.wikimedia.org/wiki/Privacy_policy" target="_blank" rel="noopener noreferrer">https://foundation.wikimedia.org/wiki/Privacy_policy</a>
            <br />
            Diese Services können gemäß deren Datenschutzrichtlinien begrenzte Informationen verarbeiten.
          </p>

          <h3>4. Cookies</h3>
          <p>
            Die Anwendung verwendet Cookies nur zur Verbesserung der Benutzerfreundlichkeit. Diese enthalten keine persönlichen Daten.
          </p>

          <h3>5. Ihre Rechte</h3>
          <p>
            Sie haben das Recht, Ihre Daten zu überprüfen und zu löschen. Da wir Ihre Daten nicht speichern, können Sie dies durch 
            Löschen Ihrer Browser-Daten und des Cache erreichen.
          </p>

          <h3>6. Kontakt</h3>
          <p>
            Wenn Sie Fragen zu dieser Datenschutzerklärung oder zu unserer Datenverarbeitung haben, kontaktieren Sie uns bitte unter 
            den im Impressum angegebenen Kontaktdaten.
          </p>

          <h3>7. Änderungen der Datenschutzerklärung</h3>
          <p>
            Wir behalten uns das Recht vor, diese Datenschutzerklärung zu aktualisieren. Änderungen werden auf dieser Seite 
            veröffentlicht. Die Nutzung der Anwendung nach Änderungen bedeutet Ihre Akzeptanz der neuen Bedingungen.
          </p>
        </Block>
    </Page>
  )
}

export default Agb