module.exports = (sequelize, DataTypes) => {

    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isDeleted:
        {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    }, {
        tableName: 'categories',
        freezeTableName: true,
        timestamps: true,

    });
    return Category;
}   
