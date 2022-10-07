
const random_color = function () {
  const o = Math.round, r = Math.random, s = 255;
  const colors = [
    'rgb(178 251 109)',
    'rgb(255 205 65)',
    'rgb(0,220,255)',
    'rgb(255,0,0)',
    'rgb(0,255,0)',
    'rgb(255,255,0)',
    'rgb(255,140,0)',
    'rgb(200,200,200)',
    'rgb(200,140,255)',
    'rgb(255,0,212)',
    'rgb(110,175,255)',
    'rgb(255,147,147)'
  ];
  return colors[o(r(colors.length - 1))];
};

exports.random_color = random_color;