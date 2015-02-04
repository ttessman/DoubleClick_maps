var container, content, bgExit, logo, logoBtn, txtPatient, cta, copyHolder, copy, txtMemberFDIC, sliderCoverWidth, slider, sliderOffset, sliderSteps, sliderArrow, arrowTimer,slideDemo,sliderCover,sliderHandle, arrowInterval, currentFrame, totalFrames, FifthThirdSlider, firstRun, arrowRunning, blockClickOut;
var imgArray = ['copy2.png','copy3.png','copy4.png','copy5.png','copy6.png','copy7.png','copy8.png','copy9.png']
var imgPreLoad = new Array();

var API_KEY= "AIzaSyC0o1-AKguhYBUzk-NbVbUVDmV6Y8Obyao"//"AIzaSyBHoUei5yPLb4dCbLmqtwvHtbhS5GeKQks"
var url = "http://local-stage.allstateonline.com/ajax/getagentsp";  
var data = {id:162,lat:40.8789999,long:-74.1181758};  
var localAgents;

if (Enabler.isInitialized()) {init()} else {Enabler.addEventListener(studio.events.StudioEvent.INIT, init)}

function init(){
	if(Enabler.isPageLoaded()){politeInit()}else{Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit)} 
}
		
function politeInit(){	
	loadAd();
	if (Enabler.isVisible()) {adVisibilityHandler()} else {Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisibilityHandler)}
}
	
function adVisibilityHandler() {
	startAnimation();
} 
	
loadAd = function(){
    init();
	//addListeners();
}

function init() {
    console.log('getting JSONP');
    J50Npi.getJSON(url, data, callback);
}

var callback = function(data){ 
    console.log(data.Agents)
    localAgents = data.Agents;
    loadMaps();                       
};

var J50Npi = {  
    currentScript: null,  
    getJSON: function(url, data, callback) {
      var src = url + (url.indexOf("?")+1 ? "&" : "?");
      var head = document.getElementsByTagName("head")[0];
      var newScript = document.createElement("script");
      var params = [];
      var param_name = ""

      this.success = callback;

      data["callback"] = "J50Npi.success";
      for(param_name in data){  
          params.push(param_name + "=" + encodeURIComponent(data[param_name]));  
      }
      src += params.join("&")

      newScript.type = "text/javascript";  
      newScript.src = src;

      if(this.currentScript) head.removeChild(currentScript);
      head.appendChild(newScript); 
    },
    success: null
}; 

function loadMaps() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key='+ API_KEY +'&' +
      'callback=initialize';
  document.body.appendChild(script);
}

function initialize() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'infobox.min.js'
  script.onload = buildMaps;
  document.body.appendChild(script)
}

