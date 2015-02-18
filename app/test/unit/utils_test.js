'use strict';

/* global Utils */

require('/js/mobile_operator.js');
require('/js/utils.js');

suite('utils', function() {
  this.timeout(500);

  suite('get_user_meta', function() {
    var stub_user_agent;

    function setup_user_agent() {
      Object.defineProperty(navigator, 'userAgent', {
        configurable: true,
        get: function() { return stub_user_agent; }
      });
    }

    function teardown_user_agent() {
      delete navigator.userAgent;
    }

    function find_key(metas, key) {
      var row = metas.metadata.find(function(meta) {
        return meta.name == key;
      });
      if (row) {
        return row.value;
      }
    }

    suite('os_version', function() {
      function find_os_version(metas) {
        return find_key(metas, 'os_version');
      }

      setup(setup_user_agent);
      teardown(teardown_user_agent);

      test('1.1', function() {
        stub_user_agent = 'Mozilla/5.0 (Mobile; rv:18.1) Gecko/0.0 Firefox/0.0';
        assert.equal(find_os_version(Utils.get_user_meta()), '18.1');
      });

      test('unknown', function() {
        stub_user_agent = 'every other user agent';
        assert.isUndefined(find_os_version(Utils.get_user_meta()));
      });
    });

    suite('handset_type', function() {
      function find_handset_type(metas) {
        return find_key(metas, 'handset_type');
      }

      setup(setup_user_agent);
      teardown(teardown_user_agent);

      test('ok', function() {
        stub_user_agent = 'Mozilla/5.0 (Mobile; nnnn; rv:26.0) ' +
                          'Gecko/26.0 Firefox/26.0';
        assert.equal(find_handset_type(Utils.get_user_meta()), 'nnnn');
      });

      test('unknown', function() {
        stub_user_agent = 'every other user agent';
        assert.isUndefined(find_handset_type(Utils.get_user_meta()));
      });
    });

    suite('operator', function() {
      var MNC_TELEFONICA = '214-5-foo';
      var MNC_DT = '202-5-wesh';

      function find_operator(metas) {
        return find_key(metas, 'operator');
      }

      teardown(function() {
        delete navigator.mozMobileConnections;
        delete navigator.mozMobileConnection;
      });

      test('single sim device', function() {
        navigator.mozMobileConnection = {lastKnownHomeNetwork: MNC_DT};
        var metas = Utils.get_user_meta();
        assert.equal(find_operator(metas), 'deutsche_telekom');
      });

      test('two sims', function() {
        navigator.mozMobileConnections = [
          {lastKnownHomeNetwork: MNC_TELEFONICA},
          {lastKnownHomeNetwork: MNC_DT}
        ];

        var metas = Utils.get_user_meta();
        assert.equal(find_operator(metas), 'telefonica');
      });

      test('one sim in slot 2', function() {
        navigator.mozMobileConnections = [
          {},
          {lastKnownHomeNetwork: MNC_DT}
        ];

        var metas = Utils.get_user_meta();
        assert.equal(find_operator(metas), 'deutsche_telekom');
      });

    });
  });
});
