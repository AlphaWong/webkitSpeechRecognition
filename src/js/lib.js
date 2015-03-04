//Clear All the information
function SpeechToTextObject() {
    var clear, working, speech, final_transcript = "";
    //Button DOM
    this.rec;
    this.clear;
    this.export;
    this.lang;
    //

    //Display DOM
    this.output;
    this.buffer;
    this.warning;
    //

    //Speech API
    this.speech;
    //
}

SpeechToTextObject.prototype.clearSlate = function () {
    if (this.working) { //If the voice to text api still running 
        this.speech.stop(); //Stop the api.
    }
    //document.getElementById('output').innerHTML = ""; //Clear the out put HTML Element
    //document.getElementById("buffer").innerHTML = ""; //Clear the Candidate words
    this.output.innerHTML = ""; //Clear the out put HTML Element
    this.buffer.innerHTML = ""; //Clear the Candidate words
    this.final_transcript = "";
    this.reset();
}

SpeechToTextObject.prototype.reset = function (me) {
    me.working = false;
    //document.getElementById("status").style.display = "none";
    //document.2getElementById("rec").innerHTML = "Start Dictation";
    me.rec.innerHTML = "Start Dictation";
}

SpeechToTextObject.prototype.action = function () {
    if (this.working) {
        this.speech.stop();
        this.reset();
    } else {
        this.speech.start();
        this.working = true;
        //        document.getElementById("status").style.display = "block";
        this.rec.innerHTML = "Stop Listening";
    }
}

//Offer Export Feature (Out source library)
SpeechToTextObject.prototype.save = function () {
    var d = this.output.innerHTML;
    filepicker.setKey('AQuD5TxGmR7WT1pF3srxIz');
    filepicker.store(d, function (a) {
        filepicker['export'](a, {
            extension: '.txt',
            services: ['DROPBOX', 'GOOGLE_DRIVE', 'COMPUTER', 'SEND_EMAIL']
        }, function (a) {});
    });
}

SpeechToTextObject.prototype.updateLang = function (sel) { // Swtich Language
    var value = sel.options[sel.selectedIndex].value;
    this.speech.lang = this.getLang(value);
    localStorage["language"] = value;
}

SpeechToTextObject.prototype.format = function (s) {
    return s.replace(/\n/g, '<br>');
}

SpeechToTextObject.prototype.capitalize = function (s) {
    return s.replace(/\S/, function (m) {
        return m.toUpperCase();
    });
}

SpeechToTextObject.prototype.initialize = function () {
    var me = this;
    this.mappingButton();
    this.speech = new webkitSpeechRecognition(); //Create Recongnition Object
    this.speech.continuous = true; //Support continuos speech !! it do not support any mobile client
    this.speech.maxAlternatives = 5; //The size of the Candidate Array
    this.speech.interimResults = true; //Show the Candidate Array
    this.speech.lang = this.getLang(localStorage["language"]); //adopting library
    this.speech.onend = this.reset(me); //Ending Handler
}

SpeechToTextObject.prototype.main = function () {
    var me = this;
    if (typeof (webkitSpeechRecognition) !== 'function') { //If the client do not support a error message will pop-up

        this.output.innerHTML = "We are sorry but Dictation requires the latest version of Google Chrome on your desktop.";
        //document.getElementById("messages").style.display = "none";

    } else {

        if (typeof (localStorage["language"]) == 'undefined') {
            localStorage["language"] = 12;
        }

        if (typeof (localStorage["transcript"]) == 'undefined') {
            localStorage["transcript"] = "";
        }

        this.output.innerHTML = localStorage["transcript"];
        this.final_transcript = localStorage["transcript"];

        setInterval(function () {
            var text = this.output.innerHTML;
            if (text !== localStorage["transcript"]) {
                localStorage["transcript"] = text;
            }
        }, 2000);

        //document.getElementById("lang").value = localStorage["language"]; //Get the selected language library
        this.lang.value = localStorage["language"]; //Get the selected language library

        //TODO: main flow
        this.initialize(); //Start the programe
        this.reset(me); //Reset the program
        //

        this.speech.onerror = function (e) { //API error handler
            var msg = e.error + " error";
            if (e.error === 'no-speech') {
                msg = "No speech was detected. Please try again.";
            } else if (e.error === 'audio-capture') {
                msg = "Please ensure that a microphone is connected to your computer.";
            } else if (e.error === 'not-allowed') {
                msg = "The app cannot access your microphone. Please go to chrome://settings/contentExceptions#media-stream and allow Microphone access to this website.";
            }
            //document.getElementById("warning").innerHTML = "<p>" + msg + "</p>";
            me.warning.innerHTML = "<p>" + msg + "</p>";
            setTimeout(function () {
                //document.getElementById("warning").innerHTML = "";
                me.warning.innerHTML = "";
            }, 5000);
        };

        this.speech.onresult = function (e) { //retrieve the Candidate from the google api
            var interim_transcript = '';
            if (typeof (e.results) == 'undefined') {
                this.reset();
                return;
            }
            for (var i = e.resultIndex; i < e.results.length; ++i) {
                var val = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    this.final_transcript += " " + val;
                } else {
                    interim_transcript += " " + val;
                }
            }
            me.output.innerHTML = me.format(me.capitalize(this.final_transcript)); //push the confirmed word to web page 
            me.buffer.innerHTML = me.format(interim_transcript); //push the Candidate to web page
        };
    }
}

