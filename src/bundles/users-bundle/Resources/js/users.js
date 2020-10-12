/*
 *
 *	ENTRY POINT
 *  WEBPACK bundle users-bundle
 *  client side
 */
// javascript bootstrap library
import 'bootstrap';
// bootstrap scss framework
import '../scss/custom.scss';

/*
 *	Class Users Bundle App
 */
class Users {
  constructor() {
    $(document).ready(() => {
      this.ready();
    });
  }

  ready() {
    let selectorLang = global.document.getElementById("language");
    if (selectorLang) {
      selectorLang.addEventListener("change", (e) => {
        this.changeLang();
        e.preventDefault();
      });
    }
    $(".password-button").on("click", () => {
      this.showPassword($(".password"), $(".password-icon"));
    });
    $("#inputGroupRole").on("change", () => {
      this.checkSelect();
    });
    if ( $("#inputGroupRole")[0]){
      $("#inputGroupRole")[0].size = $("#inputGroupRole option").length;
    }
    if ( $("#roles")[0]){
      $("#roles")[0].size = $("#inputGroupRole option").length;
    }

    $(document).on('submit', () => {
      $("#roles").removeAttr("disabled");
    });
    $("#roles option").on("click", (ev) => {
      let val = $(ev.target).val();
      $(`#inputGroupRole option[value=${val}]`).prop("selected", true);
      this.checkSelect();
    });
    $("#iconGroupRole").on("click", (ev) => {
      let val = $("#inputGroupRole").val();
      let ele = $(ev.target);
      switch (true) {
        case ele.hasClass("fa-plus-circle"):
          let opt = $('<option>', {
            value: val,
            text: val,
            selected: ""
          });
          $('#roles').append(opt);
          opt.on("click", () => {
            $(`#inputGroupRole option[value=${val}]`).prop("selected", true);
            this.checkSelect();
          });
          $("#roles")[0].size = $("#inputGroupRole option").length;
          //$("#inputGroupRole option[value=none]").prop("selected", true);
          break;
        case ele.hasClass("fa-minus-circle"):
          $(`#roles option[value=${val}]`).remove();
          //$("#inputGroupRole option[value=none]").prop("selected", true);
          $("#roles")[0].size = $("#inputGroupRole option").length;
          break;
        default:
          $("#roles")[0].size = $("#inputGroupRole option").length;
          $("#inputGroupRole")[0].size = $("#inputGroupRole option").length;
      }
      this.checkSelect();
    });
  }

  changeLang(query) {
    if (query) {
      return window.location.href = "?language=" + query;
    }
    let form = global.document.getElementById("formLang");
    if (form) {
      form.submit();
    }
  }

  checkSelect() {
    const tab = $("#roles").val() || [];
    const select = $("#inputGroupRole");
    const icon = $("#iconGroupRole");
    const val = select.val();

    if (val === "none") {
      icon.removeClass("fa-plus-circle");
      icon.removeClass("fa-minus-circle");
      icon.addClass("fa-wrench");
      return;
    }
    icon.removeClass("fa-wrench");
    if (tab.indexOf(val) >= 0) {
      icon.removeClass("fa-plus-circle");
      icon.addClass("fa-minus-circle");
    } else {
      icon.removeClass("fa-minus-circle");
      icon.addClass('fa-plus-circle');
    }
  }

  showPassword(tag, icon) {
    if (!(tag instanceof jQuery)) {
      tag = $(tag);
    }
    if (!(icon instanceof jQuery)) {
      icon = $(icon);
    }
    return tag.attr("type", function(index, attr) {
      switch (attr) {
        case "text":
          icon.removeClass("fa-eye");
          icon.addClass("fa-eye-slash");
          return "password";
        case "password":
          icon.removeClass("fa-eye-slash");
          icon.addClass("fa-eye");
          return "text";
      }
    });
  }
}


/*
 * HMR
 */
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('Cannot apply HMR update.', err);
    }
  });
}

export default new Users();
