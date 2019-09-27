const moment = require('moment');

const createItemHeader = ({
  title,
  subtitle,
  startDate,
  endDate,
  dateFormat = 'DD-MM-YYYY'
}) => [
  {
    margin: [0, 15, 0, 15],
    stack: [
      {
        columns: [
          [
            { text: title || null, style: ['itemTitle'] },
            {
              text: subtitle || null,
              style: ['itemSubtitle']
            }
          ],
          startDate &&
            endDate && [
              {
                text: `${moment(startDate).format(dateFormat)} - ${moment(
                  endDate
                ).format(dateFormat)}`,
                alignment: 'right'
              }
            ]
        ]
      }
    ]
  }
];

const studyObj = {
  _id: '5d5eff42a7c2c117fe5eb08e',
  endDate: '2010-08-31T00:00:00.000',
  name: 'American Studies',
  instituteName: 'Universiteit van Amsterdam',
  startDate: '2009-09-01T00:00:00.000Z',
  title: 'MA'
};

const jobObj = {
  _id: '5d77a8ee45107a3ea687d400',
  endDate: '2017-07-31T00:00:00.000Z',
  name: 'Redacteur',
  employerName: 'NPO',
  startDate: '2013-09-01T00:00:00.000Z',
  description: `Televisieprogramma's voorzien van ondertiteling voor doven- en slechthorenden via teletekst 888. Ik heb allerlei tv-programma's ondertiteld, waaronder liveprogramma's als De Wereld Draait Door, het NOS Journaal en Studio Sport. Werkzaamheden hielden in: het voorbereiden van ondertiteling, gebruik van speech-to-textsoftware en ervoor zorgen dat de achterliggende systemen bleven draaien.`,
  responsibilities: [
    `Tv-programma's live ondertitelen`,
    `Voorbereiden van ondertiteling`,
    `Onderhoud achterliggende systemen`
  ]
};

const courseObj = {
  _id: '5d5eff42a7c2c117fe5eb08e',
  name: 'The Complete React Developer Course',
  instituteName: 'Andrew Mead / Udemy'
};

const jobsSectionObj = {
  title: 'Job experience',
  list: [{ ...jobObj }, { ...jobObj }],
  paragraph: 'Not used text'
};

const studiesSectionObj = {
  title: 'Education',
  list: [{ ...studyObj }, { ...studyObj }],
  paragraph: 'Some long paragraph of text which is not used at all :('
};

const coursesSectionObj = {
  title: 'Courses and certifications',
  list: [{ ...courseObj }, { ...courseObj }],
  paragraph: 'Some long paragraph of text which is not used at all :('
};

const createJobItem = ({
  title,
  subtitle,
  startDate,
  endDate,
  description,
  responsibilities
}) => ({
  margin: [0, 15, 0, 15],
  stack: [
    createItemHeader({
      title,
      subtitle,
      startDate,
      endDate,
      dateFormat: 'MMMM YYYY'
    }),
    {
      text: description,
      margin: [0, 3, 0, 10]
    },
    {
      ul: responsibilities
    }
  ]
});

const createSection = (
  title,
  content = () => null,
  layout = 'headerLineOnly'
) => ({
  table: {
    headerRows: 1,
    widths: ['*'],
    body: [
      [{ text: title, style: ['tableHeader', 'sectionTitle'] }],
      [content()]
    ]
  },
  layout
});

const createAboutMeSection = ({ title, text }) => {
  return createSection(title, () => ({
    text,
    alignment: 'left',
    margin: [0, 15, 0, 15]
  }));
};

const createJobsSection = ({ title, list }) =>
  createSection(
    title,
    () =>
      list.map(({ name, employerName, startDate, endDate, description }) =>
        createJobItem({
          title: name,
          subtitle: employerName,
          description,
          startDate,
          endDate,
          dateFormat: 'MMMM YYYY'
        })
      ),
    'lightHorizontalLines'
  );

const createStudiesSection = ({ title, list }) =>
  createSection(title, () =>
    list.map(({ name, instituteName, startDate, endDate }) =>
      createItemHeader({
        title: name,
        subtitle: instituteName,
        startDate,
        endDate,
        dateFormat: 'YYYY'
      })
    )
  );

const createCoursesSection = ({ title, list }) =>
  createSection(title, () =>
    list.map(({ name, instituteName }) =>
      createItemHeader({
        title: name,
        subtitle: instituteName
      })
    )
  );

const profileObj = {
  email: 'ron@web.dev',
  fullName: 'Ron Broek',
  photo: false,
  paragraph:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et ligula ullamcorper malesuada proin libero.',
  phoneNumber: '06 12345678',
  profession: 'Le developeur de web',
  title: 'Mijn CV 2',
  website: {
    name: 'www.ronbroek.com',
    link: 'https://www.ronbroek.com'
  }
};

