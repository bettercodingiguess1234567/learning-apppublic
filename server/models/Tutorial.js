module.exports = (sequelize, DataTypes) => {
    const Tutorial = sequelize.define("Tutorial", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageFile: {
            type: DataTypes.STRING
            }
    });


    Tutorial.associate = (models) => {
        Tutorial.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };
    return Tutorial;
}