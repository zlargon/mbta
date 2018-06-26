function language (sentence, lang) {

  if (sentence === 'Search') {
    if (lang === 'zh') return '搜尋';
  }

  if (sentence === 'Favorites') {
    if (lang === 'zh') return '我的最愛';
  }

  if (sentence === 'Near By') {
    if (lang === 'zh') return '附近';
  }

  return sentence;
}

module.exports = language;
