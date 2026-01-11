import { Page, Block, Navbar } from 'framework7-react'
import React from 'react'

/**
 * Displays the legal notice (Impressum) with operator and contact details.
 */
function Impressum() {
  return (
    <Page>
        <Navbar title="Impressum" backLink="Zurück" />
        <Block style={{fontSize: "110%"}}>
            <p>
              <u>Angaben gemäß § 5 TMG:</u><br /><br />
              <u>Betreiber:</u><br />
              Janne Nußbaum, Linus Gerlach, Justin Lotwin und Nils Fleschhut<br />
              Navigationsweg 42<br />
              88045 Friedrichshafen<br />
              Deutschland<br /><br />

              <u>Kontakt:</u><br />
              E-Mail: <a id="mail" href="mailto:maps@online.com">maps@online.com</a><br /><br />

              <u>Hinweis:</u><br />
              Diese Website ist ein nicht öffentlich zugängliches, lokales Projekt und dient ausschließlich zu Entwicklungs- und Testzwecken. Sie wird nicht im Internet veröffentlicht oder kommerziell genutzt. Auch die Adresse bzw. die E-Mail ist fiktiv.
          </p>
        </Block>
    </Page>
  )
}

export default Impressum