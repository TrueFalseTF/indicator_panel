var express = require("express");
var SerialPort = require("serialport");
var Readline = require('parser-readline');

var app = express();

/*var captured = "";
function get_full_line_from_serial() {
    var part = ;
    if (part) {
        captured += part;
        parts = //Деление строки на два знаком конца строки
        if (/*Проверка колличества эллиментов в parts[]){
            capture = parts[1];
            return parts[0];
        }
    return undefined;
    }
}*/
var port = 0;
var parser = 0;

var Serial_Port_Name = false;
var Serial_Port_Speed = false;
var timeout = false;

app.get("/", function(req, res) {    
    setTimeout( function() {        
        if(Serial_Port_Name !== false && Serial_Port_Speed !== false && timeout !== false) {
            res.writeHead(200, {"Content-type": "text/event-stream", "Access-Control-Allow-Origin": "*"});
            console.log("Запуск механизма чтения COM-порта, сервер ответил - 200.");

            port = new SerialPort(Serial_Port_Name, {
                baudRate: Serial_Port_Speed
            }, function(err) {
                if (err) {
                    return console.log("Ошибка инициализации SerialPort: ", err.message);
                }
            });
        
            parser = port.pipe(new Readline());                   
            
            port.on("open", function() {    console.log("COM-порт открыт.");
                setTimeout(function() {
                    if (parser !== 0) { console.log("parser !== 0");
                        parser.on("data", function(data) {  console.log("data:" + data);                           
                            res.write("data:" + data);
                            res.write("\n\n");                           
                        });                        
                    } else {    console.log("parser == 0");}                            
                }, timeout);
            });   
    
            port.on('error', function(err) {
                console.log("Ошибка открытия COM-порта: ",err.message);
            });
        }
    }, 300);   
});

app.get("/stop_reading", function(req, res) {
    res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
    console.log("stop_reading.Отправлен заголовок 200. ");

    parser = 0;
    if (port !== 0) {
        port.close();
        port = 0;
        console.log("SerialPort деактевирован.");
    }

    Serial_Port_Name = false;
    Serial_Port_Speed = false;
    timeout = false;
    console.log("stop_reading.Прараметры serial сброшены. Запрос обработан."); 
    res.send();
});

app.get("/determination", function(req, res) {
    res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
    console.log(" determination.Отправлен заголовок 200.");

    if(req.query.Serial_Port_Name) {
        Serial_Port_Name = String(req.query.Serial_Port_Name);
        console.log("Serial_Port_Name установлен из get-запроса.");
    }
    if(req.query.Serial_Port_Speed) {
        Serial_Port_Speed = Number(req.query.Serial_Port_Speed);
        console.log("Serial_Port_Speed установлен из get-запроса.");
    }
    if(req.query.timeout) {
        timeout = Number(req.query.timeout);
        console.log("timeout установлен из get-запроса.");        
    }
    res.send();
    console.log("determination.Запрос обработан.");       
});

/*var captured = "";
function get_full_line_from_serial() {
    var part = ""; 
    console.log("get_full_line");    
    part = port.read();    
    if (part) {
        console.log("Part" + part);
        captured += part;
        parts = captured.split("", 2);
        if (parts.length == 2) {
            capture = parts[1];
            return parts[0];
        }    
    } 
    return null;    
    
}*/
console.log("Сервер открыт по TCP-порту 55505");
app.listen(55505);

/*Стрим
var mayReadShort = fs.createReadStream();

mayReadShort.on("date", function(date) {

})*/