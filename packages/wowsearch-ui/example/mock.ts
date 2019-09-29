/**
 * @file mock
 * @author Cuttle Cong
 * @date 2019/9/29
 *
 */

export default {
  took: 19,
  timed_out: false,
  _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
  hits: {
    total: { value: 7, relation: 'eq' },
    max_score: 1.9751569,
    hits: [
      {
        _index: 'temp',
        _type: '_doc',
        _id: '4',
        _score: 1.9751569,
        _source: {
          url: '#',
          type: 'text',
          content: '$ npm install -g robots',
          parents: ['robots.js', 'Installation'],
          tags: []
        },
        highlight: {
          content: [
            '$ npm install -g <span class="wowsearch-highlight">robots</span>'
          ]
        }
      },
      {
        _index: 'temp',
        _type: '_doc',
        _id: '13',
        _score: 1.6779157,
        _source: {
          url: '#',
          type: 'text',
          content:
            "var robots = require('robots')  , parser = new robots.RobotsParser(); parser.setUrl('http://nodeguide.ru/robots.txt', function(parser, success) {  if(success) {    parser.getSitemaps(function(sitemaps) {      // sitemaps — array    });  }});",
          parents: ['robots.js', 'Usage'],
          tags: []
        },
        highlight: {
          content: [
            'var <span class="wowsearch-highlight">robots</span> = require(\'<span class="wowsearch-highlight">robots</span>\')  , parser = new robots.RobotsParser(); parser.setUrl(\'http://nodeguide.ru'
          ]
        }
      },
      {
        _index: 'temp',
        _type: '_doc',
        _id: '7',
        _score: 1.5404404,
        _source: {
          url: '#',
          type: 'text',
          content:
            "var robots = require('robots')  , parser = new robots.RobotsParser(); parser.setUrl('http://nodeguide.ru/robots.txt', function(parser, success) {  if(success) {    parser.canFetch('*', '/doc/dailyjs-nodepad/', function (access) {      if (access) {        // parse url      }    });  }});",
          parents: ['robots.js', 'Usage'],
          tags: []
        },
        highlight: {
          content: [
            'var <span class="wowsearch-highlight">robots</span> = require(\'<span class="wowsearch-highlight">robots</span>\')  , parser = new robots.RobotsParser(); parser.setUrl(\'http://nodeguide.ru'
          ]
        }
      },
      {
        _index: 'temp',
        _type: '_doc',
        _id: '17',
        _score: 1.5404404,
        _source: {
          url: '#',
          type: 'text',
          content:
            'var options = {  headers:{    Authorization:"Basic " + new Buffer("username:password").toString("base64")}} var robots = require(\'robots\')  , parser = new robots.RobotsParser(null, options); parser.setUrl(\'http://nodeguide.ru/robots.txt\', function(parser, success) {  ...});',
          parents: ['robots.js', 'Usage'],
          tags: []
        },
        highlight: {
          content: [
            '= {  headers:{    Authorization:"Basic " + new Buffer("username:password").toString("base64")}} var <span class="wowsearch-highlight">robots</span>',
            " = require('<span class=\"wowsearch-highlight\">robots</span>')  , parser = new robots.RobotsParser(null, options); parser.setUrl('http://nodeguide.ru"
          ]
        }
      },
      {
        _index: 'temp',
        _type: '_doc',
        _id: '33',
        _score: 1.3647637,
        _source: {
          url: '#',
          type: 'text',
          content: 'A Standard for Robot Exclusion',
          parents: ['robots.js', 'Resources'],
          tags: []
        },
        highlight: {
          content: [
            'A Standard for <span class="wowsearch-highlight">Robot</span> Exclusion'
          ]
        }
      },
      {
        _index: 'temp',
        _type: '_doc',
        _id: '11',
        _score: 1.2699182,
        _source: {
          url: '#',
          type: 'text',
          content:
            "var robots = require('robots')  , parser = new robots.RobotsParser(                'http://nodeguide.ru/robots.txt',                'Mozilla/5.0 (compatible; RobotTxtBot/1.0)',                after_parse            );            function after_parse(parser, success) {  if(success) {    parser.canFetch('*', '/doc/dailyjs-nodepad/', function (access, url, reason) {      if (access) {        console.log(' url: '+url+', access: '+access);        // parse url ...      }    });  }};",
          parents: ['robots.js', 'Usage'],
          tags: []
        },
        highlight: {
          content: [
            'var <span class="wowsearch-highlight">robots</span> = require(\'<span class="wowsearch-highlight">robots</span>\')  , parser = new robots.RobotsParser(                \'http://nodeguide.ru'
          ]
        }
      },
      {
        _index: 'temp',
        _type: '_doc',
        _id: '15',
        _score: 1.2204576,
        _source: {
          url: '#',
          type: 'text',
          content:
            "    var robots = require('robots')      , parser = new robots.RobotsParser();     // for example:    //    // $ curl -s http://nodeguide.ru/robots.txt    //    // User-agent: Google-bot    // Disallow: /     // Crawl-delay: 2    //    // User-agent: *    // Disallow: /    // Crawl-delay: 2     parser.setUrl('http://nodeguide.ru/robots.txt', function(parser, success) {      if(success) {        var GoogleBotDelay = parser.getCrawlDelay(\"Google-bot\");        // ...      }    });",
          parents: ['robots.js', 'Usage'],
          tags: []
        },
        highlight: {
          content: [
            '    var <span class="wowsearch-highlight">robots</span> = require(\'<span class="wowsearch-highlight">robots</span>\')      , parser = new robots.RobotsParser();     // for example:    '
          ]
        }
      }
    ]
  }
}
