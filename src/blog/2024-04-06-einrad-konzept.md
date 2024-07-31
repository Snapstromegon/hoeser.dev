---
title: Meinung zum Konzept Gemeinsame Wettkämpfe im Einrad Freestyle
abstract: |
  Dies ist meine persönliche Einschätzung zum Konzept Gemeinsame Wettkämpfe im Einrad Freestyle in der Fassung vom 17. Februar 2024.
date: 2024-04-06
tags:
  - type:opinion
---

:::commentBlock
This post is in german, as it is targeted at a german audience.
Since this is not a tech post and has close to no relevancy outside of germany, I won't provide a translation.
:::

:::commentBlock
Dieser Beitrag bezieht sich auf das "Konzept Gemeinsame Wettkämpfe im Einrad Freestyle" in der Fassung vom 17. Februar 2024, welches sich im Original hier findet:
https://www.einradverband.de/2024/02/20/konzept-fuer-gemeinsame-wettkaempfe-im-einrad-freestyle-ueberarbeitet/

Der gesamte Beitrag ist rein durch mich allein entstanden. Meine Familienmitglieder, die im Sport aktiv sind, haben diesen Beitrag nicht beeinflusst.
:::

## Wer bin ich und warum habe ich eine Meinung?

Um zu erklären, warum es diesen Beitrag hier überhaupt gibt, sollte ich vermutlich ein wenig Kontext zu mir selbst geben, da vermutlich weder die Stammleserschaft meines Blogs, noch die Aktiven im Sport mich ausreichend kennen.

### Bezug zum Einradsport

Ich selbst bin kein aktiver Einradfahrer und von daher habe ich auf den Sport selbst erstmal nur eine Außensicht. Ich kann nicht ausreichend einschätzen wie anstrengend eine 3, 4 oder 5-Minuten-Kür ist um zum Beispiel eine Angemessenheit einer bestimmten Kürlänge für eine Altersklasse einzuschätzen.

Allerdings habe ich eine gewisse Erfahrung mit der Ausführung solcher Wettkämpfe, da ich bereits bei drei größeren Einradwettkämpfen im Kern-Organisationsteam war und diese nach unserer Einschätzung sehr erfolgreich umgesetzt wurden (ODM 2016 / ~250 TeilnehmerInnen, DM 2019 / ~300 TeilnehmerInnen, NDM 2023 / ~350 TeilnehmerInnen). Hierbei war ich 2016 noch hauptverantwortlich für die Technik (Anzeigesystem, Website, Musik, ...) und 2023 habe ich zusätzlich noch unter Anderem einzelne Aufgaben der Terminplanung, Zeitplanung, Kommunikation mit den TeilnehmerInnen, Design und Trophäenorganisation übernommen.

### Wettkampferfahrung außerhalb

