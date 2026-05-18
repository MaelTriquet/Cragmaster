// Must be loaded after jquery lazy load

$(function(){
    $('.js-lazy-sponsor').lazy({
        effect: "fadeIn",
        effectTime: 1000,
        threshold: 0,
        afterLoad: function(element) {

            gtag('event', 'sponsor', {
                'sponsor': element.context.dataset.action,
                'area': element.context.dataset.label,
                'non_interaction': 1
            });
        }
    });

    $('.js-lazy-sponsor').on("click", function(element) {
        gtag('event', 'sponsor_click', {
            'sponsor': $(element.currentTarget).context.dataset.action,
            'area': $(element.currentTarget).context.dataset.label
        });
      });
});
