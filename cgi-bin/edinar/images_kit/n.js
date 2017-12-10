var Maxtaille =19; // taille des tableaux de travail
var TabSel= new Array(Maxtaille); // tableau des selections 
var TabImg = new Array(Maxtaille); // tableau des images
var TabVal = new Array(Maxtaille); // tableau des valeurs 
var TabSrc = new Array(9); // tableau des sources des iamges
var browser = new Browser();
var oldnav;

var dragObj = new Object();
dragObj.zIndex = 0; 

if (!window.ctx) ctx = new Object;

if (ctx.nav) MpInitOnglets();

function MpInitOnglets() {
	window.gtNavImg = new Array();
	for (var i=1;i<ctx.nav.length;i++) {
		gtNavImg[i] = new Image;
		gtNavImg[i].src = ctx.nav[i];
	}
}
function MpOnglet(i) {
	var j, img, src;
	if (!ctx.nav || !document.images) return;
	j = ctx.onglet; ctx.onglet=0;
	MpSwap(j); MpSwap(i);
	ctx.onglet=i;
}	
function MpSwap(i) {
	var img, src;
	if (!i || !ctx.nav || !document.images || i==ctx.onglet) return;
	img = document.images["rub_"+i];
	if (img) {src=img.src; img.src=ctx.nav[i]; ctx.nav[i]=src;}
}
function MpFocus(field, sText, bIn) {
	if (bIn) {
		if (field.value == sText) field.value = '';
		field.select();
	}
	else if (!bIn && field.value == '') field.value = sText;
}
// affichage nb d'elements de la selection
function MpSel() {
	var n=MpCookGet("SEL");
	if (!n) n = "0";
	document.write(n);
}
// acces a la recherche
function MpRecherche(fEnvoi,s) {
	var m=fEnvoi.mot_clef.value;
	if (m == s || m == '') return false;
	return true;
}
// lecture d'un cookie
function MpCookGet(sCook) {
	var sc = document.cookie;
	var i = sc.indexOf(sCook+"=");
	if (i < 0) return null;
	i += sCook.length+1;
	j = sc.indexOf(";",i);
	if (j < 0) j = sc.length
	return unescape(sc.substring(i,j)); 
}
// ecriture d'un cookie
function MpCookSet(sCook,sVal, dDfv) {
	var d = (dDfv) ? '; expires='+dDfv.toGMTString() : '';
	var p = location.pathname;
	var i = p.indexOf('/portail');
	if (i > 0) p = p.substr(0,i); else p='/';
	document.cookie = sCook+'='+escape(sVal)+'; path='+p+d;
}

// ecriture d'un cookie clavier
function MpCookSetClavier(name,value,days) {
     var expire = new Date ();
     expire.setTime (expire.getTime() + (24 * 60 * 60 * 1000) * days);
     document.cookie = name + "=" + escape(value) + "; expires=" +expire.toGMTString(); 

}	

function MpBadInit(f) {
	var mc = ctx.bad_mc;
	var t = ctx.bad_etab;
	var index=0;
	var j = 1;
	for (var i = 0;	i < t.length-1; i+=2) {
		// f.mois.options[j] = new Option(t[i+1],'1'+t[i].toString()+'5');
		if (mc == t[i]) index=j;
		j++;
		}
	f.mois.selectedIndex=index;
	f.mois.blur();
	document.forms.f_bad.n_carte.focus();
}		



function MpBadInitEDIN(f) {
        var mc = ctx.bad_mc;
        var t = ctx.bad_etab;
        var index=0;
        var j = 1;
        for (var i = 0; i < t.length-1; i+=2) {
                if (mc == t[i]) index=j;
                j++;
                }
        document.forms.f_bad.n_carte.focus();
}



