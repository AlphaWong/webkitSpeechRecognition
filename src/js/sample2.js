                <em>2.</em><span class='answer'>justice</span>

var answer_node_array=document.querySelectorAll('.answer');
for(var i=0;i<answer_node_array.length;++i){
    var question_number=i+1;
    var question_number_dom=document.createElement('em');
    question_number_dom.textContent=question_number;
    var virtual_dom=document.createElement('div');
    virtual_dom.outerHTML='<div class="si-wrapper"><input type="text" class="si-input" placeholder="Voice Input"><button class="si-btn">speech input<span class="si-mic"></span><span class="si-holder"></span></button></div>';
    
}