var buildMaps = function() {
   console.log(buildMaps);
    container = document.getElementById('container_dc');	
    
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(40.879581, -74.08463)
    };
    var bounds = new google.maps.LatLngBounds();
    
    var map = new google.maps.Map(document.getElementById('content_dc'),
      mapOptions);
   
    // Initialise the inforWindow
        
    var infoWindow
    var infoWindowContent
    
    
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    var infoBoxUI = new InfoBox({
                isHidden: !1,
                disableAutoPan: !1,
                pixelOffset: new google.maps.Size(0, -265),
                closeBoxMargin: "0",
                closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
                infoBoxClearance: new google.maps.Size(1, 1)
            });
    
    var infoWindowContent = []
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < localAgents.length; i++ ) {
       
        infoWindowContent.push('<div class="infoBoxWrapper">' +
                '<div class="agent-details group">' +     
                    '<h3>'+ localAgents[i].FullName +'</h3>' +
                    '<h4></h4>'+
                    '<p>' + localAgents[i].Address + '<br>' + localAgents[i].CityStateZip + '<br><a href="tel:' + localAgents[i].PhoneNumber + '" class="tel gmap">' + localAgents[i].PhoneNumber + '</a><span class="license gmap"></span></p>' +
                    '<a class="email gmap" href="mailto:'+ localAgents[i].EmailAddress +'">Email</a>' +  
                    '<a target="_blank" href="http://maps.google.com/maps?daddr" class="directions gmap" data-end="' + localAgents[i].Address +','+ localAgents[i].CityStateZip +'" id="getDir">Directions</a>'+    
                    '<a href="' + localAgents[i].WebsiteLink + '?intcid=ILC-CFB-140815:Agent:AWS" class="agent-website gmap" target="_blank">VISIT MY WEBSITE</a>' +  
                '</div>'+   
            '</div>')
        
        var position = new google.maps.LatLng(localAgents[i].Latitude, localAgents[i].Longitude);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: 'map.icon.marker.png'//,
           // title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                
                //infoWindow.setContent(infoWindowContent[i]);
                //infoWindow.open(map, marker);
                
                infoBoxUI.setContent(infoWindowContent[i]);
                infoBoxUI.open(map, marker);
                
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }
    
    container.style.visibility ="visible"
    
    try {
        animate({
            delay: 5,
            duration: 450,
            delta: makeEaseOut(linear), 
            step: function(delta) {
                container.style.opacity = roundMath(1*delta);
            }
        })
    }catch(err){ container.style.opacity=1;
    }
    
     console.log('added maps')
}

function roundMath(num) {
    return Math.ceil(num * 100) / 100;
}

/*function preload(){
    for(i=0;i < imgArray.length; i++){
        imgPreLoad[i] = document.createElement('img');
        imgPreLoad[i].src = imgArray[i];
    }
}
*/
function startAnimation(){
//  arrowInterval = setInterval(function(){
//        AniArrow(sliderArrow); 
//        arrowRunning = true;}, 1005);
//  setTimeout(function(){
//    clearArrow();
//  }, 1005*14);
    
}



