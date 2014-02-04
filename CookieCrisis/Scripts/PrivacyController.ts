interface DialogPolyfill {
    registerDialog(element: Element): void;
}

interface Window {
    dialogPolyfill: DialogPolyfill;
}

interface Element {
    showModal(): void;
    close(): void;
}

interface PrivacySetting {
    Name: string;
    Setting?: boolean;
}

declare var sitesPrivacySettings: PrivacySetting[];

declare var usersPrivacySettings: PrivacySetting[];

declare var style: string;

module Privacy {
    export class PrivacyController {
        private settingsToStore: PrivacySetting[];
        private counter = 0;
        private head;
        private query;
        private key;

        constructor() {
            document.onreadystatechange = () => {
                if (document.readyState == "complete") {
                    this.setStyle(style);

                    if (usersPrivacySettings && usersPrivacySettings.length)
                        this.settingsToStore = usersPrivacySettings;
                    else {
                        this.settingsToStore = [];
                    }

                    if (sitesPrivacySettings.filter(p => p.Setting).length == 0)
                        this.warnAboutNoPrivacySettings();
                    else
                        this.checkPrivacy(sitesPrivacySettings.filter(p => p.Setting), 0);
                }
            };
        }

        private setStyle(css: string) {
            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                (<any>style.styleSheet).cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        }

        private warnAboutNoPrivacySettings() {
            var html = '<dialog><div>This site does not have a privacy policy - proceed?</div><div><button id="ok">Accept</button><button id="cancel">Decline</button></div></dialog>';

            var fragment = this.create(html);
            document.body.insertBefore(fragment, document.body.childNodes[0]);

            var dialog = document.querySelector('dialog');
            window.dialogPolyfill.registerDialog(dialog);
            dialog.showModal();


            document.getElementById('ok').addEventListener('click', () => {
                dialog.close();
            });

            document.getElementById('cancel').addEventListener('click', () => {
                window.location.href = 'http://privacy.devchamp.com/privacy/siteinfo?url=' + window.location.href;
            });
        }

        private watermark() {
            var html = '<img src="http://privacy.devchamp.com/images/check.png" style="position:absloute; left:20px: top:300px;" />';

            var fragment = this.create(html);
            document.body.insertBefore(fragment, document.body.childNodes[0]);
        }

        private checkPrivacy(privacySettings: PrivacySetting[], index) {

            var privacySetting = privacySettings[index];

            var stored = this.settingsToStore.filter(s => s.Name == privacySetting.Name);
            if (stored.length > 0) {
                if (stored[0].Setting) {
                    if (index++ < privacySettings.length - 1)
                        this.checkPrivacy(privacySettings, index);
                    
                    return;
                } else {
                    window.location.href = 'http://privacy.devchamp.com/privacy/siteinfo?url=' + window.location.href;
                    return;
                }

            }


            var html = '<dialog><div>' + privacySetting.Name + '</div><div><button id="ok">Accept</button><button id="cancel">Decline</button></div>' +
                '<footer><input type="checkbox" id="remember" />Store this setting in my preferences</footer></dialog>';

            var fragment = this.create(html);
            document.body.insertBefore(fragment, document.body.childNodes[0]);

            var dialog = document.querySelector('dialog');
            window.dialogPolyfill.registerDialog(dialog);
            dialog.showModal();

            var checkbox = <HTMLInputElement>document.getElementById('remember');

            document.getElementById('ok').addEventListener('click', () => {

                var done = () => {
                    dialog.close();

                    if (index++ < privacySettings.length - 1)
                        this.checkPrivacy(privacySettings, index);
                    else
                        this.watermark();
                };


                if (checkbox.checked) {
                    this.storeSetting(privacySetting.Name, true, () => done());
                } else {
                    done();
                }


            });

            document.getElementById('cancel').addEventListener('click', () => {
                var done = () => {
                    dialog.close();
                    window.location.href = 'http://privacy.devchamp.com/privacy/siteinfo?url=' + window.location.href;
                };


                if (checkbox.checked) {
                    this.storeSetting(privacySetting.Name, false, () => done());
                } else {
                    done();
                }


            });
        }

        private jsonp(url, params, callback) {
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
                try {
                    delete window[jsonp];
                } catch (e) { }
                window[jsonp] = null;
            };

            this.load(url + this.query + "callback=" + jsonp);
            return jsonp;
        }

        private load(url) {
            var script = document.createElement('script'),
                done = false;
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
        }

        private storeSetting(name: string, setting: boolean, callback: () => void) {
            this.jsonp('http://privacy.devchamp.com/privacy/setting', { name: name, setting: setting }, () => {
                callback();
            });
        }

        private create(htmlStr) {
            var frag = document.createDocumentFragment(),
                temp = document.createElement('div');
            temp.innerHTML = htmlStr;
            while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
            }
            return frag;
        }
    }
}

new Privacy.PrivacyController();