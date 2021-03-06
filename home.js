const LEVEL_STRING = ["BASIC","ADVANCED","EXPERT","MASTER"];
const imgsrc = {
	"https://chunithm-net-eng.com/mobile/images/icon_rank_0.png":"rank_d",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_1.png":"rank_c",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_2.png":"rank_b",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_3.png":"rank_bb",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_4.png":"rank_bbb",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_5.png":"rank_a",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_6.png":"rank_aa",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_7.png":"rank_aaa",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_8.png":"rank_s",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_9.png":"rank_ss",
	"https://chunithm-net-eng.com/mobile/images/icon_rank_10.png":"rank_sss",
	"https://chunithm-net-eng.com/mobile/images/icon_fullcombo.png":"fc",
	"https://chunithm-net-eng.com/mobile/images/icon_alljustice.png":"aj",
	"https://chunithm-net-eng.com/mobile/images/icon_text_basic.png":"BASIC",
	"https://chunithm-net-eng.com/mobile/images/icon_text_advanced.png":"ADVANCED",
	"https://chunithm-net-eng.com/mobile/images/icon_text_expert.png":"EXPERT",
	"https://chunithm-net-eng.com/mobile/images/icon_text_master.png":"MASTER",
};

function fetch_musicGenre(){
	console.log("not implemented");
}

function fetch_musicLevel(){
	//current level
	let currentLevel = $("div.box01_title>span")[0].innerHTML
	//do data fetching
	//let count = 0;
	return Array.of(...$("div.w388.musiclist_box")).map((e)=>{
		let result = {};
		result.level = currentLevel;
		result.name = $(e).find(".music_title")[0].innerHTML;
		scoreBox = $(e).find(".play_musicdata_highscore > span.text_b");
		result.score = scoreBox.length <= 0 ? "0" : scoreBox[0].innerHTML.replace(/,/g,"")
		return result;
	}).filter((e)=>e.score > 0);
}

function fetch_playlog(){
	return Array.of(...$("div.frame02")).slice(0,10).map((e)=>{
		let result = {};
		result.name = $(e).find(".play_musicdata_title")[0].innerHTML;
		result.score = $(e).find(".play_musicdata_score_text")[0].innerHTML.replace("Score：","").replace(/,/g,"");
		levelImg = $(e).find(".play_track_result>img").attr("src");
		result.level=imgsrc[levelImg];
		return result;
	});
}

function promise_fetch_expert(){
	return new Promise(function(res,rej){
		$.get("https://chunithm-net-eng.com/mobile/record/musicGenre/expert").done(res).fail(rej);
	});
}

function promise_fetch_master(){
	return new Promise(function(res,rej){
		$.get("https://chunithm-net-eng.com/mobile/record/musicGenre/master").done(res).fail(rej);
	});
}

function promise_fetch_latest(){
	return new Promise(function(res,rej){
		$.get("https://chunithm-net-eng.com/mobile/record/playlog").done(res).fail(rej);
	});
}

function promise_handle_fetch_musicLevel(page){
	return new Promise(function(res,rej){
		let currentLevel = $(page).find("div.box01_title>span")[0].innerHTML;
		let output = Array.of(...$(page).find("div.w388.musiclist_box")).map((e)=>{
			let result = {};
			result.level = currentLevel;
			result.name = $(e).find(".music_title")[0].innerHTML;
			scoreBox = $(e).find(".play_musicdata_highscore > span.text_b");
			result.score = scoreBox.length <= 0 ? "0" : scoreBox[0].innerHTML.replace(/,/g,"")
			return result;
		}).filter((e)=>e.score > 0);
		res(output);
	});
}

function promise_handle_fetch_playlog(page){
	return new Promise(function(res,rej){
		let output = Array.of(...$(page).find("div.frame02")).slice(0,10).map((e)=>{
			let result = {};
			result.name = $(e).find(".play_musicdata_title")[0].innerHTML;
			result.score = $(e).find(".play_musicdata_score_text")[0].innerHTML.replace("Score：","").replace(/,/g,"");
			levelImg = $(e).find(".play_track_result>img").attr("src");
			result.level=imgsrc[levelImg];
			return result;
		});
		res(output);
	});
}

function promise_inject_resource(){
	return new Promise(function(res,rej){
		let s = document.createElement('script');
		s.setAttribute('type', 'text/javascript');
		s.setAttribute('src', 'https://devildelta.github.io/maidx-analyzer/in_lv_superstar.js');
		s.addEventListener('load',res);
		document.getElementsByTagName('head')[0].appendChild(s);
	});
}

function promise_calculate_rating(arrs){
	if(!internal_level_list){
		console.log("internal level list is not loaded. QQ");
		alert('internal level list is not loaded. QQ');
		return;
	}
	
	alert('calculate rating');
}

$(document).ready(()=>{
	if(document.URL.indexOf("record/musicLevel") > -1)fetch_musicLevel();
	if(document.URL.indexOf("record/musicGenre") > -1)fetch_musicGenre();
	if(document.URL.indexOf("record/playlog") > -1)fetch_playlog();
	if(document.URL.indexOf("home/") > -1){
		Promise.all([
			promise_inject_resource(),
			promise_fetch_expert().then(promise_handle_fetch_musicLevel),
			promise_fetch_master().then(promise_handle_fetch_musicLevel),
			promise_fetch_latest().then(promise_handle_fetch_playlog),
		])
		.then(promise_calculate_rating);
	}
});
