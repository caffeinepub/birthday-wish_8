# Birthday Wish

## Current State
- App has 6 flip wish cards (BirthdayWishCards.tsx) with hardcoded label and message text
- PersonalNoteCard component exists but is NOT rendered in App.tsx
- CustomizePanel has fields: recipientName, birthdayDate, personalNote, senderName, surpriseMessage, backgroundTheme
- BirthdayProfile backend type has those same fields (no card-specific fields)

## Requested Changes (Diff)

### Add
- Customisable text (label + message) for each of the 6 wish cards, stored in localStorage
- A "Special Letter" section rendered in the page (using PersonalNoteCard component) that shows the personalNote and senderName from profile — this component is already built but unused
- CustomizePanel sections to edit each card's label & message (6 cards)
- CustomizePanel section to edit the special letter (maps to existing personalNote field, which is already editable — just ensure it's clearly labelled as "Special Letter")

### Modify
- BirthdayWishCards: accept optional customCards prop (array of {label, message}) to override hardcoded defaults
- App.tsx: load customCards from localStorage, pass to BirthdayWishCards, add PersonalNoteCard section with ScrollReveal
- CustomizePanel FormFields: add collapsible section for editing all 6 card labels+messages; rename personalNote field label to "Special Letter Text"

### Remove
- Nothing removed

## Implementation Plan
1. Update BirthdayWishCards to accept `customCards?: {label: string; message: string}[]` prop; use custom text when provided
2. Update App.tsx: load/save customCards from localStorage (key: `bdayCards`); pass to BirthdayWishCards; add PersonalNoteCard with ScrollReveal after the wish cards section
3. Update CustomizePanel: add 6 card text fields (label + message each) in FormFields; pass customCards/setCustomCards through Props; save to localStorage on save; label personalNote as "Special Letter Text"
4. Validate and build
