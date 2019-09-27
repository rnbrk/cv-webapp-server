const express = require('express');
const fs = require('fs');

const auth = require('../middleware/auth');
const { CV } = require('../models/cv');
const { cvRouterError } = require('../errorMessages/error');
const { arrayContainsItemOfOtherArray } = require('../../src/utils/utils');

const path = require('path');
const PdfPrinter = require('pdfmake');

const moment = require('moment');

const router = express.Router();

const doc = {
  content: [
    /**
     * User profile
     */
    {
      alignment: 'justify',
      margin: [0, 0, 0, 20],
      columns: [
        [
          {
            margin: [0, 0, 0, 10],
            stack: [
              { text: 'Ron Broek', style: 'mainTitle', alignment: 'left' },
              { text: 'Webdeveloper', style: 'sectionTitle', alignment: 'left' }
            ]
          },

          { text: 'ron@web.dev', alignment: 'left' },
          { text: '06 1111 222x', alignment: 'left' },
          { text: 'www.ronbroek.com', alignment: 'left' }
        ],
        { text: 'Image here' }
        // {
        //   image: 'sampleImage.jpg',
        //   width: 100,
        //   height: 100,
        //   alignment: 'right'
        // }
      ]
    },

    /**
     * About me
     */
    {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [
            {
              text: 'About me',
              style: ['tableHeader', 'sectionTitle'],
              margin: [0, 10, 0, 0]
            }
          ],
          [
            {
              text:
                "By default paragraphs are stacked one on top of (or actually - below) another.\nIt's possible however to split any paragraph (or even the whole document) into columns.\nHere we go with 2 star-sized columns, with justified text and gap set to 20:",
              alignment: 'left',
              margin: [0, 3, 0, 10]
            }
          ]
        ]
      },
      layout: 'headerLineOnly'
    },

    /**
     * Job experience
     */

    {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [
            {
              text: 'Experience',
              style: ['tableHeader', 'sectionTitle'],
              margin: [0, 10, 0, 0]
            }
          ],
          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                // Job title
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    [
                      {
                        text: 'Logistiek medewerker',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Bol.com',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ],
                    [
                      {
                        text: 'November 2016 - januari 2019',
                        alignment: 'right'
                      }
                    ]
                  ]
                },
                // Job description
                {
                  text:
                    "By default paragraphs are stacked one on top of (or actually - below) another.\nIt's possible however to split any paragraph (or even the whole document) into columns.\nHere we go with 2 star-sized columns, with justified text and gap set to 20:",
                  alignment: 'left',
                  margin: [0, 3, 0, 10]
                },
                // Job responsibilities
                {
                  ul: [
                    'Aanspreekpunt voor al je vragen',
                    'Rapporteren van issues in de keten d.m.v. analyses',
                    'Stakeholder in logistieke IT-projecten'
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                // Job title
                {
                  margin: [0, 0, 0, 10],
                  columns: [
                    [
                      {
                        text: 'Redacteur ondertiteling',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'NPO',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ],
                    [
                      {
                        text: 'September 2012 - augustus 2016',
                        alignment: 'right'
                      }
                    ]
                  ]
                },
                // Job description
                {
                  text:
                    "By default paragraphs are stacked one on top of (or actually - below) another.\nIt's possible however to split any paragraph (or even the whole document) into columns.\nHere we go with 2 star-sized columns, with justified text and gap set to 20:",
                  alignment: 'left',
                  margin: [0, 3, 0, 10]
                },
                // Job responsibilities
                {
                  ul: [
                    `Tv-programma's live ondertitelen`,
                    'Voorbereiden van ondertiteling',
                    'Onderhoud achterliggende systemen'
                  ]
                }
              ]
            }
          ]
        ]
      },
      layout: 'lightHorizontalLines'
    },

    /**
     * Education
     */

    {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [
            {
              text: 'Education',
              style: ['tableHeader', 'sectionTitle'],
              margin: [0, 10, 0, 0]
            }
          ],
          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'Master American Studies',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Universiteit van Amsterdam',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ],
                    [{ text: '2009 - 2011', alignment: 'right' }]
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'Bachelor Mediastudies',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Universiteit van Amsterdam',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ],
                    [{ text: '2004 - 2008', alignment: 'right' }]
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'Interaction design',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Universiteit van Amsterdam',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ],
                    [{ text: '2007', alignment: 'right' }]
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'Recht & Economie in Europa',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Universiteit van Amsterdam',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ],
                    [{ text: '2009', alignment: 'right' }]
                  ]
                }
              ]
            }
          ]
        ]
      },
      layout: 'headerLineOnly'
    },

    /**
     * Courses / certifications
     */

    {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [
            {
              text: 'Courses',
              style: ['tableHeader', 'sectionTitle'],
              margin: [0, 10, 0, 0]
            }
          ],
          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'The Complete React Developer Course',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Andrew Mead / Udemy',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ]
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'The Complete Node Developer Course',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Universiteit van Amsterdam',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ]
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: `You Don't Know JS`,
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Kyle Simpson',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ]
                  ]
                }
              ]
            }
          ],

          [
            {
              margin: [0, 15, 0, 15],
              stack: [
                {
                  columns: [
                    [
                      {
                        text: 'Clean Code',
                        style: ['itemTitle'],
                        alignment: 'left'
                      },
                      {
                        text: 'Robert C. Martin',
                        style: ['itemSubtitle'],
                        alignment: 'left'
                      }
                    ]
                  ]
                }
              ]
            }
          ]
        ]
      },
      layout: 'headerLineOnly'
    }
  ],
  styles: {
    mainTitle: {
      fontSize: 20,
      bold: true
    },
    sectionTitle: {
      fontSize: 16,
      color: '#2196F3',
      alignment: 'center'
    },
    itemTitle: {
      fontSize: 14,
      bold: true,
      alignment: 'left'
    },
    itemSubtitle: {
      fontSize: 14,
      alignment: 'left'
    }
  },
  defaultStyle: {
    columnGap: 20,
    font: 'Roboto'
  }
};

