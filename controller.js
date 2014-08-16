function init() {
	document.getElementById("buttonUpload").disabled = false;
	document.getElementById("buttonDownload").disabled = false;
	$('#divModalUpload').modal({ show: false});
}

function download() {
	var data = {
		todo: document.getElementById("textareaInQueue").value,
		inProgress1: document.getElementById("inputSlot1").value,
		inProgress2: document.getElementById("inputSlot2").value,
		inProgress3: document.getElementById("inputSlot3").value,
		done: document.getElementById("textareaDone").value
	};
	
	var blob = new Blob([JSON.stringify(data, null, '\t').replace(/\r?\n/g, '\r\n')], {type: "text/plain;charset=utf-8"});
	if (document.getElementById("inputDocumentTitle").value) {
		var filename = document.getElementById("inputDocumentTitle").value + ".json";
	} else {
		var filename = "untitled_focalpoint.json";
	}
	saveAs(blob, filename);
}

function showModalUpload() {
	$('#divModalUpload').modal('show');
}

function refreshGui() {
	document.getElementById("textareaInQueue").value = "";
	document.getElementById("inputSlot1").value = "";
	document.getElementById("inputSlot2").value = "";
	document.getElementById("inputSlot3").value = "";
	document.getElementById("textareaDone").value = "";
	document.getElementById("inputDocumentTitle").value = "";

	document.getElementById("buttonUpload").disabled = false;
	document.getElementById("buttonDownload").disabled = false;
}

function upload() {
	var file = document.getElementById('file').files[0];
	var readFileName = escape(file.name).substring(0, file.name.lastIndexOf('.json'));
	
	// update into singleton variable and also document title
	document.getElementById("inputDocumentTitle").value = readFileName;
	
	if(file){
		getAsText(file);
	}
}

function getAsText(readFile) {
	var reader = new FileReader();

	// Read file into memory as UTF-16      
	reader.readAsText(readFile, "UTF-8");

	// Handle progress, success, and errors
	reader.onload = loaded;
	reader.onerror = errorHandler;
}

function loaded(evt) {  
	// Obtain the read file data    
	var fileString = evt.target.result;
	var data = JSON.parse(fileString);
	
	// load to GUI
	document.getElementById("textareaInQueue").value = data.todo;
	document.getElementById("inputSlot1").value = data.inProgress1;
	document.getElementById("inputSlot2").value = data.inProgress2;
	document.getElementById("inputSlot3").value = data.inProgress3;
	document.getElementById("textareaDone").value = data.done;
	
	// clear file upload modal
	var file = document.getElementById('file').value = "";
	$('#divModalUpload').modal('hide');
	
	// alter button state
	document.getElementById("buttonUpload").disabled = true;
	document.getElementById("buttonDownload").disabled = false;
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
	// The file could not be read
	}
}

function pullDocumentTitleFromInput() {
	var documentInput = document.getElementById("inputDocumentTitle").value;
	documentInput = generateValidFilename(documentInput);
	
	// update into singleton variable and also document title
	document.getElementById("inputDocumentTitle").value = documentInput;
	document.title = documentInput + ".json";
}

function generateValidFilename(stringInput) {
	// replace nasty characters
	var replaceChar = "_";
	var regEx = new RegExp('[,/\:*$?""<> |]', 'g');
	var filename = stringInput.replace(regEx, replaceChar);
	filename = filename.replace(/'/g, replaceChar);
	
	// remove opening dots
	while (filename[0] == ".") {
		filename = filename.substring(1);
	}
	
	// lowercase
	filename = filename.toLowerCase();
	
	return filename;
}