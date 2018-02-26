"use strict";
/**
 * Container - constractor for base class
 *
 */
function Container() {
  this.id = "";
  this.className = "";
  this.element = null;
}
/**
 * render - method return any this.elements or creaate new "div"
 */
Container.prototype.render = function() {
  if (this.element) {
    return this.element;
  } else {
    var div = document.createElement("div");
    div.id = this.id;
    div.classList.add(this.className);
    this.element = div;

    return div;
  }
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
Comments.endpoint = "http://api.spacenear.ru/comments.php";
