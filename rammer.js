var version = "2.0"
var codename = "Railway"
var buildnumber = "245"
var funnyphrase = "У нас есть кнут, но нету пряника. А зря! Пряник то вкусный"
var isbeta = true
var background_default = "/Sys/Img/GreenBack.jpg"
var background = app.LoadText( "background","/Sys/Img/GreenBack.jpg" )
var phonenumber=""
var defaulturl = "Html/wygl_start_page.html"
var debug = false
var daysofweek = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"]
var folder = "/sdcard/Rammer" 
var folder_exists = app.FolderExists( folder );
var tmp_data = {}
var notification = ""
var repeat_music = false
var sh_rad = 0
var sh_dy = 0.05
var melodies = ["Snd/melody1.mp3"]
var xcm = app.ListFolder( folder );
if( debug==true ) {
var bootanimationtime = 2000
}else{
var bootanimationtime = 4000
}
//Called when application is started.
function OnStart()
{
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "Vertical,fillxy,top" );
laydrawer = app.CreateLayout( "Linear", "Vertical,fillxy" );

// ЭКСПЕРИМЕНТАЛЬНЫЙ КОД!!! НЕКИТ НЕ ТРОГАЙ!!! СТЕРЕТЬ ЭТОТ КОММЕНТАРИЙ В СЛУЧАЕ АПОКАЛИПСИСА
app.LockDrawer( "left" );
layboot = app.CreateLayout( "Linear", "Vertical,fillxy" );
layboot.SetBackColor( "black" );
bootanim = app.CreateVideoView( 1.1,1 );
bootanim.SetFile( "Vid/bootanimation.mp4" );
bootanim.Play();
layboot.AddChild( bootanim );
app.AddLayout( layboot );
setTimeout(function() {
app.RemoveLayout(layboot);
app.AddLayout( lay );
app.AddDrawer( laydrawer,"left",0.9,0.15 );
drawdrawer()
},bootanimationtime)
// КОНЕЦ

if(folder_exists==false) {
app.MakeFolder( folder );
app.MakeFolder( folder+"/Music/" )
app.MakeFolder( folder+"/Pictures/" );
app.MakeFolder( folder+"/Apps/" );
app.MakeFolder( folder+"/Video/" );
}

audioplayer = app.CreateMediaPlayer();
soundplayer = app.CreateMediaPlayer();
soundplayer1 = app.CreateMediaPlayer();

laymainbtns = app.CreateLayout( "linear", "Horizontal,fillxy,Bottom" );
lay.SetBackground( background );

layother = app.CreateLayout( "Linear", "Vertical" );
buttonphone = app.CreateButton( "Телефон" );
laymainbtns.AddChild( buttonphone );
buttonsms = app.CreateButton( "СМС" );
laymainbtns.AddChild( buttonsms );
buttons = app.CreateButton( "Мелодии" );
buttons.SetOnTouch( s_event );
laymainbtns.AddChild( buttons );
buttonbrowser = app.CreateButton( "Браузер" );
laymainbtns.AddChild( buttonbrowser );

buttonphone.SetOnTouch( phone );
buttonbrowser.SetOnTouch( browser_activity );

lay.AddChild( layother );
lay.AddChild( laymainbtns );

	txttime = app.CreateText( "" );
txttime.SetTextSize( 32 );
txttime.SetTextShadow( sh_rad,sh_dy,sh_dy,"black" );
layother.AddChild( txttime );

	txtdate = app.CreateText( "" );
txtdate.SetTextSize( 28 );
txtdate.SetTextShadow( sh_rad,sh_dy,sh_dy,"black" );
layother.AddChild( txtdate );

	txtnotif = app.CreateText( "" );
txtnotif.SetTextSize( 24 );
txtnotif.SetTextShadow( sh_rad,sh_dy,0.01,"black" );
layother.AddChild( txtnotif );

layotherhoz = app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layotherhoz );

layother1hoz = app.CreateLayout( "Linear", "Horizontal" );
layother.AddChild( layother1hoz );

buttonmusic = app.CreateButton( "Музыка" );
buttonmusic.SetOnTouch( music_activity );
layotherhoz.AddChild( buttonmusic );

buttonfiles = app.CreateButton( "Файлы" );
buttonfiles.SetOnTouch( files_activity );
layotherhoz.AddChild( buttonfiles );

buttoncamera = app.CreateButton( "Камера" );
buttoncamera.SetOnTouch( camera_activity );
layotherhoz.AddChild( buttoncamera );

