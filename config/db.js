module.exports = {
    'secret': 'jshacks',
    'database': 'mongodb://' + (process.env.mongoserver || 'localhost') + '/node-rest-auth',
};
