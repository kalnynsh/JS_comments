"use strict";
/**
 * Container - constractor for base class
 * create HTML elements with options
 *  @param { any }
 *  options {
 *         id: {any},
 *  className: {string},
 * elementName: {string},
 *     dataset: {string}
 *  }
 */
function Container(options) {
  this.element = options.elementName || "div";
  this.id = options.id || null;
  this.className = options.className || null;
  this.data = options.data || null;
}

Container.prototype.render = function() {
  var elem = document.createElement(this.element);

  if (this.id) elem.id = this.id;
  if (this.className) elem.className = this.className;
  if (this.data) elem.data = this.data;

  return elem;
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
 */
function Comments() {
  // Save context
  var self = this;
  // Return comments in var results
  var results;
  // Send POST request with body = @param initBody
  // Handling results in callback() function
  this.init = function(initBody, callback) {
    var xhr = new XMLHttpRequest();
    var body = initBody;
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
          results = JSON.parse(xhr.responseText);
          if (typeof callback === "function") {
            callback(self, results);
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
    return results;
  };
}

/** Static
 * class Comments property
 * */
Comments.endpoint = "http://api.spacenear.ru/comments.php"; // POST request body = // "add_review=true&id_user=342&text=Lorem" ( add comment ) // "approve_review=true&id_comment=342" ( approve comment ) // "delete_review=true&id_comment=342" ( delete comment ) // "show_reviews=true" ( show comments )

/** template object for Comments 
 * * id_user: {
     number
   },
   * add_review: {
     boolean
   },
   * approve_review: {
     boolean
   },
   * delete_review: {
     boolean
   },
   * show_reviews: {
     boolean
   },
   * body: {
     string
   }
 */
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
    return null;
  }
};

/** method show */
Comments.prototype.show = function(options) {
  var self = this;
  // Create new options object from parameter
  var opt = Object.create(options);
  opt.show_reviews = true;
  var body = opt.body();

  if (this.getComments()) {
    var commentsArray;
    // Have data, render comments list
    var parentContainer = document.querySelector(".content__info1 .comments");
    // Show only =< 15 comments
    if (this.getComments().length >= 10) {
      commentsArray = this.getComments().slice(0, 10);
    } else {
      commentsArray = this.getComments();
    }

    for (var i = 0; i < commentsArray.length; i++) {
      var commentElem = new Container({
        elementName: "div",
        className: "comment",
        data: commentsArray[i].id_comment
      }).render();
      commentElem.dataset.commentNumber = commentsArray[i].id_comment;

      var commentLable = new Container({
        elementName: "div",
        className: "comment__label"
      }).render();

      var commentIcon = new Container({
        elementName: "i",
        className: "fas fa-book"
      }).render();

      commentLable.appendChild(commentIcon);
      commentElem.appendChild(commentLable);

      var commentBody = new Container({
        elementName: "div",
        className: "comment__body"
      }).render();

      commentBody.textContent = commentsArray[i].text;
      commentElem.appendChild(commentBody);

      var commentStatus = new Container({
        elementName: "div",
        className: "comment__status"
      }).render();

      if (commentsArray[i].approve == 1) {
        commentStatus.classList.add("comment__status_yes");
      }

      var commentSIcon = new Container({
        elementName: "i",
        className: "fas fa-check"
      }).render();

      commentStatus.appendChild(commentSIcon);
      commentElem.appendChild(commentStatus);

      var commentDelete = new Container({
        elementName: "div",
        className: "comment__delete"
      }).render();

      var commentDIcon = new Container({
        elementName: "i",
        className: "fas fa-trash-alt"
      }).render();

      commentDelete.appendChild(commentDIcon);
      commentElem.appendChild(commentDelete);
      parentContainer.appendChild(commentElem);
    }
  } else {
    // Not have data
    self.init(body, function(self, results) {
      // console.log("We have results");
      var commentsArray;
      // Have data, render comments list
      var parentContainer = document.querySelector(".content__info1 .comments");

      // Show only =< 15 comments
      if (results.length >= 10) {
        commentsArray = results.slice(0, 10);
      } else {
        commentsArray = results;
      }

      for (var i = 0; i < commentsArray.length; i++) {
        var commentElem = new Container({
          elementName: "div",
          className: "comment",
          data: commentsArray[i].id_comment
        }).render();
        commentElem.dataset.commentNumber = commentsArray[i].id_comment;

        var commentLable = new Container({
          elementName: "div",
          className: "comment__label"
        }).render();

        var commentIcon = new Container({
          elementName: "i",
          className: "fas fa-book"
        }).render();

        commentElem.appendChild(commentLable);
        commentLable.appendChild(commentIcon);

        var commentBody = new Container({
          elementName: "div",
          className: "comment__body"
        }).render();

        commentBody.textContent = commentsArray[i].text;
        commentElem.appendChild(commentBody);

        var commentStatus = new Container({
          elementName: "div",
          className: "comment__status"
        }).render();

        if (commentsArray[i].approve == 1) {
          commentStatus.classList.add("comment__status_yes");
        }

        var commentSIcon = new Container({
          elementName: "i",
          className: "fas fa-check"
        }).render();

        commentStatus.appendChild(commentSIcon);
        commentElem.appendChild(commentStatus);

        var commentDelete = new Container({
          elementName: "div",
          className: "comment__delete"
        }).render();

        var commentDIcon = new Container({
          elementName: "i",
          className: "fas fa-trash-alt"
        }).render();

        commentDelete.appendChild(commentDIcon);
        commentElem.appendChild(commentDelete);
        parentContainer.appendChild(commentElem);
      }
    });
  }
};

