var Privacy;
(function (Privacy) {
    var PrivacyController = (function () {
        function PrivacyController() {
            var _this = this;
            this.counter = 0;
            document.onreadystatechange = function () {
                if (document.readyState == "complete") {
                    _this.setStyle(style);

                    if (usersPrivacySettings && usersPrivacySettings.length)
                        _this.settingsToStore = usersPrivacySettings;
                    else {
                        _this.settingsToStore = [];
                    }

                    if (sitesPrivacySettings.filter(function (p) {
                        return p.Setting;
                    }).length == 0)
                        _this.warnAboutNoPrivacySettings();
                    else
                        _this.checkPrivacy(sitesPrivacySettings.filter(function (p) {
                            return p.Setting;
                        }), 0);
                }
            };
        }
        PrivacyController.prototype.setStyle = function (css) {
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        };

        PrivacyController.prototype.warnAboutNoPrivacySettings = function () {
            var html = '<dialog><div>This site does not have a privacy policy - proceed?</div><div><button id="ok">Accept</button><button id="cancel">Decline</button></div></dialog>';

            var fragment = this.create(html);
            document.body.insertBefore(fragment, document.body.childNodes[0]);

            var dialog = document.querySelector('dialog');
            window.dialogPolyfill.registerDialog(dialog);
            dialog.showModal();

            document.getElementById('ok').addEventListener('click', function () {
                dialog.close();
            });

            document.getElementById('cancel').addEventListener('click', function () {
                window.location.href = 'http://privacy.devchamp.com/privacy/siteinfo?url=' + window.location.href;
            });
        };

        PrivacyController.prototype.watermark = function () {
            var html = '<img src="http://privacy.devchamp.com/images/check.png" style="position:absloute; left:20px: top:300px;" />';

            var fragment = this.create(html);
            document.body.insertBefore(fragment, document.body.childNodes[0]);
        };

        PrivacyController.prototype.checkPrivacy = function (privacySettings, index) {
            var _this = this;
            var privacySetting = privacySettings[index];

            var stored = this.settingsToStore.filter(function (s) {
                return s.Name == privacySetting.Name;
            });
            if (stored.length > 0) {
                if (stored[0].Setting) {
                    if (index++ < privacySettings.length - 1)
                        this.checkPrivacy(privacySettings, index);
                    else
                        this.watermark();

                    return;
                } else {
                    window.location.href = 'http://privacy.devchamp.com/privacy/siteinfo?url=' + window.location.href;
                    return;
                }
            }

            var html = '<dialog><div>' + privacySetting.Name + '</div><div><button id="ok">Accept</button><button id="cancel">Decline</button></div>' + '<footer><input type="checkbox" id="remember" />Store this setting in my preferences</footer></dialog>';

            var fragment = this.create(html);
            document.body.insertBefore(fragment, document.body.childNodes[0]);

            var dialog = document.querySelector('dialog');
            window.dialogPolyfill.registerDialog(dialog);
            dialog.showModal();

            var checkbox = document.getElementById('remember');

            document.getElementById('ok').addEventListener('click', function () {
                var done = function () {
                    dialog.close();

                    if (index++ < privacySettings.length - 1)
                        _this.checkPrivacy(privacySettings, index);
                    else
                        _this.watermark();
                };

                if (checkbox.checked) {
                    _this.storeSetting(privacySetting.Name, true, function () {
                        return done();
                    });
                } else {
                    done();
                }
            });

            document.getElementById('cancel').addEventListener('click', function () {
                var done = function () {
                    dialog.close();
                    window.location.href = 'http://privacy.devchamp.com/privacy/siteinfo?url=' + window.location.href;
                };

                if (checkbox.checked) {
                    _this.storeSetting(privacySetting.Name, false, function () {
                        return done();
                    });
                } else {
                    done();
                }
            });
        };

        PrivacyController.prototype.jsonp = function (url, params, callback) {
            this.query = "?";
            params = params || {};
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    this.query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
                }
            }
            var jsonp = "json" + (++this.counter);
            window[jsonp] = function (data) {
                callback(data);
                try  {
                    delete window[jsonp];
                } catch (e) {
                }
                window[jsonp] = null;
            };

            this.load(url + this.query + "callback=" + jsonp);
            return jsonp;
        };

        PrivacyController.prototype.load = function (url) {
            var script = document.createElement('script'), done = false;
            script.src = url;
            script.async = true;

            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                }
            };
            if (!this.head) {
                this.head = document.getElementsByTagName('head')[0];
            }
            this.head.appendChild(script);
        };

        PrivacyController.prototype.storeSetting = function (name, setting, callback) {
            this.jsonp('http://privacy.devchamp.com/privacy/setting', { name: name, setting: setting }, function () {
                callback();
            });
        };

        PrivacyController.prototype.create = function (htmlStr) {
            var frag = document.createDocumentFragment(), temp = document.createElement('div');
            temp.innerHTML = htmlStr;
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            return frag;
        };
        return PrivacyController;
    })();
    Privacy.PrivacyController = PrivacyController;
})(Privacy || (Privacy = {}));

new Privacy.PrivacyController();
//# sourceMappingURL=PrivacyController.js.map
