/* globals JSONPath */
/* eslint-disable import/unambiguous */

// Todo: Extract testing example paths/contents and use for a
//         pulldown that can populate examples

// Todo: Make configurable with other JSONPath options

// Todo: Allow source to be treated as an (evaled) JSON object

// Todo: Could add JSON/JS syntax highlighting in sample and result,
//   ideally with a jsonpath-plus parser highlighter as well

const $ = (s) => document.querySelector(s);

var results=[];

const updateResults = () => {
    const jsonSample = $('#jsonSample');
    const reportValidity = () => {
        // Doesn't work without a timeout
        setTimeout(() => {
            jsonSample.reportValidity();
        });
    };
    let json;
    try {
        json = JSON.parse(jsonSample.value);
        jsonSample.setCustomValidity('');
        reportValidity();
    } catch (err) {
        jsonSample.setCustomValidity('Error parsing JSON: ' + err.toString());
        reportValidity();
        return;
    }
    const result = JSONPath.JSONPath({
        path: $('#jsonpath').value,
        json
    });
    results = result;
    $('#results').value = JSON.stringify(result, null, 2);
};

$('#jsonpath').addEventListener('input', () => {
    if(!! $('#jsonSample').value){
        updateResults();
    }
});

$('#jsonSample').addEventListener('input', () => {
    updateResults();
});
$('#jsonSample').addEventListener('blur', () => {
    updateResults();
});

var event={}
var handler_for_contexts=[]

function doFor(){
    var forAction =$('#event-handler-for').value;
    if(!!forAction.trim()){
        try{
            eval("event.handler_for="+forAction);
            handler_for_contexts=[]
            for(const i of results){
                handler_for_contexts.push(event['handler_for'](i));
            }
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    }
    return false;
}
var handler_collect_contexts=[]
function doCollect(){
    var forAction =$('#event-handler-collect').value;
    if(!!forAction.trim()){
        try{
            eval("event.handler_collect="+forAction);
            handler_collect_contexts=''
            handler_collect_contexts = event['handler_collect'](handler_for_contexts);
            $('#event-handler-result').value = (handler_collect_contexts);
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    }
    return false;
}

$('#event-handler-for').addEventListener('blur', () => {
    updateResults();
    if(doFor()){
        doCollect();
    }
});


$('#event-handler-collect').addEventListener('blur', () => {
    updateResults();
    if(doFor()){
        doCollect();
    }
});

function action(){
    updateResults();
    if(doFor()){
        doCollect();
    }
}