/*
function clearArrow(){
    try {
    clearInterval(arrowInterval);
    }catch(err){
    }
    arrowRunning = false;
    sliderArrow.style.display = 'none';
}

function AniArrow(targetElement){
  targetElement.style.opacity = 0;
  targetElement.style.left = 0;
  
   var arrowInTween = new Tweenable();
    arrowInTween.tween({
        from: { opacity: 0, x: 0},
        to:   { opacity: 1, x: 25},
        duration: 250,
        easing: {
            opacity: 'easeOutSine',
            x: 'easeInQuad'
        },
        step: function (state) {
            targetElement.style.opacity = state.opacity;   
            targetElement.style.left = state.x + "px";
        }
    });
    
  setTimeout(function(){
        var arrowOpacityOutTween = new Tweenable();
        arrowOpacityOutTween.tween({
            from: { opacity: 1},
            to:   { opacity: 0},
            duration: 250,
            easing: 'easeInSine',
            step: function (state) {
                targetElement.style.opacity = state.opacity;         
            }
        });
  }, 750);
}

function ArrowAniStart(){
        sliderArrow.style.display = 'inline';
        sliderArrow.style.webkitAnimationName = "";
        sliderArrow.style.animationName = "";
        sliderArrow.className = '';
    
        setTimeout(function(){
            sliderArrow.offsetWidth = sliderArrow.offsetWidth;
            sliderArrow.className = 'ArrowAni';
            sliderArrow.style.animationName = "myanimation";
            sliderArrow.style.webkitAnimationName = "myanimation";
        },5);
}
	
//Add Event Listeners
addListeners = function() {
	logoBtn.addEventListener('click', logoExitHandler, false);
    cta.addEventListener('click', ctaExitHandler, false);
    FifthThirdSlider = new Dragdealer('slider', {
        left: sliderOffset,
        steps: sliderSteps,
        snap: false,
        callback: function(x,y) {
            if (firstRun > 2){
                 Enabler.counter('slider_total', true);
            }
        },
        
        animationCallback: function(x, y) {
            var currentStep= this.getStep()[0];
            if(firstRun == 1){
                if(arrowRunning == true || sliderArrow.style.display != 'none'){
                    clearArrow();
                }
            }else if (firstRun == 2){
                 Enabler.counter('slider_unique');
            } 
                
            firstRun++
            
            copy.setAttribute("src", imgArray[currentStep - 1]);
           
            if(x>=0.7){
                sliderCover.style.width= Math.round(x * sliderCoverWidth) + "px";
            }else{
                sliderCover.style.width= Math.round(x * sliderCoverWidth) + sliderOffset + "px";
            }
        }
    });  
    
    if(isMobile()){
        FifthThirdSlider.disable();
        bgExit.addEventListener('touchstart', touchStartLBI,false);  
        bgExit.style.height = "100%";
    } else {
        bgExit.addEventListener('click', bgExitHandler, false); 
        bgExit.style.height = "200px";
        //container.addEventListener('mouseenter', mouseenterLBI, false);
        container.addEventListener('mouseleave', mouseleaveLBI, false);
    }
    
    container.style.visibility ="visible";
    
    try {
        animate({
            delay: 5,
            duration: 450,
            delta: makeEaseOut(linear), 
            step: function(delta) {
                container.style.opacity = roundMath(1*delta);
            }
        })
    }catch(err){ container.style.opacity=1;
    }
    
}

//mouseenterLBI = function(e) {
	//FifthThirdSlider.enable();
    //console.log("enable it" + console.log(FifthThirdSlider))
//}

mouseleaveLBI = function(e) {
    try {
        //not sure this correct
        FifthThirdSlider.dragging = false;
    }catch(err){
    }
}

bgExitHandler = function(e) {
	Enabler.exit('background_exit');
}

ctaExitHandler = function(e) {
	Enabler.exit('cta_exit');
}

logoExitHandler = function(e) {
	Enabler.exit('logo_exit');
}

var touchStarted = false, // detect if a touch event is sarted
    currX = 0,
    currY = 0,
    cachedX = 0,
    cachedY = 0;

var getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    };

touchStartLBI = function(e) {   
    start_x = e.changedTouches[0].pageX;
    bgExit.addEventListener('touchmove', touchMoveLBI,false);  
    bgExit.addEventListener('touchend', touchEndLBI,false);  
    e.preventDefault()		
    
    var pointer = getPointerEvent(e);
    // caching the current x
    cachedX = currX = pointer.pageX;
    // caching the current y
    cachedY = currY = pointer.pageY;
    // a touch event is detected      
    touchStarted = true;
    
    setTimeout(function (){
        if ((cachedX === currX) && !touchStarted && (cachedY === currY)) {
            // Here you get the Tap event
            //console.log('tap ');
            bgExitHandler(e);
        }
    },200);
}

touchMoveLBI = function(e) {  
     var dx = e.changedTouches[0].pageX - start_x;
     var abs_dx = Math.abs(dx);
     if(abs_dx>30) {
        checkSliderPos(dx/abs_dx);
         start_x = e.changedTouches[0].pageX;
     }
}

touchEndLBI = function(e) {   
    touchStarted = false;
    bgExit.removeEventListener('touchmove', touchMoveLBI);  
    bgExit.removeEventListener('touchend', touchEndLBI);  
    e.preventDefault()
} 

function checkSliderPos(dir) {
    currentStep = FifthThirdSlider.getStep()
    if((currentStep[0] >= 2 && currentStep[0] <= 8)||(currentStep[0] == 9 && dir == -1)||(currentStep[0] == 1 && dir == 1 )){
       updateSlider(dir);
    }
}
    
function updateSlider(dir){ 
    currentFrame = currentStep[0] + dir;
    FifthThirdSlider.setStep(currentFrame, currentStep[1], true);  
}

function isMobile(){
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent||navigator.vendor||window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4)))
}*/