function FillInTheBlank() {
    this.question_node_array;
    this.article;
    this.play_button;
};
//var answer_node_array = document.querySelectorAll('.answer');

FillInTheBlank.prototype.main = function () {
    this.mapping();
    var me = this;
    for (var i = 0; i < me.question_node_array.length; ++i) {

        var answer = me.question_node_array[i].textContent;
        var answer_span = document.createElement('span');
        answer_span.textContent = answer;
        answer_span.className = 'answer';

        var question_number = i + 1;
        var question_number_dom = document.createElement('em');
        question_number_dom.textContent = question_number + '. ';

        //        var virtual_dom = document.createElement('div');
        //        virtual_dom.outerHTML = '<div class="si-wrapper"><input type="text" class="si-input" placeholder="Voice Input"><button class="si-btn">speech input<span class="si-mic"></span><span class="si-holder"></span></button></div>';
        me.question_node_array[i].innerHTML = '';
        me.question_node_array[i].appendChild(question_number_dom);
        me.question_node_array[i].appendChild(answer_span);
        me.question_node_array[i].innerHTML += '<div class="si-wrapper"><input type="text" class="si-input" placeholder="Voice Input" readonly><button class="si-btn">speech input<span class="si-mic"></span><span class="si-holder"></span></button></div>';
    }
}
FillInTheBlank.prototype.play = function () {
    var utterance = new SpeechSynthesisUtterance(this.article);
    speechUtteranceChunker(utterance, {
        chunkLength: 120
    }, function () {
        //some code to execute when done
        console.log('done');
    });
}
FillInTheBlank.prototype.stop = function () {
    speechUtteranceChunker.cancel = true;
}
FillInTheBlank.prototype.mapping = function () {
    var me = this;
    this.play_button.addEventListener('click', function () {
        me.play();
    });
    this.stop_button.addEventListener('click', function () {
        me.stop();
    });
    this.score_button.addEventListener('click', function () {
        me.compare();
    });
}
FillInTheBlank.prototype.compare = function () {
    var me = this;
    var model_answer = document.querySelectorAll('.answer');
    var user_answer = document.querySelectorAll('.si-input');
    var original_tr;
    var output_tr;
    var isCorrect_tr;
    var index_tr;
    var score = document.createElement('var');
    var result_array = doCompare(model_answer, user_answer);

    me.score_container.innerHTML = '';
    var table_and_score = doCreateScoreTableAndGetScore(result_array);
    me.score_container.appendChild(table_and_score.table);

    score.textContent = "Score:" + ((table_and_score.score.length / model_answer.length) * 100).toFixed(2);
    me.score_container.appendChild(score);

    function doCreateScoreTableAndGetScore(a) {
        var table = document.createElement('table');
        var correct_array = [];
        for (var i = 0; i < a.length; ++i) {
            if (i % 10 == 0) {
                index_tr = document.createElement('tr');
                original_tr = document.createElement('tr');
                output_tr = document.createElement('tr');
                isCorrect_tr = document.createElement('tr');
            }
            var original_td = document.createElement('td');
            original_td.innerHTML = a[i].original.textContent;
            original_tr.appendChild(original_td);

            var output_td = document.createElement('td');
            if (a[i].output.value == '') {
                output_td.innerHTML = 'Missing';
            } else {
                output_td.innerHTML = a[i].output.value;
            }
            output_tr.appendChild(output_td);

            var isCorrect_td = document.createElement('td');
            isCorrect_td.innerHTML = isCorrect_td.className = a[i].isCorrect;
            isCorrect_tr.appendChild(isCorrect_td);

            var index_td = document.createElement('td');
            index_td.innerHTML = (i+1) + '. ';
            index_tr.appendChild(index_td);

            if (a[i].isCorrect) {
                correct_array.push(i);
            }
            if (i % 10 == 0) {
                table.appendChild(index_tr);
                table.appendChild(original_tr);
                table.appendChild(output_tr);
                table.appendChild(isCorrect_tr);
                table.appendChild(document.createElement('br'));
            }
        }
        return {
            table: table,
            score: correct_array
        };
    }

    function doCompare(a, b) {
        var result_array = [];
        for (var i = 0; i < a.length; ++i) {
            var result = {};
            result.original = a[i];
            if (b[i] == undefined) {
                result.output = '';
                result.isCorrect = false;
            } else {
                result.output = b[i];
                result.isCorrect = a[i].textContent.toLowerCase() == b[i].value.toLowerCase();
            }
            result_array.push(result);
        }
        return result_array;
    }

    function stringToArray(str) {
        return str.split(' ');
    }

    function isEmpty(arr) {
        return arr[0] == "";
    }
}