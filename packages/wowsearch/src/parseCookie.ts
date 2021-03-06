"use strict";

var defaultParseOptions = {
  decodeValues: true,
  map: false
};

function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}

export function parseString(setCookieValue, options = {} as any) {
  setCookieValue = setCookieValue.trim()
  var parts = setCookieValue.split(";").filter(isNonEmptyString);

  return parts.map(function(part) {
    var nameValue = part.split("=");
    var name = nameValue.shift().trim();
    var value = nameValue.join("=").trim(); // everything after the first =, joined by a "=" if there was more than one part

    var cookie = {
      name: name, // grab everything before the first =
      value: options.decodeValues ? decodeURIComponent(value) : value // decode cookie value
    } as any;

    // var sides = part.split("=");
    // var key = sides
    //   .shift()
    //   .trimLeft()
    //   .toLowerCase();
    // var value = sides.join("=");
    // if (key === "expires") {
    //   cookie.expires = new Date(value);
    // } else if (key === "max-age") {
    //   cookie.maxAge = parseInt(value, 10);
    // } else if (key === "secure") {
    //   cookie.secure = true;
    // } else if (key === "httponly") {
    //   cookie.httpOnly = true;
    // } else if (key === "samesite") {
    //   cookie.sameSite = value;
    // } else {
    //   cookie[key] = value;
    // }
    return cookie
  });
}

function parse(input, options) {
  if (!input) {
    return [];
  }
  if (input.headers) {
    input =
      // fast-path for node.js (which automatically normalizes header names to lower-case
      input.headers["set-cookie"] ||
      // slow-path for other environments - see #25
      input.headers[
        Object.keys(input.headers).find(function(key) {
          return key.toLowerCase() === "set-cookie";
        })
        ];
  }
  if (!Array.isArray(input)) {
    input = [input];
  }

  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;

  if (!options.map) {
    return input.filter(isNonEmptyString).map(function(str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function(cookies, str) {
      var cookie = parseString(str, options);
      cookies[cookie.name] = cookie;
      return cookies;
    }, cookies);
  }
}

/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.
  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.
  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }

  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;

  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }

  function notSpecialChar() {
    ch = cookiesString.charAt(pos);

    return ch !== "=" && ch !== ";" && ch !== ",";
  }

  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;

    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        // ',' is a cookie separator if we have later first '=', not ';' or ','
        lastComma = pos;
        pos += 1;

        skipWhitespace();
        nextStart = pos;

        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }

        // currently special character
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          // we found cookies separator
          cookiesSeparatorFound = true;
          // pos is inside the next cookie, so back up and return it.
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          // in param ',' or param separator ';',
          // we continue from that comma
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }

    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }

  return cookiesStrings;
}