buttonphoto = app.CreateButton( "Фото" );
buttonphoto.SetOnTouch( photo_activity );
layotherhoz.AddChild( buttonphoto );

buttonvideo = app.CreateButton( "Видео" );
buttonvideo.SetOnTouch( video_activity );
layotherhoz.AddChild( buttonvideo );

layotherwgt = app.CreateLayout( "Linear", "Horizontal" );

layother.AddChild( layotherwgt );

calltime()
setInterval(calltime,1000)

	//Add layout to app.	
//	app.AddLayout( lay );
}

function notify_update()
{
	txtnotif.SetText( notification );
}


function create_notify(text,time)
{
	// КОД УВЕДОМЛЕНИЙ
notification = text
notify_update()
// ТАЙМЕР КОД
setTimeout(function() {
notification=""
notify_update()
},time)
//КОНЕЦ
}

function calltime()
{
time = new Date()
hours = time.getHours()
minutes = time.getMinutes()
seconds = time.getSeconds()
day = time.getDate()
month = time.getMonth()
year = time.getFullYear()

tmp_data.hours = hours
tmp_data.minutes = minutes
tmp_data.seconds = seconds
tmp_data.day = day
tmp_data.month = month
tmp_data.year = year

txttime.SetText( hours+":"+minutes );
txtdate.SetText( day+"/"+month+"/"+year+" "+daysofweek[ time.getUTCDay() ] );
txtnotif.SetText( notification );
}

function drawdrawer()
{
laystatus = app.CreateLayout( "Linear", "Vertical" );
	drawermaintext = app.CreateText( "", null, null, "FontAwesome" ); 
setInterval(function() {
batterylevel = app.GetBatteryLevel()*100
drawermaintext.SetText( "[fa-battery-full]  " + Math.ceil(batterylevel) + "%   [fa-signal]  " + app.GetRSSI() + " dbm (значения неверные)");
},1000)
laystatus.AddChild( drawermaintext );
laydrawer.AddChild( laystatus );
laybtnsdraw = app.CreateLayout( "Linear", "Horizontal" );
laybtnsdraw1 = app.CreateLayout( "Linear", "Horizontal" );
if(debug==true) {
laystatus.SetBackColor( "#123456" );
laydrawer.SetBackColor( "#556677" );
laybtnsdraw1.SetBackColor( "#cc55aa" );
}
infobtn = app.CreateButton( "[fa-info]  О системе", null, null, "FontAwesome" );
infobtn.SetOnTouch( showinfo );
laybtnsdraw.AddChild( infobtn );
laydrawer.AddChild( laybtnsdraw );
laydrawer.AddChild( laybtnsdraw1 );

appsbtn = app.CreateButton( "Приложения" );
appsbtn.SetOnTouch( showapps );
laybtnsdraw.AddChild( appsbtn );

lockscreenbtn = app.CreateButton( "Заблокировать экран" );
lockscreenbtn.SetOnTouch( screenlock );
laybtnsdraw1.AddChild( lockscreenbtn );
}


function AddButton( lay, name )
{
	btn = app.CreateButton( name, null, null, "Alum" );
	btn.SetOnTouch( btnphone_OnTouch );
	lay.AddChild( btn );
}

function cutstring(str, cutStart, cutEnd){
  return str.substr(0,cutStart) + str.substr(cutEnd+1);
}

function addclosebtn(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
} );
}

function addclosebtnbrowser(lay)
{
	closebtn = app.CreateButton( "Закрыть", null, 0.06 );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
browser.LoadHtml("<b>Браузер остановлен для оптимизации.</b>");
} );
}

function phone()
{
	layphone = app.CreateLayout( "linear", "Vertical,fillxy" );
layphone.SetBackColor( "gray" );
lphtxt = app.CreateLayout( "linear", "Horizontal" );	
 	phonetxt = app.CreateText( "" );
	lphtxt.AddChild( phonetxt );
layphone.AddChild( lphtxt );
lph1 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph1,"7")
AddButton(lph1,"8")
AddButton(lph1,"9")
layphone.AddChild( lph1 );
lph2 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph2,"4")
AddButton(lph2,"5")
AddButton(lph2,"6")
layphone.AddChild( lph2 );
lph3 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph3,"1")
AddButton(lph3,"2")
AddButton(lph3,"3")
layphone.AddChild( lph3 );
lph4 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph4,"*")
AddButton(lph4,"0")
AddButton(lph4,"#")
layphone.AddChild( lph4 );
lph5 = app.CreateLayout( "linear", "Horizontal" );	
  AddButton(lph5,"Call")
