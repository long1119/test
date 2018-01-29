var postData = {};
var flag;
var num = 0;
function GetRequest() {   
  var url = location.search; //获取url中"?"符后的字串 
  // var theRequest = new Object();   
  if (url.indexOf("?") != -1) {   
    //  var str = url.substr(1);
    var str = url.substr(url.indexOf("&"));   
     strs = str.split("&");
     strs = decodeURI(strs);    //解码
     strs = strs.split(",");
     for (var i=0;i<strs.length;i++){
       var user = strs[i].split("=");
      //  var pass = user[0]+':'+user[1];
      postData[user[0]] = user[1];
     }
  }   
  // return theRequest;   
}
GetRequest(); 
for(key in postData){
  if(postData[key]){
    flag = true;
  }
}  
var XHR=null;  
if (window.XMLHttpRequest) {  
    // 非IE内核  
    XHR = new XMLHttpRequest();  
} else if (window.ActiveXObject) {  
    // IE内核,这里早期IE的版本写法不同,具体可以查询下  
    XHR = new ActiveXObject("Microsoft.XMLHTTP");  
} else {  
    XHR = null;  
}
if(XHR&&flag){ 
    var token = window.sessionStorage.getItem("access_token");
    var url = "/bpd-proj/bpd/masterTimeSheetDate/visualization?"+"&_="+Number(new Date());
    if (token) {
        var realToken = token.substr(1, token.length - 2)
        url = url + "&accessToken=" + realToken;
    };
    // XHR.open("POST", "/bpd-proj/bpd/masterTimeSheetDate/visualization",true);
    XHR.open("POST",url,true); 
    XHR.setRequestHeader("Content-type","application/json");
    XHR.send(JSON.stringify(postData));
    XHR.onreadystatechange = function () {     //监听
        if (XHR.readyState == 4 && XHR.status == 200) {  
            // 这里可以对返回的内容做处理  
            // 一般会返回JSON或XML数据格式  
            // 主动释放,JS本身也会回收的
            resultData = eval('('+XHR.responseText+')');
            if(resultData.startDate != null){
              // init(resultData)
              drawTimeSheet(resultData);
              endDo();
            }
            XHR = null;  
        }  
    }; 
};


/* 全局变量 start  */
var resultData;
var end;
var start;
var width = 3000;
var height = 920;
var REST = 1;
var ld;
var newAxis;
var dy = 17;
/* 全局变量 end  */


// function init(resultData){
//   start = new Date(resultData.startDate).getTime();
//   end = new Date(resultData.endDate).getTime();
// }


