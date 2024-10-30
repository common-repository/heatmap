/**
 * This class will monitor user mouse movement and clicks.
 */
var Heatmap = {

	// Server address
	Server: WPURL + "/wp-content/plugins/heatmap/view.php",
	PrevSelectedDay: "",

	/**
	 * Constructor
	 */
        init: function()
        {
		// Create toolbar
		var toolbar = '<div id="heatmap_toolbar">'
			    +    '<div id="heatmap_calendar"><div class="jcalendar-month"></div></div>'
			    +    '<div id="heatmap_content"></div>'
			    +    '<div id="heatmap_arrow" class="arrow_down"></div>'
			    + '</div>';

		// Insert toolbar at the top of the page
		jQuery('body').prepend(toolbar);
		
		// Load Calendar
		jQuery('#heatmap_calendar').jcalendar().css({'opacity': '0.2'})
			.bind("mouseenter", function() {
				jQuery(this).animate({'opacity': '0.7'}, 700);
			})
			.bind("mouseleave", function() {
				jQuery(this).animate({'opacity': '0.2'}, 700);
			});

		// Toggle heatmap layer
		jQuery('#heatmap_arrow').toggle(
			function() {
				jQuery('#heatmap_arrow').css({'position': 'absolute', 'top': 'auto', 'bottom': '0px'});

 	              		jQuery('#heatmap_content').css({ 'position': 'relative', 'z-index': '10000' }).animate({ 'opacity': '0.7', 'top': '0px', 'height': jQuery(document).height() }, 1000, function() {
					jQuery('#heatmap_arrow').css({'position': 'fixed', 'bottom': '0px', 'top': 'auto', 'background-image': 'url(wp-content/plugins/heatmap/images/arrow-up.jpg)'});
					Heatmap.Load();
					jQuery('#heatmap_calendar').show();
				});
			},
			function() {
				jQuery('#heatmap_arrow').css({'position': 'absolute', 'top': 'auto', 'bottom': '0px'});

                        	jQuery('#heatmap_content').animate({ 'opacity': '1', 'height': '0px' }, 1000, function() {
					jQuery('#heatmap_content').empty();
					jQuery('#heatmap_calendar').hide();
					jQuery('#heatmap_arrow').css({'position': 'fixed', 'bottom': 'auto', 'top': '0px', 'background-image': 'url(wp-content/plugins/heatmap/images/arrow-down.jpg)'});
				});
                        }
		);
        },
	
	/**
	 * Load heatmap data
	 *
	 * @param day String
	 */
	Load: function(selectedDay) 
	{
		var day = "";
		var month = "";
		var year = "";
	
		// Open previous selected day if new is not set
		if(selectedDay == undefined && Heatmap.PrevSelectedDay != "")
		{
			selectedDay = Heatmap.PrevSelectedDay;
		}

		if(selectedDay != undefined) 
		{	
			Heatmap.PrevSelectedDay = selectedDay;

			var date = new Date(selectedDay);
			day = date.getDate();
			month = date.getMonth()+1;
			year = date.getFullYear();
		}
	

		jQuery('#heatmap_content').empty();
		jQuery('#heatmap_content').load(Heatmap.Server+'?screen='+jQuery(window).width()+'&day='+day+'&month='+month+'&year='+year+'&rand='+new Date().getTime());
	}

};


/**
 * Function load Heatmap when document is ready
 */
(function(i) {
	var u = navigator.userAgent;
	var e = /*@cc_on!@*/false; 
	var st = setTimeout;

	if(/webkit/i.test(u))
	{
		st(function()
		{
			var dr = document.readyState;
			if(dr == "loaded" || dr == "complete") 
			{
				i()
			} 
			else
			{
				st(arguments.callee,10);
			}
		}, 10);
	}
	else if((/mozilla/i.test(u)&&!/(compati)/.test(u)) || (/opera/i.test(u)))
	{
		document.addEventListener("DOMContentLoaded",i,true); 
	} 
	else if(e)
	{     
		(function()
		{
			var t = document.createElement('doc:rdy');
			try 
			{
				t.doScroll('left');
				i();
				t = null;
			}
			catch(e)
			{
				st(arguments.callee,0);
			}
		})();
	}
	else
	{
		window.onload = i;
	}
})(Heatmap.init);