SpeechToTextObject.prototype.getLang = function (opt) { //Dictionary of the language libaray

    var langs = [
        ["Afrikaans", "af-za", "--", "en-us"],
        ["Bahasa Indonesia", "id-id", "--", "id-id"],
        ["Bahasa Melayu", "ms-my", "--", "ms-my"],
        ["Català", "ca-es", "--", "ca-es"],
        ["Čeština", "cs-cz", "--", "cs-cz"],
        ["Deutsch", "de-de", "--", "de-de"],
        ["Australia", "en-au", "English", "en-gb"],
        ["Canada", "en-ca", "English", "en-us"],
        ["India", "en-in", "English", "en-gb"],
        ["New Zealand", "en-nz", "English", "en-gb"],
        ["South Africa", "en-za", "English", "en-gb"],
        ["United Kingdom", "en-gb", "English", "en-gb"],
        ["United States", "en-us", "English", "en-us"],
        ["Argentina", "es-ar", "Español", "es-419"],
        ["Bolivia", "es-bo", "Español", "es-419"],
        ["Chile", "es-cl", "Español", "es-419"],
        ["Colombia", "es-co", "Español", "es-419"],
        ["Costa Rica", "es-cr", "Español", "es-419"],
        ["Ecuador", "es-ec", "Español", "es-419"],
        ["El Salvador", "es-sv", "Español", "es-419"],
        ["España", "es-es", "Español", "es"],
        ["Estados Unidos", "es-us", "Español", "es-419"],
        ["Guatemala", "es-gt", "Español", "es-419"],
        ["Honduras", "es-hn", "Español", "es-419"],
        ["México", "es-mx", "Español", "es-419"],
        ["Nicaragua", "es-ni", "Español", "es-419"],
        ["Panamá", "es-pa", "Español", "es-419"],
        ["Paraguay", "es-py", "Español", "es-419"],
        ["Perú", "es-pe", "Español", "es-419"],
        ["Puerto Rico", "es-pr", "Español", "es-419"],
        ["Rep. Dominicana", "es-do", "Español", "es-419"],
        ["Uruguay", "es-uy", "Español", "es-419"],
        ["Venezuela", "es-ve", "Español", "es-419"],
        ["Euskara", "eu-es", "--", "en-us"],
        ["Français", "fr-fr", "--", "fr"],
        ["Galego", "gl-es", "--", "en-us"],
        ["IsiZulu", "zu-za", "--", "en-us"],
        ["Íslenska", "is-is", "--", "en-us"],
        ["Italiano Italia", "it-it", "Italiano", "it"],
        ["Italiano Svizzera", "it-ch", "Italiano", "it"],
        ["Magyar", "hu-hu", "--", "hu"],
        ["Nederlands", "nl-nl", "--", "nl"],
        ["Polski", "pl-pl", "--", "pl"],
        ["Brasil", "pt-br", "Português", "pt-br"],
        ["Portugal", "pt-pt", "Português", "pt-pt"],
        ["Română", "ro-ro", "--", "ro"],
        ["Slovenčina", "sk-sk", "--", "sk"],
        ["Suomi", "fi-fi", "--", "fi"],
        ["Svenska", "sv-se", "--", "sv"],
        ["Türkçe", "tr-tr", "--", "tr"],
        ["български", "bg-bg", "--", "bg"],
        ["Pусский", "ru-ru", "--", "ru"],
        ["Српски", "sr-rs", "--", "sr"],
        ["한국어", "ko-kr", "--", "ko"],
        ["普通话 (中国大陆)", "cmn-hans-cn", "中文", "zh-cn"],
        ["普通话 (香港)", "cmn-hans-hk", "中文", "zh-cn"],
        ["中文 (台灣)", "cmn-hant-tw", "中文", "zh-tw"],
        ["粵語 (香港)", "yue-hant-hk", "中文", "zh-hk"],
        ["日本語", "ja-jp", "--", "ja"],
        ["Lingua latīna", "la", "--", "es-419"]
    ];
    return langs[opt][1];
}

SpeechToTextObject.prototype.mappingButton = function () {
    var me = this;
    //Mapping the Button to the Event Handler
    this.rec.addEventListener('click', function () {
        me.action();
    });

    this.clear.addEventListener('click', function () {
        me.clearSlate();
    });

    this.export.addEventListener('click', function () {
        me.save();
    });

    this.lang.addEventListener('change', function () {
        me.
    });

}