function drawTimeSheet(data){
  drawPaper();
  drawLine();
  drawHline();
  var titleText = paper.text(700,30,data.projectName).attr({
    "font-size":"20px",
    "font-weight":"bold"
  });
  // var img = paper.image("../../assets/img/ProgrameManagement.png",width-180,0,175,50);
  if(data.lits != null){
    ld = document.getElementById("leftDown");
    ldw = document.getElementById("leftDownWrap");
    ld.style.border = "1px solid black";
    ld.style.fontSize = "8px";
    ld.style.fontWeight = "bold";
    ld.style.padding = "0.5rem";
    var fuck = -1;
    var axis = 0;
    var week;
    var rowNumber;
    var timeWidth;
    data.lits.forEach(function(elementData) {
      // elementData.planDate = elementData.planDate.split(" ")[0];
      if(elementData.configElementTypeId==null){
        fuck += 1;
        // var ww = 280+fuck%4*60;
        // var kk = Math.floor(fuck/4);
        // elementData.configDisplayPosition = 17+kk;
        var ww = 280+fuck%2*60;
        var kk = Math.floor(fuck/2);
        var hh = height - (kk+1)*50;
        elementData.configGraphicColor = 'yellow';
        elementData.ww = ww;
        elementData.hh = hh;
        drawDownFive1(elementData);
      }
      else{
        if(elementData.elementTypeName == "MRD"){
          ldw.style.display = "block";
          var span1 = document.createElement("span");
          span1.style.display = "inline-block";
          span1.style.width = "140px";
          span1.innerHTML = elementData.elementName;
          var span2 = document.createElement("span");
          span2.style.display = "inline-block";
          span2.style.width = "40px";
          span2.innerHTML = elementData.week;
          var span3 = document.createElement("span");
          span3.style.display = "inline-block";
          span3.style.width = "30px";
          span3.innerHTML = elementData.planDate;
          var span4 = document.createElement("br");
          ld.appendChild(span1);
          ld.appendChild(span2);
          ld.appendChild(span3);
          ld.appendChild(span4);
        }
        else{
          if(elementData.configDisplayPosition>0){
            svgData[elementData.configDisplayPosition-1].push(elementData);
            var D_value = 0;
            if(week == null){
              week = elementData.week;
              rowNumber = elementData.configDisplayPosition;
              timeWidth = elementData.configWidth;
            }
            else{
              D_value = elementData.week - week;
              week = elementData.week;
              if(elementData.configDisplayPosition == rowNumber){
                axis = axis+timeWidth + D_value*2;
              }
              else{
                var big = svgData[elementData.configDisplayPosition-1].length -1;
                if(big>0){
                  var ko = svgData[elementData.configDisplayPosition-1][big].week-svgData[elementData.configDisplayPosition-1][big-1].week;
                  if(ko<11){
                    var ok = axis - svgData[elementData.configDisplayPosition-1][big-1].axis;
                    if(ok>timeWidth){
                      axis = axis + D_value*2;
                    }
                    else{
                      axis = axis + timeWidth + D_value;
                    }
                  }
                  else{
                    axis = axis + D_value*5;
                  }
                }
                else{
                  axis = axis + D_value*5;
                }
                // if(D_value<10){
                //   axis = axis + D_value*(15-D_value);
                // }
                // else{
                //   axis = axis + D_value*4;
                // }
                rowNumber = elementData.configDisplayPosition;
                timeWidth = elementData.configWidth;
              }
              week = elementData.week;
            }
            var small = svgData[elementData.configDisplayPosition-1].length - 1;
            svgData[elementData.configDisplayPosition-1][small].axis = axis;   
            newAxis = axis;
            drawElement(elementData);
          }
        }
      }
    });
    width = newAxis+60;
    if(width<1300){
      width = 1300;
    }
    if(data.approvalDate != null){
      var titleText1 = paper.text(width-300,30,"Version Date: "+data.approvalDate).attr({
        "text-anchor":'middle'
      })
    }
    var img = paper.image("../../assets/img/ProgrameManagement.png",width-180,0,175,50);
    paper.setSize(width,height);
    var ld_height = ld.offsetHeight;
    ldw.style.bottom = ld_height+15+'px';
    if(ld_height>350){
      ld.style.offsetWidth += 17+'px';
    }
  };
  drawHline1();
}
var svgData = new Array();
for(var n=0;n<17;n++){
  svgData[n] = new Array();
}
function drawLine(){        //画竖线
  var len = Math.ceil(width/50);
  for(var i=0;i<len;i++){
    var path = 'M'+50*i+','+54+'V'+(50*i+height);
    var line = paper.path(path).attr("stroke-dasharray","-");
  }
}
function drawHline(){
  var path1 = 'M'+0+','+50+'H'+width;     //画横线
  var path2 = 'M'+0+','+54+'H'+width;
  var path3 = 'M'+0+','+58+'H'+width;
  var line1 = paper.path(path1).attr({
    "stroke":"blue",
  });
  var line2 = paper.path(path2).attr({
    "stroke":"red",
  });
  var line3 = paper.path(path3).attr({
    "stroke":"blue"
  })
}
function drawHline1(){
  var path1 = 'M'+0+','+(height-8)+'H'+width;     //画横线
  var path2 = 'M'+0+','+(height-4)+'H'+width;
  var path3 = 'M'+0+','+height+'H'+width;
  var line1 = paper.path(path1).attr({
    "stroke":"blue",
  });
  var line2 = paper.path(path2).attr({
    "stroke":"red",
  });
  var line3 = paper.path(path3).attr({
    "stroke":"blue"
  })
}
function drawDownFive1(element){
  var x = Number(element.ww);
  // var y = Number(element.configDisplayPosition*80);
  var y = Number(element.hh);
  var num = 36;
  // var path = 'M'+x+','+y+'L'+(x+num)+','+y+'L'+(x+num)+','+(y+25)+'L'+(x+num/2)+','+(y+40)+'L'+x+','+(y+25)+'Z';
  var path = 'M'+x+','+(y+10)+'L'+(x+num/2)+','+y+'L'+(x+num)+','+(y+10)+'L'+(x+num)+','+(y+30)+'L'+x+','+(y+30)+'Z';  
  var polygon = paper.path(path);
  polygon.attr({
    "fill": element.configGraphicColor,
    "stroke-width": 2,
    "stroke": '#0070C0',
    "cursor": 'pointer'
  });
  polygon.mouseover(function(){
    polygon.animate({"transform":'s1.5'},500,"elastic");
  });
  polygon.mouseout(function(){
    polygon.animate({"transform":'s1'},500);
  })
  var tip1 = paper.text(x+num/2,y-5, element.planDate).attr("font-size","8");
  var svg = document.getElementById("mySvg");
  svg.style.fontFamily = 'Arial';
  var titleDiv = document.createElement("div");
  if(element.elementName.length>4){
    titleDiv.style.fontSize = '7px';
  }
  else{
    titleDiv.style.fontSize = '10px';
  };
  titleDiv.innerHTML = element.elementName.replace(/\s+/,'\n');
  titleDiv.style.position = "absolute";
  titleDiv.style.left = x+'px';
  titleDiv.style.top = y+10+'px';
  titleDiv.style.width = num+'px';
  titleDiv.style.textAlign = "center";
  svg.appendChild(titleDiv);
  var tip3 = paper.text(x+num/2,y+25, element.week).attr({
    "font-size":8,
  });
}