/**
 * Display cv
 */
router.get('/cvs/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id).populate('user');

    // There must be a cleaner way to get User data into CV.profile
    // This takes the relevant data from the populated CV.user and adds it to CV.profile
    const cvObject = cv.toObject();
    cvObject.profile = {
      ...cvObject.profile,
      email: cvObject.user.email,
      fullName: cvObject.user.fullName,
      profession: cvObject.user.profession,
      website: cvObject.user.website,
      phoneNumber: cvObject.user.phoneNumber,
      dateOfBirth: cvObject.user.dateofBirth,
      hasPhoto: !!cvObject.user.photo
    };

    // replaces user object with its _id again. Undoes population
    cvObject.user = cvObject.user._id;

    res.send(cvObject);
  } catch (e) {
    res.status(404).send({
      error: cvRouterError.NOT_FOUND
    });
  }
});

/**
 * Export cv to pdf
 */
router.get('/cvs/:id/pdf', (req, res) => {
  try {
    const fonts = {
      Roboto: {
        normal: path.resolve('fonts', 'Roboto-Regular.ttf'),
        bold: path.resolve('fonts', 'Roboto-Bold.ttf'),
        italics: path.resolve('fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.resolve('fonts', 'Roboto-BoldItalic.ttf')
      }
    };

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(doc);

    res.set('Content-type', 'application/pdf');
    res.set('Content-disposition', 'inline; filename="cv.pdf"');

    pdfDoc.end();
    pdfDoc.pipe(res);
  } catch (e) {
    console.log(e);
    res.status(404).send({
      error: cvRouterError.NOT_FOUND
    });
  }
});

/**
 * Create new cv
 */
router.post('/cvs', auth, async (req, res) => {
  try {
    const cv = new CV({ user: req.user._id });
    await cv.save();
    res.send(cv);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Delete cv
 */
router.delete('/cvs/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!cv) {
      throw new Error();
    }

    cv.remove();
    res.send();
  } catch (e) {
    res.status(404).send({
      error: cvRouterError.NOT_FOUND
    });
  }
});

/**
 * Update cv
 */
router.patch('/cvs/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });

    if (!cv) throw new Error();

    const ALLOWED_UPDATES = [
      'title',
      'profile',
      'skills',
      'jobs',
      'studies',
      'courses'
    ];

    const isValidOperation = arrayContainsItemOfOtherArray(
      updates,
      ALLOWED_UPDATES
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: userRouterError.INVALID_UPDATES });
    }
    updates.forEach(update => {
      cv[update] = req.body[update];
    });

    const newCv = await cv.save();
    res.send(newCv);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Add new job to CV
 */

