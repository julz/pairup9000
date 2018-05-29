// this is some example defaults, I'd suggest replacing this with your own pairs
// and then .gitignoring this file.

export const defaultState = {
  assignments: {
    '0': [],
    '1': [],
    '2': [],
    'out': [''],
    'pm': ['julz'],
    'unassigned': [
       'tom', 'ed', 'will', 'claudia','oliver','julia','danail','georgi',
    ],
  },
  tracks: [
    '0', '1', '2', '3', '4',
  ],
  trackNames: {
    '0': 'Track One',
    '1': 'Track Two',
    '2': 'Track Three',
  },
  photos: {
    'julz': 'https://avatars2.githubusercontent.com/u/354013?v=3&s=72',
    'tom': 'https://avatars2.githubusercontent.com/u/16281740?v=3&s=72',
    'ed': 'https://avatars3.githubusercontent.com/u/6475144?v=3&s=72',
    'will': 'https://avatars2.githubusercontent.com/u/1611510?v=3&s=72',
    'claudia': 'https://avatars2.githubusercontent.com/u/8898786?v=3&s=72',
    'oliver': 'https://avatars2.githubusercontent.com/u/7828615?v=3&s=72',
    'julia': 'https://avatars2.githubusercontent.com/u/16097774?v=3&s=72',
    'danail': 'https://avatars2.githubusercontent.com/u/5657719?v=3&s=72',
    'georgi': 'https://avatars2.githubusercontent.com/u/9860469?v=3&s=72',
  },
  badges: { '1': [ 'CI' ] },
  locked: { 'julz': true },
  version: 0,
}
