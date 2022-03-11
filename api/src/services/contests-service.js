import serviceErrors from './service-errors.js';


const getPhaseOneContests = contestsData => {
  return async (user) => {
    const contests = await contestsData.getPhaseOneContests();
    const submissions = await contestsData.getCurrentUserSubmissions(user.id);

    if (contests.length < 1) {

      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contests: null,
      };
    }

    return {
      error: null,
      contests: { contests, submissions },
    };
  };
};

const getPhaseTwoContests = contestsData => {
  return async () => {
    const result = await contestsData.getPhaseTwoContests();

    if (result.length < 1) {

      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contests: null,
      };
    }

    return {
      error: null,
      contests: result,
    };
  };
};

const getFinishedContests = contestsData => {
  return async () => {
    const result = await contestsData.getFinishedContests();

    if (result.length < 1) {

      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contests: null,
      };
    }

    return {
      error: null,
      contests: result,
    };
  };
};

const getPhaseOneContestById = (phaseOneData, contestsData) => {
  return async (value) => {
    const result = await phaseOneData.getPhaseOneContestBy('id', value);
    const submissions = await contestsData.getSubmissionsByContestId(value);

    if (!result) {

      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contest: null,
      };
    }
    const contestSubmissionsAndScorings = { ...result, submissions };
    return { error: null, contest: contestSubmissionsAndScorings };
  };
};
const getPhaseTwoContestById = (phaseTwoData, contestsData) => {
  return async (value) => {
    const result = await phaseTwoData.getPhaseTwoContestBy('id', value);
    const submissions = await contestsData.getSubmissionsByContestId(value);

    if (!result) {

      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contest: null,
      };
    }
    const contestSubmissionsAndScorings = { ...result, submissions };
    return { error: null, contest: contestSubmissionsAndScorings };
  };
};
const getFinishedContestById = contestsData => {
  return async (value, userId) => {
    const result = await contestsData.getFinishedContestBy('id', value);
    const submissions = await contestsData.getFinishedSubmissionsByContestId(value, userId);
    const currUserSubmission = await contestsData.getCurrentUserSubmissionByContestId(value, userId);

    if (!result) {

      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contest: null,
      };
    }
    const contestSubmissions = { ...result, submissions, currUserSubmission };
    return { error: null, contest: contestSubmissions };
  };
};

const createContest = (contestsData, usersData) => {
  return async (createContestData) => {

    const { title, category, isopen, phase1, phase2, photo, users } = createContestData;

    const existingContest = await contestsData.getContestBy('title', title);

    if (existingContest) {

      return {
        error: serviceErrors.DUPLICATE_RECORD,
        user: null,
      };
    }

    const createdContest = await contestsData.createContest(title, category, isopen, phase1, phase2, photo);

    if (users) {
      const privateUsers = JSON.parse(users);

      const jury = await usersData.getUsersByRole(1);
      const transformedJury = jury.map(person => ({username: person.username, key: person.id}));
      
      const juryAndPrivateUsers = [...privateUsers, ...transformedJury];

      juryAndPrivateUsers.forEach(user => contestsData.insertUsersToPrivateContest(createdContest.id, user.key));
    }

    return { error: null, contest: { ...createdContest, users } };
  };
};

const getPrivateUsers = contestsData => {
  return async (userId) => {
    const result = await contestsData.getUsersFromPrivateContest(userId);

    if (!result) {
      return { error: serviceErrors.RECORD_NOT_FOUND, users: null };
    }

    return { error: null, users: result };
  };
};

const createSubmission = (contestData, phaseOneData, usersData) => {
  return async (submissionData) => {
    const { title, story, photo, id, contestid } = submissionData;

    const isUserExist = await usersData.getBy('id', id);
    const isContestExist = await contestData.getContestBy('id', contestid);

    if (!isUserExist || !isContestExist) {
      return { error: serviceErrors.RECORD_NOT_FOUND, submission: null };
    }

    const duplicateSubmission = await phaseOneData.isSubmissionAlreadyExist(id, contestid);

    if (duplicateSubmission) {
      return { error: serviceErrors.DUPLICATE_RECORD, submission: null };
    }

    const createdSubmission = await phaseOneData.createSubmission(title, story, photo, id, contestid);


    const organizators = await usersData.getUsersByRole(1);
    organizators.forEach(person => usersData.insertDefaultJuryScore(createdSubmission.insertId, person.id, contestid));

    const submission = {
      id: createdSubmission.insertId,
      title,
      story,
      photo,
      user_id: id,
      contest_id: contestid,
    };

    return { error: null, submission };
  };
};

const getSubmissionsById = phaseOneData => {
  return async (value) => {
    const result = await phaseOneData.getSubmissionsBy('contests_id', value);

    if (!result[0]) {
      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        submissions: null,
      };
    }

    return { error: null, submissions: result };

  };
};

const getSubmissionScoreById = contestData => {
  return async (contestid, id) => {
    const avgScore = await contestData.getAverageScore(contestid, id);
    const scoringsBySubmissionId = await contestData.getScoringsBySubmissionId(contestid, id);

    if (!scoringsBySubmissionId[0]) {
      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        submission: null,
      };
    }

    return { error: null, submission: { scoringsBySubmissionId, avgScore } };
  };
};

const getAllContestsForCurrentUser = contestData => {
  return async (userid) => {
    const result = await contestData.getAllContestsForCurrentUser(userid);

    if (!result[0]) {
      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        contests: null,
      };
    }

    return { error: null, contests: result };
  };
};

const getAllJuryScorings = phasetwoData => {
  return async (userSubmitionId, contestId) => {
    const result = await phasetwoData.getAllPhasetwoSubmissions(userSubmitionId, contestId);

    if (!result[0]) {
      return {
        error: serviceErrors.RECORD_NOT_FOUND,
        scoring: null,
      };
    }

    return { error: null, scoring: result };
  };
};

const updateJuryScore = phasetwoData => {
  return async (score, comment, wrong_category, userSubmitionId, userId, contestid) => {

    const duplicateScore = await phasetwoData.isScoreExisting(userSubmitionId, userId, contestid);

    if (duplicateScore?.comment.length > 0) {
      return {
        error: serviceErrors.DUPLICATE_RECORD,
        scoring: null,
      };
    }
    let createdScore;
    if (wrong_category === 1) {
      createdScore = await phasetwoData.updateJuryScore(0, 'Wrong category!', wrong_category, +userSubmitionId, +userId, +contestid);
    } else {
      createdScore = await phasetwoData.updateJuryScore(score, comment, 0, +userSubmitionId, +userId, +contestid);
    }

    const scoring = {
      id: createdScore.insertId,
      score,
      comment,
      wrong_category,
      user_submit_id: userSubmitionId,
      users_id: userId,
      contests_id: contestid,
    };

    return {
      error: null,
      scoring,
    };
  };

};



export default {
  getPhaseOneContests,
  getPhaseTwoContests,
  getFinishedContests,
  getPhaseOneContestById,
  getPhaseTwoContestById,
  getFinishedContestById,
  createContest,
  createSubmission,
  getSubmissionsById,
  getSubmissionScoreById,
  getAllJuryScorings,
  updateJuryScore,
  getAllContestsForCurrentUser,
  getPrivateUsers,
};