$('a.affiliate').on('click', function(el) {
    b = jQuery(el.target);
    console.log("Affiliate: link pressed");
    href = b.attr("href");
    match = href.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/i);
    target = match ? match[1] : "";
    console.log(b.data("label"), target);
    gtag('event', 'affiliate', {
        'affiliate_type': b.data("type"),
        'affiliate_page_title': document.title,
        'affiliate_label': b.data("label"),
        'affiliate_primary_option': b.data("primary"),
        'affiliate_link': href,
        'affiliate_target': target,
        'affiliate_publication_id': b.data("publicationid"),
        'affiliate_node_id': b.data("nodeid")});
});

var regionsReplace = {
    "eu": ['at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se'],
    "dach": ['ch', 'de', 'at', 'fl'],
    "eur": ['al', 'ad', 'am', 'by', 'ba', 'fo', 'ge', 'gi', 'is', 'im', 'xk', 'li', 'mk', 'md', 'mc', 'me', 'no', 'ru', 'sm', 'rs', 'ch', 'tr', 'ua', 'gb', 'va', 'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se'],
    "oze": ['as', 'au', 'cx', 'ck', 'fj', 'pf', 'gu', 'ki', 'mh', 'fm', 'nr', 'nc', 'nz', 'nu', 'nf', 'mp', 'pw', 'pg', 'pn', 'ws', 'sb', 'tl', 'tk', 'to', 'tv', 'vu', 'wf'],
    "nam": ['ai', 'ag', 'aw', 'bb', 'bz', 'bm', 'bq', 'vg', 'ca', 'ky', 'cr', 'cu', 'cw', 'dm', 'do', 'sv', 'gl', 'gd', 'gp', 'gt', 'ht', 'hn', 'jm', 'mq', 'mx', 'ms', 'an', 'ni', 'pa', 'pr', 'bl', 'kn', 'lc', 'mf', 'pm', 'vc', 'sx', 'bs', 'tt', 'tc', 'us', 'vi'],
    "sam": ['ar', 'bo', 'br', 'cl', 'co', 'ec', 'fk', 'gf', 'gy', 'py', 'pe', 'sr', 'uy', 've'],
    "afr": ['dz', 'ao', 'bj', 'bw', 'bf', 'bi', 'cm', 'cv', 'cf', 'td', 'km', 'cd', 'dj', 'eg', 'gq', 'er', 'et', 'ga', 'gm', 'gh', 'gn', 'gw', 'ci', 'ke', 'ls', 'lr', 'ly', 'mg', 'mw', 'ml', 'mr', 'mu', 'yt', 'ma', 'mz', 'na', 'ne', 'ng', 'cg', 're', 'rw', 'sh', 'st', 'sn', 'sc', 'sl', 'so', 'za', 'ss', 'sd', 'sz', 'tz', 'tg', 'tn', 'ug', 'eh', 'zm', 'zw'],
    "asi": ['af', 'am', 'az', 'bh', 'bd', 'bt', 'io', 'bn', 'kh', 'cn', 'cc', 'ge', 'hk', 'in', 'id', 'ir', 'iq', 'il', 'jp', 'jo', 'kz', 'kw', 'kg', 'la', 'lb', 'mo', 'my', 'mv', 'mn', 'mm', 'np', 'kp', 'om', 'pk', 'ps', 'ph', 'qa', 'sa', 'sg', 'kr', 'lk', 'sy', 'tw', 'tj', 'th', 'tr', 'tm', 'ae', 'uz', 'vn', 'ye']
};

function update_buy_links_for_country(usercountry) {
    console.log("update_buy_links_for_country: ", usercountry);
    $('.affiliate-group').each(function() {
        var $group = $(this);
        var buyoptions = [];
        $group.find("li a.affiliate").each(function() {
            var $buyOption = $(this);
            var data = $buyOption.data();
            data.url = $buyOption.attr("href");
            buyoptions.push(data);
        });

        if (buyoptions.length <= 1) {
            return;
        }

        var best = buyoptions[0];
        usercountry = usercountry.toLowerCase();

        var bestScore = 2000;

        for (selling of buyoptions) {
            let url = selling.url;
            let score = 1000; //default score for config without country > match all
            
            if (url) {
                //hard coded rule that climb-europe should be better
                if (url.includes("climb-europe")) score=990;
                //very strict rule that omeega roc shoudl always be on top.
                if (url.includes("omegaroc")) {
                    bestScore = 2000;
                    best = selling;
                    break;
                }
            } 

            let regions = selling.regions;
            if (regions) {
                let countries = [];
                for (region of regions) {
                    region = region.toLowerCase();
                    if (region in regionsReplace) { 
                        // replace the group with all countries
                        countries.push(regionsReplace[region]);
                    } else {
                        countries.push(region);
                    }
                }
                // is the user browsing country in the list o all countries for the config
              if ( countries.includes(usercountry) ) {
                // the score is the number of countries in the config
                // assumtion is that we pic the most specific config as the one with the lowest number of members 
                score = countries.length
              }
            }
            if (score < bestScore) {
              bestScore = score;
              best = selling;
            }
        }

        $best_link = $group.find("a.affiliate-best");
        $best_link.attr("href", best.url);
        $best_link.data(best);
        console.log("updated best to ", best.url);
        //remove possible old discount
        $group.find("a.affiliate-best-off").remove();
        //create a new discount
        if (best.off > 0) {
            $off = $(`<a class="btn btn-success affiliate affiliate-best-off" target="_new" style="padding-left:2px; padding-right:2px;">-${best.off}%<a>`);
            $off.attr("href", best.url);
            $off.attr("title", $best_link.attr("title"));
            $off.data(best);
            $group.prepend($off);
        }
    });
}

$(document).ready(function() {
    console.log("run affiliate main");
    if (typeof window.browsing_country == 'undefined') {
        // in order to get the response headers of the page we do a api call
        // the get the simple area structe of the world node (this reqeust is cached from CF very likely)
        // in that response we can get the user country
        $.get('/api/node/id/7546063/children/area?flatten=data[id,name,urlStub,urlAncestorStub,subAreaCount,subType,asciiName]&expires=10',
        function(data, status, xhr){
            var country = xhr.getResponseHeader("ip-geoip-country");
            if (country) {
                window.browsing_country = country;
                update_buy_links_for_country(window.browsing_country);
            }
        });
    } else {
        update_buy_links_for_country(window.browsing_country);
    }
});

