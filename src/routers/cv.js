const express = require('express');

const auth = require('../middleware/auth');
const { CV } = require('../models/cv');
const { cvRouterError } = require('../errorMessages/error');
const { arrayContainsItemOfOtherArray } = require('../../src/utils/utils');

const moment = require('moment');

const router = express.Router();

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
      dateOfBirth: cvObject.user.dateofBirth
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
// POST '/cvs/:id/studies'

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

module.exports = router;
