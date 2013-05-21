function checkAuth(){
	// print("iWatch : Checking Authorization");
	if (context.getUser().getCommonName() == "Anonymous"){
		sessionScope.put("entryPage",context.getUrl().getPath() + context.getUrl().getQueryString())
		context.redirectToPage("/login.xsp");
	}
}

function checkBrowser(){
	// print("iWatch : Checking Browser Type");
	sessionScope.put("browserType","browser")
	// Override the browser type if we detect a mobile device
	var browserType = context.getUserAgent().getUserAgent();
	if (browserType.match("iPhone")){
		sessionScope.put("browserType","iPhone");}
	if (browserType.match("iPad")){
		sessionScope.put("browserType","iPad");}
	if (browserType.match("Blackberry")){
		sessionScope.put("browserType","blackberry");}
	if (browserType.match("Android")){
		sessionScope.put("browserType","Android");}
}

function checkTheme(browserName){
	
	if (browserName == "browser"){
		if (context.getSessionProperty("xsp.theme") != browserName + "_" + applicationScope.appThemeVersion+ "_" + applicationScope.appTheme){
			context.setSessionProperty("xsp.theme",browserName+ "_" + applicationScope.appThemeVersion+ "_" + applicationScope.appTheme);
			var thisPage = context.getUrl().toString();
			context.redirectToPage(thisPage);
		}
	}
}

function initSession(){
	// print("iWatch : Initializing sessionScope Cache");
	// Quick Access To The Users Roles.
	sessionScope.put("Config",false);
	sessionScope.put("Debug",false);
	sessionScope.put("Moderator",false);
	sessionScope.put("Twitter",false);
	if(@Contains(context.getUser().getRoles(),"[Config]") == @True()){
		sessionScope.put("Config",true);
	}
	if(@Contains(context.getUser().getRoles(),"[Debug]") == @True()){
		sessionScope.put("Debug",true);
	}
	if(@Contains(context.getUser().getRoles(),"[Moderator]") == @True()){
		sessionScope.put("Moderator",true);
	}
	if(@Contains(context.getUser().getRoles(),"[Twitter]") == @True()){
		sessionScope.put("Twitter",true);
	}
	sessionScope.commonName = context.getUser().getCommonName();
	sessionScope.init = true;
}

function initApplication() {
	// print("iWatch : Initializing applicationScope Cache");
	// Find The Active Blog Configuration Document.
	var configView:NotesView = database.getView("lkp_cfg_ActiveConfig");
	var configDoc:NotesDocument = configView.getFirstDocument();
	if (configDoc == null ){
		initialConfig();
		configView.refresh();
		var configDoc:NotesDocument = configView.getFirstDocument();
	}
	// Basics
	applicationScope.appName = configDoc.getItemValueString("cfg_basic_appName");
	applicationScope.appDesc = configDoc.getItemValueString("cfg_basic_appDesc");
	applicationScope.appFooter = configDoc.getItemValueString("cfg_basic_appFooter");
	// Layout
	applicationScope.appTheme = configDoc.getItemValueString("cfg_basic_appTheme");
	applicationScope.appThemeVersion = configDoc.getItemValueString("cfg_basic_appThemeVersion");
	// Options
	applicationScope.appEmail = configDoc.getItemValueString("cfg_basic_appEmail");
	applicationScope.enableUserRequests = configDoc.getItemValueString("cfg_basic_enableUserRequests");
	applicationScope.enableRequestApproval = configDoc.getItemValueString("cfg_basic_enableRequestApproval");
	applicationScope.enableModeration = configDoc.getItemValueString("cfg_basic_enableModeration");
	applicationScope.enableTwitter = configDoc.getItemValueString("cfg_basic_enableTwitter");
	// Login
	applicationScope.loginMarketTitle = configDoc.getItemValueString("cfg_login_market_title");
	applicationScope.loginMarketText = configDoc.getItemValueString("cfg_login_market_text");
	applicationScope.loginLegal1 = configDoc.getItemValueString("cfg_login_legal1");
	applicationScope.loginLegal2 = configDoc.getItemValueString("cfg_login_legal2");
	// History
	applicationScope.keepMemoDays = configDoc.getItemValueInteger("cfg_history_keepMemos");
	applicationScope.keepAlertDays = configDoc.getItemValueInteger("cfg_history_keepAlerts");

	applicationScope.put("init",true)
}

function initialConfig(){
	// print("iWatch : Creating New Default Configuration Document");
	// Used For The First Time A Person Opens This Application.
	// Builds The Default Configuration.
	var thisDB:NotesDatabase = sessionAsSigner.getDatabase(session.getServerName(),session.getCurrentDatabase().getFilePath());
	var newConfigDoc:NotesDocument = thisDB.createDocument();
	newConfigDoc.replaceItemValue("Form","cfg_Config");
	// Basic
	newConfigDoc.replaceItemValue("cfg_basic_appName","iWatch V2.0.0");
	newConfigDoc.replaceItemValue("cfg_basic_appDesc","The XPages Google News Alerts System");
	newConfigDoc.replaceItemValue("cfg_basic_appFooter","Powered By iWatch V2.0.0");
	// Layout
	newConfigDoc.replaceItemValue("cfg_basic_appTheme","blue");
	// Options
	newConfigDoc.replaceItemValue("cfg_basic_appEmail","");
	newConfigDoc.replaceItemValue("cfg_basic_enableUserRequests","false");
	newConfigDoc.replaceItemValue("cfg_basic_enableRequestApproval","false");
	newConfigDoc.replaceItemValue("cfg_basic_enableModeration","false");
	newConfigDoc.replaceItemValue("cfg_basic_enableTwitter","false");
	// Login
	newConfigDoc.replaceItemValue("cfg_login_market_title","What Can You Do With iWatch?");
	newConfigDoc.replaceItemValue("cfg_login_market_text","Find out what's happening in the world with Google News Alerts brought straight to your browser with iWatch.");
	newConfigDoc.replaceItemValue("cfg_login_legal1","Copyright Declan Sciolla-Lynch");
	newConfigDoc.replaceItemValue("cfg_login_legal2","IBM, the IBM logo and Lotus are trademarks of IBM Corporation, in the United States, other countries, or both.");
	// History
	newConfigDoc.replaceItemValue("cfg_history_keepMemos",7);
	newConfigDoc.replaceItemValue("cfg_history_keepAlerts",30);
	newConfigDoc.save(true,true);
}