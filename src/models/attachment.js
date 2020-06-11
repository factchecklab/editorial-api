import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  /**
   * Attachment is additional data that can be attached to an item.
   */
  class Attachment extends Sequelize.Model {
    setAirtableMeta(meta, options) {
      return sequelize.query(
        `UPDATE attachments
         SET metadata = jsonb_set(metadata, '{airtable}', $1, true)
         WHERE id = $2`,
        { ...options, bind: [JSON.stringify(meta), this.id] }
      );
    }
  }

  Attachment.init(
    {
      itemType: {
        field: 'item_type',
        type: DataTypes.TEXT,
        allowNull: false,
      },
      itemId: {
        field: 'item_id',
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
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
    },
    {
      sequelize,
      modelName: 'attachment',
    }
  );

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.Asset, {
      as: 'asset',
      foreignKey: {
        name: 'assetId',
        field: 'asset_id',
        allowNull: false,
      },
    });
  };

  return Attachment;
};