function MpBadSelect(s) {
	var i=s.selectedIndex;
	var loc=(parent) ? parent.location : location;
	if (i > 0) {
			// alimentation cookie client
			var d = new Date();
			d.setYear(d.getYear()+1);
			MpCookSet("RBCLIENT", "oui", d) 
		var url=ctx.bad_urlprec;
		url += (url.search(/\?/) >= 0) ? "&mc=":"?mc=";
		loc.replace(url + s.options[i].value.substr(1,3));
	}
}
// acces bad
function MpBadVerif(f,s) {

	if (oldnav == 0 && CookClavier != '0'){
		return false;
	}

	else {


/*
		if (f.mois.selectedIndex != null && f.mois.selectedIndex <= 0) {
			alert("Veuillez s\u00e9lectionner votre mois de validite");
			f.mois.focus();
			return false;
		}

		if (f.annee.selectedIndex != null && f.annee.selectedIndex <= 0) {
			alert("Veuillez s\u00e9lectionner votre annee de validite");
			f.annee.focus();
			return false;
		}
	
*/



     	if (f.n_carte.value == '') {
			alert("Veuillez saisir votre num\u00e9ro de carte");
			f.n_carte.focus();
			return false;
		}



 if (f.n_carte.value == null) {
                        alert("Veuillez saisir votre num\u00e9ro de carte");
                        f.n_carte.focus();
                        return false;
                }






		if (f.n_carte.value.length > 16) {
			alert("Num\u00e9ro de carte est incorrect ");
			f.n_carte.focus();
			return false;
		}
		if (f.c_conf.value == '') {
			alert("Veuillez saisir votre code confidentiel");
			f.c_conf.focus();
			return false;
		}
		f.clavier.value=CookClavier;
		f.action=ctx.bad_urlpart; 
		if (ctx.bad_typ == 3) {
			if (f.n_carte.value.length == 16) f.action=ctx.bad_urlpart;	
		}
	
		var d = new Date();
		d.setYear(d.getYear()+1);
	
		return true;
	}
}

// acces bad via le clavier
function MpBadVerifClavier(f,s) {

	if (f.c_conf.value == '') {
		alert("Veuillez saisir votre code confidentiel");
		return false;
	}
	f.action=ctx.bad_urlpart;
	if (ctx.bad_typ == 3) {
		if (f.n_carte.value.length == 16) f.action=ctx.bad_urlpart;	
	}
	var d = new Date();
	d.setYear(d.getYear()+1);
	
	return true;
	
}

function chImg(img_name,ceEtat)
{
  if (document.layers)
  {
    document.images[img_name].src=document.mesImages2.document.images[img_name + ceEtat+"_bi"].src;
  }
  else
  {
    document.images[img_name].src=document.images[img_name + ceEtat+"_bi"].src;
  }
}


function IniTotem()
{
	oldnav = 0;
	
	// recherche du navigateur
	if (browser.isMSIE){
		if (browser.version > 5){
			oldnav = 0;
		}
		else{
			oldnav = 1;
		}	
	}
	if (browser.isNetscape){
		if (browser.os == "Mac" && browser.version > 5){
			oldnav = 0;
		}
		else {
			if (browser.os == "Windows" && browser.version > 5){
				oldnav = 0;
			}
			else {
				oldnav = 1;
			}
		}
		 
	}
	if (browser.isOpera){
		if (browser.os == "Mac"){
			oldnav = 1;
		}
		else {
			if (browser.version >= 8){
				oldnav = 0;
			}
			else{
				oldnav = 1;
			}
		}	
	}
	
	if (browser.isMozilla){
		oldnav = 1;
	}
	
	if (browser.isFirefox){
		oldnav = 0;
	}
	
	if (browser.isSafari){
		oldnav = 1;
	}
	
	
	// affichage suivant navigateur compatible DOM
	if (oldnav==0 && CookClavier != '0'){
		document.getElementById("oldnavcadenas").style.visibility = "hidden";
		document.getElementById("oldnavcode").style.visibility = "hidden";	
	}
	else {
		document.getElementById("oldnavcadenas").style.visibility = "visible";
		document.getElementById("oldnavcode").style.visibility = "visible";
	}
}

