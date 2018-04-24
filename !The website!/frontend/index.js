var smoothie_1 = new SmoothieChart({millisPerPixel:100, scrollBackwards:true, maxValue:30, minValue:0, grid: {verticalSections: 6}});
smoothie_1.streamTo(document.getElementById("graphics_1"));

var smoothie_2 = new SmoothieChart({millisPerPixel:100, scrollBackwards:true, maxValue:10000, minValue:0, grid: {verticalSections: 10}});
smoothie_2.streamTo(document.getElementById("graphics_2"));

var line1 = new TimeSeries();
var line2 = new TimeSeries();

var value1 = 0;
var value2 = 0;

setInterval(function() {      		
	line1.append(new Date().getTime(), value1);
}, 1000);
smoothie_1.addTimeSeries(line1);				

setInterval(function() {      		
	line2.append(new Date().getTime(), value2);
}, 1000);
smoothie_2.addTimeSeries(line2);	


var URL = 0;    

var type_indicator_values = 0;
var source = 0;

// (stop == 0) - до первого нажатия кнопки подключения
// (stop == 1) - после первого удачного подключения к потоку
// (stop == 2) - при попытки переподключения пользователем по введённому URL
// при (stop == 2) - (stop = 0) и остановка события, если URL и подключение действует событие вновь запустится.
function Revision() {				
	source = new EventSource(URL);
	console.log("Созданный объект EventSource, пытается установить соединение.");
	source.onopen = function(e) { console.log("Соединение EventSource открыто.");
		source.onmessage = function(e) { console.log("Принято сообщение. EventSource.");
			//обработчик типа значений данных
			if(e.data == "T") {
				type_indicator_values = e.data;
			} else if(e.data == "S") {
				type_indicator_values = e.data;
			}

			//обработчик данных
			if(e.data != "Ok!") {
				if(type_indicator_values == "T" && e.date != "T" && e.date != "S") {
					value1 = e.data;		    		    		
				} else if(type_indicator_values == "S" && e.date != "T" && e.date != "S") {
					value2 = e.data;	    			    		
				}
			}				
		};
	};
			
	source.onerror = function(e) {
		if (this.readyState == source.CONNECTING) {
			console.log("Соединение EventSource порвалось, пересоединяемся...");
		} else {
			console.log("Ошибка EventSource, состояние: " + this.readyState);
		}
	};
}

function stop_reading() {
	if (source !== 0) {
		source.close();
		source = 0;
		console.log("EventSource деактивирован.");
	}

	if(document.getElementById("URL").value != "") {
		URL = "http://" + document.getElementById("URL").value + "/";
	}
		
	if(URL !== 0) {
		var xhr = getXmlHttp();
		xhr.open("GET", URL + "stop_reading?r=" + Math.random(), true);
		URL = 0;

		xhr.send(null);
		console.log("stop_reading().Открыто ассинхронное XMLHttpRequest соединение. ");
		
		var timerId = setTimeout(function check_execution() {
			if (xhr.readyState == 4) {	console.log("stop_reading().Состояние XMLHttpRequest запроса - 4.");					
				if(xhr.status == 200) {	console.log("stop_reading().Получен статус соединения 200.");				
					xhr.abort();
					xhr = 0;
					console.log("stop_reading().XMLHttpRequest запрос закрыт следующая команда - return.");
					return;					
				}
			}
			timerId = setTimeout(check_execution, 10);
		}, 10);
		
		/*
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {				
				if(xhr.status == 200) {
					xhr.abort();
					xhr = 0;					
				}
			}
		};*/		
	}
}
	

function determination() {
  	URL = "http://" + document.getElementById("URL").value + "/";
  	var Serial_Port_Name = document.getElementById("Serial_Port_Name").value;
  	var Serial_Port_Speed = document.getElementById("Serial_Port_Speed").value;
  	var timeout = document.getElementById("timeout").value;

	var get_request = URL + "determination?Serial_Port_Name=" + escape(Serial_Port_Name) + "&Serial_Port_Speed=" + escape(Serial_Port_Speed) + "&timeout=" + escape(timeout) + "&r=" + Math.random();
		
  	var xhr = getXmlHttp();
	xhr.open("GET", get_request, true);
	  
	xhr.send(null);
	console.log("determination().Открыт ассинхронный XMLHttpRequest запрос. ");		
		
	var timerId = setTimeout(function check_execution() {
		if (xhr.readyState == 4) {	console.log("determination().Состояние XMLHttpRequest запроса - 4. ");				
			if(xhr.status == 200) {	console.log("determination().Получен статус соединения 200. ");
				xhr.abort();
				xhr = 0;
				console.log("determination().XMLHttpRequest запрос закрыт следующая команда - return. ");
				return;					
			}
		}
		timerId = setTimeout(check_execution, 10);
	}, 10);
			
	
	/*
	setTimeout(function() {
		xhr.abort();
		Revision();
	}, 200);*/		   		 	
}    

function getXmlHttp() {
  	var xmlhttp;
  	try {
  		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  	} 	catch (e) {
  		try {
  			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  		} catch (E) {
  			xmlhttp = false;
  		}
  	}
  	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
  		xmlhttp = new XMLHttpRequest();
	}
	console.log("Создан объект XMLHttpRequest.");
  	return xmlhttp;
}

/*Тестовый вывод и функция зачистки массива
    
function output(Array,dataDiv) {
  var index_value = 0;

	while(index_value < Array.length) {
	  dataDiv.innerHTML = Array[index_value];
	  index_value++;
	}
}


function clear_array(Array, max_size_array) {
  if(Array.length > max_size_array){
    Array.shift();
  }
}*/