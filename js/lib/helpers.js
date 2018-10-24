// common parsing and formatting functions

const formatCommas = d3.format(',');

function formatPrefix(suffixes) {
  if (!suffixes) return formatCommas;
  return (visits) => {
    const prefix = d3.formatPrefix(visits);

    const suffix = suffixes[prefix.symbol];
    return prefix && suffix
      ? prefix.scale(visits)
        .toFixed(suffix[1])
        .replace(/\.0+$/, '') + suffix[0]
      : formatCommas(visits);
  };
}

function trimZeroes(str) {
  return str.replace(/\.0+$/, '');
}

export default {
  formatVisits() {
    return formatPrefix({
      k: ['k', 1], // thousands
      M: ['m', 1], // millions
      G: ['b', 2], // billions
    });
  },

  formatBigNumber() {
    return formatPrefix({
      M: [' million', 1], // millions
      G: [' billion', 2], // billions
    });
  },

  formatPercent(p) {
    return p >= 0.1
      ? `${trimZeroes(p.toFixed(1))}%`
      : '< 0.1%';
  },

  formatHour(hour) {
    const n = +hour;
    const suffix = n >= 12 ? 'p' : 'a';
    return (n % 12 || 12) + suffix;
  },

  formatURL(url) {
    let index = 0;
    // find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf('://') > -1) {
      index = 2;
    }
    // find & remove port number
    return url
      .split('/')[index]
      .split(':')[0]
      .replace(new RegExp('%20', 'g'), ' ');
  },

  formatFile(url) {
    const splitUrls = url.split('/');
    const domain = splitUrls[splitUrls.length - 1];
    return domain.replace(new RegExp('%20', 'g'), ' ');
  },

  /*
   * listify an Object into its key/value pairs (entries) and sorting by
   * numeric value descending.
   */
  listify(obj) {
    return d3.entries(obj)
      .sort((a, b) => d3.descending(+a.value, +b.value));
  },
};
