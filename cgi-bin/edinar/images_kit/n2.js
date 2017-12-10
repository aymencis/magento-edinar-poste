// declaration 
var Maxtaille =19; // taille des tableaux de travail
var TabSel= new Array(Maxtaille); // tableau des selections 
var TabImg = new Array(Maxtaille); // tableau des images
var TabVal = new Array(Maxtaille); // tableau des valeurs 
var TabSrc = new Array(9); // tableau des sources des iamges
var browser = new Browser();
var oldnav;

// utilise par les fonctions DragClavier, etc.
var dragObj = new Object();
dragObj.zIndex = 0; 

// init contexte si non defini
if (!window.ctx) ctx = new Object;

// init elements de style specifiques
if (document.layers)
	document.write('<link rel="stylesheet" type="text/css" href="'+ctx.css_nn+'">');
else {
	document.write('<style>\n');
	document.write('input.rech{ border:1px solid #70706E; }\n');
	document.write('input.bad{ border:1px solid #70706E; }\n');
	if (ctx.img_degrade) {
		document.write('.degrade{ background:#FFC773 url('+ctx.img_degrade+') repeat-y; }\n');
		document.write('.degrade2{ background:#FFC773 url('+ctx.img_degrade2+') no-repeat; }\n');
		document.write('.fondjeunes{ background:#FF9966 url('+ctx.img_jeune+') no-repeat top right; }\n');
	}
	document.write('</style>\n');
}
// init onglets
if (ctx.nav) MpInitOnglets();

