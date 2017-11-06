/*
 * Copyright (c) 2017-present Muneeb Samuels. All Rights Reserved. See License.txt for license information.
 */

function isValidSAID(id) {
  let i,
    c,
    even = '',
    sum = 0,
    check = id.slice(-1);

  if (id.length !== 13 || id.match(/\D/)) {
    return false;
  }
  id = id.substr(0, id.length - 1);
  // eslint-disable-next-line no-cond-assign
  for (i = 0; (c = id.charAt(i)); i += 2) {
    sum += +c;
    even += id.charAt(i + 1);
  }
  even = '' + even * 2;
  // eslint-disable-next-line no-cond-assign
  for (i = 0; (c = even.charAt(i)); i++) {
    sum += +c;
  }
  sum = 10 - ('' + sum).charAt(1);
  return ('' + sum).slice(-1) === check;
}

export { isValidSAID };
