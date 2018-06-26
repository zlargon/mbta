function language (s, lang) {

  if (s === 'Search') {
    if (lang === 'zh') return '搜尋';
  }

  if (s === 'Favorites') {
    if (lang === 'zh') return '我的最愛';
  }

  if (s === 'Near By') {
    if (lang === 'zh') return '附近';
  }

  if (s === 'Language') {
    if (lang === 'zh') return '語言';
  }

  if (s === 'About us') {
    if (lang === 'zh') return '關於我';
  }

  if (s === 'Contact us') {
    if (lang === 'zh') return '與我聯絡';
  }

  return s;
}

module.exports = language;
