
const random_color = function () {
  const floor = Math.floor, rnd = Math.random, s = 255;
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
    'rgb(255,147,147)',
    '#ae1392',
    '#efeff1',
    '#1f69ff',
    '#f5f500',
    '#ff38db',
    '#00f593',
    '#7aa7ff',
    '#e69900',
    '#eb0400',
    '#00f0f0',
    '#00a3a3',
    '#ebeb00',
    '#d1b3ff',
    '#ff8280'
  ];
  return colors[floor(rnd() * colors.length)];
};

exports.random_color = random_color;