/* fonction d'init des différents tableaux */
function IniTab()
{
	for(var j=0; j<=Maxtaille; j++)
	{
		TabSel[j]="N";
		TabImg[j]="/images_kit/A.gif";
		TabVal[j]="10";
	}
	TabSrc[0] = "/images_kit/n0.gif";
	TabSrc[1] = "/images_kit/n1.gif";
	TabSrc[2] = "/images_kit/n2.gif";
	TabSrc[3] = "/images_kit/n3.gif";
	TabSrc[4] = "/images_kit/n4.gif";
	TabSrc[5] = "/images_kit/n5.gif";
	TabSrc[6] = "/images_kit/n6.gif";
	TabSrc[7] = "/images_kit/n7.gif";
	TabSrc[8] = "/images_kit/n8.gif";
	TabSrc[9] = "/images_kit/n9.gif";
}

/* fonction de choix des cases utilisés pour le clavier*/
function RandCase()
{
	var FinCase=0;
	while (FinCase<10)
	{
		var Indice= Math.floor(Math.random() * Maxtaille);
		
		if (TabSel[Indice] == "N")
		{
			TabSel[Indice] = "O";
			FinCase++;
		}
	}
}

/*fonction d'alimentation des tableaux */
function AlimTab()
{
	var l=0;
	for (var k=0; k<=Maxtaille; k++)
	{
		if (TabSel[k]=="O")
		{
			TabImg[k] = TabSrc[l];
			TabVal[k] = l;
			l++;
		}
	}
}

/* fonction qui permet d'effacer la mot de passe saisie */
function Corriger()
{
    document.f_badClavier.c_conf.value = "";
}

/* fonction qui alimente le mot de passe en fonction des touches selectionnées */
function AlimCode(iValeur)
{
   if (TabVal[iValeur]<10)
   {  
     document.f_badClavier.c_conf.value = document.f_badClavier.c_conf.value + TabVal[iValeur];
   }
}

/* fonction de chargement du clavier */
function LoadScr()
{
	document.f_badClavier.case0.src=TabImg[0];
	document.f_badClavier.case1.src=TabImg[1];
	document.f_badClavier.case2.src=TabImg[2];
	document.f_badClavier.case3.src=TabImg[3];
	document.f_badClavier.case4.src=TabImg[4];
	document.f_badClavier.case5.src=TabImg[5];
	document.f_badClavier.case6.src=TabImg[6];
	document.f_badClavier.case7.src=TabImg[7];
	document.f_badClavier.case8.src=TabImg[8];
	document.f_badClavier.case9.src=TabImg[9];
	document.f_badClavier.case10.src=TabImg[10];
	document.f_badClavier.case11.src=TabImg[11];
	document.f_badClavier.case12.src=TabImg[12];
	document.f_badClavier.case13.src=TabImg[13];
	document.f_badClavier.case14.src=TabImg[14];
	document.f_badClavier.case15.src=TabImg[15];
	document.f_badClavier.case16.src=TabImg[16];
	document.f_badClavier.case17.src=TabImg[17];
	document.f_badClavier.case18.src=TabImg[18];
	document.f_badClavier.case19.src=TabImg[19];
}


/* affiche le clavier */
function AfficheClavier()
{
	 if (document.f_bad.n_carte.value == '' || document.f_bad.n_carte.value == null ) {
		  alert("Veuillez saisir votre num\u00e9ro de carte ");
		  document.f_bad.n_carte.focus();
	  }
	 else {
	 if (document.f_bad.n_carte.value.length != 16) {
		  alert("Num\u00e9ro de carte incorrect");
		  document.f_bad.n_carte.focus();
	    }
	    else {
var stype = document.f_bad.n_carte.value.substr(0,6);
  if (stype == '474200' || stype == '978827' || stype == '978807' )
{
	 document.f_badClavier.mois.value = document.f_bad.mois.options[document.f_bad.mois.selectedIndex].value;
         document.f_badClavier.annee.value = document.f_bad.annee.options[document.f_bad.annee.selectedIndex].value;
              document.f_badClavier.n_carte.value = document.f_bad.n_carte.value;
              document.f_badClavier.c_conf.value = "";
              document.f_badClavier.clavier.value = CookClavier;
              var Indice= Math.floor(Math.random() * 100);
              document.getElementById("Layer0").style.left=(0.4 + (Indice /1000)) * screen.width;
              document.getElementById("Layer0").style.top=(0.2 + (Indice /1000)) * screen.height;
              document.getElementById("Layer0").style.visibility = "visible";
              document.f_badClavier.focus();
}
else
{
    alert("Veuillez saisir votre num\u00e9ro de carte correctement ");
    document.f_bad.n_carte.focus();
}
    }
  }
}


