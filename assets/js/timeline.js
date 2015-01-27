function renderTimeLine(elSel, arr){
	var yearPixel, //Width of each year in pixels
		yearTotal,
		xDim, //Width of el
		padWidth = 3,
		percentageFull = 100;

	xDim = $(elSel).width();
	xDim -= ((arr.length) * padWidth); //Pad each element to at least this thick
	yearTotal = arr[0].dateEnd - arr[arr.length-1].dateStart + (arr.length * 2);
	yearPixel = (100 - padWidth * arr.length)/ yearTotal;//Width of years / pixels in element
	for(el in arr){
		//Take object and set width
		//create div, set properties
		//Add to el
		var a = $('<div>');
		var epochYearCount = arr[el].dateEnd - arr[el].dateStart;// Work out differences between numbers, in positive
		var percentageWidth = Math.floor(((epochYearCount * yearPixel) + padWidth));
		arr[el].percentageStart = percentageFull;
		arr[el].percentageEnd = percentageFull - percentageWidth;

		a.addClass("el"+ el);
		a.css('width', percentageWidth + '%');
		//Add name
		//Add color
		$(elSel).prepend(a);
		percentageFull -= percentageWidth;
	}
	var tooltip = $('<div class="slidertooltip" />').css({
	    position: 'absolute',
	    top: -25,
	    left: -10
	}).text('Drag me').show();
	$(".ui-slider-handle").append(tooltip).hover(function() {
	}, function() {
	    tooltip.remove();
	})
	// $('.ui-slider-handle').on('show.bs.tooltip', function () {
	// 	console.log('hiding');
	// 	$('.ui-slider-handle').tooltip('destroy');
	// });
	// $('.ui-slider-handle').tooltip({
	// 	placement: 'top',
	// 	title: 'Drag me'
	// }).tooltip('show');
}