Abseits der Erfahrungen als Ausrichter im Einradsport habe ich Wettkampferfahrungen gerade im Bereich der Schüler-Robotikwettkämpfe. Ich habe Jahrelang als Teilnehmer an der [First Lego League](https://www.first-lego-league.org/de/) teilgenommen. Zudem bin ich 2014 als Teil des deutschen Teams zum [World Robot Olympiad](https://www.worldrobotolympiad.de/) Weltfinale nach Sotschi gereist und habe 2022 als Judge im Weltfinale der WRO in Dortmund mitgewirkt und das Regelwerk für 2023 mit überarbeitet. Im Laufe dieser Zeit habe ich hunderte Seiten an Regelwerken durchgearbeitet, gerade mit der Betrachtung auf genaue Formulierungen und wie einzelne Regeln interpretiert werden könnten.

### Beruflicher Kontext

Beruflich bin ich als Software Ingeneur (DevOps) bei einem großen, internationalen Automobilzulieferer tätig und engagiere mich in meiner Freizeit auch für die freie Softwareentwicklung (Open Source Software).

### Allgemeine Einstellung zu Kritik und Regelformulierungen

In all diesen Bereichen ist es meiner Meinung nach wichtig, sich präzise und korrekt auszudrücken und sich bewusst zu sein, wo eine Vorgabe problematisch oder lückenhaft ist. Zudem halte ich es für wichtig und richtig stets professionell auf Probleme hinzuweisen und Kritik an der Sache stets von der Kritik an einer Person zu trennen (mehr dazu in [einem anderen Blogpost](/blog/2023-02-15-code-reviews/)).

## Wichtige Begrifflichkeiten

Um diesen Beitrag korrekt zu lesen, sind die Definitionen, die ich hier für einige Worte verwende, nötig.
Einige der generellen Begriffe werden an die englischen Definitionen aus dem [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119) angelehnt und aus der [deutschen Interpretation von Adfinis](https://adfinis.com/blog/german-interpretation-of-rfc-2119/) übernommen. Ich empfehle stark, diese auch in das Konzept / ein Regelwerk zu übernehmen.

<dl>
<dt>MUSS</dt>
<dd>oder die Schlüsselwörter “ERFORDERLICH” oder “NÖTIG” bedeuten, dass die Definition eine absolute Anforderung der Spezifikation ist.</dd>
<dt>DARF NICHT</dt>
<dd>oder das Wort “VERBOTEN” Bedeutet, dass die Definition ein absolutes Verbot der Spezifikation ist.</dd>
<dt>SOLL</dt>
<dd>oder das Adjektiv “EMPFOHLEN” bedeutet, dass es in speziellen Situationen Gründe geben kann, diese Spezifikation zu ignorieren. Natürlich müssen die Auswirkungen voll und ganz verstanden und sorgfältig abgewägt werden, bevor von der Spezifikation abgewichen wird.</dd>
<dt>SOLL NICHT</dt>
<dd>oder “NICHT EMPFOHLEN” bedeutet, dass es gute Gründe in speziellen Situationen geben kann, dass dieses Verhalten akzeptabel, ja sogar nützlich sein kann. Natürlich müssen die Auswirkungen voll und ganz verstanden und sorgfältig abgewägt werden, bevor von der Spezifikation abgewichen wird.</dd>
<dt>Regel</dt>
<dd>eine als allgemeingültige, präzise Definition oder Vorgabe, an die sich gehalten werden MUSS. Es wird, wenn irgend möglich weder Raum zur Interpretation gelassen, noch dupliziert. Wenn ein bewusster Konflikt zu anderen Regeln besteht (z.B. eine spezifische Regel bricht die allgemeine), so SOLL die gebrochene Regel referenziert und die Änderung z.B. in einer Anmerkung oder einem weiteren Dokument begründet werden.</dd>
<dt>Regelwerk</dt>
<dd>eine zusammenstellung aus Regeln (entweder durch direkte Nennung, oder Referenz auf andere Regelwerke), an die sich gehalten werden MUSS mit einer bestimmten Gültigkeit (z.B. eine Veranstaltung oder eine Wettkampfserie). Zudem enthält ein Regelwerk alle nötigen Definitionen um die "Eineindeutigkeit" sicherzustellen.</dd>
<dt>Meisterschaft</dt>
<dd>eine Veranstaltung, bei der SportlerInnen gegeneinander antreten. Synonym wird auch "Wettkampf" verwendet.</dd>
<dt>Saison</dt>
<dd>eine Reihe an Meisterschaften innerhalb eines Zeitraums von einem Jahr. Der Start ist nicht genau definiert und liegt zwischen dem Ende der Deutschen Meisterschaft der vorhergehenden Saison und der ersten Landesmeisterschaft der aktuellen Saison.</dd>
</dl>

## Vorwort

:::sidenote
Ja, ein Vorwort ist bei mir nicht immer am Anfang.
:::

Bevor ich mit der eigentlichen Kritik an dem Konzept starte, möchte ich ein paar allgemeine Worte zu dem Konzept und der Idee dahinter loswerden.

Ich finde es sehr begrüßenswert, dass sich die beiden Einradverbände [BDR](https://einrad-bdr.de/) und [EVD](https://www.einradverband.de/) auf eine gemeinsame Kooperation einigen konnten. Ebenfalls begrüße ich es, dass der [RKB](https://rkbsoli.org/) in die Gestaltung des Konzepts einbezogen wird. Ich bin der festen Überzeugung, dass es dem Einradsport zuträglich ist, wenn die Verbände in der Gestaltung der Wettkampfserien kooperieren und somit den Meisterschaften Legitimität geben. Aus diesen Gründen möchte ich auch nochmal darauf hinweisen, dass dies _keine_ Kritik an den AutorInnen des Konzepts als Personen sein soll, sondern sich jegliche Kritik rein auf das Konzept selbst bezieht. Durch meine ehrenamtlichen Tätigkeiten ist mir sehr wohl bewusst, dass ein solcher Aufwand nicht leicht fällt und wertgeschätzt gehört. Zudem ist Kritik nicht zwingend negativ und so werde ich auch hier sowohl positive, als auch negative Dinge hervorheben.

In den Versionen von vor 2024 stand dieser einleitende Satz:

> Wir alle möchten, dass unser Sport professioneller wird und das System auch für Laien leicht nachvollziehbar ist.
>
> _Überarbeitetes Konzept aus 2023_

Ich finde diesen sehr treffend (auch, da ich mich als Laien in dem Sport verstehe) und werde meine Kritik auch auf diesem Leitsatz fußen, auch wenn der Satz nicht mehr im aktuellen Konzept zu finden ist. Um sowohl die Nachvollziehbarkeit für Laien, als auch die Professionalität zu erreichen, ist es meiner Meinung nach essentiell, dass implizierte Regeln und Tradition vollständig vermieden werden. So kann man zum Beispiel nur davon ausgehen, dass Gruppen als letztes starten, wenn dies auch so im Regelwerk geschrieben steht.

:::commentBlock
Wenn ich in diesem Beitrag Regeländerungen vorschlage, so sind diese immer als Laienverschläge zu betrachten. Ich werde stets Begründungen mitliefern, aber ich kenne den Sport nicht ausreichend um diese abschließend zu bewerten.
:::

:::actionBlock
Wenn ich aktiv eine Änderung vorschlage, mache ich dies in einem Block wie diesem.
:::

Als Letztes möchte ich anmerken, dass mindestens einige meiner Kritikpunkte mindestens Teilen der AutorInnen des Konzepts seit mindestens der Norddeutschen Meisterschaft 2023 vorliegen. Da meiner Meinung nach teilweise selbst grobe Fehlformulierungen im Konzept Bestand haben, schreibe ich zur allgemeinen Dokumentation diesen Beitrag.

## Die Kritik

### Entwicklung der Versionen

Die Versionen des Konzepts zeigen mit jeder Überarbeitung klare Verbesserungen auf, weshalb ich zuversichtlich bin, dass sich das Konzept in ein gutes Regelwerk überführen lässt.

### Was ist ein Konzept?

Aus meiner beruflichen und wettkampfstechnischen Erfahrung heraus kenne ich ein Konzept als eine nichtkonkrete Umsetzungsstrategie. In diesem Kontext würde sich also ein Konzept zum Beispiel von einem Regelwerk dahingehend unterscheiden, dass ein Konzept für gemeinsame Wettkämpfe zwar den Ablauf mit den Qualifikationen von LM zu NDM/SDM und DM definiert, aber nicht zwingend die genaue Größe des Kürfeldes vorgibt. Solche Details werden dahingehend in einem Regelwerk konkretisiert. Das Regelwerk sollte am Ende die einzige und abschließende Regelerklärung bieten. Jede Regelfrage sollte eineindeutig mit dem Regelwerk (dies beinhaltet referenzierte Regelwerke) zu beantworten sein.

Das aktuelle Konzept ist meiner Ansicht nach im Charakter eines Regelwerks geschrieben, für ein Regelwerk aber in weiten Teilen nicht präzise genug (z.B. wie funktioniert die Wertung?).

:::actionBlock
Das Konzept aufspalten in ein Zielsetzungskonzept im Stile dessen, was aus der Version 2023 entfernt wurde und stattdessen zusätzlich ein Regelwerk herausgeben.
:::

### Welches Basisregelwerk wird genutzt?

Das Konzept liest sich, als herscht eine einstimmige Meinung welches Basisregelwerk genutzt und hier konkretisiert wird (z.B. fehlen Definitionen wie "Artistic Freestyle" überhaupt funktioniert / was das ist oder wie die Wertung funktioniert).

:::actionBlock
Ein Regelwerk sollte entweder alles von Grund auf definieren (halte ich hier für nicht sinnvoll) oder muss ein Basisregelwerk referenzieren.
:::

### Überstrikte Regeln

Das Konzept setzt an einigen Punkten meiner Meinung nach überstrikte Regeln für den Veranstalter, welche nach Allgemeingültigkeit nicht immer sinnvoll anwendbar sind. Hier eine Liste einiger Beispiele:

#### Zeitraum der Meisterschaften

> Nord/Süd Meisterschaften - Mitte/Ende Oktober (mind. drei Wochen vor DM)
>
> _Konzept, S. 1_

> Beginn am Freitagnachmittag verpflichtend
>
> _Konzept, S. 8_

> Am Sonntag findet in der Mittags- und Umbaupause die Siegerehrung der Einzel- und Paarkür- Finale statt.
>
> _Konzept, S. 11_

Dadurch darf eine solche Meisterschaft niemals einen Feiertag wie zum Beispiel den Tag der Deutschen Einheit komplett nutzen, wenn dieser zum Beispiel auf einem Freitag oder Montag liegt. Ebenso kann es aus unterschiedlichen Gründen sinnvoll sein am Sonntag gar keine Mittags- und Umbaupause zu haben.

#### Jurysitzplatz Gruppenküren

> Die Jury sitzt bei Gruppenküren auf der Tribüne (mit genügend Platz/Ruhe, ab der NDM/SDM ist dies verpflichtend)
>
> _Konzept, S.10_

Wenn dies vor der NDM/SDM nicht verpflichtend ist, sollte dies explizit als "sollte" deklariert sein.

Abseits davon verbietet diese Regel andere örtliche Gegebenheiten zu nutzen, die eventuell sinnvoller sind (z.B. ein Balkon, eine erhöhtes Podest, ...).

:::actionBlock
Dies könnte so geändert werden, dass der Jury eine erhöhte Position mit einer bestimmten Erhöhung ermöglicht wird (z.B. zwischen ein und zwei Metern).
:::

### Nicht ausreichend allgemeingültige Regeln

Neben Regeln, die zu strikt sind, enthält das Konzept auch mehrere Regeln, die unklar sind, oder nicht alle Fälle abdecken. Hier ebenfalls einige Beispiele:

#### Gruppenstartort

> Gruppen müssen dort starten, wo 50% oder mehr der Fahrer vereinszugehörig sind.
>
> _Konzept, S. 2_

Was ist mit Gruppen, die je zu einem Drittel aus Hessen, Thüringen und Niedersachsen kommen? Hier ist für keine Landesmeisterschaft die 50%-Hürde erreichbar. Ebenfalls ist unklar, wie bei einer 50:50 Teilung zwischen zwei Bundesländern verfahren wird. Ebenso ist unklar, ob Ersatzfahrer hier mitzählen.

:::actionBlock
_Änderungsvorschlag:_
Gruppen müssen dort starten, wo die meisten der Fahrer vereinszugehörig sind. Sollte dies nicht eindeutig sein, darf die Gruppe eine Zugehörigkeit wählen.
:::

#### Gruppenwechsel

> Bei Gruppenküren dürfen 50% ausgewechselt werden, d.h. +- 50% Abweichung je nach Gruppengröße.
>
> _Konzept, S. 7_

Bei einer Gruppe mit einer ungeraden Anzahl Teilnehmer ist unklar, ob hier auf-, oder abgerundet wird. Zudem sorgt der zweite Halbsatz eher für Duplizierung und Verwirrung statt eine Klarstellung zu bieten.

:::actionBlock
_Änderungsvorschlag:_
Bei Gruppenküren dürfen maximal 50% ausgewechselt werden.
:::

#### Videokürabfolge

> Die Videokür wird als letzte Kür der jeweiligen Altersklasse und Disziplin im direkten Anschluss an die letzte „Live-Kür“ bewertet.
>
> _Konzept, S. 7_

Diese Formulierung erlaubt nur eine einzige Videokür im Block, da zwei Videoküren nicht beide "als letzte Kür" bewertet werden können.

:::actionBlock
_Änderungsvorschlag:_
Die Videoküren werden als letzte Küren der jeweiligen Altersklasse und Disziplin im direkten Anschluss an die letzte „Live-Kür“ bewertet.
:::

### Nicht ausreichend spezifische Regeln

Die hier genannten Regeln sind nicht genau genug und lassen Unklarheiten offen.

#### Was ist der Veranstaltungsstand?

> entfernte Hallen mit Übertragung des Veranstaltungsstands
>
> _Konzept, S. 8_

Was ist eine ausreichende Übertragung und was ist der "Veranstaltungsstand". Reicht es zum Beispiel, wenn alle 15 Minuten ein Mitglied des Orgateams in die Einfahrhalle geht und laut ruft "Gerade fährt die Marie!", oder ist z.B. ein Livestream, eine Live-Anzeige mit aktualisierendem Zeitplan und so weiter das Minimum?

#### Ab wann ist eine Gruppe eine Großgruppe?

Es werden zwar die Altersgrenzen im Dokument klar definiert, aber nicht, ab wie vielen Fahrern eine Gruppe überhaupt als "Großgruppe" zählt. Was passiert zudem, wenn eine Gruppe (zum Beispiel wegen Verletzungen und Mangel an Ersatzfahrern) unter diese Grenze fällt?

### Regel-in-sich-Konsistenz

Für Laien und Sportler ist ein Regelwerk verständlicher, wenn verwandte Regeln nach dem selben Muster entschieden werden.

#### Fahrerwechsel bei Gruppen- und Paarküren

Für Gruppen gilt nach Regelwerk, dass 50% ausgewechselt werden dürfen. Wenn man jetzt Paarküren als ganz kleine Gruppe ansieht und die selbe Logik anwendet, dann dürfte man einen Fahrer wechseln, was dem aktuellen Regelwerk widerspricht.

Würde man die Gruppenregel hingegen so abwandeln, dass "über die Hälfte der Gruppe bestehen bleiben muss" (Hälfte - 1 darf ausgewechselt werden), dann würde die selbe Logik auch für Paarküren erklären, warum _nicht_ gewechselt werden darf.

#### Altersklassenbestimmung

Für Gruppen gibt es einen Stichtag in der Saison, nach dem die Altersklasse bestimmt wird. Für Einzel- und Paarküren ist der erste Wettkampftag entscheidend.

Eine Vereinheitlichung dahingehend, dass der Stichtag für alle Disziplinen gilt, würde für Laien den Sport verständlicher machen (da dies in anderen Wettkämpfen meiner Erfahrung nach ebenfalls gängig ist) und gleich mehrere Probleme im Konzept und für die Sportler beheben. So muss zum Beispiel nicht mehr auf Altersklassenwechsler geachtet werden und die Kürzeit ändert sich ebenfalls nicht innerhalb einer Saison. Hiervon ist zu erwarten, dass alleine bei den Einzel Weiblich Fahrerinnen jedes Jahr 5-10 von dieser Regel betroffen sind.

#### Abstand zwischen Wettkämpfen

> Ein Abstand zwischen den Wettkämpfen von mindestens drei Wochen muss eingehalten werden.
>
> _Konzept, S. 2_

> ein oder mehrere Wettkämpfe finden in einem Zeitraum von 3 Wochen statt
>
> _Konzept, S. 6_

Diese beiden Aussagen widersprechen sich und können nicht gleichzeitig gültig sein.

### Allgemeine Anmerkungen

In diesem Unterkapitel sammle ich einige Anmerkungen zum Konzept, die keinen anderen Platz haben.

#### Anzahl Starts

> Da die genaue Anzahl der Starter durch das Qualifikationsverfahren bereits feststeht, kann der Veranstalter bzw. Ausrichter bereits im Vorfeld alles erledigen.
>
> _Konzept, S. 2_

:::sidenote
Der relevante Regelabschnitt wurde zur Version 2024 bereits _massiv_ verbessert.
:::

Diese Aussage ist **falsch**.

Der Veranstalter bzw. Ausrichter kennt die maximale Anzahl Starts, aber nicht die genaue Anzahl.

Wenn beispielsweise der Ausrichter der Norddeutschen Meisterschaft seinen Wettkampf vorbereitet weiß er noch nicht, ob in der Vorlaufgruppe Junior Expert insgesamt 27 Starts (3 LMs mit je 3 AK mit je Platz 1-3) oder doch 33 Starts gemeldet werden (3 LMs mit je 3 AK mit je Platz 1-3 + 3LMs mit Platz 4-5 von U15). Bei Expert 1 und Expert 2 wechselt dies nur zwischen je 27 und 30 Starts. Rechnet man dies jetzt zusammen, kommt man auf folgendes:

| Disziplin  | Vorlauf | Min | Max |
| :--------- | :-----: | :-: | :-: |
| Einzel W   |   JE    | 27  | 33  |
| Einzel W   |   E1    | 27  | 30  |
| Einzel W   |   E2    | 27  | 30  |
| Einzel M   |   JE    | 27  | 33  |
| Einzel M   |   E1    | 27  | 30  |
| Einzel M   |   E2    | 27  | 30  |
| Paar       |   JE    | 27  | 33  |
| Paar       |   E1    | 27  | 30  |
| Paar       |   E2    | 27  | 30  |
| **Gesamt** |         | 243 | 279 |

Das sind immerhin 36 Starts oder 15% Spielraum (~1/7). Gerechnet **ohne** Juryzeit macht das 126 Minuten Unterschied oder etwas über 2h im Zeitplan (3 * 6 Küren JE * 3min + 3 * 2 * 3 Küren E * 4min).

#### Einspruchsfrist

> muss dieser innerhalb von 30min nach Bekanntgabe der Ergebnisse einen [...] Antrag [...] am Jurytisch abgeben
>
> _Konzept, S. 11_

Die Bekanntgabe der Ergebnisse ist für mich abgeschlossen, sobald alle Plätze der Gruppe (z.B. einer Altersklasse) verkündet wurden. Dadurch kann bei Ablauf der 30 Minuten die Siegerehrung noch im Gange sein.

:::actionBlock
Ich würde die Frist explizit erst mit Ende der Siegerehrung starten lassen.
:::

#### Alter ist nicht Erfahrung

Das Konzept setzt beim Thema Jury Alter in Relation zu Erfahrung / Fähigkeit. Dieser Zusammenhang ist offensichtlich ein Trugschluss, denn sonst wäre ich mit einem frischen Juryschein ja auf einmal nur deswegen ein besseres Jurymitglied als eine 20-jährige, die seit 4 Jahren aktiv Jurymitglied ist.

> Mindestalter der Juroren ist 16 Jahre, es sollten jedoch maximal drei 16-Jährige pro Wertungsklasse sein
>
> _Konzept, S. 10_

:::actionBlock
Eine Variante wäre, stattdessen die Juryerfahrung als ausschlaggebenden Punkt zu nehmen (z.B. maximal drei Juroren, die das erste mal auf dieser Wettkampfebene (LM, NDM/SDM, DM) richten)
:::

#### Einheitliche Formulierungen

Es sollte klar bestimmt werden, was eine "Meisterschaft" und ein "Wettkampf" sind und diese Begriffe sollten konsistent, eindeutig und synonymfrei im Dokument genutzt werden, um die Verständlichkeit zu verbessern.

#### FAQ

Den Aspekt ein FAQ für häufig gestellte Fragen bereitzustellen, finde ich sehr gut. Dies wurde jedoch mit der aktuellen Überarbeitung ersatzlos entfernt.

Ich würde mir wünschen, dass eine Platform für häufig gestellte Fragen bereitgestellt wird (als Dokument, Forum oder Sonstiges), wo man Verständnisfragen offen stellen und abschließend beantworten kann.

##### Wichtige Eigenschaften eines Regel-FAQs

- Einfach verständlich
- Korrekte Antworten
- Keine "neuen" Regeln aufstellen, die nicht im Regelwerk stehen
- Niemals dem Regelwerk widersprechen
- Antworten sollten auf das Regelwerk verweisen. Beispiel: [FAQ der World Robot Olympiad](https://www.worldrobotolympiad.de/saison-2024/faq#faq1361)

### Allgemein offene Fragen

Hier sammle ich einige Fragen, die ich nicht aus dem Konzept heraus beantworten kann.

- Sind Einzelküren Weiblich und Einzelküren Männlich zwei unterschiedliche Disziplinen? Nach 1.1 würde ich sagen ja, nach 3.1 nein.
- Wenn sich ein Paar aus je einem Nord- und Südfahrer für eine Norddeutsche LM entscheidet, dürfen sie dann (nach Qualifikation zur nächsten Runde) bei der Süddeutschen starten? Falls nein: Wo steht dies im Regelwerk?
- Was ist der offizielle Weg um einmalig Ideen in das Konzept und Regelwerk einzubringen?
- Ist eine Vereinslose Teilnahme an den Meisterschaften möglich? Falls das sein sollte, ist es diesen Fahrern nicht möglich zum Beispiel Einspruch zu erheben.

## Abschließende Worte

Dieses Dokument ist in PDF-Form jetzt länger als das Konzept selbst, von daher fasse ich den Schluss möglichst kurz.

Ich möchte noch einmal widerholen, dass dieser Beitrag meinen Wunsch ausdrückt diesen Sport für alle klarer, verständlicher und professioneller zu gestalten. Ich achte und beführworte die Arbeit, die von allen Seiten in dieses gemeinsame Konzept geflossen ist und mein Ziel ist nur, zu einer weiteren Verbesserung beizutragen.

Ich bin bei allen drei Meisterschaften, die ich mit ausgerichtet habe, von mehreren Seiten gebeten worden meine Software für die Veranstaltung wiederverwendbar bereitzustellen und ich habe noch immer vor dies zu tun. Jedoch brauche ich für die Umsetzung ein klares Regelwerk, damit ich nicht wieder darauf angewiesen bin kurz vor oder während einer Veranstaltung noch größere Änderungen an einer Software vorzunehmen.

Ebenfalls bin ich der Meinung, dass der Prozess der Überarbeitung des Konzepts offener und transparenter gestaltet werden sollte.
In der Softwareentwicklung ist es üblich, dass es neben der offiziell veröffentlichten Version meist auch eine "Vorabversion" gibt, die bereits die nächsten Änderungen enthält und an der noch aktiv gearbeitet wird. Wenn dann auch noch eine Möglichkeit für Außenstehende geschaffen wird Feedback zu einer solchen Version zu geben, würde dies sicherlich allen Seiten entgegenkommen.

Meiner Meinung nach wird die überarbeitete Version zudem viel zu spät veröffentlicht.

> Die Ausschreibungen sollten ca. sechs Monate vor dem Wettkampf veröffentlicht werden.
>
> _Konzept, S. 8_

Mit Beginn der Norddeutschen Meisterschaft mitte Oktober und einer Veröffentlichung der überarbeiteten Version des Konzepts mitte Februar bleibt einem Veranstalter, der vorab die Konditionen seiner Veranstaltung kennen möchte, eigentlich nur zwei Monate grob zu planen, sich zu bewerben und die Ausschreibung anzufertigen.

Ich würde empfehlen als Zielsetzung die Überarbeitung des Konzepts ein halbes Jahr vor Saisonstart zu veröffentlichen, gerade wenn sich noch so fundamentale Fakten wie der Zeitraum für die DM im Konzept ändern.

Gerne bin ich bereit bei der Überarbeitung zu unterstützen, wenn dies gewünscht ist. Meine Kontaktdaten sind den relevanten Personen bekannt.
