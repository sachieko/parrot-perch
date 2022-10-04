
// This function returns a random rgba style value for a css property 
// ----> rgba(0,0,0)
const random_rgba = function() {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

exports.random_rgba = random_rgba;

// This function takes in a message and a userColors object, and returns the style property for that particular user.
const getUserColor = function(message, userColors) {
  console.log(message.split(':'));
};

exports.getUserColor = getUserColor;