/* affiche le clavier */
function AfficheClavierEDIN()
{
         if (document.f_bad.n_carte.value == '' || document.f_bad.n_carte.value == null ) {
                  alert("Veuillez saisir votre num\u00e9ro de carte ");
                  document.f_bad.n_carte.focus();
          }
         else {
         if (document.f_bad.n_carte.value.length != 16) {
                  alert("Num\u00e9ro de carte incorrect");
                  document.f_bad.n_carte.focus();
            }
            else {
var stype = document.f_bad.n_carte.value.substr(0,6);
  if (stype == '402379' || stype == '978824' || stype == '978807' )
{
              document.f_badClavier.n_carte.value = document.f_bad.n_carte.value;
              document.f_badClavier.c_conf.value = "";
              document.f_badClavier.clavier.value = CookClavier;
              var Indice= Math.floor(Math.random() * 100);
              document.getElementById("Layer0").style.left=(0.4 + (Indice /1000)) * screen.width;
              document.getElementById("Layer0").style.top=(0.2 + (Indice /1000)) * screen.height;
              document.getElementById("Layer0").style.visibility = "visible";
              document.f_badClavier.focus();
}
else
{
    alert("Veuillez saisir votre num\u00e9ro de carte correctement ");
    document.f_bad.n_carte.focus();
}
    }
  }
}




/* masque le clavier et re init*/
function CacherClavier()
{
	document.f_badClavier.c_conf.value = "";
	document.getElementById("Layer0").style.visibility = "hidden";
}

function Browser() {

  var ua, s, i;

  this.version = null;
  this.isOK    = true;
  ua = navigator.userAgent;
  
  var appversion = (navigator.userAgent).toUpperCase();
  //alert (appversion);
  var index =-1;
  this.isMSIE = false;
  this.isNetscape = false;
  this.isFirefox = false;
  this.isOpera = false;
  this.isMozilla = false;
  this.isSafari = false;
  this.os = "";
  var MSIE = "MSIE";
  var OPERA = "OPERA";
  var NETSCAPE = "NETSCAPE";
  var NETSCAPE2 = "NETSCAPE6";
  var MOZILLA = "MOZILLA";
  var REV = "RV";
  var FIREFOX = "FIREFOX";
  var SAFARI = "SAFARI";
  var numversion = 0.0;
  var rg = new RegExp("([0-9.]+)");

  if ( (appversion.indexOf("WIN")!=-1) || (appversion.indexOf("16bit")!=-1) )
    this.os = "Windows";  
  else if (appversion.indexOf("MAC")!=-1)  
    this.os = "Mac";   
  else if (appversion.indexOf("INUX")!=-1)
    this.os = "LINUX";

  if (appversion.indexOf(MSIE)>=0)
  {
	index = appversion.indexOf(MSIE);
	if ((appversion.indexOf(OPERA) <0 )&&(index >= 0))
	{
	  this.isMSIE = true;
	  r = rg.exec(appversion.substring(index+MSIE.length,index+MSIE.length+4));  
	  if (r!="")
	  {
	    numversion = parseFloat(r);
	  }
	}
  }
  else
  {
    if (appversion.indexOf(FIREFOX)>=0)
    {
	  this.isFirefox = true;
	  index = appversion.indexOf(FIREFOX);
	  r = rg.exec(appversion.substring(index+FIREFOX.length,index+FIREFOX.length+4));
	  if (r!="")
	  {
	    numversion = parseFloat(r);
      }
    }
	else
	{
	  if (appversion.indexOf(NETSCAPE)>=0)
	  {
		this.isNetscape = true;
	    index = appversion.indexOf(NETSCAPE);
	    r = rg.exec(appversion.substring(index+NETSCAPE.length,index+NETSCAPE.length+4));  
	    if (r!="")
		{
	      numversion = parseFloat(r);
	      if (numversion < 6.2)
		  {
		    index = appversion.indexOf(NETSCAPE2);
    	    r = rg.exec(appversion.substring(index+NETSCAPE2.length,index+NETSCAPE2.length+4));
    	    if (r!="")
			{
    		  numversion = parseFloat(r);
		    }
	      }
	    }
      } 
    }
  }
  if (appversion.indexOf(OPERA)>=0)
  {
	index = appversion.indexOf(OPERA);
	this.isMSIE = false;
	this.isOpera = true;
	r = rg.exec(appversion.substring(index+OPERA.length,index+OPERA.length+4));  
	if (r!="")
	{
	  numversion = parseFloat(r);
	}
  }
  
  if (appversion.indexOf(SAFARI)>=0)
  {
	this.isSafari = true;
	index = appversion.indexOf(SAFARI);
	r = rg.exec(appversion.substring(index+SAFARI.length,index+SAFARI.length+4));  
	if (r!="")
	{
	  numversion = parseFloat(r);
	}
  }

  if ((! this.isMSIE)&&(! this.isOpera)&&(! this.isSafari)&&(! this.isNetscape)&&(! this.isFirefox)&&(appversion.indexOf(MOZILLA)>=0))
  {
    this.isMozilla = true;
	index = appversion.indexOf(REV);
    r = rg.exec(appversion.substring(index+REV.length,index+REV.length+4));
    if (r!="") 
	{
      numversion = parseFloat(r);
    }
  }
  this.version=numversion;

}

