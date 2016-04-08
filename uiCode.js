function openOptions() {
	document.getElementById('Options').className='show optionsshadow';


}


function closeOptions() {
	document.getElementById('Options').className='hide optionsshadow';//Hide the options.
}

var currentTab = 1;
function changeText (clickedTab) {
	var tab = "tab" + clickedTab.toString();
	var pickTab = "pickTab" + clickedTab.toString();




	document.getElementById(tab).className='text_show';



	document.getElementById(("tab" + currentTab.toString())).className='text_hide';


	document.getElementById(pickTab).className='tab_active';
	document.getElementById(("pickTab" + currentTab.toString())).className='tab';

	currentTab = clickedTab;

}