router.post('/cvs/:id/jobs', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const listOfJobs = cv.jobs.list;

    const oldestStartDate =
      listOfJobs.reduce(
        (oldestDate, job) =>
          oldestDate === null ||
          moment(job.startDate).isBefore(moment(oldestDate))
            ? job.startDate
            : oldestDate,
        null
      ) || moment('01-01-1970').toISOString();

    listOfJobs.push({
      name: 'Job title',
      employerName: 'Employer name',
      endDate: moment(oldestStartDate)
        .subtract(1, 'month')
        .toISOString(),
      startDate: moment(oldestStartDate)
        .subtract(1, 'year')
        .toISOString(),
      description: 'Job description',
      responsibilities: ['First responsibility', 'Second responsibility']
    });
    const newJob = listOfJobs[listOfJobs.length - 1];
    await cv.save();

    res.status(201).send(newJob);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Delete job from CV
 */
router.delete('/cvs/:id/jobs/:jobId', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const job = await cv.jobs.list.id(req.params.jobId).remove();
    cv.save();
    res.send(job);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Update job
 */
router.patch('/cvs/:id/jobs/:jobId', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const job = await cv.jobs.list.id(req.params.jobId);

    updates.forEach(update => {
      job[update] = req.body[update];
    });

    await cv.save();
    res.send(job);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Add study
 */
router.post('/cvs/:id/studies', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const listOfStudies = cv.studies.list;

    listOfStudies.push({
      name: 'Education name',
      startDate: moment()
        .subtract(1, 'years')
        .toISOString(),
      endDate: moment().toISOString(),
      instituteName: 'Institute name',
      title: 'Title'
    });

    const newStudy = listOfStudies[listOfStudies.length - 1];
    await cv.save();

    res.status(201).send(newStudy);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Delete study
 */
router.delete('/cvs/:id/studies/:studyId', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const study = await cv.studies.list.id(req.params.studyId).remove();
    cv.save();
    res.send(study);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Update study
 */
router.patch('/cvs/:id/studies/:studyId', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const study = await cv.studies.list.id(req.params.studyId);

    updates.forEach(update => {
      study[update] = req.body[update];
    });

    await cv.save();
    res.send(study);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Add course
 */
router.post('/cvs/:id/courses', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const listOfCourses = cv.courses.list;

    listOfCourses.push({
      name: '_Course name',
      instituteName: 'Institute name'
    });

    const newCourse = listOfCourses[listOfCourses.length - 1];
    await cv.save();

    res.status(201).send(newCourse);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Delete course
 */
router.delete('/cvs/:id/courses/:courseId', auth, async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const course = await cv.courses.list.id(req.params.courseId).remove();
    cv.save();
    res.send(course);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

/**
 * Update course
 */
router.patch('/cvs/:id/courses/:courseId', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    const course = await cv.courses.list.id(req.params.courseId);

    updates.forEach(update => {
      course[update] = req.body[update];
    });

    await cv.save();
    res.send(course);
  } catch (e) {
    return res.status(404).send({ error: cvRouterError.NOT_FOUND });
  }
});

module.exports = router;