/* method remove commit from textarea */
Comments.prototype.reset = function() {
  document.getElementById("commentInputID").value = "";
};

/* method add commit */
Comments.prototype.add = function(options) {
  var self = this;
  // Create new options object from parameter
  var opt = Object.create(options);
  opt.add_review = true;
  opt.id_user = Math.floor(Math.random() * 5000) + 1;

  var message = document.getElementById("commentInputID").value;
  opt.text = message || "New wise thoughts";

  if (!message) alert("Please write message");

  var body = opt.body();

  self.init(body, function(self, results) {
    if (results.result == 1) {
      alert(results.userMessage);
      document.getElementById("commentInputID").value = "";
    } else if (results.result == 0) {
      alert(results.error_message);
    } else {
      alert("Response from server don`t have result = 1");
    }
  });
};

/** method changeStatus */
Comments.prototype.changeStatus = function(options) {
  var self = this;
  var body = options.body();

  self.init(body, function(self, results) {
    if (results.result == 1) {
      alert(results.userMessage || "We have result = 1");
    } else if (results.result == 0) {
      alert(results.error_message);
    } else {
      alert("Response from server don`t have result = 1");
    }
  });
};

/** method changeStatus */
Comments.prototype.delete = function(options) {
  var self = this;
  var body = options.body();

  self.init(body, function(self, results) {
    if (results.result == 1) {
      alert(results.userMessage || "We have result = 1");
    } else if (results.result == 0) {
      alert(results.error_message);
    } else {
      alert("Response from server don`t have result = 1");
    }
  });
};

var comments = new Comments();
comments.show(commentOptions);

var commentsMainElem = document.querySelector(".content__info1 .comments");
commentsMainElem.addEventListener("click", function(event) {
  return commentsHanler(event, comments, commentOptions);
});

function commentsHanler(event, comments, commentOptions) {
  var target = event.target;
  var commentElem = target.closest(".comment");
  var addCommentBtn = target.closest(".comment-input__btn");
  var changeStatusElem = target.closest(".comment__status");
  var deleteElem = target.closest(".comment__delete");

  if (!(commentElem || addCommentBtn)) return; // Not a ".comment" OR ".comment-input__btn"

  if (addCommentBtn) {
    return comments.add(commentOptions);
  }

  if (
    !(
      commentElem.contains(changeStatusElem) || commentElem.contains(deleteElem)
    )
  ) {
    return;
  }
  // "div.comment" not contain "div.comment__status"
  // or "div.comment__delete"

  if (commentElem.dataset.commentNumber) {
    var commentId = commentElem.dataset.commentNumber;
  }
  // var commentId = commentElem.getAttribute("data-comment-number");

  if (changeStatusElem) {
    // Change status comments.changeStatus()
    // var idComment =
    if (comments instanceof Comments) {
      var optApprove = Object.create(commentOptions); // from cloure
      optApprove.approve_review = true;
      optApprove.id_comment = commentId;
      return comments.changeStatus(optApprove);
    } else {
      console.log("We don`t have instence of Comments");
      return;
    }
  } else if (deleteElem) {
    var optDelete = Object.create(commentOptions); // from cloure
    optDelete.delete_review = true;
    optDelete.id_comment = commentId;

    return comments.delete(optDelete);
  }
}
