var once = 0;

// 新增圖片至固定DIV
function insertHtmlAtCursor(html) {
  try{
    var orinode = document.getElementById("postContent_image"); // 找到插入圖片的DIV
    $("#postContent_image").css("display", "block");
    var range = document.createRange(); // 設定插入圖片時的range function
    range.setStart(orinode, 0); // 設定range起始點

    var node = range.createContextualFragment(html); // 欲插入之element
    orinode.insertBefore(node, document.getElementById("clear"));
  }catch(err) {
    alert("錯誤!");
  }
}

(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {

  "use strict";

  var log = function (o) {
        try {
          console.log(o)
        } catch (e) {}
      };

  function CropAvatar($element) {
    this.$container = $element;

    this.$avatarView = this.$container.find(".avatar-view");
    this.$avatar = this.$avatarView.find("img");
    this.$avatarModal = this.$container.find("#avatar-modal");
    this.$loading = this.$container.find(".loading");

    this.$avatarForm = this.$avatarModal.find(".avatar-form");
    this.$avatarUpload = this.$avatarForm.find(".avatar-upload");
    this.$avatarSrc = this.$avatarForm.find(".avatar-src");
    this.$avatarData = this.$avatarForm.find(".avatar-data");
    this.$avatarInput = this.$avatarForm.find(".avatar-input");
    this.$avatarSave = this.$avatarForm.find("#avatar-save");

    this.$avatarWrapper = this.$avatarModal.find(".avatar-wrapper");
    this.$avatarPreview = this.$avatarModal.find(".avatar-preview");

    this.$avatarBtn = this.$container.find("#image");

    this.$contentDIV = this.$container.find("#postContent");

    this.init();
    log(this);
  }

  CropAvatar.prototype = {
    constructor: CropAvatar,

    support: {
      fileList: !!$("<input type=\"file\">").prop("files"),
      fileReader: !!window.FileReader,
      formData: !!window.FormData
    },

    init: function () {
      this.support.datauri = this.support.fileList && this.support.fileReader;

      if (!this.support.formData) {
        this.initIframe();
      }

      this.initTooltip();
      this.initModal();
      this.addListener();
    },

    addListener: function () {
      $(document).mouseup(function(){
        if(document.activeElement.id=='rmimg'){
          document.activeElement.parentNode.remove();
          if($("#postContent_image").html().indexOf("img") == -1){ // div 內已無圖片
            $("#postContent_image").css("display", "none");
          }
        }
      });
      
      this.$avatarBtn.on("click", $.proxy(this.click, this));
      this.$avatarView.on("click", $.proxy(this.click, this));
      this.$avatarInput.on("change", $.proxy(this.change, this));
      this.$avatarForm.on("submit", $.proxy(this.submit, this));
    },

    initTooltip: function () {
      this.$avatarView.tooltip({
        placement: "bottom"
      });
    },

    initModal: function () {
      this.$avatarModal.modal("hide");
      this.initPreview();
    },

    initPreview: function () {
      var url = this.$avatar.attr("src");

      this.$avatarPreview.empty().html('<img src="' + url + '">');
    },

    initIframe: function () {
      var iframeName = "avatar-iframe-" + Math.random().toString().replace(".", ""),
          $iframe = $('<iframe name="' + iframeName + '" style="display:none;"></iframe>'),
          firstLoad = true,
          _this = this;

      this.$iframe = $iframe;
      this.$avatarForm.attr("target", iframeName).after($iframe);

      this.$iframe.on("load", function () {
        var data,
            win,
            doc;

        try {
          win = this.contentWindow;
          doc = this.contentDocument;

          doc = doc ? doc : win.document;
          data = doc ? doc.body.innerText : null;
        } catch (e) {}

        if (data) {
          _this.submitDone(data);
        } else {
          if (firstLoad) {
            firstLoad = false;
          } else {
            _this.submitFail("Image upload failed!");
          }
        }

        _this.submitEnd();
      });
    },

    click: function () {
      this.$avatarModal.modal("show");
      once = 0; // 可以 submit 圖片
    },

    change: function () {
      var files,
          file;

      if (this.support.datauri) {
        files = this.$avatarInput.prop("files");

        if (files.length > 0) {
          file = files[0];

          if (this.isImageFile(file)) {
            this.read(file);
          }
        }
      } else {
        file = this.$avatarInput.val();

        if (this.isImageFile(file)) {
          this.syncUpload();
        }
      }
    },

    submit: function () {
      if (!this.$avatarSrc.val() && !this.$avatarInput.val()) {
        return false;
      }

      if(once != 0){ // 禁止 submit 圖片
        return false;
      }

      if (this.support.formData) {
        once++;
        this.ajaxUpload();
        return false;
      }
    },

    isImageFile: function (file) {
      if (file.type) {
        return /^image\/\w+$/.test(file.type);
      } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
      }
    },

    read: function (file) {
      var _this = this,
          fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = function () {
        _this.url = this.result
        _this.startCropper();
      };
    },

    startCropper: function () {
      var _this = this;

      if (this.active) {
        this.$img.cropper("setImgSrc", this.url);
      } else {
        this.$img = $('<img src="' + this.url + '">');
        this.$avatarWrapper.empty().html(this.$img);
        this.$img.cropper({
          //aspectRatio: 1,
          preview: this.$avatarPreview.selector,
          done: function (data) {
            var json = [
                  '{"x":' + data.x,
                  '"y":' + data.y,
                  '"height":' + data.height,
                  '"width":' + data.width + "}"
                ].join();

            _this.$avatarData.val(json);
          }
        });

        this.active = true;
      }
    },

    stopCropper: function () {
      if (this.active) {
        this.$img.cropper("disable");
        this.$img.data("cropper", null).remove();
        this.active = false;
      }
    },

    ajaxUpload: function () {
      var url = this.$avatarForm.attr("action"),
          data = new FormData(this.$avatarForm[0]),
          _this = this;

      $.ajax(url, {
        type: "post",
        data: data,
        processData: false,
        contentType: false,

        beforeSend: function () {
          _this.submitStart();
        },

        success: function (data) {
          _this.submitDone(data);
        },

        error: function (XMLHttpRequest, textStatus, errorThrown) {
          _this.submitFail(textStatus || errorThrown);
        },

        complete: function () {
          _this.submitEnd();
        }
      });
    },

    syncUpload: function () {
      this.$avatarSave.click();
    },

    submitStart: function () {
      this.$loading.fadeIn();
    },

    submitDone: function (data) {
      log(data);

      try {
        data = $.parseJSON(data);
      } catch (e) {};

      if (data && data.state === 200) {
        if (data.result) {
          this.url = data.result;
          var href_img = '../'+this.url;
          href_img = href_img.replace("resize\/" ,'');
          //insertHtmlAtCursor('<a href="'+href_img+'"><img src="..\/' + this.url + '">');

          //insertHtmlAtCursor('<img src="..\/' + this.url + '">');

          insertHtmlAtCursor("<div class=\"show-image\"><img src=\"..\/"+this.url+"\" /><input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\" /></div>");

          if (this.support.datauri || this.uploaded) {
            this.uploaded = false;
            this.cropDone();
          } else {
            this.uploaded = true;
            this.$avatarSrc.val(this.url);
            this.startCropper();
          }

          this.$avatarInput.val("");
        } else if (data.message) {
          this.alert(data.message);
        }
      } else {
        this.alert("Failed to response");
      }
    },

    submitFail: function (msg) {
      this.alert(msg);
    },

    submitEnd: function () {
      this.$loading.fadeOut();
    },

    cropDone: function () {
      this.$avatarSrc.val("");
      this.$avatarData.val("");
      this.$avatar.attr("src", this.url);
      this.stopCropper();
      this.$avatarModal.modal("hide");
    },

    alert: function (msg) {
      var $alert = [
            '<div class="alert alert-danger avater-alert">',
              '<button type="button" class="close" data-dismiss="alert">&times;</button>',
              msg,
            '</div>'
          ].join("");

      this.$avatarUpload.after($alert);
    }
  };

  $(function () {
    var example = new CropAvatar($("#post-form-main"));
  });
});