AddButton(lph5,"<<<")
layphone.AddChild( lph5 );
addclosebtn(layphone)
app.AddLayout( layphone );
}

function btnphone_OnTouch()
{
	app.Vibrate( "0,100" );
	
	//Get button text.
	btn = this;
var nmb = btn.GetText()
if( nmb == "<<<" ) {
phonenumber = ""
} else if( nmb == "Call" ) {
app.Call( phonenumber );
phonenumber = ""
} else {
phonenumber+=nmb
}
phonetxt.SetText( phonenumber );

}

function rammer_error(err)
{
	layerr = app.CreateLayout( "Linear", "Horizontal" );
layerr.SetBackColor( "black" );
txterr = app.CreateText( "Ошибка: "+err, null, null, "multiline");
txterr.SetTextSize( 16 );
layerr.AddChild( txterr );
app.AddLayout( layerr );
setTimeout(function() {
app.RemoveLayout( layerr );
},3000)
}

function rammer_message(msg)
{
var ram_msg;
	laymsg = app.CreateLayout( "Linear", "Horizontal" );
laymsg.SetBackColor( "black" );
txtmsg = app.CreateText( msg , null, null, "multiline");
txtmsg.SetTextSize( 12 );
laymsg.AddChild( txtmsg );
app.AddLayout( laymsg );
clearTimeout(ram_msg)
ram_msg = setTimeout(function() {
app.RemoveLayout( laymsg );
},3000)
}

function browser_activity(url)
{
	laybrowser = app.CreateLayout( "Linear", "Vertical,fillxy" );
laybrowser.SetBackColor( "gray" );
browser = app.CreateWebView( 1,0.83, "IgnoreErrors" );
gobtn = app.CreateButton( "<Go>",null,0.06 );
laybrowserhoz = app.CreateLayout( "Linear", "Horizontal" );
addressurlbar = app.CreateTextEdit( defaulturl, 0.6, null, "SingleLine" );
loadbar = app.CreateSeekBar( 0.9,0.05 );
loadbar.SetRange( 100 );
loadbar.SetEnabled( false );
backbtnbrowser = app.CreateButton( "<Back>",null, 0.06);
backbtnbrowser.SetOnTouch(function(){browser.Back()});
gobtn.SetOnTouch( function () {
browser.LoadUrl(addressurlbar.GetText())
});
addclosebtnbrowser(laybrowser)
laybrowser.AddChild( laybrowserhoz );
laybrowserhoz.AddChild( addressurlbar );
laybrowserhoz.AddChild( gobtn );
laybrowserhoz.AddChild( backbtnbrowser );
laybrowser.AddChild( browser );
laybrowser.AddChild( loadbar );
if(typeof(url)=="undefined") {
browser.LoadUrl(defaulturl)
}else{
browser.LoadUrl(url)
}
browser.SetOnProgress( browser_progress );
browser.SetOnTouch( function() {
urldata = browser.GetUrl()
addressurlbar.SetText( urldata );
});
app.AddLayout( laybrowser );
}

function browser_progress(e)
{
loadbar.SetValue( e )
}

function showinfo()
{
infobtn.SetEnabled( false );
	layinfo = app.CreateLayout( "Linear", "Vertical,fillxy" );
layinfo.SetBackColor( "gray" );
addclosebtninfo(layinfo)
// КОД ИНФОРМАЦИИ О СИСТЕМЕ >> 1
logo = app.CreateImage( "Img/rammer.png", 0.15 );
layinfo.AddChild( logo );
txtvers = app.CreateText( version );
txtfunnyphrase = app.CreateText( funnyphrase, null, null, "Multiline" );
txtfunnyphrase.SetTextSize( 14 );
txtcodename = app.CreateText( "Кодовое имя: " + codename );
if(isbeta==true) {
txtvers = app.CreateText( version+" beta" );
} else {
txtvers = app.CreateText( version );
}
txtvers.SetTextSize( 32 );
layinfo.AddChild( txtvers );
layinfo.AddChild( txtfunnyphrase );
layinfo.AddChild( txtcodename );
developersbtn = app.CreateButton( "О разработчиках" )
developersbtn.SetOnTouch( developersinfo );
layinfo.AddChild( developersbtn );
// КОНЕЦ << 1
app.AddLayout( layinfo );
}

function addclosebtninfo(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
infobtn.SetEnabled( true );
app.RemoveLayout( lay );
} );
}

