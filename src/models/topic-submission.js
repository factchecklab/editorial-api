import Sequelize from 'sequelize';
import { cleanUrl } from '../util/url';

export default (sequelize, DataTypes) => {
  class TopicSubmission extends Sequelize.Model {
    static findByAirtableId(id, options) {
      return this.findOne({
        ...(options || {}),
        where: {
          'metadata.airtable.id': id,
        },
      });
    }

    static findAllWithoutAirtableId(options) {
      return this.findAll({
        ...(options || {}),
        where: {
          'metadata.airtable.id': null,
        },
      });
    }

    static async countDuplicateOf(id, options) {
      const result = await this.findOne({});

      return result ? result.count : 0;
    }

    async findRootDuplicate(options) {
      let submission = this;
      const traversed = [];

      while (submission.duplicateId) {
        if (traversed.includes(submission.duplicateId)) {
          throw new Error(
            `Loop encountered while finding duplicate of topic submission ${this.id}`
          );
        }

        if (traversed.length > 5) {
          throw new Error(
            `Too many references where encountered while finding duplicate of topic submission ${this.id}`
          );
        }

        traversed.push(submission.duplicateId);

        submission = await submission.getDuplicate(options);
      }
      return submission;
    }

    async updateDuplicateCount(options) {
      const count = await TopicSubmission.count({
        ...options,
        where: {
          duplicateId: this.id,
        },
      });
      this.setDataValue('duplicateCount', count);
    }

    setAirtableMeta(meta, options) {
      return sequelize.query(
        `UPDATE topic_submissions
         SET metadata = jsonb_set(metadata, '{airtable}', $1, true)
         WHERE id = $2`,
        { ...options, bind: [JSON.stringify(meta), this.id] }
      );
    }
  }

  TopicSubmission.init(
    {
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        set(value) {
          this.setDataValue('message', value || '');
        },
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          this.setDataValue('url', value ? cleanUrl(value) : null);
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        set(value) {
          this.setDataValue('comment', value || '');
        },
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value) {
          this.setDataValue('status', value || null);
        },
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      duplicateCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      airtableId: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.metadata.airtable && this.metadata.airtable.id;
        },
        set(value) {
          throw new Error('Unsupported');
        },
      },
      isDuplicate: {
        type: DataTypes.VIRTUAL,
        get() {
          return !!this.duplicateId;
        },
      },
    },
    {
      sequelize,
      modelName: 'topic_submissions',
    }
  );

  TopicSubmission.associate = (models) => {
    TopicSubmission.belongsTo(models.TopicSubmission, {
      as: 'duplicate',
      foreignKey: {
        name: 'duplicateId',
        field: 'duplicate_id',
      },
    });
    TopicSubmission.hasMany(models.Attachment, {
      as: 'attachments',
      foreignKey: 'itemId',
      constraints: false,
      scope: {
        itemType: 'topic-submission',
      },
    });
  };

  return TopicSubmission;
};
