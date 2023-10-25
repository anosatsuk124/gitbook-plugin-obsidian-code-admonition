var cheerio = require("cheerio"),
  $,
  options =
    // map annotations to styles
    {
      /* info */
      info: {
        alert: "info",
        picto: "fa-info",
      },
      note: {
        alert: "info",
        picto: "fa-edit",
      },
      tag: {
        alert: "info",
        picto: "fa-tag",
      },
      comment: {
        alert: "info",
        picto: "fa-comment-o",
      },
      todo: {
        alert: "info",
        picto: "fa-bookmark",
      },
      /* success */
      hint: {
        alert: "success",
        picto: "fa-lightbulb-o",
      },
      success: {
        alert: "success",
        picto: "fa-lightbulb-o",
      },
      /* warning */
      warning: {
        alert: "warning",
        picto: "fa-exclamation-triangle",
      },
      caution: {
        alert: "warning",
        picto: "fa-exclamation-triangle",
      },
      /* danger */
      danger: {
        alert: "danger",
        picto: "fa-times-circle",
      },
      fixme: {
        alert: "danger",
        picto: "fa-bug",
      },
      bug: {
        alert: "danger",
        picto: "fa-bug",
      },
      /* quote */
      quote: {
        alert: "quote",
        picto: "fa-quote-left",
      },

      /* Default */
      default: {
        alert: "quote",
        picto: "fa-quote-left",
      },
    };

module.exports = {
  book: {
    assets: "./book",
    css: ["plugin.css"],
  },
  hooks: {
    // For all the hooks, this represent the current generator
    // This is called before the book is generated
    init: function () {
      // console.log( "richquotes init!" );
      if (this.options.pluginsConfig && this.options.pluginsConfig.richquotes) {
        // richquotes is a POJO, save to use for-in
        var richquotes = this.options.pluginsConfig.richquotes;
        for (key in richquotes) {
          // console.log(key, richquotes[key]);
          options[key] =
            richquotes[key] === false ? undefined : richquotes[key];
        }
      }
    },

    // This is called for each page of the book
    // It can be used for modifying page content
    // It should return the new page
    page: function (page) {
      var $bq, $this, style;

      $ = cheerio.load(page.content);
      $bq = $("blockquote").each(function () {
        $this = $(this);
        const pattern = /\s*\[\!(.+)\]/g;
        const html = $this.html();

        const matches = html.match(pattern);

        if (!matches) {
          return;
        }

        const match = pattern.exec(html)[1];

        style = options[match] // look up annotation in options
          ? options[match]
          : options["default"];

        if (!style) {
          return;
        }

        const removed_annotation = html.replace(pattern, "");

        $this.empty().html(removed_annotation);
        $this.addClass("clearfix alert alert-" + style.alert);
        const $first_p = $this.find("p").first();
        $first_p.prepend('<i class="fa fa-1x ' + style.picto + '"></i>');
      });

      // Replace by the transformed element
      page.content = $.html();
      return page;
    },
  },
};