function music_activity()
{
folder = "/sdcard/Rammer/Music/"
laymusic = app.CreateLayout( "Linear", "Vertical,fillxy" );
laymusic.SetBackColor( "gray" );
musiclist = app.CreateList( app.ListFolder( folder,".mp3" ),1,0.3 );
musiclist.SetOnTouch(choosemusic)
statusmusictext = app.CreateText( "", null, null, "Multiline");
musictimetext = app.CreateText( "", null, null, "");
addclosebtn(laymusic)

stopmusicbtn = app.CreateButton( "[fa-stop]",null, null, "FontAwesome" );
stopmusicbtn.SetOnTouch( function() {
audioplayer.Stop();
} );
swloopmusic = app.CreateToggle( "[fa-replay]", null, null, "FontAwesome" );
swloopmusic.SetChecked( repeat_music );
swloopmusic.SetOnTouch( function(yn) {
repeat_music = yn
audioplayer.SetLooping( repeat_music );
//create_notify(yn,3000)
});
laymusic.AddChild( musiclist );
laymusic.AddChild( statusmusictext );
laymusic.AddChild( musictimetext );
seekmusicbar = app.CreateSeekBar( 1 );
laymusic.AddChild( seekmusicbar );
laymusic.AddChild( swloopmusic );
laymusic.AddChild( stopmusicbtn );
app.AddLayout( laymusic );
}


function choosemusic(file)
{
audioplayer.Stop();
audioplayer.SetFile( folder+file )
statusmusictext.SetText( "Сейчас проигрывается: "+folder+file );
audioplayer.Play(  );
musicready()
audioplayer.SetOnReady( function() {
statusmusictext.SetText( "Сейчас проигрывается: "+folder+file );
audioplayer.Play(  );
musicready()
audioplayer.SetOnSeekDone( musiccomplete );
})
}

function choosemusicfiles(file)
{
audioplayer.Stop();
audioplayer.SetFile( file );
audioplayer.Play();
audioplayer.SetOnReady( function() {
audioplayer.Play();
});
//musicready()
//audioplayer.SetOnSeekDone( musiccomplete );
}

function musicready()
{
seekmusicbar.SetRange( audioplayer.GetDuration() );
seekmusicbar.SetOnTouch( seek_music );
 tmp_data.musictimeint = setInterval(function () {
var seekmusic = audioplayer.GetPosition();
musictimetext.SetText( Math.ceil(seekmusic) + "/" + Math.ceil( audioplayer.GetDuration() ) );
seekmusicbar.SetValue( seekmusic );
},100)
}

function musiccomplete()
{
	clearInterval( tmp_data.musictimeint );
}

function seek_music(e)
{
audioplayer.SeekTo( e );
}

// ЭТОТ КУСОК КОДА НУЖДАЕТСЯ В ПОЧИНКЕ
function files_activity()
{
curfold = folder
folder = "/sdcard/Rammer"
xcm = app.ListFolder( folder );
layfiles = app.CreateLayout( "Linear", "Vertical,fillxy" );
layfiles.SetBackColor( "gray" );
fileslist = app.CreateList( xcm ,null, 0.7 );
fileslist.SetOnTouch(chfolder)
//fileslist.SetOnLongTouch(file_operations)
addclosebtnfiles(layfiles)
layfiles.AddChild( fileslist );
backbtnfiles = app.CreateButton( "Назад" );
backbtnfiles.SetOnTouch( back_files );
txtpath = app.CreateText( "" );
layfiles.AddChild( txtpath );
layfiles.AddChild( backbtnfiles );
app.AddLayout( layfiles );
txtpath.SetText( folder );
/*
	lst = app.CreateList( xcm );
lst.SetOnTouch( chfolder );
btnback = app.CreateButton( "Back" );
btnback.SetOnTouch( function() {
dir="/sdcard/Rammer"
xcm = app.ListFolder( dir );
lst.SetList( xcm );
});
lay.AddChild( btnback );
*/

}

function chfolder(fold)
{
/*
	dir+="/"+ev
xcm = app.ListFolder( dir );
lst.SetList( xcm );
}
*/
if( app.IsFolder( folder+"/"+fold ) ) {
folder+="/"+fold
tmp_data.fold = fold
xcm = app.ListFolder( folder );
fileslist.SetList(xcm)
}else{

/*if( app.IsFolder( xcm ) ) {

}else{
*/
rejpg = new RegExp("\b*jpg");
if(rejpg.test(curfold+"/"+fold)) {
photo_activity(curfold+"/Pictures/"+fold)
}
remp3 = new RegExp("\b*mp3");
if(remp3.test(curfold+"/"+fold)) {
rammer_message("Аудио проигрывается: "+fold)
choosemusicfiles(curfold+"/Music/"+fold);
}
remp4 = new RegExp("\b*mp4")
if(remp4.test(curfold+"/"+fold)) {
rammer_message("Открываю видео")
video_activity(curfold+"/Video/"+fold)
}
}
txtpath.SetText( folder );
}

