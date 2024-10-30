/**
 * This class will monitor user mouse movement and clicks.
 */
var Heatmap = {

	// Server address
	Server: WPURL + "/wp-content/plugins/heatmap/loger.php",
	
	// Browser name
	Browser: "",

	// Document element
	Document: "",

	// Define variables
	xmlDoc: null,
	clickHeatTime: 0,


	/**
	 * Constructor
	 */
        init: function()
        {
		// Add onmousedown event using listeners
		if(document.addEventListener)
		{
			document.addEventListener('mousedown', Heatmap.catchClickHeat, false);
		}
		else if(document.attachEvent)
		{
			document.attachEvent('onmousedown', Heatmap.catchClickHeat);
		}

		// Add onfocus event on iframes (mostly ads) - Does NOT work with Gecko-powered browsers, because onfocus doesn't exist on iframes
		iFrames = document.getElementsByTagName('iframe');
		for (i = 0; i < iFrames.length; i++)
		{
			if (document.addEventListener)
			{
				iFrames[i].addEventListener('focus', Heatmap.catchClickHeat, false);
			}
			else if (document.attachEvent)
			{
				iFrames[i].attachEvent('onfocus', Heatmap.catchClickHeat);
			}
		}

                if(typeof window.ActiveXObject != 'undefined')
                {
                        Heatmap.xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
                }
                else
                {
                        Heatmap.xmlDoc = new XMLHttpRequest();
                }
        },

	/**
	 * Function detect browser
	 *
	 * @return boolean
	 */
	IE: function() 
	{
		return (document.all ? true : false);
	},

	/**
	 * Send mouse X,Y coordinates
	 *
	 * @param e Event
	 */
	catchClickHeat: function(e) 
	{	
		// Check if last click was at least 1 second ago
		var clickTime = new Date();
		if((clickTime.getTime() - Heatmap.clickHeatTime) >= 1000)
		{	
			var mouseXY = Heatmap.getMouseXY(e);

	        	Heatmap.sendData(Heatmap.Server+"?heatmap=click&x="+mouseXY[0]+"&y="+mouseXY[1]);
			Heatmap.clickHeatTime = clickTime.getTime();
		}

        	return true;
	},

	/**
	 * Get mouse X,Y coordinates
	 *
	 * @param e Event
	 * @return array
	 */
	getMouseXY: function(e)
	{

		var tempX = 0;
		var tempY = 0;

		// Check browser and get coordinates
		if(Heatmap.IE())
		{
			tempX = event.clientX + document.body.scrollLeft;
			tempY = event.clientY + document.body.scrollTop;
		}
		else
		{
			tempX = e.pageX;
			tempY = e.pageY;
		}
	
		// Return coordinates
		return Array(tempX, tempY);
	},

	/**
	 * Send data to the server.
	 *
	 * @param URL string
	 */
	sendData: function(URL)
	{
		Heatmap.xmlDoc.open("GET", URL, true);
	        Heatmap.xmlDoc.send(null);
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
