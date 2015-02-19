function renderTimeLine(elSel, arr){
	var yearPixel, //Width of each year in pixels
		yearTotal,
		xDim, //Width of el
		padWidth = 4,
		percentageFull = 100;
	$(elSel).html('');
	$('.ui-slider-handle').html();//Clear for hover
	xDim = $(elSel).width();
	xDim -= ((arr.length) * padWidth); //Pad each element to at least this thick
	yearTotal = arr[0].dateEnd - arr[arr.length-1].dateStart; //+ (arr.length * 2);
	yearPixel = (100 - padWidth * arr.length)/ yearTotal;//Width of years / pixels in element
	for(el in arr){
		//Take object and set width
		//create div, set properties
		//Add to el
		var a = $('<div>');
		var epochYearCount = arr[el].dateEnd - arr[el].dateStart;// Work out differences between numbers, in positive
		var percentageWidth = Math.round(((epochYearCount * yearPixel) + padWidth));
		arr[el].percentageStart = percentageFull;
		arr[el].percentageEnd = percentageFull - percentageWidth;
		var dateStr = "";
		dateStr += Math.abs(arr[el].dateStart);
		if(arr[el].dateStart < 0){
			dateStr += "BC";
		} else {
			dateStr += "AD";
		}
		dateStr += ' - ';
		dateStr += Math.abs(arr[el].dateEnd);
		if(arr[el].dateEnd < 0){
			dateStr += "BC";
		} else {
			dateStr += "AD";
		}
		a.text(dateStr);
		a.addClass("el"+ el);
		a.css('width', percentageWidth + '%');
		//Add name
		//Add color
		$(elSel).prepend(a);
		percentageFull -= percentageWidth;
	}

	// var tooltip = $('<div class="slidertooltip" />').css({
	//     position: 'absolute',
	//     top: '-25px',
	//     left: '-10px'
	// }).text('Drag me').show();
	// $(".ui-slider-handle").append(tooltip).hover(function() {
	// }, function() {
	//     tooltip.remove();
	// })

	// $('.ui-slider-handle').on('show.bs.tooltip', function () {
	// 	$('.ui-slider-handle').tooltip('destroy');
	// });
	// $('.ui-slider-handle').tooltip({
	// 	placement: 'top',
	// 	title: 'Drag me'
	// }).tooltip('show');
}