var paper;
function drawPaper(){
  paper = Raphael("mySvg",width,height);
}




function drawElement(element){
  if(element.configWidth==null||element.configWidth==0){
    element.configWidth = 44;
  }
  if(0 == element.configGraphicType){
    drawDownFive(element);
  }
  else if(1 == element.configGraphicType){
    drawUpFive(element);
  }
  else if(2 == element.configGraphicType){
    drawCircle(element);
  }
  else if(3 == element.configGraphicType){
    drawDiamond(element);
  }
  else if(4 == element.configGraphicType){
    drawRect(element);
  }
}


function drawRect(element){
  var num = Number(element.configWidth/2);
  var y_axis = element.configDisplayPosition * 50+dy;
  var rect = paper.rect(
    newAxis+10,y_axis,element.configWidth,20).attr({
        "fill": element.configGraphicColor,
        "stroke-width": element.configBorder,
        "cursor": 'pointer'      
  });
  rect.mouseover(function(){
    rect.animate({"transform":'s1.5'},500,"elastic");
  });
  rect.mouseout(function(){
    rect.animate({"transform":'s1'},500);
  })
  var tip1 = paper.text(newAxis+num+10,y_axis-5,element.planDate).attr("font-size","8");
  var svg = document.getElementById("mySvg");
  var titleDiv = document.createElement("div");
  if(element.elementName.length>4){
    titleDiv.style.fontSize = '7px';
  }
  else{
    titleDiv.style.fontSize = '10px';
  };
  titleDiv.innerHTML = element.elementName.replace(/\s+/,'\n');
  titleDiv.style.position = "absolute";
  titleDiv.style.left = newAxis+10+'px';
  titleDiv.style.top = y_axis+4+'px';
  titleDiv.style.width = element.configWidth+'px';
  titleDiv.style.textAlign = "center";
  if(element.configGraphicColor == "purple"||element.configGraphicColor=="#404040"||element.configGraphicColor=="red"||element.configGraphicColor=="#3365FB"||element.configGraphicColor=="#00B2F7"||element.configGraphicColor=="#A6A6A6"){
    titleDiv.style.color = "#fff";
  }
  svg.appendChild(titleDiv);
  var tip3 = paper.text(newAxis+num+10,y_axis+26, element.week).attr("font-size","8");
}
function drawCircle(element){
  var num = Number(element.configWidth/2);
  var y_axis = element.configDisplayPosition*50 + dy;
  var circle = paper.circle(newAxis+num+10,y_axis+num,num);
  circle.attr({
    "fill": element.configGraphicColor,
    "stroke-width": element.configBorder,
    "cursor": 'pointer'  
  })
  circle.mouseover(function(){
    circle.animate({"transform":'s1.5'},500,"elastic");
  });
  circle.mouseout(function(){
    circle.animate({"transform":'s1'},500);
  })
  var tip1 = paper.text(newAxis+num+10,y_axis-5, element.planDate).attr("font-size","8");
  var svg = document.getElementById("mySvg");
  var titleDiv = document.createElement("div");
  if(element.elementName.length>4){
    titleDiv.style.fontSize = '7px';
  }
  else{
    titleDiv.style.fontSize = '10px';
  }
  titleDiv.innerHTML = element.elementName.replace(/\s+/,'\n');
  titleDiv.style.position = "absolute";
  titleDiv.style.left = newAxis+10+'px';
  titleDiv.style.top = y_axis+10+'px';
  titleDiv.style.width = num*2+'px';
  titleDiv.style.textAlign = "center";
  svg.appendChild(titleDiv);
  var tip3 = paper.text(newAxis+num+10,y_axis+num*2-7, element.week).attr("font-size","8");
}
 function drawUpFive(element){
    var x = Number(newAxis+10);
    var y = Number(element.configDisplayPosition*50)+dy;
    var num = Number(element.configWidth);
    var path = 'M'+x+','+(y+10)+'L'+(x+num/2)+','+y+'L'+(x+num)+','+(y+10)+'L'+(x+num)+','+(y+30)+'L'+x+','+(y+30)+'Z';
    var polygon = paper.path(path);
    polygon.attr({
      "fill": element.configGraphicColor,
      "stroke-width": element.configBorder,
      "cursor": 'pointer' 
    })
    polygon.mouseover(function(){
      polygon.animate({"transform":'s1.5'},500,"elastic");
    });
    polygon.mouseout(function(){
      polygon.animate({"transform":'s1'},500);
    })
    var tip1 = paper.text(x+num/2,y-5,element.planDate).attr("font-size","8");
    var tip3 = paper.text(x+num/2,y+25,element.week).attr("font-size","8");
    var svg = document.getElementById("mySvg");
    var titleDiv = document.createElement("div");
    if(element.elementName.length>4){
      titleDiv.style.fontSize = '7px';
    }
    else{
      titleDiv.style.fontSize = '10px';
    }
    titleDiv.innerHTML = element.elementName.replace(/\s+/,'\n');
    titleDiv.style.position = "absolute";
    titleDiv.style.left = x+'px';
    titleDiv.style.top = y+10+'px';
    titleDiv.style.width = num+'px';
    titleDiv.style.textAlign = "center";
    if(element.configGraphicColor == "purple"||element.configGraphicColor=="#404040"||element.configGraphicColor=="red"||element.configGraphicColor=="#3365FB"||element.configGraphicColor=="#00B2F7"){
      titleDiv.style.color = '#fff';
      tip3.attr({
        "fill":"#fff"
      });
    }
    svg.appendChild(titleDiv);
 }
 
 function drawDownFive(element){
   var x = Number(newAxis+10);
   var y = Number(element.configDisplayPosition*50)+dy;
   var num = Number(element.configWidth);
   var path = 'M'+x+','+y+'L'+(x+num)+','+y+'L'+(x+num)+','+(y+20)+'L'+(x+num/2)+','+(y+30)+'L'+x+','+(y+20)+'Z';
   var polygon = paper.path(path);
   polygon.attr({
     "fill": element.configGraphicColor,
     "stroke-width": element.configBorder,
     "cursor": 'pointer' 
   });
   if(element.configGraphicColor=='yellow'){
     polygon.attr('stroke','red');
   }
   polygon.mouseover(function(){
    polygon.animate({"transform":'s1.5'},500,"elastic");
  });
  polygon.mouseout(function(){
    polygon.animate({"transform":'s1'},500);
  })
  var tip1 = paper.text(x+num/2,y-5, element.planDate).attr("font-size","8");
  var tip3 = paper.text(x+num/2,y+23, element.week).attr("font-size","8");
  var svg = document.getElementById("mySvg");
  var titleDiv = document.createElement("div");
  if(element.elementName.length>4){
    titleDiv.style.fontSize = '7px';
  }
  else{
    titleDiv.style.fontSize = '10px';
  }
  titleDiv.innerHTML = element.elementName.replace(/\s+/,'\n');
  if(element.configGraphicColor == "purple"||element.configGraphicColor=="#404040"||element.configGraphicColor=="red"||element.configGraphicColor=="#3365FB"||element.configGraphicColor=="#00B2F7"){
    titleDiv.style.color = '#fff';
    tip3.attr("fill","#fff");
  }
  else if(element.configGraphicColor=='yellow'){
    titleDiv.style.color = 'red';
    tip3.attr("fill","red");
  }
  titleDiv.style.position = "absolute";
  titleDiv.style.left = x+'px';
  titleDiv.style.top = y+5+'px';
  titleDiv.style.width = num+'px';
  titleDiv.style.textAlign = "center";
  svg.appendChild(titleDiv);
 }
 function drawDiamond(element){
   var x = Number(newAxis+10);
   var y = Number(element.configDisplayPosition*50)+dy;
   var num = Number(element.configWidth);
   var path = 'M'+(x+num/2)+','+y+'L'+(x+num)+','+(y+num/2)+'L'+(x+num/2)+','+(y+num)+'L'+x+','+(y+num/2)+'Z';
   var polygon = paper.path(path);
   polygon.attr({
     "fill": element.configGraphicColor,
     "stroke-width": element.configBorder,
     "cursor": 'pointer'
   });
   polygon.mouseover(function(){
    polygon.animate({"transform":'s1.5'},500,"elastic");
  });
  polygon.mouseout(function(){
    polygon.animate({"transform":'s1'},500);
  })
  var tip1 = paper.text(x+num/2,y-5, element.planDate).attr("font-size","8");
  var tip3 = paper.text(x+num/2,y+num-5, element.week).attr("font-size","8");
  var svg = document.getElementById("mySvg");
  var titleDiv = document.createElement("div");
  if(element.elementName.length>4){
    titleDiv.style.fontSize = '7px';
  }
  else{
    titleDiv.style.fontSize = '10px';
  }
  titleDiv.innerHTML = element.elementName.replace(/\s+/,'\n');
  if(element.configGraphicColor == "purple"||element.configGraphicColor=="#404040"||element.configGraphicColor=="red"||element.configGraphicColor=="#3365FB"||element.configGraphicColor=="#00B2F7"){
    titleDiv.style.color = '#fff';
    tip3.attr('fill','#fff');
  }
  titleDiv.style.position = "absolute";
  titleDiv.style.left = x+'px';
  titleDiv.style.top = y+10+'px';
  titleDiv.style.width = num-10+'px';
  titleDiv.style.textAlign = "center";
  svg.appendChild(titleDiv);
 }

function endDo(){
  var tspan = document.querySelectorAll("tspan");
  for(var j=0,len=tspan.length;j<len;j++){
    tspan[j].setAttribute("dy","2.5");
  }
}
