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
  weddingStart: "2027-01-06T10:30:00+05:30",
  displayDate: "Wednesday · 6 January 2027",
  displayPlace: "Othera & Kumbanad, Thiruvalla",

  // Audio track
  music: "assets/music.m4a",
  musicLoopStart: 59,
  musicLoopEnd: 156,

  // Timeline events (PDF Page 3)
  events: [
    {
      id: "meet-greet",
      date: "2027-01-06",
      weekday: "Wednesday",
      title: "Meet & Greet",
      parts: [
        {
          time: "10:15 am",
          what: "Meet & Greet",
          where: "Church Grounds, Ebenezer Marthoma Church premises, Othera",
          map: "https://maps.app.goo.gl/BDc7FmCFvpCj5zTm6"
        }
      ],
      cal: {
        start: "2027-01-06T10:15:00+05:30",
        end: "2027-01-06T10:30:00+05:30"
      }
    },
    {
      id: "ceremony",
      date: "2027-01-06",
      weekday: "Wednesday",
      highlight: true,
      title: "Wedding Ceremony",
      parts: [
        {
          time: "10:30 am",
          what: "Wedding Ceremony",
          where: "Ebenezer Marthoma Church, Othera P.O, Thiruvalla",
          map: "https://maps.app.goo.gl/BDc7FmCFvpCj5zTm6"
        }
      ],
      cal: {
        start: "2027-01-06T10:30:00+05:30",
        end: "2027-01-06T12:00:00+05:30"
      }
    },
    {
      id: "reception",
      date: "2027-01-06",
      weekday: "Wednesday",
      highlight: true,
      title: "Wedding Reception",
      parts: [
        {
          time: "12:30 pm",
          what: "Wedding Reception",
          where: "Royal Convention Centre, Kumbanad",
          map: "https://maps.app.goo.gl/WBtSgTKFupCVxvTd9"
        }
      ],
      cal: {
        start: "2027-01-06T12:30:00+05:30",
        end: "2027-01-06T15:00:00+05:30"
      }
    },
    {
      id: "toast",
      date: "2027-01-06",
      weekday: "Wednesday",
      title: "Final Toast",
      parts: [
        {
          time: "3:00 pm",
          what: "Final Toast",
          where: "Royal Convention Centre, Kumbanad",
          map: "https://maps.app.goo.gl/WBtSgTKFupCVxvTd9"
        }
      ],
      cal: {
        start: "2027-01-06T15:00:00+05:30",
        end: "2027-01-06T15:30:00+05:30"
      }
    }
  ],

  // Gallery Photos (PDF Page 4)
  photos: [
    { src: "assets/img/img-1.jpeg", alt: "Bibin & Christeena", arch: true },
    { src: "assets/img/img-2.jpeg", alt: "Bibin & Christeena" },
    { src: "assets/img/img-3.jpeg", alt: "Bibin & Christeena" },
    { src: "assets/img/img-4.jpeg", alt: "Bibin & Christeena" },
    { src: "assets/img/img-5.jpeg", alt: "Bibin & Christeena" },
    { src: "assets/img/img-6.jpeg", alt: "Bibin & Christeena", arch: true }
  ],

  // Guest Wishes Storage Settings (PDF Page 5)
  guestbook: {
    storageKey: "bibin_christeena_wishes_v1",
    googleForm: {
      endpoint: "https://docs.google.com/forms/d/e/1FAIpQLSeUwgTw6m4BBdEj_nTMrcHr3ucwYLrxX_l-wLSF5DPWlaEZXw/formResponse",
      nameEntry: "entry.1266621477",
      messageEntry: "entry.381587613"
    }
  },

  // Footer Closing (PDF Page 5)
  closing: {
    withLoveFrom: "Alvin, Betsy & Christy",
    couple: "Bibin & Christeena"
  }
};
