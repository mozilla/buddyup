'use strict';

/* jshint -W101 */
// Adapted from https://github.com/mozilla/fireplace/blob/814340c631e3de2db04d21f5cb27488f167c7153/src/media/js/mobilenetwork.js
/* jshint +W101 */

(function(exports) {
    var carriers = [
        'america_movil',
        'carrierless',
        'china_unicom',
        'congstar',
        'deutsche_telekom',
        'etisalat',
        'grameenphone',
        'hutchinson_three_group',
        'kddi',
        'kt',
        'megafon',
        'mtn',
        'qtel',
        'singtel',
        'smart',
        'sprint',
        'telecom_italia_group',
        'telefonica',
        'telenor',
        'tmn',
        'vimpelcom'
    ];

    var carriersRegions = {
        // Missing [ "208", "222", "234", "404", "405" ]

        // Greece
        202: {
            // This actually belongs to Vodafone, which DT owns.
            5: 'deutsche_telekom'
        },

        // Spain
        214: {
            5: 'telefonica',
            7: 'telefonica'
        },

        // Hungary
        216: {
            1: 'telenor',
            20: 'telenor',
            30: 'deutsche_telekom',
            // Actually Vodafone but treat like DT.
            70: 'deutsche_telekom'
        },

        // Serbia
        220: {
            1: 'telenor',
            2: 'telenor'
        },

        // Czech Republic
        230: {
            1: 'deutsche_telekom',
            2: 'telefonica',
            10: 'telefonica'
        },

        // Slovakia
        231: {
            2: 'deutsche_telekom',
            4: 'deutsche_telekom',
            6: 'telefonica'
        },

        // Austria
        232: {
            2: 'telefonica',
            8: 'telefonica'
        },

        // United Kingdom
        234: {
            2: 'telefonica',
            10: 'telefonica',
            11: 'telefonica',
            30: 'deutsche_telekom'
        },

        // Poland
        260: {
            2: 'deutsche_telekom'
        },

        // Germany
        262: {
            1: {
                // Differentiate congstar using the SPN, everything else with
                // that MNC is DT.
                '__default': 'deutsche_telekom',
                'congstar': 'congstar',
                'congstar.de': 'congstar'
            },
            2: 'deutsche_telekom',
            7: 'o2'
        },

        // Montenegro
        297: {
            1: 'telenor',
            2: 'deutsche_telekom',
            4: 'deutsche_telekom'
        },

        // United States
        // T-Mobile has a bunch of other MNCs but they are marked as
        // 'Not Operational' on http://en.wikipedia.org/wiki/Mobile_country_code
        310: {
            26: 'deutsche_telekom',
            160: 'deutsche_telekom',
            260: 'deutsche_telekom',
            490: 'deutsche_telekom'
        },

        // Mexico
        334: {
            2: 'america_movil',
            3: 'telefonica',
            20: 'america_movil'
        },

        // Japan
        440: {
            7: 'kddi',
            8: 'kddi',
            50: 'kddi',
            51: 'kddi',
            52: 'kddi',
            53: 'kddi',
            54: 'kddi',
            55: 'kddi',
            56: 'kddi',
            70: 'kddi',
            71: 'kddi',
            72: 'kddi',
            73: 'kddi',
            74: 'kddi',
            75: 'kddi',
            76: 'kddi',
            77: 'kddi',
            78: 'kddi',
            79: 'kddi',
            88: 'kddi',
            89: 'kddi'
        },

        // China
        460: {
            1: 'china_unicom'
        },

        // Bangladesh
        470: {
            1: 'grameenphone'
        },

        // South Africa
        655: {
            10: 'mtn'
        },

        // Guatemala
        704: {
            3: 'telefonica'
        },

        // El Salvador
        706: {
            4: 'telefonica'
        },

        // Nicaragua
        710: {
            3: 'telefonica'
        },

        // Costa Rica
        712: {
            4: 'telefonica'
        },

        // Panama
        714: {
            2: 'telefonica',
            3: 'america_movil'
        },

        // Peru
        716: {
            6: 'telefonica',
            10: 'america_movil'
        },

        // Argentina
        722: {
            10: 'telefonica',
            70: 'telefonica',
            // Claro
            310: 'america_movil',
            320: 'america_movil',
            330: 'america_movil'
        },

        // Brazil
        724: {
            6: 'telefonica',
            10: 'telefonica',
            11: 'telefonica',
            23: 'telefonica'
        },

        // Chile
        730: {
            2: 'telefonica'
        },

        // Colombia
        732: {
            102: 'telefonica',
            123: 'telefonica'
        },

        // Venezuela
        734: {
            4: 'telefonica'
        },

        // Ecuador
        740: {
            1: 'america_movil'
        },

        // Paraguay
        744: {
            2: 'america_movil',
            4: 'telefonica'
        },

        // Uruguay
        748: {
            7: 'telefonica',
            // Claro.
            10: 'america_movil'
        }
    };

    function getNetwork(mcc, mnc, spn) {
        // Look up region and carrier from MCC (Mobile Country Code)
        // and MNC (Mobile Network Code).

        // Strip leading zeros and make it a string.
        mcc = (+mcc || 0) + '';
        mnc = (+mnc || 0) + '';

        // Already a string or undefined, make it a lowercase string.
        spn = (spn || '').toLowerCase();

        // Workaround for Polish SIMs (bug 876391, bug 880369).
        if (mcc === '260' && mnc[0] === '2') {
            mnc = 2;
        }
        // Colombia.
        if (mcc === '732' && mnc[0] === '1') {
            mnc = 123;
        }
        // Spain.
        if (mcc === '214') {
            if (mnc[0] === '5') {
                mnc = 5;
            }
            if (mnc[0] === '7') {
                mnc = '7';
            }
        }

        // Make them integers.
        mcc = +mcc || 0;
        mnc = +mnc || 0;

        var carrier = carriersRegions[mcc];

        // If it's a string, the carrier is the same for every MNC.
        // If it's an object, the carrier is different based on the MNC or SPN.
        if (typeof carrier === 'object') {
            carrier = carrier[mnc];

            // Some carriers share the same MCC but have a different SPN to
            // tell them apart.
            if (typeof carrier === 'object') {
                carrier = carrier[spn] || carrier.__default;
            }
        }

        return carrier || null;
    }

    // Parse and return mcc/mnc from a MozMobileConnection object.
    function handleConnection(conn) {
        function mccify(network) {
            var mccParts = (network || '-').split('-');
            if (mccParts.length < 2) {
                return null;
            }
            // mccParts contains at least mcc and mnc. Recent implementations
            // includes the SPN as a third parameter, if it's not present we'll
            // just return undefined, it's fine.
            return {mcc: mccParts[0], mnc: mccParts[1], spn: mccParts[2]};
        }
        // Testing lastKnownHomeNetwork first is important, because it's the
        // only one which contains the SPN.
        var lastNetwork = mccify(conn.lastKnownHomeNetwork ||
                                 conn.lastKnownNetwork);
        if (lastNetwork) {
            return lastNetwork;
        } else {
            return {mcc: undefined, mnc: undefined, spn: undefined};
        }
    }

    function detectMobileNetworks() {
      var connections = navigator.mozMobileConnections || [];
      if (navigator.mozMobileConnection) {
        connections = [navigator.mozMobileConnection];
      }
      return Array.prototype.map.call(connections, handleConnection);
    }

    exports.MobileOperator = {
        carriersRegions: carriersRegions,
        carriers: carriers,
        detectMobileNetworks: detectMobileNetworks,
        getNetwork: getNetwork
    };
})(window);
