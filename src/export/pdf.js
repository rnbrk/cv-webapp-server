const moment = require('moment');
const path = require('path');

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

const createJobItem = ({
  title,
  subtitle,
  startDate,
  endDate,
  description,
  responsibilities = []
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

    responsibilities.length > 0
      ? {
          ul: responsibilities
        }
      : null
  ]
});

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
          { text: subtitle || null, style: 'mainSubtitle' }
        ]
      },

      email ? { text: email } : null,
      phoneNumber ? { text: phoneNumber } : null,
      website ? { text: website.name } : null
    ],
    photo
      ? {
          image: photo.buffer,
          width: 100,
          height: 100,
          alignment: 'right'
        }
      : null
  ]
});

const createPDFDocDefinition = (
  { title, courses, jobs, studies, user, profile },
  styleObj
) => {
  const docDefinition = {
    content: [
      createUserProfile({
        title: user.fullName,
        subtitle: user.profession,
        email: user.email,
        phoneNumber: user.phoneNumber,
        website: user.website,
        photo: user.photo
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

const styles = {
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
    fontSize: 10,
    font: 'Roboto'
  }
};

const fonts = {
  Roboto: {
    normal: path.resolve('fonts', 'Roboto-Regular.ttf'),
    bold: path.resolve('fonts', 'Roboto-Bold.ttf'),
    italics: path.resolve('fonts', 'Roboto-Italic.ttf'),
    bolditalics: path.resolve('fonts', 'Roboto-BoldItalic.ttf')
  }
};

module.exports = { createPDFDocDefinition, styles, fonts };
