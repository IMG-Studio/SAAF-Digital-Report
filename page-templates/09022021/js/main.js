window.addEventListener("DOMContentLoaded", event => 
{
	// Revised animation structure
	class ElementAnimation 
	{	
		constructor(_identifier, _property, _propertyInitialValue, _propertyTargetValue, _scrollStartOffset, _scrollStopOffset, _updateCallback = undefined) {
			
			// Future update to accept hashed id attribute element identifiers
			// currently accepts only class
			this.identifier = _identifier;
			this.container = document.getElementsByClassName(this.identifier)[0];
			this.property = _property;
			this.propertyInitialValue = _propertyInitialValue;
			this.propertyTargetValue = _propertyTargetValue;
			this._scrollStartOffset = _scrollStartOffset;
			this._scrollStopOffset = _scrollStopOffset;
			this.scrollStartOffset = (_scrollStartOffset / 100) * window.innerHeight;
			this.scrollStopOffset = (_scrollStopOffset / 100) * window.innerHeight;
				// update scroll-dummy-overlay if > overlay height document.getElementsByClassName("scroll-dummy-overlay")[0].style.height = (window.innerHeight * stop/100) + "px";
			this.updateCallback = _updateCallback;

			this.animationPercentage = undefined; // For use in animate()
			this.animationValue = undefined // For use in animate()
			this.lastAnimationValue = undefined // For use in animate()

			if (ElementAnimation.createdAnimations[this.identifier] == undefined)
				ElementAnimation.createdAnimations[this.identifier] = {};
			
			if (ElementAnimation.createdAnimations[this.identifier][this.property] == undefined)
				ElementAnimation.createdAnimations[this.identifier][this.property] = [];

			ElementAnimation.createdAnimations[this.identifier][this.property].push(this);
		}

		static setScrollDummyHeight () {
			document.getElementsByClassName("scroll-dummy-overlay")[0].style.height = 
				((window.innerHeight * (1 + (getLastScrollAnimation()._scrollStopOffset / 100))) * ElementAnimation.scrollFactor) + "px"; // 1 + adds window height to scrollStopOffset percentage height. scrollStopOffset equally 2000 = 20 window heights or common slide height of (100 vh)
		}

		// Consider moving to static
		update (pageScrollPosition) {
			if (pageScrollPosition >= this.scrollStopOffset)
			{
				this.container.classList.remove("active");

					// may require a settimeout delay between active and completed for CSS animations
				this.container.classList.add("completed");
			}
			else {
				// may require a settimeout delay between completed and active for CSS animations
				if (pageScrollPosition >= this.scrollStartOffset)
				{
					this.container.classList.add("active");
					this.container.classList.remove("completed");
				}
				else {
					this.container.classList.remove("active");
				}
			}

			this.animate(pageScrollPosition);

			if (typeof this.updateCallback == "function")
				this.updateCallback(pageScrollPosition, this.scrollStartOffset, this.scrollStopOffset);
		}

		// consider moving to static
		animate (pageScrollPosition) {
			this.animationPercentage = (pageScrollPosition - this.scrollStartOffset) / (this.scrollStopOffset - this.scrollStartOffset);
			this.animationValue = this.propertyInitialValue + ((this.propertyTargetValue - this.propertyInitialValue) * this.animationPercentage);

			if (this.lastAnimationValue != this.animationValue) {
				// console.log ("| Animate " + this.property);
				// console.log ("| ------- " + this.propertyInitialValue + " --> " + this.propertyTargetValue);
				// console.log ("| ------- " + this.animationPercentage + "%  ===  " + this.animationValue);
				// console.log ("| |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")

				switch (this.property) {
					case "opacity":

						this.container.style.opacity = this.animationValue;

						break;

					case "margin-left":

						this.container.style.marginLeft = this.animationValue + "px";

						break;

					case "scale":

						this.container.style.transform = "scale(" + this.animationValue + ")";

						break;
				}

				this.lastAnimationValue = this.animationValue;
			}
		}
	}

	ElementAnimation.createdAnimations = {};
	ElementAnimation.scrollFactor = 1.95; // 1 normal scroll speed, 2 scrolling takes twice as long, 3 scrolling takes three times as long as normal
	ElementAnimation.scrollDisabled = false;

	/*
	ElementAnimation.createdAnimations = 
	{
		"element-identifier-1": {
			"property-1": [ElementAnimation(), ElementAnimation()],
			"property-2": [ElementAnimation(), ElementAnimation()]
		},
		"element-identifier-1": {
			...
		}
	}
	*/


	// Page scroll animations

	new ElementAnimation("section-1", "opacity", 
		// initial property at start of animation, target property at stop of animation
		1.0, 0.0, 
		// Scroll min, max
		35, 100
	);
	new ElementAnimation("header-top", "opacity", 1.0, 0.0, 35, 100);
	// new ElementAnimation("section-1__text-1", "opacity",  1.0,  0.0,  0, 100);
	// new ElementAnimation("section-1__text-1", "margin-left",  50,    0,  0, 100);
	// new ElementAnimation("section-1__text-2", "opacity",  1.0,  0.0,  0, 100);
	// new ElementAnimation("section-1__text-2", "margin-left",  50,    0,  0, 100);

	new ElementAnimation("header-left", "opacity", 0.0, 1.0, 100, 120);
	new ElementAnimation("header-left", "margin-left", -100, 0, 100, 120);

	console.log ("margin-left as percent window");
	new ElementAnimation("section-2__text-1", "opacity",  0.0,  1.0,  105, 120);
	new ElementAnimation("section-2__text-1", "margin-left",  50,    0,  105, 120);
	new ElementAnimation("section-2__text-2", "opacity",  0.0,  1.0,  110, 125);
	new ElementAnimation("section-2__text-2", "margin-left",  50,    0,  110, 125);
	new ElementAnimation("section-2__text-3", "opacity",  0.0,  1.0,  110, 125);
	new ElementAnimation("section-2__text-3", "margin-left",  50,    0,  110, 125);
	new ElementAnimation("section-2__text-4", "opacity",  0.0,  1.0,  130, 145);
	new ElementAnimation("button-next-slide-section-2", "opacity",  0.0,  1.0,  110, 120);
	new ElementAnimation("button-ripple-2", "scale", 1.0, 2.0, 120, 130);
	new ElementAnimation("button-ripple-2", "scale", 2.0, 1.5, 131, 135);
	new ElementAnimation("button-ripple-2", "scale", 1.5, 2.0, 136, 140);
	new ElementAnimation("button-ripple-2", "scale", 2.0, 1.0, 139, 150);

	new ElementAnimation("section-2", "opacity", 1.0, 0.0, 175, 190);

	new ElementAnimation("section-3__title", "margin-left", 100, 0, 100, 500);
	new ElementAnimation("section-4__title", "margin-left", 100, 0, 100, 500);
	new ElementAnimation("section-5__title", "margin-left", 100, 0, 100, 500);

	new ElementAnimation("section-3__subtitle", "opacity", 0.0, 1.0, 195, 215);
	new ElementAnimation("section-3__subtitle", "margin-left", 100, 0, 195, 300);
	new ElementAnimation("section-3__icon", "opacity", 0.0, 1.0, 195, 210);

	// // //new ElementAnimation("section-3__titlecontainer", "margin-left", 65, 80, 50, 0);
	// //new ElementAnimation("section-3__icon", "opacity", 240, 265, 0.0, 1.0);
	new ElementAnimation("section-3__icon", "opacity", 1.0, 0.0, 264, 265);
	new ElementAnimation("section-3__background", "opacity", 1.0, 0.0, 265, 300);
	new ElementAnimation("section-3__title-1", "opacity", 1.0, 0.0, 215, 240);
	new ElementAnimation("section-3__title-2", "opacity", 1.0, 0.0, 215, 240);
	new ElementAnimation("section-3__subtitle", "opacity", 1.0, 0.0, 245, 270);

	new ElementAnimation("section-4__background", "scale", 1.0, 1.05, 245, 500);
	new ElementAnimation("section-4__pretitle", "opacity", 0.0, 1.0, 300, 315);
	new ElementAnimation("section-4__text", "opacity", 0.0, 1.0, 300, 340);
	
	new ElementAnimation("section-4__pretitle", "margin-left", 50, 0, 250, 385);
	new ElementAnimation("section-4__pretitle", "opacity", 1.0, 0.0, 350, 385);
	new ElementAnimation("section-4__title-1", "opacity", 1.0, 0.0, 340, 385);
	new ElementAnimation("section-3__title", "opacity", 1.0, 0.0, 340, 385);
	new ElementAnimation("section-4__text", "opacity", 1.0, 0.0, 350, 385);

	new ElementAnimation("section-3", "opacity", 1.0, 0.0, 370, 385);

	new ElementAnimation("section-4__background", "opacity", 1.0, 0.0, 390, 405);
	new ElementAnimation("section-4", "opacity", 1.0, 0.0, 390, 405);

	new ElementAnimation("section-5__background", "scale", 1.0, 1.05, 245, 500);
	new ElementAnimation("section-5__pretitle", "margin-left", 50, 0, 390, 485);
	new ElementAnimation("button-prev-slide-section-5", "opacity", 0.0, 1.0, 405, 415);
	new ElementAnimation("button-next-slide-section-5", "opacity", 0.0, 1.0, 405, 415);
	new ElementAnimation("button-ripple-5", "scale", 1.0, 5, 420, 440);
	new ElementAnimation("button-ripple-5", "scale", 5, 1.0, 450, 470);

	new ElementAnimation("section-5", "opacity", 1.0, 0.0, 470, 485);

	new ElementAnimation("section-6__background", "scale", 1.0, 1.05, 470, 700);
	new ElementAnimation("section-6__pretitle", "margin-left", 50, 0, 470, 585);
	new ElementAnimation("section-6__pretitle", "opacity", 0.0, 1.0, 470, 500);
	new ElementAnimation("section-6__title", "margin-left", 50, 0, 480, 585);
	new ElementAnimation("section-6__title", "opacity", 0.0, 1.0, 490, 520);

	// new ElementAnimation("section-6__pretitle", "opacity", 1.0, 0.0, 520, 500);
	// new ElementAnimation("section-6__title", "opacity", 1.0, 0.0, 490, 520);
	new ElementAnimation("section-6", "opacity", 1.0, 0.0, 570, 585);

	new ElementAnimation("section-7__background", "scale", 1.0, 1.05, 470, 700);
	new ElementAnimation("section-7__text", "opacity", 0.0, 1.0, 585, 600);

	// Section 7 | Closing
	new ElementAnimation("section-7", "opacity", 1.0, 0.0, 670, 685);

	// Section 8 | Active
	new ElementAnimation("section-8__title", "margin-left", 150, 0, 670, 850);
	new ElementAnimation("section-8__subtitle", "margin-left", 100, 0, 670, 750);
	new ElementAnimation("section-8__subtitle-wrapper", "opacity", 0.0, 1.0, 680, 710);

	// Section 8 | Closing
	new ElementAnimation("section-8__background", "opacity", 1.0, 0.0, 770, 790);
	new ElementAnimation("section-8__title-1", "opacity", 1.0, 0.0, 700, 760);
	new ElementAnimation("section-8__title-2", "opacity", 1.0, 0.0, 700, 760);
	new ElementAnimation("section-8__subtitle", "opacity", 1.0, 0.0, 700, 770);
	new ElementAnimation("section-8__icon", "opacity", 1.0, 0.0, 700, 760);

	new ElementAnimation("section-8", "opacity", 1.0, 0.0, 785, 795);

	//Section 9 | Active
	new ElementAnimation("section-9__background", "scale", 1.0, 1.05, 785, 1100);
	new ElementAnimation("section-9__title", "margin-left", 125, 0, 790, 850);
	new ElementAnimation("section-9__title", "opacity", 0.0, 1.0, 790, 825);
		new ElementAnimation("section-9__pretitle", "margin-left", 50, 0, 790, 850);
		new ElementAnimation("section-9__pretitle", "opacity", 0.0, 1.0, 805, 860);
			new ElementAnimation("section-9__subtitle", "margin-left", 50, 0, 820, 850);
			new ElementAnimation("section-9__subtitle", "opacity", 0.0, 1.0, 820, 850);
				new ElementAnimation("section-9__stats", "margin-left", 50, 0, 830, 860);
				new ElementAnimation("section-9__stats", "opacity", 0.0, 1.0, 830, 860);


	new ElementAnimation("section-9", "opacity", 1.0, 0.0, 885, 900);

	new ElementAnimation("section-10__background", "scale", 1.0, 1.05, 785, 1100);
	new ElementAnimation("section-10__total-wrapper", "opacity", 0.0, 1.0, 900, 970);

	// Continue here
	var barTotalTargets = [3199110, 3922681, 4655491, 5168063, 6156827, 6490115, 42309054];
	var barTotals = [0, 0, 0, 0, 0, 0, 0];
	//var updateTotalTimeout = undefined; // Prevent updating of total html with every single bar every single pixel scrolled. 

	var updateBarCallback = function(barIndex, sp, ssta, ssto) { 
		barTotals[barIndex-1] = barTotalTargets[barIndex-1] * ((sp - ssta) / (ssto - ssta));

		//updateTotalTimeout = setTimeout(function() { 
			document.getElementsByClassName("section-10__total-wrapper")[0].innerHTML = '$' + barAmount();
		
		//}, 25); 
	};

	var barAmount = function() {
		var totalString = Math.round(barTotals.reduce((a, b) => a + b, 0)).toLocaleString();

		if (totalString == "0")
			totalString = "-";

		return totalString;
	}

	new ElementAnimation("section-10__bar bar-7", "opacity", 0.0, 1.0, 900, 910, function(sp, ssta, ssto) { updateBarCallback(7, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-6", "opacity", 0.0, 1.0, 910, 920, function(sp, ssta, ssto) { updateBarCallback(6, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-5", "opacity", 0.0, 1.0, 920, 930, function(sp, ssta, ssto) { updateBarCallback(5, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-4", "opacity", 0.0, 1.0, 930, 940, function(sp, ssta, ssto) { updateBarCallback(4, sp, ssta, ssto); });
	
	new ElementAnimation("section-10__bar bar-3", "opacity", 0.0, 1.0, 940, 950, function(sp, ssta, ssto) { updateBarCallback(3, sp, ssta, ssto); });
	
	new ElementAnimation("section-10__bar bar-2", "opacity", 0.0, 1.0, 950, 960, function(sp, ssta, ssto) { updateBarCallback(2, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-1", "opacity", 0.0, 1.0, 960, 970, function(sp, ssta, ssto) { updateBarCallback(1, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-7", "opacity", 1.0, 0.0, 980, 1000);
	new ElementAnimation("section-10__bar bar-6", "opacity", 1.0, 0.0, 980, 1000);
	new ElementAnimation("section-10__bar bar-5", "opacity", 1.0, 0.0, 980, 1000);
	new ElementAnimation("section-10__bar bar-4", "opacity", 1.0, 0.0, 980, 1000);
	new ElementAnimation("section-10__bar bar-3", "opacity", 1.0, 0.0, 980, 1000);
	new ElementAnimation("section-10__bar bar-2", "opacity", 1.0, 0.0, 980, 1000);

	new ElementAnimation("section-10__total", "opacity", 1.0, 0.0, 975, 1000);
	new ElementAnimation("section-10__background", "opacity", 1.0, 0.0, 975, 1000, true);

	new ElementAnimation("section-11__background", "scale", 1.0, 1.05, 785, 1100);
	new ElementAnimation("section-11__pretitle", "opacity", 0.0, 1.0, 995, 1015);
	new ElementAnimation("section-11__pretitle", "margin-left", 50, 0, 995, 1010);
	new ElementAnimation("section-11__title", "opacity", 0.0, 1.0, 1005, 1025);
	new ElementAnimation("section-11__title", "margin-left", 50, 0, 995, 1010);
	new ElementAnimation("section-11__text", "opacity", 0.0, 1.0, 1005, 1025);
	new ElementAnimation("section-11__text", "margin-left", 50, 0, 1000, 1015);
	new ElementAnimation("section-11__bardetails", "opacity", 0.0, 1.0, 1025, 1045);
	new ElementAnimation("section-11__bardetails", "margin-left", 75, 0, 995, 1010);
	new ElementAnimation("section-11__note", "opacity", 0.0, 1.0, 1030, 1050);
	new ElementAnimation("section-11__note", "margin-left", 75, 0, 995, 1010);

	new ElementAnimation("section-10", "opacity", 1.0, 0.0, 1085, 1100);
	new ElementAnimation("section-11", "opacity", 1.0, 0.0, 1085, 1100);


	new ElementAnimation("section-12__image", "scale", 0.95, 0.975, 1100, 1112);
	new ElementAnimation("section-12__image", "scale", 0.975, 1.0, 1112, 1115);
	new ElementAnimation("section-12__image", "margin-left", -60, 0, 1100, 1110);
	new ElementAnimation("section-12__image", "opacity", 0.0, 1.0, 1100, 1115);
	new ElementAnimation("section-12__imageshorttext", "opacity", 0.0, 1.0, 1100, 1130);
	new ElementAnimation("section-12__title", "opacity", 0.0, 1.0, 1110, 1140);
	new ElementAnimation("section-12__title", "margin-left", 50, 0, 1110, 1140);
	new ElementAnimation("section-12__text", "opacity", 0.0, 1.0, 1120, 1150);
	new ElementAnimation("section-12__text", "margin-left", 50, 0, 1120, 1150);
	new ElementAnimation("button-next-slide-section-12", "opacity", 0.0, 1.0, 1130, 1150);

	new ElementAnimation("section-12", "opacity", 1.0, 0.0, 1165, 1200);


	new ElementAnimation("section-13__image", "scale", 0.95, 0.975, 1200, 1212);
	new ElementAnimation("section-13__image", "scale", 0.975, 1.0, 1212, 1215);
	new ElementAnimation("section-13__image", "margin-left", -60, 0, 1200, 1210);
	new ElementAnimation("section-13__image", "opacity", 0.0, 1.0, 1200, 1215);
	new ElementAnimation("section-13__imageshorttext", "opacity", 0.0, 1.0, 1200, 1230);
	new ElementAnimation("section-13__title", "opacity", 0.0, 1.0, 1210, 1240);
	new ElementAnimation("section-13__title", "margin-left", 50, 0, 1210, 1240);
	new ElementAnimation("section-13__text", "opacity", 0.0, 1.0, 1220, 1250);
	new ElementAnimation("section-13__text", "margin-left", 50, 0, 1220, 1250);
	new ElementAnimation("button-next-slide-section-13", "opacity", 0.0, 1.0, 1230, 1250);

	new ElementAnimation("section-13", "opacity", 1.0, 0.0, 1265, 1300);


	new ElementAnimation("section-14__image", "scale", 0.95, 0.975, 1300, 1312);
	new ElementAnimation("section-14__image", "scale", 0.975, 1.0, 1312, 1315);
	new ElementAnimation("section-14__image", "margin-left", -60, 0, 1300, 1310);
	new ElementAnimation("section-14__image", "opacity", 0.0, 1.0, 1300, 1315);
	new ElementAnimation("section-14__imageshorttext", "opacity", 0.0, 1.0, 1300, 1330);
	new ElementAnimation("section-14__title", "opacity", 0.0, 1.0, 1310, 1340);
	new ElementAnimation("section-14__title", "margin-left", 50, 0, 1310, 1340);
	new ElementAnimation("section-14__text", "opacity", 0.0, 1.0, 1320, 1350);
	new ElementAnimation("section-14__text", "margin-left", 50, 0, 1320, 1350);
	new ElementAnimation("button-next-slide-section-14", "opacity", 0.0, 1.0, 1330, 1350);

	new ElementAnimation("section-14", "opacity", 1.0, 0.0, 1365, 1400);


	new ElementAnimation("section-15__image", "scale", 0.95, 0.975, 1400, 1412);
	new ElementAnimation("section-15__image", "scale", 0.975, 1.0, 1412, 1415);
	new ElementAnimation("section-15__image", "margin-left", -60, 0, 1400, 1410);
	new ElementAnimation("section-15__image", "opacity", 0.0, 1.0, 1400, 1415);
	new ElementAnimation("section-15__imageshorttext", "opacity", 0.0, 1.0, 1400, 1470);
	new ElementAnimation("section-15__pretitle", "opacity", 0.0, 1.0, 1415, 1480);
	new ElementAnimation("section-15__pretitle", "margin-left", 50, 0, 1415, 1480);
	new ElementAnimation("section-15__title", "opacity", 0.0, 1.0, 1410, 1440);
	new ElementAnimation("section-15__title", "margin-left", 50, 0, 1410, 1440);
	new ElementAnimation("section-15__text", "opacity", 0.0, 1.0, 1420, 1450);
	new ElementAnimation("section-15__text", "margin-left", 50, 0, 1420, 1450);
	new ElementAnimation("button-next-slide-section-15", "opacity", 0.0, 1.0, 1430, 1450);

	new ElementAnimation("section-15", "opacity", 1.0, 0.0, 1465, 1500);


	new ElementAnimation("section-16__background", "scale", 1.0, 1.05, 1465, 1700);
	new ElementAnimation("section-16__pretitle", "opacity", 0.0, 1.0, 1515, 1545);
	new ElementAnimation("section-16__pretitle", "margin-left", 50, 0, 1515, 1545);
	new ElementAnimation("section-16__title", "opacity", 0.0, 1.0, 1530, 1560);
	new ElementAnimation("section-16__title", "margin-left", 50, 0, 1530, 1560);

	new ElementAnimation("section-16", "opacity", 1.0, 0.0, 1565, 1600);


	new ElementAnimation("section-17__background", "scale", 1.0, 1.05, 1465, 1700);
	new ElementAnimation("section-17__text", "opacity", 0.0, 1.0, 1620, 1650);

	new ElementAnimation("section-17", "opacity", 1.0, 0.0, 1665, 1700);


	new ElementAnimation("section-18__title", "opacity", 0.0, 1.0, 1715, 1745);
	new ElementAnimation("section-18__title", "margin-left", 50, 0, 1720, 1750);
	new ElementAnimation("section-18__subtitle", "opacity", 0.0, 1.0, 1720, 1750);
	new ElementAnimation("section-18__subtitle", "margin-left", 100, 0, 1720, 1750);
	new ElementAnimation("section-18__icon", "opacity", 0.0, 1.0, 1720, 1750);

	new ElementAnimation("section-18", "opacity", 1.0, 0.0, 1765, 1800);


	new ElementAnimation("section-19__background", "scale", 1.0, 1.05, 1765, 1900);
	new ElementAnimation("section-19__pretitle", "opacity", 0.0, 1.0, 1815, 1845);
	new ElementAnimation("section-19__pretitle", "margin-left", 50, 0, 1815, 1845);
	new ElementAnimation("section-19__title", "opacity", 0.0, 1.0, 1820, 1850);
	new ElementAnimation("section-19__title", "margin-left", 50, 0, 1820, 1850);
	new ElementAnimation("section-19__text", "opacity", 0.0, 1.0, 1825, 1855);
	new ElementAnimation("section-19__text", "margin-left", 50, 0, 1825, 1855);

	new ElementAnimation("section-19", "opacity", 1.0, 0.0, 1865, 1900);


	new ElementAnimation("section-20__background", "scale", 1.0, 1.05, 1865, 2000);
	new ElementAnimation("section-20__pretitle", "opacity", 0.0, 1.0, 1901, 1930);
	new ElementAnimation("section-20__pretitle", "margin-left", 50, 0, 1900, 1930);
	new ElementAnimation("section-20__title", "opacity", 0.0, 1.0, 1905, 1935);
	new ElementAnimation("section-20__title", "margin-left", 50, 0, 1905, 1935);
	new ElementAnimation("section-20__text", "opacity", 0.0, 1.0, 1910, 1940);
	new ElementAnimation("section-20__text", "margin-left", 50, 0, 1910, 1940);

	new ElementAnimation("section-20", "opacity", 1.0, 0.0, 1965, 2000);


	new ElementAnimation("section-21__pretitle", "opacity", 0.0, 1.0, 2015, 2065);
	new ElementAnimation("section-21__pretitle", "margin-left", 50, 0, 2020, 2070);
	new ElementAnimation("section-21__title", "opacity", 0.0, 1.0, 2015, 2075);
	new ElementAnimation("section-21__title", "margin-left", 50, 0, 2015, 2075);
	new ElementAnimation("section-21__main-content", "opacity", 0.0, 1.0, 2015, 2085);
	new ElementAnimation("section-21__quoter", "opacity", 0.0, 1.0, 2020, 2100);

	new ElementAnimation("section-21", "opacity", 1.0, 0.0, 2065, 2100);


	new ElementAnimation("section-22__pretitle", "opacity", 0.0, 1.0, 2115, 2165);
	new ElementAnimation("section-22__pretitle", "margin-left", 50, 0, 2120, 2170);
	new ElementAnimation("section-22__title", "opacity", 0.0, 1.0, 2115, 2175);
	new ElementAnimation("section-22__title", "margin-left", 50, 0, 2115, 2175);
	new ElementAnimation("section-22__main-content", "opacity", 0.0, 1.0, 2115, 2175);

	new ElementAnimation("section-22", "opacity", 1.0, 0.0, 2165, 2200);


	new ElementAnimation("section-23__pretitle", "opacity", 0.0, 1.0, 2215, 2235);
	new ElementAnimation("section-23__pretitle", "margin-left", 50, 0, 2215, 2235);
	new ElementAnimation("section-23__title", "opacity", 0.0, 1.0, 2215, 2235);
	new ElementAnimation("section-23__title", "margin-left", 50, 0, 2215, 2235);
	new ElementAnimation("button-next-slide-section-23", "opacity", 0.0, 1.0, 2215, 2235);

	new ElementAnimation("section-23__sector sector-1", "opacity", 0.0, 1.0, 2225, 2245);
	new ElementAnimation("section-23__sector sector-2", "opacity", 0.0, 1.0, 2235, 2255);
	new ElementAnimation("section-23__sector sector-3", "opacity", 0.0, 1.0, 2245, 2265);

	new ElementAnimation("section-23", "opacity", 1.0, 0.0, 2265, 2300);


	new ElementAnimation("section-24__background", "scale", 1.0, 1.05, 2265, 2500);
	new ElementAnimation("section-24__pretitle", "margin-left", 150, 0, 2320, 2330);
	new ElementAnimation("section-24__pretitle", "opacity", 0.0, 1.0, 2320, 2330);
	new ElementAnimation("section-24__title", "margin-left", 150, 0, 2320, 2330);
	new ElementAnimation("section-24__title", "opacity", 0.0, 1.0, 2320, 2330);
	new ElementAnimation("section-24__subtitle", "margin-left", 100, 0, 2320, 2330);
	new ElementAnimation("section-24__subtitle", "opacity", 0.0, 1.0, 2320, 2330);

	new ElementAnimation("section-24", "opacity", 1.0, 0.0, 2365, 2400);


	new ElementAnimation("section-25__background", "scale", 1.0, 1.05, 2265, 2500);
	new ElementAnimation("section-25__text", "opacity", 0.0, 1.0, 2450, 2470);

	new ElementAnimation("section-25", "opacity", 1.0, 0.0, 2485, 2500);


	new ElementAnimation("section-26__title", "margin-left", 150, 0, 2485, 2530);
	new ElementAnimation("section-26__title", "opacity", 0.0, 1.0, 2485, 2530);
	new ElementAnimation("section-26__subtitle", "margin-left", 100, 0, 2485, 2530);
	new ElementAnimation("section-26__subtitle", "opacity", 0.0, 1.0, 2485, 2530);
	new ElementAnimation("section-26__icon", "opacity", 0.0, 1.0, 2485, 2530);

	new ElementAnimation("section-26", "opacity", 1.0, 0.0, 2585, 2600);


	new ElementAnimation("section-27__pretitle", "opacity", 0.0, 1.0, 2600, 2700);
	new ElementAnimation("section-27__pretitle", "margin-left", 50, 0, 2600, 2700);
	new ElementAnimation("section-27__title", "opacity", 0.0, 1.0, 2605, 2700);
	new ElementAnimation("section-27__title", "margin-left", 50, 0, 2605, 2700);
	new ElementAnimation("section-27__main-content", "opacity", 0.0, 1.0, 2610, 2630);

	new ElementAnimation("section-27", "opacity", 1.0, 0.0, 2685, 2700);



	new ElementAnimation("section-28__main-content", "opacity", 0.0, 1.0, 2710, 2730);

	new ElementAnimation("section-28", "opacity", 1.0, 0.0, 2785, 2800);


	new ElementAnimation("section-29__background", "scale", 1.0, 1.05, 2785, 2900);
	new ElementAnimation("section-29__pretitle", "opacity", 0.0, 1.0, 2800, 2830);
	new ElementAnimation("section-29__pretitle", "margin-left", 50, 0, 2800, 2830);
	new ElementAnimation("section-29__title", "opacity", 0.0, 1.0, 2800, 2830);
	new ElementAnimation("section-29__title", "margin-left", 50, 0, 2800, 2830);
	new ElementAnimation("section-29__text", "opacity", 0.0, 1.0, 2800, 2830);
	new ElementAnimation("section-29__text", "margin-left", 50, 0, 2800, 2830);

	new ElementAnimation("section-29", "opacity", 1.0, 0.0, 2885, 2900);


	new ElementAnimation("section-30__background", "scale", 1.0, 1.05, 2885, 3000);
	new ElementAnimation("section-30__pretitle", "opacity", 0.0, 1.0, 2905, 2935);
	new ElementAnimation("section-30__pretitle", "margin-left", 50, 0, 2905, 2935);
	new ElementAnimation("section-30__title", "opacity", 0.0, 1.0, 2910, 2940);
	new ElementAnimation("section-30__title", "margin-left", 50, 0, 2910, 2940);
	new ElementAnimation("section-30__link-1", "opacity", 0.0, 1.0, 2920, 2950);
	new ElementAnimation("section-30__link-1", "margin-left", 50, 0, 2920, 2950);
	new ElementAnimation("section-30__link-2", "opacity", 0.0, 1.0, 2925, 2955);
	new ElementAnimation("section-30__link-2", "margin-left", 50, 0, 2920, 2950);
	new ElementAnimation("section-30__note", "opacity", 0.0, 1.0, 2910, 2940);

	new ElementAnimation("section-30", "opacity", 1.0, 0.0, 2985, 3000);


	new ElementAnimation("section-31__background", "scale", 1.0, 1.05, 2985, 3100);
	new ElementAnimation("section-31__title-1", "opacity", 0.0, 1.0, 3020, 3050);
	new ElementAnimation("section-31__title-1", "margin-left", 50, 0, 3020, 3050);
	new ElementAnimation("section-31__title-2", "opacity", 0.0, 1.0, 3025, 3055);
	new ElementAnimation("section-31__title-2", "margin-left", 50, 0, 3025, 3055);

	new ElementAnimation("section-31", "opacity", 1.0, 0.0, 3085, 3100);


	new ElementAnimation("section-32__title", "margin-left", 50, 0, 3120, 3150);
	new ElementAnimation("section-32__title", "opacity", 0.0, 1.0, 3120, 3150);
	new ElementAnimation("section-32__text", "margin-left", 50, 0, 3125, 3155);
	new ElementAnimation("section-32__text", "opacity", 0.0, 1.0, 3125, 3155);
	new ElementAnimation("section-32__donate", "margin-left", 50, 0, 3130, 3160);
	new ElementAnimation("section-32__donate", "opacity", 0.0, 1.0, 3130, 3160);
	new ElementAnimation("section-32__links", "margin-left", 50, 0, 3135, 3165);
	new ElementAnimation("section-32__links", "opacity", 0.0, 1.0, 3135, 3165);

	ElementAnimation.setScrollDummyHeight();

	// Load page
	document.getElementsByClassName("header-top")[0].classList.remove("hidden");

	setTimeout (function () {

		document.getElementsByTagName("body")[0].classList.add("page-loaded");

	}, 1);


	// Update animations on scroll

	var elementPropertyCount = undefined, elementPropertyIndex = undefined, 
		elementAnimationObject = undefined, 
		firstAnimationObject = undefined, activeAnimationObject = undefined, completedAnimationObject = undefined;

	window.addEventListener('scroll', function(e) {
		console.log (window.pageYOffset);
		
		var pageScrollPosition = window.pageYOffset;

		if (!ElementAnimation.scrollDisabled) {
			scrollElementAnimations(pageScrollPosition / ElementAnimation.scrollFactor);
		}
		else {
			scrollTo(ElementAnimation.scrollDisabledPosition, 50);
		}

	});

	function scrollElementAnimations (pageScrollPosition) {
		for (var elementIdentifier in ElementAnimation.createdAnimations) {
	        
	        if (ElementAnimation.createdAnimations.hasOwnProperty(elementIdentifier)) {
	            
	            for (var property in ElementAnimation.createdAnimations[elementIdentifier]) {
	                
	                if (ElementAnimation.createdAnimations[elementIdentifier].hasOwnProperty(property)) {
	                	
	                	elementPropertyCount = ElementAnimation.createdAnimations[elementIdentifier][property].length;

	                	firstAnimationObject = undefined, activeAnimationObject = undefined, completedAnimationObject = undefined;

	                	for (elementPropertyIndex = 0; elementPropertyIndex < elementPropertyCount; elementPropertyIndex++) {
	                		elementAnimationObject = ElementAnimation.createdAnimations[elementIdentifier][property][elementPropertyIndex];

	                 		// range greater than stop
	 						if (pageScrollPosition > elementAnimationObject.scrollStopOffset) {
	 							completedAnimationObject = elementAnimationObject;
	 							completedAnimationObject.update(completedAnimationObject.scrollStopOffset); // there may be callback functions from one or more animations of the same property
	 						}
	 						// range start - stop
	 						else if (pageScrollPosition >= elementAnimationObject.scrollStartOffset) {
	 							activeAnimationObject = elementAnimationObject;
	 							break;
	 						}
	                    }

	                    if (activeAnimationObject != undefined) {
	                    	activeAnimationObject.update(pageScrollPosition);
	                    }
	                    else if (completedAnimationObject != undefined) {
	                    	//completedAnimationObject.update(completedAnimationObject.scrollStopOffset); // there may be callback functions from one or more animations of the same property
	                    }
	                    else {
	                    	firstAnimationObject = ElementAnimation.createdAnimations[elementIdentifier][property][0];
	                    	firstAnimationObject.update(firstAnimationObject.scrollStartOffset);
	                    } /* else {
							if (element.active)
								removeClass
	                    } */
	                }
	            }
	        }
	    }
	}

	function getLastScrollAnimation () {
		
		var lastElement = undefined;

		for (var elementIdentifier in ElementAnimation.createdAnimations) {
	        
	        if (ElementAnimation.createdAnimations.hasOwnProperty(elementIdentifier)) {
	            
	            for (var property in ElementAnimation.createdAnimations[elementIdentifier]) {
	                
	                if (ElementAnimation.createdAnimations[elementIdentifier].hasOwnProperty(property)) {
	                	
	                	elementPropertyCount = ElementAnimation.createdAnimations[elementIdentifier][property].length;

	                	for (elementPropertyIndex = 0; elementPropertyIndex < elementPropertyCount; elementPropertyIndex++) {
	                		elementAnimationObject = ElementAnimation.createdAnimations[elementIdentifier][property][elementPropertyIndex];

	                		if (lastElement == undefined)
	                			lastElement = elementAnimationObject;

	                		else if (lastElement.scrollStopOffset < elementAnimationObject.scrollStopOffset)
	                			lastElement = elementAnimationObject;
	                	}
	               	}
	            }
	        }
	    }

	    return lastElement;
	}

	var quotesContainer = document.getElementsByClassName("section-2a__quoter")[0];

	var quoteIndex = 0;

	// Main cycle duration (not the entire duration though. total duration: cycle duration + transition duration
	function cycleQuotesRecursively() {
		var quotes = quotesContainer.getElementsByClassName("quote");
		console.log ("if quotes visible");
		setTimeout(function() {
			quotesContainer.style.opacity = 0.0;
			quotes[quoteIndex].classList.remove("active");

			quoteIndex++;

			if (quoteIndex >= quotes.length)
				quoteIndex = 0;

			// Transition duration
			setTimeout(function() {
				// quoteParagraph.innerHTML = quotesDictionary[quoteIndex].p;

				// quoteSpan.innerHTML = quotesDictionary[quoteIndex].span;

				quotesContainer.style.opacity = 1.0;
				quotes[quoteIndex].classList.add("active");

				cycleQuotesRecursively();

			}, 900);

	    }, 6100);
	}

	cycleQuotesRecursively();

	/*
		Comma seperated list of class names. or a single class name
	*/
	function toggle (query) {
		console.log(query);
		var toggleElements = document.querySelectorAll(query);

		console.log(toggleElements);

		for (var i = 0; i < toggleElements.length; i++) {
			if (!toggleElements[i].classList.contains("toggle")) {
				toggleElements[i].classList.add("toggle");
				ElementAnimation.scrollDisabled = true;
				ElementAnimation.scrollDisabledPosition = window.pageYOffset;
			}
			else {
				toggleElements[i].classList.remove("toggle");
				ElementAnimation.scrollDisabled = false;
			}
			// remove class
		}
	}

	document.querySelectorAll("[data-toggle]").forEach(item => {
	  item.addEventListener('click', event => {
	    var query = item.getAttribute("data-toggle");

		setTimeout(function() {
			toggle(item.getAttribute("data-toggle")); 

		}, 15);
	  });
	});


	document.getElementsByClassName("button-arrow-red-section-1")[0].addEventListener('click', function() {
		scrollTo(window.innerHeight * 1.5, 500);
	});

	document.querySelectorAll(".nav-main__link").forEach(item => {
		item.addEventListener('click', event => {
			// (parseInt(event.srcElement.getAttribute("data-section")) - 1)
			
			var scrollToPosition = (parseInt(event.srcElement.getAttribute("data-offset")) / 100) * window.innerHeight;
			scrollTo(scrollToPosition, 500);
			//console.log (window.pageYOffset);
			event.preventDefault();
		});

	});

	// jQuery scrollTo in vanilla JS
	// https://gist.github.com/andjosh/6764939
	function scrollTo(to, duration) {
	    var start = window.pageYOffset,
	        change = to - start,
	        currentTime = 0,
	        increment = 20;
	        
	    var animateScroll = function(){        
	        currentTime += increment;
	        var val = Math.easeInOutQuad(currentTime, start, change, duration);
	        window.scroll(0,val); // Edited for use with scroll-dummy-overlay
	        if(currentTime < duration) {
	            setTimeout(animateScroll, increment);
	        }
	    };
	    animateScroll();
	}

	//t = current time
	//b = start value
	//c = change in value
	//d = duration
	Math.easeInOutQuad = function (t, b, c, d) {
	  t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	};

});








