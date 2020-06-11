import models from '../models';
import hooks, { client } from '../search';

const reindex = async () => {
  const reports = await models.TopicSubmission.findAll();
  await Promise.all(
    reports.map((report) => {
      return hooks.TopicSubmission.save(client, report);
    })
  );
};

(async function main() {
  await reindex();
  console.log('Done');
})();
