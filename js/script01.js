"use strict";
/**
 * Container - constractor for base class
 *
 */
function Container(options) {
  this.id = options.id;
  this.className = options.className;
  this.element = options.elementName || "div";
  this.data = options.data;
}
/**
 * render - method return any this.elements or creaate new "div"
 */
Container.prototype.render = function() {
  if (this.element) {
    return this.element;
  } else {
    var elem = document.createElement(this.element);
    if (this.id) elem.id = this.id;
    if (this.className) elem.classList.add(this.className);

    return elem;
  }
};

Container.prototype.remove = function() {
  var elem;
  if (this.id) {
    elem = document.getElementById(this.id);
    elem.remove();
    return true;
  } else if (this.className) {
    elem = document.querySelector("." + this.className);
    elem.remove();
    return true;
  }
  console.log("For remove element must have id or class name");
  return false;
};

/**
 * Comments - constructor
 *
 * @param {any} options {
 * id_user: {number},
 * add_review: {boolean},
 * approve_review: {boolean},
 * delete_review: {boolean},
 * show_reviews: {boolean},
 * body: {string}
 * }
 */
function Comments(options) {
  var comments;
  // Send POST request with options.body
  this.init = function(callback) {
    var xhr = new XMLHttpRequest();
    var body = options.body;
    // POST request body =
    // "add_review=true&id_user=342&text=Lorem" ( add comment )
    // "approve_review=true&id_comment=342" ( approve comment )
    // "delete_review=true&id_comment=342" ( delete comment )
    // "show_reviews=true" ( show comments )
    var url = Comments.endpoint + "/";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.timeout = 30000; // 30 sec

    xhr.send(body);

    xhr.ontimeout = function() {
      alert("Извините, запрос превысил максимальное время");
    };

    xhr.onerror = function(error) {
      alert("Произошла ошибка " + error);
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState != XMLHttpRequest.DONE) return; // 4

      if (xhr.status === 200) {
        try {
          var results = JSON.parse(xhr.responseText);
          comments = results;
          if (typeof callback === "function") {
            callback();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        alert(
          "Ошибка: " + (this.status ? this.statusText : "запрос не удался")
        );
      }
    }; // onready..
  }; // init

  this.getComments = function() {
    return comments;
  };
}

/** Static
 * class Comments property
 * */
Comments.endpoint = "http://api.spacenear.ru/comments.php"; // POST request body = // "add_review=true&id_user=342&text=Lorem" ( add comment ) // "approve_review=true&id_comment=342" ( approve comment ) // "delete_review=true&id_comment=342" ( delete comment ) // "show_reviews=true" ( show comments )

/** template object for Comments */

var commentOptions = {
  id_user: null,
  id_comment: null,
  add_review: false,
  text: "",
  approve_review: false,
  delete_review: false,
  show_reviews: false,
  body: function() {
    if (this.show_reviews) {
      return "show_reviews" + "=" + "true";
    }
    if (this.add_review && this.id_user && this.text) {
      return (
        "add_review" +
        "=" +
        "true" +
        "&id_user=" +
        this.id_user +
        "&text=" +
        encodeURIComponent(this.text)
      );
    }
    if (this.approve_review && this.id_comment) {
      return "approve_review" + "=" + "true" + "&id_comment=" + this.id_comment;
    }
    if (this.delete_review && this.id_comment) {
      return "delete_review" + "=" + "true" + "&id_comment=" + this.id_comment;
    }
  }
};

/** show method */
Comments.prototype.show = function(options) {
  var self = this;
  // Create new ooptions object from paramentr
  var opt = Object.create(options);
};
