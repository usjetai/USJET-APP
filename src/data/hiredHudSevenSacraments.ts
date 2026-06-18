/** Seven sacraments — Catholic Church (Catechism of the Catholic Church, CCC 1210–1211). */

export const HIRED_HUD_SEVEN_SACRAMENTS = [
  {
    name: "Baptism",
    summary:
      "Entry into the Church; water and the Trinitarian formula wash away original sin and mark the soul for Christ.",
  },
  {
    name: "Confirmation",
    summary:
      "Sealed with chrism by the bishop; the Holy Spirit strengthens the baptized for mission and witness.",
  },
  {
    name: "Eucharist",
    summary:
      "Holy Communion — the body and blood of Jesus Christ under the appearances of bread and wine at Mass.",
  },
  {
    name: "Penance",
    summary:
      "Reconciliation (Confession): confess sins to a priest, receive absolution, and return to grace.",
  },
  {
    name: "Anointing of the Sick",
    summary:
      "Sacrament of healing and comfort for the seriously ill; unites suffering with Christ the healer.",
  },
  {
    name: "Holy Orders",
    summary:
      "Ordination of bishops, priests, and deacons to serve the Church in the person of Christ the Head.",
  },
  {
    name: "Matrimony",
    summary:
      "Sacramental marriage between baptized man and woman — covenant love mirroring Christ and the Church.",
  },
] as const;

export const HIRED_HUD_SEVEN_SACRAMENT_COUNT = HIRED_HUD_SEVEN_SACRAMENTS.length;

/** Jesus Christ — fleet radio catechism anchors. */
export const HIRED_HUD_RADIO_CHRIST_ANCHORS = {
  title: "Jesus Christ",
  sonOfGod: "Second Person of the Trinity — true God and true man.",
  savior: "Died on the cross for our sins and rose on the third day.",
  eucharist: "Present in the Eucharist — 'This is my body' at the Last Supper.",
  shepherd: "Good Shepherd who lays down his life for the flock.",
} as const;

/** Blessed Virgin Mary — Mother of God. */
export const HIRED_HUD_RADIO_MARY_ANCHORS = {
  title: "Blessed Virgin Mary",
  motherOfGod: "Theotokos — Mother of God; carried Jesus in the womb at the Annunciation.",
  immaculate: "Immaculate Conception — preserved from original sin by grace.",
  fiat: "Her yes at Nazareth: 'Let it be done unto me according to thy word.'",
  rosary: "Rosary devotion — meditate on Christ's life through Mary's eyes.",
  intercessor: "Honored as Mother and intercessor; she points every soul to her Son.",
} as const;