// evt onload 
// init onglets
function MpInitOnglets() {
	window.gtNavImg = new Array();
	for (var i=1;i<ctx.nav.length;i++) {
		gtNavImg[i] = new Image;
		gtNavImg[i].src = ctx.nav[i];
	}
}
// allume un onglet
function MpOnglet(i) {
	var j, img, src;
	if (!ctx.nav || !document.images) return;
	j = ctx.onglet; ctx.onglet=0;
	MpSwap(j); MpSwap(i);
	ctx.onglet=i;
}	
// swap image onglet
function MpSwap(i) {
	var img, src;
	if (!i || !ctx.nav || !document.images || i==ctx.onglet) return;
	img = document.images["rub_"+i];
	if (img) {src=img.src; img.src=ctx.nav[i]; ctx.nav[i]=src;}
}
// lien onglet pro
function MpOngletPro(lk) {
	var model  = (ctx.aspx) ? "modele1.aspx?pr=" : "modele1.asp?pr=";
	var sPr=MpCookGet("PR"), sPro;
	if (sPr=="B65" || sPr=="B66") lk.href = model+sPr;
	else if (sPro=MpCookGet("PRO")) lk.href = model+sPro;
	else if (ctx.onglet_pro) lk.href = ctx.onglet_pro;
}
// conversion d'une chaine jj/mm/ss hh:mm:ss en Date ou 30/12/1899 si chaine vide ou invalide
function hd(str) {
	var		mask;
	var		t,d,m,y,h,mi,s;
	var		i;
	
	// init
	d=30;m=12;y=1899;h=mi=s=0;
	// applique les masques successifs horodate, date, heure
	mask = /\s*(\d\d?)\/(\d\d?)\/(\d{4}|\d{2})\s+(\d\d?):(\d\d?):(\d\d?)\s*$/;
	t = mask.exec(str);
	if (t) {
		if (t[3].length == 2) y=2000; else y=0;
		for (i=1; i<t.length; i++) t[i]=parseInt(t[i]);
		d = t[1]; m=t[2]; y+=t[3]; h=t[4]; mi=t[5]; s=t[6];
	}
	else {
		mask = /\s*(\d\d?)\/(\d\d?)\/(\d{4}|\d{2})\s*$/;
		t = mask.exec(str);
		if (t) {
			if (t[3].length == 2) y=2000; else y=0;
			for (i=1; i<t.length; i++) t[i]=parseInt(t[i]);
			d = t[1]; m=t[2]; y+=t[3];
			if (t[3].length == 2) y += 2000;
		}
		else {
			mask = /\s*(\d\d?):(\d\d?):(\d\d?)\s*$/;
			t = mask.exec(str);
			if (t) {
				for (i=1; i<t.length; i++) t[i]=parseInt(t[i]);
				h = t[1]; mi=t[2]; s=t[3];
			}
		}
	}
	if (h>23 || mi>59 || s>59) h=mi=s=0;
	if (d==30 && m==12 && y==1899) {
		return new Date(y,m-1,d,h,mi,s,0);
	}
	if (d<1 || d>31 || m<1 || m>12 || y<1900 || y>2100) { d=30; m=12; y=1899; }
	return new Date(y,m-1,d,h,mi,s,0);
}
// conversion d'une variable en litteral JavaScript
function MpSerialize(v) {
	var y,m,d,h,mi,s,sRet;
	var bComma = false;
	
	if (v == null) sRet = 'null';
	
	else if (typeof v == 'string') {
		sRet = v.replace(/\\/g, '\\\\');
		sRet = sRet.replace(/\t/g, '\\t');
		sRet = sRet.replace(/\r/g, '\\r');
		sRet = sRet.replace(/\n/g, '\\n');
		sRet = sRet.replace(/\'/g, '\\\'');
		sRet = "'"+sRet+"'";
	}
	else if (v.constructor == Date) {
		y=v.getFullYear(); m=v.getMonth()+1; d=v.getDate();
		h=v.getHours(); mi=v.getMinutes(); s=v.getSeconds();
		if (d!=30 || m!=12 || y!=1899) {
			d=d.toString(); m=m.toString();
			sRet=((d.length == 2)?d:'0'+d)+'/'+((m.length==2)?m:'0'+m)+'/'+y;
		}
		if (h!=0 || mi!=0 || s!=0) {
			if (sRet) sRet += ' '; else sRet = '';
			h=h.toString(); mi=mi.toString(); s=s.toString();
			sRet += ((h.length == 2)?h:'0'+h)+':'+((mi.length == 2)?mi:'0'+mi)+':'+
			 ((s.length == 2)?s:'0'+s);
		}
		if (sRet == null) sRet = "hd()";
		else sRet = "hd('" + sRet + "')";
	}
	else if (v.constructor == Array) {
		sRet = '[';
		for (var i=0; i < v.length; i++) {
			if (bComma) sRet += ',';
			bComma = true;
			sRet += MpSerialize(v[i]);
		}
		sRet += ']';
	}
	else if (typeof v == 'object') {
		sRet = '{';
		for (var prop in v) {
			if (bComma) sRet += ',';
			bComma = true;
			sRet += prop+':'+MpSerialize(v[prop]);
		}
		sRet += '}';
	}
	else sRet = v.toString();
	return sRet;
}
// fonction d'impression
function printFrame(){
	var sNS		 = (navigator.appName == "Netscape");
	var sVersNav = navigator.appVersion;		
	// Navigateur Netscape
	if (sNS) {			
		window.print();
	}else{
		// No Version du Navigateur IE 
		pos = sVersNav.indexOf("MSIE");
		if (pos >0) {
			numVers = sVersNav.substr((pos+5),1);
			if (numVers > 4){
				window.print();
			}else{
				var WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
				document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
				WebBrowser1.ExecWB(6, 2);
				//Use a 1 vs. a 2 for a prompting dialog box
				WebBrowser1.outerHTML = "";
			}
		}else{
			alert("Pour imprimer, utiliser l'item \"Imprimer\" du menu Fichier Imprimer.")
		}	
	}
}
// parametrage ouverture d'une fenetre
function MP_paramfen(sW,sH,sToolBar,sStatusBar,sLocation,sMenu,sScroll,sResize,sTitleBar,sDepend){
	sParam = 'width='+sW+',height='+sH+',toolbar='+sToolBar+',status='+sStatusBar+',location='+sLocation+',menubar='+sMenu+',scrollbars='+sScroll+',resizable='+sResize+',titlebar='+sTitleBar+',dependent='+sDepend;
	return sParam;
}
// impression avec ou sans le modele d'impression
function MP_imprimer(url,tMethod) {
	if (!url) {
		url= (ctx.aspx) ? "modeleimp.aspx" : "modeleimp.asp";
		url+=document.location.search;
		if (ctx.rh) url=url+"&rh=1"
	}
	if (!tMethod) tMethod=ctx.post;
	// Cas des Formulaire => Impression direct de la Page
	// Sinon on recharge la page pour supprimer le totem
	if (tMethod == 'POST') {
		printFrame();
	}else{
		window.open(url,'Impression',MP_paramfen('600','450','yes','no','no','yes','yes','yes','yes','yes'));
	}	
}
// envoyer a un ami
function MP_ami(url) {
	if (!url) {
		if (!ctx.url) return;
		//V4 var popup= "mp_popup.aspx";
		var popup= (ctx.aspx) ? "mp_popup.aspx" : "mp_popup.asp";
		url=popup+"?np=envoyer_a_un_ami&url="+escape(location.protocol+'//'+location.host+ctx.url+'&nv='+ctx.ddc);
	}
	var w=window.open(url,"envoyer_a_un_ami","directories=no,resizable=no,scrollbars=yes,toolbar=no,left=100,top=13,height=520,width=590");
	w.focus();
}
// appel satisfaction
function MP_sat(degre, url) {
	if (degre == undefined) {
		var d=(parent.frames.length)?parent.frames.totemd.document:document;
		var rb=d.forms.f_sat.degre;
		for (var i=0; i < rb.length; i++) if (rb[i].checked) break;
		if (i >= rb.length) { alert("Pr\u00e9cisez votre choix"); return; }
		degre = rb[i].value;
	}
	if (!url) {
		//V4 var popup= "mp_popup.aspx"; xx
		var popup= (ctx.aspx) ? "mp_popup.aspx" : "mp_popup.asp";
		url=popup+"?np=satisfaction_resultat&idc="+ctx.idc+"&ddc="+ctx.ddc;
	}
	url = url + "&dg="+degre 
	var w=window.open(url,"envoyer_a_un_ami","left=100,top=13,width=500,height=300,resizable=yes,scrollbars=yes");
	w.focus();
}
// ajout a la selection
function MP_Bookmark() {
	if (!ctx.url) return;
	//V4 var popup= "mp_popup.aspx"; xx
	var popup= (ctx.aspx) ? "mp_popup.aspx" : "mp_popup.asp";
	var url=popup+"?np=ajout_selection&url="+escape(ctx.url)+
	 "&idc="+ctx.idc+"&titre="+escape(document.title);
	var w=Window.open(url,"envoyer_a_un_ami","left=100,top=13,width=500,height=300,resizable=yes,scrollbars=yes");
	w.focus();
}
// gestion focus et blur d'un champ (bIn = 1 si focus, 0 si blur)
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

