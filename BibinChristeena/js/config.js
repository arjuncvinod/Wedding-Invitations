/**
 * Wedding Website Configuration: Bibin & Christeena
 * All invitation content, dates, venues, links, and photos are configured here.
 */

const CONFIG = {
  couple: {
    groom: "Bibin",
    bride: "Christeena",
    groomParents: "Mr. T.V. Varghese & Mrs. Mariamma Varghese",
    brideParents: "Mr. Thomas T. Iype & Mrs. Betsy Thomas",
    initials: "B & C"
  },

  // Wedding date in ISO format for countdown (IST UTC+05:30)
  weddingStart: "2026-11-28T10:30:00+05:30",
  displayDate: "Saturday · 28 November 2026",
  displayPlace: "Othera & Kumbanad, Thiruvalla",

  // Audio track
  music: "assets/music.mp3",

  // Timeline events (PDF Page 3)
  events: [
    {
      id: "meet-greet",
      date: "2026-11-28",
      weekday: "Saturday",
      title: "Meet & Greet",
      parts: [
        {
          time: "10:15 am",
          what: "Meet & Greet",
          where: "Church Grounds, Ebenezer Marthoma Church premises, Othera",
          map: "https://maps.google.com/?q=Ebenezer+Marthoma+Church+Othera+Thiruvalla"
        }
      ],
      cal: {
        start: "2026-11-28T10:15:00+05:30",
        end: "2026-11-28T10:30:00+05:30"
      }
    },
    {
      id: "ceremony",
      date: "2026-11-28",
      weekday: "Saturday",
      highlight: true,
      title: "Wedding Ceremony",
      parts: [
        {
          time: "10:30 am",
          what: "Wedding Ceremony",
          where: "Ebenezer Marthoma Church, Othera P.O, Thiruvalla",
          map: "https://maps.google.com/?q=Ebenezer+Marthoma+Church+Othera+Thiruvalla"
        }
      ],
      cal: {
        start: "2026-11-28T10:30:00+05:30",
        end: "2026-11-28T12:00:00+05:30"
      }
    },
    {
      id: "reception",
      date: "2026-11-28",
      weekday: "Saturday",
      highlight: true,
      title: "Wedding Reception",
      parts: [
        {
          time: "12:30 pm",
          what: "Wedding Reception",
          where: "Royal Convention Centre, Kumbanad",
          map: "https://maps.google.com/?q=Royal+Convention+Centre+Kumbanad"
        }
      ],
      cal: {
        start: "2026-11-28T12:30:00+05:30",
        end: "2026-11-28T15:00:00+05:30"
      }
    },
    {
      id: "toast",
      date: "2026-11-28",
      weekday: "Saturday",
      title: "Final Toast",
      parts: [
        {
          time: "3:00 pm",
          what: "Final Toast",
          where: "Royal Convention Centre, Kumbanad",
          map: "https://maps.google.com/?q=Royal+Convention+Centre+Kumbanad"
        }
      ],
      cal: {
        start: "2026-11-28T15:00:00+05:30",
        end: "2026-11-28T15:30:00+05:30"
      }
    }
  ],

  // Gallery Photos (PDF Page 4)
  photos: [
    { src: "assets/img/couple-1.jpg", alt: "Bibin & Christeena holding hands", arch: true },
    { src: "assets/img/couple-2.jpg", alt: "Bibin & Christeena laughing together" },
    { src: "assets/img/couple-3.jpg", alt: "Bibin & Christeena romantic portrait" },
    { src: "assets/img/couple-4.jpg", alt: "Bibin & Christeena in the garden" },
    { src: "assets/img/couple-5.jpg", alt: "Bibin & Christeena golden sunset" },
    { src: "assets/img/couple-6.jpg", alt: "Bibin & Christeena looking forward together", arch: true },
    { src: "assets/img/vignette-1.jpg", alt: "The Vow - Sacred wedding rings" },
    { src: "assets/img/vignette-2.jpg", alt: "The Bond - Hands intertwined" },
    { src: "assets/img/vignette-3.jpg", alt: "The Grace - Fresh bridal florals" }
  ],

  // Guest Wishes Storage Settings (PDF Page 5)
  guestbook: {
    storageKey: "bibin_christeena_wishes_v1",
    apiEndpoint: ""
  },

  // Footer Closing (PDF Page 5)
  closing: {
    withLoveFrom: "Alvin, Betsy & Christy",
    couple: "Bibin & Christeena"
  }
};