const createUserProfile = ({
  title,
  subtitle,
  email,
  phoneNumber,
  website,
  photo
}) => ({
  margin: [0, 0, 0, 20],
  columns: [
    [
      {
        margin: [0, 0, 0, 10],
        stack: [
          { text: title || null, style: 'mainTitle' },
          { text: subtitle || null, style: 'mainSubitle' }
        ]
      },

      email ? { text: email } : null,
      phoneNumber ? { text: phoneNumber } : null,
      website ? { text: website.name } : null
    ],
    photo ? 'PHOTO' : null
    // {
    //   image: photo,
    //   width: 100,
    //   height: 100,
    //   alignment: 'right'
    // }
  ]
});

const cvObj = {
  title: 'CV 11-09-2019 11:41',
  user: '5d65017606f4421fab1571d5',
  _id: '5d49e7123492066d3e8aa1d3',
  courses: coursesSectionObj,
  jobs: jobsSectionObj,
  studies: studiesSectionObj,
  profile: profileObj
};

const styleObj = {
  styles: {
    mainTitle: {
      fontSize: 18,
      bold: true
    },
    mainSubtitle: {
      fontSize: 14,
      color: '#2196F3'
    },
    sectionTitle: {
      fontSize: 14,
      color: '#2196F3',
      alignment: 'center',
      margin: [0, 10, 0, 0]
    },
    itemTitle: {
      fontSize: 12,
      bold: true,
      alignment: 'left'
    },
    itemSubtitle: {
      fontSize: 12,
      alignment: 'left'
    }
  },
  defaultStyle: {
    columnGap: 20,
    fontSize: 10
  }
};

const createPDFDocDefinition = (
  { title, courses, jobs, studies, profile },
  styleObj
) => {
  const docDefinition = {
    content: [
      createUserProfile({
        title: profile.fullName,
        subtitle: profile.profession,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        website: profile.website,
        photo: profile.photo
      }),
      createAboutMeSection({ title: 'About me', text: profile.paragraph }),
      createJobsSection({ title: jobs.title, list: jobs.list }),
      createStudiesSection({ title: studies.title, list: studies.list }),
      createCoursesSection({ title: courses.title, list: courses.list })
    ],
    ...styleObj
  };

  return docDefinition;
};

console.log(JSON.stringify(createPDFDocDefinition(cvObj, styleObj), null, 4));

// const exampleDocDefinition = {
//   content: [
//     /**
//      * User profile
//      */
//     {
//       alignment: 'justify',
//       margin: [0, 0, 0, 20],
//       columns: [
//         [
//           {
//             margin: [0, 0, 0, 10],
//             stack: [
//               { text: 'Ron Broek', style: 'mainTitle' },
//               { text: 'Webdeveloper', style: 'mainSubtitle' }
//             ]
//           },

//           { text: 'ron@web.dev' },
//           { text: '06 1111 222x' },
//           { text: 'www.ronbroek.com' }
//         ],
//         {
//           image: 'sampleImage.jpg',
//           width: 100,
//           height: 100,
//           alignment: 'right'
//         }
//       ]
//     },

//     /**
//      * About me
//      */
//     {
//       table: {
//         headerRows: 1,
//         widths: ['*'],
//         body: [
//           [{ text: 'About me', style: ['tableHeader', 'sectionTitle'] }],
//           [
//             {
//               text:
//                 "By default paragraphs are stacked one on top of (or actually - below) another.\nIt's possible however to split any paragraph (or even the whole document) into columns.\nHere we go with 2 star-sized columns, with justified text and gap set to 20:",
//               alignment: 'left',
//               margin: [0, 15, 0, 15]
//             }
//           ]
//         ]
//       },
//       layout: 'headerLineOnly'
//     },

//     /**
//      * Job experience
//      */

