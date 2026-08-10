# Information Architecture

## Website type

A focused German-language B2B one-page website with separate legal pages.

## Routes

- `/` — main landing page
- `/impressum` — legal notice with placeholders
- `/datenschutz` — privacy policy with placeholders
- `/robots.txt`
- `/sitemap.xml`

## Header navigation

- Produkt
- Funktionsweise
- Einsatzbereiche
- Verantwortung
- Kontakt
- CTA: Pilotprojekt besprechen

Use anchor navigation on the landing page.

## Landing-page sequence

### 1. Header

- logo on the left
- anchor navigation
- primary CTA
- mobile menu
- sticky or lightly floating behavior is allowed if unobtrusive

### 2. Hero

Purpose: explain the product immediately.

Content:

- eyebrow: `AI Venue Intelligence`
- headline: `Risiken erkennen, bevor Situationen eskalieren.`
- supporting copy
- primary and secondary CTA
- polished product/dashboard visual

The visual should communicate:

- camera zones
- venue map or abstract floor plan
- risk heatmap
- prioritized alert
- human review status

It must look like a conceptual product interface, not a fake claim of a finished deployed product.

### 3. Trust/positioning strip

A concise strip with statements such as:

- Bestehende Kamerainfrastruktur
- Priorisierte Lagehinweise
- Menschliche Entscheidungshoheit

Do not add customer logos.

### 4. Problem

Explain why raw camera feeds are not enough.

Suggested structure:

- short intro
- three or four problem cards
- visual emphasis on attention overload and changing venue dynamics

### 5. Solution / Product

Explain the central operational dashboard and its outputs:

- live overview
- heatmaps
- prioritized alerts
- contextual information
- review workflow

### 6. How it works

Three steps:

1. Erfassen
2. Analysieren
3. Unterstützen

### 7. Use cases

Four cards:

- Clubs und Nachtgastronomie
- Festivals und Großveranstaltungen
- Festzelte und Eventhallen
- Security-Unternehmen

### 8. Human control

Prominent section with the message:

`Atreides trifft keine Sicherheitsentscheidungen.`

Explain:

- no autonomous action
- alerts require human review
- final decisions remain with venue staff
- the system is intended to focus attention, not label individuals

### 9. Responsible technology and privacy

Communicate principles only:

- data minimization
- no facial recognition
- no biometric identification
- role-based access as a design objective
- traceable alert workflow
- configurable retention as a design objective

Do not claim a specific hosting region, certification or implementation status unless supplied later.

### 10. Pilot program

Explain that Atreides is looking for selected pilot environments.

Possible pilot steps:

- infrastructure assessment
- definition of relevant scenarios
- limited pilot area
- joint evaluation with security leadership
- feedback and iteration

### 11. Contact

Preferred first version:

A lightweight form with:

- name
- company
- business email
- venue type
- optional number of cameras
- message
- privacy checkbox

However, do not connect a database or mail service until credentials and recipient details are supplied. Initially, either:

A. implement a validated frontend form with a clear temporary disabled/submission placeholder, or  
B. use a mailto CTA if the owner supplies a business email.

Never silently discard a submitted form.

### 12. Footer

- logo
- one-sentence description
- contact placeholder
- Impressum
- Datenschutz
- copyright