function addclosebtnfiles(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
folder="/sdcard/Rammer"
} );
}

function back_files()
{
folder="/sdcard/Rammer"
	fileslist.SetList(app.ListFolder(folder))
txtpath.SetText( folder );
//txtpath.SetText( xcm );
}

function showapps()
{
appsbtn.SetEnabled( false );
layapps = app.CreateLayout( "Linear", "Vertical,fillxy" );
	layappsbtn = app.CreateLayout( "Linear", "Horizontal" );
layapps.SetBackColor( "gray" );
layappsbtn1 = app.CreateLayout( "Linear", "Horizontal" );
layapps.AddChild( layappsbtn1 );
layapps.AddChild( layappsbtn );
// КОД >>2
/*
addappbtn = app.CreateButton( "Добавить" );
addappbtn.SetOnTouch( addapp_event );
layappsbtn.AddChild( addappbtn );
*/
changewallpapersbtn = app.CreateButton( "Сменить обои" );
changewallpapersbtn.SetOnTouch( changewallpapers );
layappsbtn.AddChild( changewallpapersbtn );
dsmsbtn = app.CreateButton( "DSMS" );
dsmsbtn.SetOnTouch( dsms_activity );
layappsbtn.AddChild( dsmsbtn );
testappbtn = app.CreateButton( "Тест. приложение" );
testappbtn.SetOnTouch( runtestapp );
layappsbtn1.AddChild( testappbtn );
//КОНЕЦ <<2
addclosebtnapps(layappsbtn)
app.AddLayout( layapps );
}

function addapp_event()
{
	layaddapp = app.CreateLayout( "Linear", "Horizontal,fillxy" );
layaddapp.SetBackGradient( "red","yellow","blue" );
addclosebtn(layaddapp)
app.AddLayout( layaddapp );
}

function addclosebtnapps(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
appsbtn.SetEnabled( true );
app.RemoveLayout( layapps );
} );
}

function camera_activity()
{
	laycamera = app.CreateLayout( "Linear", "Vertical,fillxy" );
laycamera.SetBackColor( "gray" );
laycamerahoz = app.CreateLayout( "Linear", "Horizontal" );
camerascreen = app.CreateCameraView( 1, 0.9 );
camerascreen.SetOnReady( function() { 
camerascreen.StartPreview();
});
snapcamerabtn = app.CreateButton( "Сфотать" );
snapcamerabtn.SetOnTouch( snapcamera );
flashlightbtn = app.CreateToggle( "Вспышка" );
flashlightbtn.SetOnTouch( function(g){
camerascreen.SetFlash( g );
});
laycamera.AddChild( camerascreen );
laycamera.AddChild( laycamerahoz );
laycamerahoz.AddChild( snapcamerabtn );
laycamerahoz.AddChild( flashlightbtn );
addclosebtncam(laycamerahoz)
app.AddLayout( laycamera );
}

function addclosebtncam(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveLayout( laycamera );
} );
}


function snapcamera()
{
	camerascreen.TakePicture( folder+"/Pictures/PIC_"+tmp_data.year+"-"+tmp_data.month+"-"+tmp_data.seconds+"_"+tmp_data.hours+"-"+tmp_data.minutes+"-"+tmp_data.seconds+".jpg" );
}

function photo_activity(file)
{
	layphoto = app.CreateLayout( "Linear", "Vertical,fillxy" );
layphoto.SetBackColor( "gray" );
imgphoto = app.CreateImage( file, 1, 0.9 );
if(typeof(file)=="undefined") {
file=null
imgphoto.SetTextSize( 22 );
imgphoto.DrawText( "Выберите изображение в Файлах",0.01,0.5  );
}
//alert(file)
layphotohoz = app.CreateLayout( "Linear", "Horizontal" );
layphoto.AddChild( imgphoto );
layphoto.AddChild( layphotohoz );
addclosebtnpht(layphotohoz)
app.AddLayout( layphoto );
}

function addclosebtnpht(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveLayout( layphoto );
} );
}

function s_event()
{
	lays = app.CreateLayout( "Linear", "Vertical,fillxy" );
lays.SetBackColor( "gray" );
lstswork = app.CreateList( melodies )
lstswork.SetOnTouch( function(mel){ 
audioplayer.Stop();
audioplayer.SetFile( mel )
audioplayer.SetOnReady( function(){
audioplayer.Play();
})
});
lays.AddChild( lstswork );
addclosebtn(lays)
app.AddLayout( lays );
}