//     {
//       table: {
//         headerRows: 1,
//         widths: ['*'],
//         body: [
//           [{ text: 'Experience', style: ['tableHeader', 'sectionTitle'] }],
//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 // Job title
//                 {
//                   margin: [0, 0, 0, 10],
//                   columns: [
//                     [
//                       { text: 'Logistiek medewerker', style: ['itemTitle'] },
//                       { text: 'Bol.com', style: ['itemSubtitle'] }
//                     ],
//                     [
//                       {
//                         text: 'November 2016 - januari 2019',
//                         alignment: 'right'
//                       }
//                     ]
//                   ]
//                 },
//                 // Job description
//                 {
//                   text:
//                     "By default paragraphs are stacked one on top of (or actually - below) another.\nIt's possible however to split any paragraph (or even the whole document) into columns.\nHere we go with 2 star-sized columns, with justified text and gap set to 20:",
//                   alignment: 'left',
//                   margin: [0, 3, 0, 10]
//                 },
//                 // Job responsibilities
//                 {
//                   ul: [
//                     'Aanspreekpunt voor al je vragen',
//                     'Rapporteren van issues in de keten d.m.v. analyses',
//                     'Stakeholder in logistieke IT-projecten'
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 // Job title
//                 {
//                   margin: [0, 0, 0, 10],
//                   columns: [
//                     [
//                       {
//                         text: 'Redacteur ondertiteling',
//                         style: ['itemTitle']
//                       },
//                       { text: 'NPO', style: ['itemSubtitle'] }
//                     ],
//                     [
//                       {
//                         text: 'September 2012 - augustus 2016',
//                         alignment: 'right'
//                       }
//                     ]
//                   ]
//                 },
//                 // Job description
//                 {
//                   text:
//                     "By default paragraphs are stacked one on top of (or actually - below) another.\nIt's possible however to split any paragraph (or even the whole document) into columns.\nHere we go with 2 star-sized columns, with justified text and gap set to 20:",
//                   alignment: 'left',
//                   margin: [0, 3, 0, 10]
//                 },
//                 // Job responsibilities
//                 {
//                   ul: [
//                     `Tv-programma's live ondertitelen`,
//                     'Voorbereiden van ondertiteling',
//                     'Onderhoud achterliggende systemen'
//                   ]
//                 }
//               ]
//             }
//           ]
//         ]
//       },
//       layout: 'lightHorizontalLines'
//     },

//     /**
//      * Education
//      */

//     {
//       table: {
//         headerRows: 1,
//         widths: ['*'],
//         body: [
//           [{ text: 'Education', style: ['tableHeader', 'sectionTitle'] }],
//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       {
//                         text: 'Master American Studies',
//                         style: ['itemTitle']
//                       },
//                       {
//                         text: 'Universiteit van Amsterdam',
//                         style: ['itemSubtitle']
//                       }
//                     ],
//                     [{ text: '2009 - 2011', alignment: 'right' }]
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       { text: 'Bachelor Mediastudies', style: ['itemTitle'] },
//                       {
//                         text: 'Universiteit van Amsterdam',
//                         style: ['itemSubtitle']
//                       }
//                     ],
//                     [{ text: '2004 - 2008', alignment: 'right' }]
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       { text: 'Interaction design', style: ['itemTitle'] },
//                       {
//                         text: 'Universiteit van Amsterdam',
//                         style: ['itemSubtitle'],
//                         alignment: 'left'
//                       }
//                     ],
//                     [{ text: '2007', alignment: 'right' }]
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       {
//                         text: 'Recht & Economie in Europa',
//                         style: ['itemTitle']
//                       },
//                       {
//                         text: 'Universiteit van Amsterdam',
//                         style: ['itemSubtitle']
//                       }
//                     ],
//                     [{ text: '2009', alignment: 'right' }]
//                   ]
//                 }
//               ]
//             }
//           ]
//         ]
//       },
//       layout: 'headerLineOnly'
//     },

//     /**
//      * Courses / certifications
//      */

//     {
//       table: {
//         headerRows: 1,
//         widths: ['*'],
//         body: [
//           [{ text: 'Courses', style: ['tableHeader', 'sectionTitle'] }],
//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       {
//                         text: 'The Complete React Developer Course',
//                         style: ['itemTitle']
//                       },
//                       {
//                         text: 'Andrew Mead / Udemy',
//                         style: ['itemSubtitle']
//                       }
//                     ]
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       {
//                         text: 'The Complete Node Developer Course',
//                         style: ['itemTitle']
//                       },
//                       {
//                         text: 'Universiteit van Amsterdam',
//                         style: ['itemSubtitle']
//                       }
//                     ]
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       { text: `You Don't Know JS`, style: ['itemTitle'] },
//                       {
//                         text: 'Kyle Simpson',
//                         style: ['itemSubtitle']
//                       }
//                     ]
//                   ]
//                 }
//               ]
//             }
//           ],

//           [
//             {
//               margin: [0, 15, 0, 15],
//               stack: [
//                 {
//                   columns: [
//                     [
//                       { text: 'Clean Code', style: ['itemTitle'] },
//                       {
//                         text: 'Robert C. Martin',
//                         style: ['itemSubtitle']
//                       }
//                     ]
//                   ]
//                 }
//               ]
//             }
//           ]
//         ]
//       },
//       layout: 'headerLineOnly'
//     }
//   ],
//   styles: {
//     mainTitle: {
//       fontSize: 18,
//       bold: true
//     },
//     mainSubtitle: {
//       fontSize: 14,
//       color: '#2196F3'
//     },
//     sectionTitle: {
//       fontSize: 14,
//       color: '#2196F3',
//       alignment: 'center',
//       margin: [0, 10, 0, 0]
//     },
//     itemTitle: {
//       fontSize: 12,
//       bold: true,
//       alignment: 'left'
//     },
//     itemSubtitle: {
//       fontSize: 12,
//       alignment: 'left'
//     }
//   },
//   defaultStyle: {
//     columnGap: 20,
//     fontSize: 10
//   }
// };
