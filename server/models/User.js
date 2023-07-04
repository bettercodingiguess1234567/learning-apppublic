module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Tutorial, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
    };
    return User;
}

//This User model will be mapped to the database table users