function developersinfo()
{
laydevinfo = app.CreateLayout( "Linear", "Vertical,fillxy" );
laydevinfo.SetBackGradient( "blue","green","red" );
	txtdev1info = app.CreateText( "Андрей Павленко [andrejpavlenko666@gmail.com] - разработчик, бета тестер, и дизайнер (хотя дизайна нет)",null, null, "Multiline" );
txtdev1info.SetHtml("<b>Андрей Павленко</b> [andrejpavlenko666@gmail.com] - разработчик, бета тестер, и дизайнер (хотя дизайна нет)")
txtdev2info = app.CreateText( "Никита Серков [WoT: NikSerNagibator30] [емэйл@gmail.com] - бета тестер и генератор идей.",null, null, "Multiline" );
laydevinfo.AddChild( txtdev1info )
laydevinfo.AddChild( txtdev2info );
addclosebtn(laydevinfo)
app.AddLayout( laydevinfo );
}

function screenlock()
{
background = app.LoadText( "background","/Sys/Img/GreenBack.jpg" )
app.CloseDrawer( "Left" );
app.LockDrawer( "Left" );
	laylock = app.CreateLayout( "Linear", "Vertical,fillxy" );
laylock.SetBackground( background );
app.AddLayout( laylock );
// ТУТ НАЧАЛО КОДА >> 3
txttimelock = app.CreateText( "" );
txtdatelock = app.CreateText( "" );
statustxt = app.CreateText( "", null, null, "FontAwesome" );
msgtxt = app.CreateText( "", null, null, "FontAwesome" );
txttimelock.SetTextSize( 28 );
txtdatelock.SetTextSize( 24 );
statustxt.SetTextSize( statustxt.GetTextSize( )+6 );
batterylevel = Math.ceil(app.GetBatteryLevel()*100)
txttimelock.SetText( hours+":"+minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+daysofweek[ time.getUTCDay() ] );
statustxt.SetText( "[fa-battery-full] "+batterylevel+"%");
var intlocktime = setInterval(function () {
txttimelock.SetText( hours+":"+minutes );
txtdatelock.SetText( day+"/"+month+"/"+year+" "+daysofweek[ time.getUTCDay() ] );
batterylevel = Math.ceil(app.GetBatteryLevel()*100)
statustxt.SetText( "[fa-battery-full] "+batterylevel+"%");
},1000)
laylock.AddChild( txtdatelock );
laylock.AddChild( txttimelock );
laylock.AddChild( statustxt );
laylock.AddChild( msgtxt );
btnunlock = app.CreateButton( "Разблокировать" );
btnunlock.SetOnTouch( function () {
soundplayer.SetFile( "Snd/unlock1.ogg" );
soundplayer.Stop();
soundplayer.SetOnReady( function() {
soundplayer.Play();
})
clearInterval( intlocktime );
app.UnlockDrawer( "Left" );
laylock.Animate( "SlideToLeft" );
});
soundplayer.SetFile( "Snd/lock.ogg" );
laylock.AddChild( btnunlock );
//КОНЕЦ << 3
laylock.Animate( "SlideFromLeft" );
soundplayer.Play();
}

function changewallpapers()
{
	laychwallpapers = app.CreateLayout( "Linear", "Vertical,fillxy" );
laychwallpapers.SetBackColor( "gray" );
laychwallpapershoz = app.CreateLayout( "Linear", "Horizontal" );
imgw1 = app.CreateImage( "Img/wallpaper1.jpg",0.2,0.2);
imgw1.SetOnTouch( chwtow1 );
imgw2 = app.CreateImage( "Img/wallpaper2.jpg",0.2,0.2);
imgw2.SetOnTouch( chwtow2 );
imgw3 = app.CreateImage( "Img/wallpaper3.jpg",0.2,0.2);
imgw3.SetOnTouch( chwtow3 );
imgw4 = app.CreateImage( "Img/wallpaper4.jpg",0.2,0.2);
imgw4.SetOnTouch( chwtow4 );
laychwallpapers.AddChild( laychwallpapershoz );
laychwallpapershoz.AddChild( imgw1 );
laychwallpapershoz.AddChild( imgw2 );
laychwallpapershoz.AddChild( imgw3 );
laychwallpapershoz.AddChild( imgw4 );
txtwallpaperstatus = app.CreateText( "" );
btnresetwallpaper = app.CreateButton( "Вернуть обои!!!" );
btnresetwallpaper.SetOnTouch( function(){
app.SaveText( "background",background_default );
//txtwallpaperstatus.SetText( "Перезапустите приложение для установки обоев" );
lay.SetBackground( background_default );
});
laychwallpapers.AddChild( btnresetwallpaper );
laychwallpapers.AddChild( txtwallpaperstatus );
addclosebtnchw(laychwallpapers)
app.AddLayout( laychwallpapers );
}