// init pave bad
// chgt d'etablissement
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
	
// 		MpCookSet('NAB',f.n_carte.value,d);
		MpCookSet('NAB','',d);

		var nbad=MpCookGet('NBAD');
		if (isNaN(nbad)) nbad=1; else nbad++;
		MpCookSet('NBAD',nbad,d);
		MpCookSet('RBCLIENT','oui',d);
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
	
// 	MpCookSet('NAB',document.n_carte.value,d);
	MpCookSet('NAB','',d);

	var nbad=MpCookGet('NBAD');
	if (isNaN(nbad)) nbad=1; else nbad++;
	MpCookSet('NBAD',nbad,d);
	MpCookSet('RBCLIENT','oui',d);   
	return true;
	
}

// fonction permettant le parsing des images dans le cas du roll over ou des script
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


/* init du totem en fonction du navigateur */
/* oldnav = 0 --> nouveau totem            */
/* oldnav = 1 --> ancien totem             */
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
	 	  
	 if (document.f_bad.n_carte.value.length > 16) {
		  alert("Num\u00e9ro de carte incorrect");
		  document.f_bad.n_carte.focus();
	    }
	    else {


	      document.f_badClavier.n_carte.value = document.f_bad.n_carte.value;
	      document.f_badClavier.c_conf.value = "";
	      document.f_badClavier.clavier.value = CookClavier;
	
	      var Indice= Math.floor(Math.random() * 100);
	      document.getElementById("Layer0").style.left=(0.4 + (Indice /1000)) * screen.width;
	      document.getElementById("Layer0").style.top=(0.2 + (Indice /1000)) * screen.height;
	      document.getElementById("Layer0").style.visibility = "visible";
	      document.f_badClavier.focus();
	    }
	  }
 

}
/* masque le clavier et re init*/
function CacherClavier()
{
	document.f_badClavier.c_conf.value = "";
	document.getElementById("Layer0").style.visibility = "hidden";
}

/* ctrl présence cookie clavier*/
function IniPopup()
{
   var CookClavierPopup=MpCookGet('CLAVIER');
   if (CookClavierPopup == '0'){
   	document.AccesClavier.cbClavier.checked = true;	
   }
   else { 
   	document.AccesClavier.cbClavier.checked = false;
   }
   window.resizeTo(650, 480);
}

/* écriture cookie accessibilité et retour à la page d'accueil*/
function ValidateAccessibilite()
{  
   var d = new Date();
   d.setYear(d.getYear()+1);
   if (document.AccesClavier.cbClavier.checked == true){
      if (browser.isMSIE){
      	MpCookSet('CLAVIER','0',d);
      }
      else {
      	MpCookSetClavier('CLAVIER','0','365');
      }
   }
   else {
      if (browser.isMSIE){
      	MpCookSet('CLAVIER','1',d);
      }
      else {
      	MpCookSetClavier('CLAVIER','1','365');
      }
   }
  
  document.location.href = '/';
  // opener.location.reload();
  // window.close();
}
/* oblige l'internaute à confirmer la saisie du code au clavier*/
function controlCB()
{
  if(!document.getElementById("cbClavier").checked)
   {
      alert("Veuillez confirmer votre choix en cochant la case");
      return false;
   }
   return true;
}

function ControlAndValid()
{
  if(controlCB())
    ValidateAccessibilite();
}

/* foncftion browser*/
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
