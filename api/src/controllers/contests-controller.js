import express from 'express';
import { authMiddleware, roleMiddleware } from '../auth/auth-middleware.js';
import contestsData from '../data/contests-data.js';
import phasetwoData from '../data/phasetwo-data.js';
import usersData from '../data/users-data.js';
import phaseOneData from '../data/phaseone-data.js';
import contestsService from '../services/contests-service.js';
import serviceErrors from '../services/service-errors.js';
import { createValidator, createContestSchema, userSubmitSchema, juryScoringSchema } from './../validators/allSchemas.js';
import multer from 'multer';
import storage from '../../storage.js';


const contestsController = express.Router();

contestsController.use(authMiddleware);

contestsController
  .get('/phaseone',
    async (req, res) => {
      const { user } = req;

      const { error, contests } = await contestsService.getPhaseOneContests(contestsData)(user);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Not found contests in phase one' });
      } else {

        res.status(200).send(contests);
      }
    })
  .get('/phaseone/:id',
    async (req, res) => {

      const { id } = req.params;
      const { error, contest } = await contestsService.getPhaseOneContestById(phaseOneData, contestsData)(+id);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Contest not found or not in phase two!' });
      } else {

        res.status(200).send(contest);
      }
    })
  .get('/phasetwo',
    roleMiddleware('Organizer'),
    async (req, res) => {

      const { error, contests } = await contestsService.getPhaseTwoContests(contestsData)();

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Not found contests in phase two' });
      } else {

        res.status(200).send(contests);
      }
    })
  .get('/phasetwo/:id',
    roleMiddleware('Organizer'),
    async (req, res) => {

      const { id } = req.params;
      const { error, contest } = await contestsService.getPhaseTwoContestById(phasetwoData, contestsData)(+id);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Contest not found or not in phase two!' });
      } else {

        res.status(200).send(contest);
      }
    })
  .get('/finished',
    async (req, res) => {

      const { error, contests } = await contestsService.getFinishedContests(contestsData)();

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Not found finished contests' });
      } else {

        res.status(200).send(contests);
      }
    })
  .get('/finished/:id',
    async (req, res) => {

      const { id } = req.params;
      const userId = req.user.id;
      const { error, contest } = await contestsService.getFinishedContestById(contestsData)(+id, +userId);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Contest not found or not finished!' });
      } else {

        res.status(200).send(contest);
      }
    })
  .post('/create',
    roleMiddleware('Organizer'),
    multer({ storage: storage }).single('photo'),
    createValidator(createContestSchema),
    async (req, res) => {
      const { title, category, isopen, phase1, phase2, users } = req.body;

      const photo = req.file.filename;
      const userSubmissionData = {
        title,
        category,
        isopen,
        phase1,
        phase2,
        photo,
        users,
      };

      const { error, contest } = await contestsService.createContest(contestsData, usersData)(userSubmissionData);

      if (error === serviceErrors.DUPLICATE_RECORD) {

        res.status(400).send({ message: 'Please enter a unique contest name!' });
      } else {

        res.status(201).send(contest);
      }
    })
  .get('/private-users/:id',
    async (req, res) => {

      const { id } = req.params;
      const { error, users } = await contestsService.getPrivateUsers(contestsData)(id);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(400).send({ message: 'You don\'t participate in private contests yet!' });
      } else {

        res.status(201).send(users);
      }
    },
  )
  .get('/:id/user-submit',
    async (req, res) => {
      const { id } = req.params;
      const { error, submissions } = await contestsService.getSubmissionsById(phaseOneData)(+id);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Not found contests' });
      } else {

        res.status(200).send(submissions);
      }
    })
  .get('/user-submit/mycontests/',
    roleMiddleware('Photo Junkie'),
    async (req, res) => {
      const { id } = req.user;
      const { error, contests } = await contestsService.getAllContestsForCurrentUser(contestsData)(+id);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'You currently don\'t participate in any contests' });
      } else {

        res.status(200).send(contests);
      }
    },
  )
  .get('/:contestid/user-submit/:id',
    async (req, res) => {
      const { contestid, id } = req.params;
      const { error, submission } = await contestsService.getSubmissionScoreById(contestsData)(+contestid, +id);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Not founded scorings!' });
      } else {

        res.status(200).send(submission);
      }
    },
  )
  .post('/:contestid/user-submit/',
    multer({ storage: storage }).single('photo'),
    createValidator(userSubmitSchema),
    async (req, res) => {
      const { id } = req.user;
      const { contestid } = req.params;
      const { title, story } = req.body;
      const photo = req.file.filename;
      const userSubmissionData = {
        contestid,
        id,
        title,
        story,
        photo,
      };

      const { error, submission } = await contestsService.createSubmission(contestsData, phaseOneData, usersData)(userSubmissionData);

      if (error === serviceErrors.DUPLICATE_RECORD) {

        res.status(400).send({ message: 'You already have a submission in this contest!' });
      } else if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(400).send({ message: 'Invalid submission!' });
      } else {
        
        res.status(201).send(submission);
      }

    },
  )

  .get('/:contestid/user-submit/:usersubmitionid/jury-scoring',
    async (req, res) => {

      const { contestid, usersubmitionid } = req.params;
      const { error, scoring } = await contestsService.getAllJuryScorings(phasetwoData)(usersubmitionid, contestid);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'Scorings not founded' });
      } else {

        res.status(200).send(scoring);
      }
    })
  .put('/phasetwo/:contestid/user-submit/:usersubmitionid/jury-scoring',
    createValidator(juryScoringSchema),
    roleMiddleware('Organizer'),
    async (req, res) => {
      
      const { contestid, usersubmitionid } = req.params;
      const currUserId = req.user.id;
      const { score, comment, wrong_category } = req.body;

      const { error, scoring } = await contestsService.updateJuryScore(phasetwoData)(score, comment, wrong_category, usersubmitionid, currUserId, contestid);

      if (error === serviceErrors.DUPLICATE_RECORD) {

        res.status(409).send({ message: 'You have already submitted your score!' });
      } else {

        res.status(201).send(scoring);
      }
    });




export default contestsController;