function addclosebtnchw(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveLayout( laychwallpapershoz );
} );
}

function chwtow1()
{
app.SaveText( "background","Img/wallpaper1.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper1.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function chwtow2()
{
app.SaveText( "background","Img/wallpaper2.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper2.jpg" );
txtdate.SetTextColor( "#22ff22" );
txttime.SetTextColor( "#22ff22" );
}

function chwtow3()
{
app.SaveText( "background","Img/wallpaper3.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper3.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function chwtow4()
{
app.SaveText( "background","Img/wallpaper4.jpg" );
//txtwallpaperstatus.SetText( "Перезапустите приложение для продолжения..." );
lay.SetBackground( "Img/wallpaper4.jpg" );
txtdate.SetTextColor( "gray" );
txttime.SetTextColor( "gray" );
}

function video_activity(file)
{
	layvideo = app.CreateLayout( "Linear","Vertical,fillxy" );
layvideohoz = app.CreateLayout( "Linear", "Horizontal" );
layvideo.SetBackColor( "gray" );
// НАЧАЛО КОДА >> 4
videoplayer = app.CreateVideoView( 1,0.8 );
if(typeof(file)=="undefined") {
videoplayer.SetFile( "Vid/testvideo.mp4" );
}else{
videoplayer.SetFile( file ); 
}
btnvideoplay = app.CreateButton( "[fa-play]", null, null, "FontAwesome" );
btnvideoplay.SetOnTouch( function() {
videoplayer.Play();
videodur = videoplayer.GetDuration()
seekvideotime.SetRange( videodur );
tmp_data.svt = setInterval(function(){
tmp_data.videopos=videoplayer.GetPosition()
seekvideotime.SetValue( tmp_data.videopos );
},1000)
});
btnvideopause = app.CreateButton( "[fa-pause]", null, null, "FontAwesome" );
btnvideopause.SetOnTouch( function() {
videoplayer.Pause();
});
btnvideostop = app.CreateButton( "[fa-stop]", null, null, "FontAwesome" );
btnvideostop.SetOnTouch( function() {
videoplayer.Stop();
clearInterval(tmp_data.svt)
});
seekvideotime = app.CreateSeekBar( 1 )
seekvideotime.SetOnTouch( function(time) {
videoplayer.SeekTo( time );
});
layvideo.AddChild( seekvideotime );
layvideohoz.AddChild( btnvideoplay );
layvideohoz.AddChild( btnvideopause );
layvideohoz.AddChild( btnvideostop );
layvideo.AddChild( videoplayer );
// КОНЕЦ << 4
addclosebtnvid(layvideo)
layvideo.AddChild( layvideohoz );
app.AddLayout( layvideo );
}

function addclosebtnvid(lay)
{
	closebtn = app.CreateButton( "Закрыть" );
  lay.AddChild(closebtn)
  closebtn.SetOnTouch( function() {
app.RemoveLayout( lay );
app.RemoveLayout( layvideohoz );
} );
}

function dsms_activity()
{
laydsms = app.CreateLayout( "Linear", "Vertical,fillxy" );
laydsms.SetBackColor( "gray" );
// ТЕСТОВЫЙ КОД
tmp_data.notelength = 1.5
tmp_data.prefix = ":2"
tmp_data.buf = ""
scl = app.CreateTabs( "Synth,Roll,Options",1,0.9);
laydsms.AddChild( scl );

options_layout = scl.GetLayout("Options");
synth_layout = scl.GetLayout("Synth");
roll_layout = scl.GetLayout("Roll")
synth_layout_hoz = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz );
synth_layout_hoz1 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz1 );
synth_layout_hoz2 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz2 );
synth_layout_hoz3 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz3 );
synth_layout_hoz4 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz4 );
synth_layout_hoz5 = app.CreateLayout( "Linear", "Horizontal" );
synth_layout.AddChild( synth_layout_hoz5 );
syn = app.CreateSynth( );
sd_text = app.CreateText( "" );
options_layout.AddChild(sd_text);
s_delay = app.CreateSeekBar( 1 );
s_delay.SetOnChange( Dsmsdelay_change );
options_layout.AddChild(s_delay)
sd_text.SetText( "Note length: "+ tmp_data.notelength );
syn.SetVca( 10, 400, 0.8, 100 );
syn.SetVcf( 10, 400, 0.8, 100, 1000, 0.85, 2.0 );
s_delay.SetRange( 5 );
s_delay.SetValue( tmp_data.notelength );
for(i=0; i<7; i++) {
AddButtonDsms(synth_layout_hoz,i+40)
}
for(i=7; i<14; i++) {
AddButtonDsms(synth_layout_hoz1,i+40)
}
for(i=14; i<21; i++) {
AddButtonDsms(synth_layout_hoz2,i+40)
}
for(i=21; i<28; i++) {
AddButtonDsms(synth_layout_hoz3,i+40)
}
for(i=28; i<35; i++) {
AddButtonDsms(synth_layout_hoz4,i+40)
}
for(i=35; i<42; i++) {
AddButtonDsms(synth_layout_hoz5,i+40)
}