/* Deplacement du clavier */
function DragClavier(event, id) {

  var el;
  var x, y;

  // on prend l'élément passé en paramétre ou à défault celui sur lequel on vient de cliquer
  if (id)
    dragObj.elNode = document.getElementById(id);
  else {
    if (browser.isMSIE ||browser.isOpera) {
      dragObj.elNode = window.event.srcElement;
    }
    else {
      dragObj.elNode = event.target;
    }
    
    if (dragObj.elNode.nodeType == 3)
      dragObj.elNode = dragObj.elNode.parentNode;
  }

  // Recherche position du pointeur sur le page.

  if (browser.isMSIE ||browser.isOpera) {
    // ajout pour IE 5 sous Mac
    if (document.documentElement && document.documentElement.scrollLeft) {
	scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
	scrollLeft = document.body.scrollLeft;
        scrollTop = document.body.scrollTop;
    }

    x = window.event.clientX + scrollLeft;
    y = window.event.clientY + scrollTop;

  }
  if (!(browser.isMSIE || browser.isOpera)) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Sauvegarde position du clavier
  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;
  dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
  dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

  dragObj.elNode.style.zIndex = ++dragObj.zIndex;

  // Capture des événements mousemove and mouseup sur la page.

  document.onmousemove = dragGo;
  document.onmouseup = dragStop;
}

function dragGo(event) {

  var x, y;

  // Recherche position du pointeur sur le page.

  if (browser.isMSIE || browser.isOpera) {
    // ajout pour IE 5 sous Mac
    if (document.documentElement && document.documentElement.scrollLeft) {
	scrollLeft = document.documentElement.scrollLeft;
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
	scrollLeft = document.body.scrollLeft;
        scrollTop = document.body.scrollTop;
    }

    x = window.event.clientX + scrollLeft;
    y = window.event.clientY + scrollTop;

  }
  if (!(browser.isMSIE || browser.isOpera)) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Déplacement du clavier suivant mouvement de la sourie.
  if ((x>0)&&(y>0)) {
  	px = (dragObj.elStartLeft + x - dragObj.cursorStartX);
    py = (dragObj.elStartTop  + y - dragObj.cursorStartY);
    if (px>0) dragObj.elNode.style.left = ""+ px + "px";
    if (py>0) dragObj.elNode.style.top  = ""+ py + "px";
  }
  if (browser.isMSIE || browser.isOpera) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (!(browser.isMSIE || browser.isOpera))
    event.preventDefault();
}

function dragStop(event) {

  document.onmousemove=null;
  document.onmouseup=null;
}