syn.SetNoteLength( tmp_data.notelength )
roll_text = app.CreateTextEdit( "" );
roll_layout.AddChild(roll_text)
roll_enter = app.CreateButton( "Play" );
roll_enter.SetOnTouch( Dsmsplay_roll );
roll_layout.AddChild(roll_enter);

wavfrm_spn = app.CreateSpinner( "Saw,Square,Sine" );
wavfrm_spn.SetOnChange( DsmsSetWF );
options_layout.AddChild(wavfrm_spn)
vcasus_txt = app.CreateText( "Vca Sustain" );
options_layout.AddChild(vcasus_txt)
vcasus_scr = app.CreateSeekBar( 1 );
vcasus_scr.SetOnChange( Dsmschange_vcasus );
vcasus_scr.SetRange( 1 );
options_layout.AddChild(vcasus_scr)

vcadec_txt = app.CreateText( "Vca Decay" );
options_layout.AddChild(vcadec_txt)
vcadec_scr = app.CreateSeekBar( 1 );
vcadec_scr.SetOnChange( Dsmschange_vcadec );
vcadec_scr.SetRange( 1 );
options_layout.AddChild(vcadec_scr)

buffer = app.CreateText( "", null, null, "Multiline" );
synth_layout.AddChild(buffer)

clear_btn = app.CreateButton( "Clear" );
clear_btn.SetOnTouch( function() {
tmp_data.buf=""
buffer.SetText( "" );
} );
synth_layout.AddChild( clear_btn );

sendtr_btn = app.CreateButton( "Send to roll" );
sendtr_btn.SetOnTouch( function() {
roll_text.SetText( tmp_data.buf );
} );
synth_layout.AddChild( sendtr_btn );

function Dsmschange_vcasus(e)
{
syn.SetVcaSustain(e)
	vcasus_txt.SetText( "Vca Sustain: "+e );
}

function Dsmschange_vcadec(e)
{
syn.SetVcaDecay(e)
	vcadec_txt.SetText( "Vca Decay: : "+e );
}

function Dsmsdelay_change(e)
{
tmp_data.notelength = e
	syn.SetNoteLength( tmp_data.notelength );
sd_text.SetText( "Note length: " + tmp_data.notelength );
}

function AddButtonDsms(lay, name)
{
	btn = app.CreateButton( name, 0.13, 0.08, "Alum" );
	btn.SetOnTouch( Dsmsbtns_OnTouch );
	lay.AddChild( btn );
}

function Dsmsbtns_OnTouch()
{
btn = this
btn_txt = btn.GetText();
	syn.PlayMidiTune( btn_txt+tmp_data.prefix )
tmp_data.buf+=btn_txt+tmp_data.prefix+","
buffer.SetText( tmp_data.buf );
}

function Dsmsplay_roll()
{
	sht = roll_text.GetText();
syn.PlayMidiTune( sht )
}

function DsmsSetWF(e)
{
	syn.SetWaveShape(e)
}
// КОНЕЦ
addclosebtn(laydsms)
app.AddLayout( laydsms );
}

function get_tmp_data()
{
	return JSON.stringify(tmp_data)
}

function runtestapp()
{
if( app.FileExists( "/sdcard/Rammer/Apps/test.js" ) ) {
  code = app.ReadFile( "/sdcard/Rammer/Apps/test.js" );
eval( code );
} else {
rammer_message("Нет программы в '/sdcard/Rammer/Apps/test.js'. Поместите файл test.js по этому пути. Документация будет доступна потом. ")
//alert(get_tmp_data())
}
}