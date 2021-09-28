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

			this.active = false;
			this.complete = false;
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

		setToActive () {
			this.container.classList.remove("complete"); // setTimeout between class changes to allow for CSS animations or other setTimeouts? not necessary-- not yet...
			this.complete = false;
			this.container.classList.add("active");
			this.active = true;
		}

		setToUnactive () {
			this.container.classList.remove("active");
			this.active = false;
		}

		setToComplete () {
			this.container.classList.remove("active"); // setTimeout between class changes to allow for CSS animations or other setTimeouts? not necessary-- not yet...
			this.active = false;
			this.container.classList.add("complete");
			this.complete = true;
		}

		// Consider moving to static
		update (pageScrollPosition, updateCallbacksOnly = false) {

			// If/what updates
			if (updateCallbacksOnly == false)
			{
				if (pageScrollPosition > this.scrollStopOffset)
				{
					this.setToComplete();
				}
				else {
					// may require a settimeout delay between completed and active for CSS animations
					if (pageScrollPosition >= this.scrollStartOffset)
					{
						if (pageScrollPosition == this.scrollStopOffset)
							this.setToComplete();
						else
							this.setToActive();
					}
					else {
						if (this.active)
							this.setToUnactive();
					}
				}

				this.animate(pageScrollPosition);
			}

			// Update callback function
			if (typeof this.updateCallback == "function")
				this.updateCallback(this, pageScrollPosition, this.scrollStartOffset, this.scrollStopOffset);
		}

		// consider moving to static
		animate (pageScrollPosition) {
			this.animationPercentage = (pageScrollPosition - this.scrollStartOffset) / (this.scrollStopOffset - this.scrollStartOffset);
			this.animationValue = this.propertyInitialValue + ((this.propertyTargetValue - this.propertyInitialValue) * this.animationPercentage);

			if (this.lastAnimationValue != this.animationValue) {

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
	ElementAnimation.scrollFactor = 1.475; // 1 normal scroll speed, 2 scrolling takes twice as long, 3 scrolling takes three times as long as normal
	ElementAnimation.scrollDisabled = false;



	// Page scroll animations

	new ElementAnimation(
		// identifier (class)
		"section-1",
		// property
		"opacity",
		// initial property at start of animation, target property at stop of animation
		1.0, 0.0,
		// Scroll min, max
		10, 100
	);
	new ElementAnimation("header-top", "opacity", 1.0, 0.0, 10, 85);
	new ElementAnimation("header-left", "opacity", 0.0, 1.0, 90, 100);
	new ElementAnimation("header-left", "margin-left", -96, 0, 85, 100);


	new ElementAnimation("section-2__text-1", "opacity",  0.0,  1.0,  90, 140);
	new ElementAnimation("section-2__text-1", "margin-left",  50,    0,  90, 130);
	new ElementAnimation("section-2__text-2", "opacity",  0.0,  1.0,  105, 140);
	new ElementAnimation("section-2__text-2", "margin-left",  50,    0,  105, 140);
	new ElementAnimation("section-2__text-3", "opacity",  0.0,  1.0,  105, 140);
	new ElementAnimation("section-2__text-3", "margin-left",  50,    0,  105, 140);
	new ElementAnimation("section-2__text-4", "opacity",  0.0,  1.0,  105, 145);
	new ElementAnimation("section-2__text-4", "margin-left",  50,  0,  105, 145);
	new ElementAnimation("button-next-slide-section-2", "opacity",  0.0,  1.0,  100, 110);

	new ElementAnimation("section-2", "opacity", 1.0, 0.0, 185, 195);

	new ElementAnimation("section-3__title", "margin-left", 160, 0, 185, 500);
	new ElementAnimation("section-4__title", "margin-left", 160, 0, 185, 500);
	new ElementAnimation("section-5__title", "margin-left", 160, 0, 185, 500);

	new ElementAnimation("section-3__subtitle", "opacity", 0.0, 1.0, 195, 215);
	new ElementAnimation("section-3__subtitle", "margin-left", 100, 0, 195, 300);
	new ElementAnimation("section-3__icon", "opacity", 0.0, 1.0, 195, 210);

	// // //new ElementAnimation("section-3__titlecontainer", "margin-left", 65, 80, 50, 0);
	// //new ElementAnimation("section-3__icon", "opacity", 240, 265, 0.0, 1.0);
	new ElementAnimation("section-3__icon", "opacity", 1.0, 0.0, 210, 256, function(thisele, sp, ssta, ssto) {
		if (sp >= ssto) { thisele.container.style.pointerEvents = "none"; } else { thisele.container.style.pointerEvents = "all"; } });
	new ElementAnimation("section-3__background", "opacity", 1.0, 0.0, 265, 300);
	new ElementAnimation("section-3__title-1", "opacity", 1.0, 0.0, 215, 240);
	new ElementAnimation("section-3__title-2", "opacity", 1.0, 0.0, 215, 240);
	new ElementAnimation("section-3__subtitle", "opacity", 1.0, 0.0, 215, 240);

	new ElementAnimation("section-4__background", "scale", 1.0, 1.05, 245, 500);
	new ElementAnimation("section-4__pretitle", "opacity", 0.0, 1.0, 290, 315);
	new ElementAnimation("section-4__title", "opacity", 0.0, 1.0, 310, 315);
	new ElementAnimation("section-4__text", "opacity", 0.0, 1.0, 310, 340);

	new ElementAnimation("section-4__pretitle", "margin-left", 100, 0, 260, 365);
	new ElementAnimation("section-4__pretitle", "opacity", 1.0, 0.0, 360, 365);
	new ElementAnimation("section-4__title-1", "opacity", 1.0, 0.0, 350, 365);
	new ElementAnimation("section-3__title", "opacity", 1.0, 0.0, 350, 365);
	new ElementAnimation("section-4__text", "opacity", 1.0, 0.0, 360, 365);

	new ElementAnimation("section-3", "opacity", 1.0, 0.0, 340, 385);

	new ElementAnimation("section-4__background", "opacity", 1.0, 0.0, 390, 405);
	new ElementAnimation("section-4", "opacity", 1.0, 0.0, 390, 405);

	new ElementAnimation("section-5__background", "scale", 1.0, 1.05, 245, 500);
	new ElementAnimation("section-5__pretitle", "margin-left", 50, 0, 390, 485);
	new ElementAnimation("button-prev-slide-section-5", "opacity", 0.0, 1.0, 405, 415);
	new ElementAnimation("button-next-slide-section-5", "opacity", 0.0, 1.0, 405, 415);


	new ElementAnimation("section-5", "opacity", 1.0, 0.0, 470, 485);

	new ElementAnimation("section-6__background", "scale", 1.0, 1.05, 470, 700);
	new ElementAnimation("section-6__pretitle", "margin-left", 50, 0, 475, 525);
	new ElementAnimation("section-6__pretitle", "opacity", 0.0, 1.0, 475, 500);
	new ElementAnimation("section-6__title", "margin-left", 50, 0, 485, 535);
	new ElementAnimation("section-6__title", "opacity", 0.0, 1.0, 485, 510);

	// new ElementAnimation("section-6__pretitle", "opacity", 1.0, 0.0, 520, 500);
	// new ElementAnimation("section-6__title", "opacity", 1.0, 0.0, 490, 520);
	new ElementAnimation("section-6", "opacity", 1.0, 0.0, 570, 585);

	new ElementAnimation("section-7__background", "scale", 1.0, 1.05, 470, 700);
	new ElementAnimation("section-7__text", "opacity", 0.0, 1.0, 585, 635);

	// Section 7 | Closing
	new ElementAnimation("section-7", "opacity", 1.0, 0.0, 670, 685);

	// Section 8 | Active
	new ElementAnimation("section-8__title", "margin-left", 150, 0, 670, 850);
	new ElementAnimation("section-8__subtitle", "margin-left", 120, 0, 670, 765);
	new ElementAnimation("section-8__subtitle-wrapper", "opacity", 0.0, 1.0, 680, 710);

	// Section 8 | Closing
	new ElementAnimation("section-8__background", "opacity", 1.0, 0.0, 770, 790);
	new ElementAnimation("section-8__title-1", "opacity", 1.0, 0.0, 700, 760);
	new ElementAnimation("section-8__title-2", "opacity", 1.0, 0.0, 700, 760);
	new ElementAnimation("section-8__subtitle", "opacity", 1.0, 0.0, 700, 770);
	new ElementAnimation("section-8__icon", "opacity", 1.0, 0.0, 700, 760, function(thisele, sp, ssta, ssto) {
		if (sp >= ssto) { thisele.container.style.pointerEvents = "none"; } else { thisele.container.style.pointerEvents = "all"; } });

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

	new ElementAnimation("section-9__background", "opacity", 1.0, 0.0, 850, 900);
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

	new ElementAnimation("section-10__bar bar-7", "opacity", 0.0, 1.0, 900, 912, function(thisele, sp, ssta, ssto) { updateBarCallback(7, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-6", "opacity", 0.0, 1.0, 912, 924, function(thisele, sp, ssta, ssto) { updateBarCallback(6, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-5", "opacity", 0.0, 1.0, 924, 936, function(thisele, sp, ssta, ssto) { updateBarCallback(5, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-4", "opacity", 0.0, 1.0, 936, 948, function(thisele, sp, ssta, ssto) { updateBarCallback(4, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-3", "opacity", 0.0, 1.0, 948, 960, function(thisele, sp, ssta, ssto) { updateBarCallback(3, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-2", "opacity", 0.0, 1.0, 960, 972, function(thisele, sp, ssta, ssto) { updateBarCallback(2, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-1", "opacity", 0.0, 1.0, 972, 984, function(thisele, sp, ssta, ssto) { updateBarCallback(1, sp, ssta, ssto); });

	new ElementAnimation("section-10__bar bar-7", "opacity", 1.0, 0.0, 984, 1000);
	new ElementAnimation("section-10__bar bar-6", "opacity", 1.0, 0.0, 984, 1000);
	new ElementAnimation("section-10__bar bar-5", "opacity", 1.0, 0.0, 984, 1000);
	new ElementAnimation("section-10__bar bar-4", "opacity", 1.0, 0.0, 984, 1000);
	new ElementAnimation("section-10__bar bar-3", "opacity", 1.0, 0.0, 984, 1000);
	new ElementAnimation("section-10__bar bar-2", "opacity", 1.0, 0.0, 984, 1000);

	new ElementAnimation("section-10__total", "opacity", 1.0, 0.0, 984, 1000);
	new ElementAnimation("section-10__background", "opacity", 1.0, 0.0, 975, 1000, true);

	new ElementAnimation("section-11__background", "scale", 1.0, 1.05, 785, 1100);
	new ElementAnimation("section-11__pretitle", "opacity", 0.0, 1.0, 995, 1015);
	new ElementAnimation("section-11__pretitle", "margin-left", 50, 0, 995, 1010);
	new ElementAnimation("section-11__title", "opacity", 0.0, 1.0, 1005, 1025);
	new ElementAnimation("section-11__title", "margin-left", 50, 0, 995, 1010);
	new ElementAnimation("section-11__text", "opacity", 0.0, 1.0, 1005, 1025);
	new ElementAnimation("section-11__text", "margin-left", 50, 0, 1000, 1015);
	new ElementAnimation("section-11__bardetails", "opacity", 0.0, 1.0, 1025, 1040);
	new ElementAnimation("section-11__bardetails", "margin-left", 75, 0, 995, 1010);
	new ElementAnimation("section-11__note", "opacity", 0.0, 1.0, 1030, 1050);
	new ElementAnimation("section-11__note", "margin-left", 75, 0, 995, 1010);

	new ElementAnimation("section-10", "opacity", 1.0, 0.0, 1085, 1100);
	new ElementAnimation("section-11", "opacity", 1.0, 0.0, 1085, 1100);


	new ElementAnimation("section-12__image", "scale", 0.95, 0.975, 1100, 1111);
	new ElementAnimation("section-12__image", "scale", 0.975, 1.0, 1111, 1115);
	new ElementAnimation("section-12__image", "margin-left", -60, 0, 1100, 1110);
	new ElementAnimation("section-12__image", "opacity", 0.0, 1.0, 1100, 1115);
	new ElementAnimation("section-12__imageshorttext", "opacity", 0.0, 1.0, 1100, 1130);
	new ElementAnimation("section-12__title", "opacity", 0.0, 1.0, 1110, 1140);
	new ElementAnimation("section-12__title", "margin-left", 50, 0, 1110, 1140);
	new ElementAnimation("section-12__text", "opacity", 0.0, 1.0, 1120, 1150);
	new ElementAnimation("section-12__text", "margin-left", 50, 0, 1120, 1150);
	new ElementAnimation("button-next-slide-section-12", "opacity", 0.0, 1.0, 1130, 1150);

	new ElementAnimation("section-12", "opacity", 1.0, 0.0, 1165, 1200);


	new ElementAnimation("section-13__image", "scale", 0.95, 0.975, 1190, 1211);
	new ElementAnimation("section-13__image", "scale", 0.975, 1.0, 1211, 1215);
	new ElementAnimation("section-13__image", "margin-left", -60, 0, 1190, 1210);
	new ElementAnimation("section-13__image", "opacity", 0.0, 1.0, 1190, 1215);
	new ElementAnimation("section-13__imageshorttext", "opacity", 0.0, 1.0, 1200, 1230);
	new ElementAnimation("section-13__title", "opacity", 0.0, 1.0, 1210, 1240);
	new ElementAnimation("section-13__title", "margin-left", 50, 0, 1210, 1240);
	new ElementAnimation("section-13__text", "opacity", 0.0, 1.0, 1220, 1250);
	new ElementAnimation("section-13__text", "margin-left", 50, 0, 1220, 1250);
	new ElementAnimation("button-next-slide-section-13", "opacity", 0.0, 1.0, 1230, 1250);

	new ElementAnimation("section-13", "opacity", 1.0, 0.0, 1265, 1300);


	new ElementAnimation("section-14__image", "scale", 0.95, 0.975, 1290, 1311);
	new ElementAnimation("section-14__image", "scale", 0.975, 1.0, 1311, 1315);
	new ElementAnimation("section-14__image", "margin-left", -60, 0, 1290, 1310);
	new ElementAnimation("section-14__image", "opacity", 0.0, 1.0, 1290, 1315);
	new ElementAnimation("section-14__imageshorttext", "opacity", 0.0, 1.0, 1300, 1330);
	new ElementAnimation("section-14__title", "opacity", 0.0, 1.0, 1310, 1340);
	new ElementAnimation("section-14__title", "margin-left", 50, 0, 1310, 1340);
	new ElementAnimation("section-14__text", "opacity", 0.0, 1.0, 1320, 1350);
	new ElementAnimation("section-14__text", "margin-left", 50, 0, 1320, 1350);
	new ElementAnimation("button-next-slide-section-14", "opacity", 0.0, 1.0, 1330, 1350);

	new ElementAnimation("section-14", "opacity", 1.0, 0.0, 1365, 1400);


	new ElementAnimation("section-15__image", "scale", 0.95, 0.975, 1390, 1411);
	new ElementAnimation("section-15__image", "scale", 0.975, 1.0, 1411, 1415);
	new ElementAnimation("section-15__image", "margin-left", -60, 0, 1390, 1410);
	new ElementAnimation("section-15__image", "opacity", 0.0, 1.0, 1390, 1415);
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
	new ElementAnimation("section-18__subtitle", "margin-left", 75, 0, 1720, 1750);
	new ElementAnimation("section-18__icon", "opacity", 0.0, 1.0, 1720, 1750);
	new ElementAnimation("section-18__icon", "opacity", 1.0, 0.0, 1755, 1765, function(thisele, sp, ssta, ssto) {
		if (sp >= ssto) { thisele.container.style.pointerEvents = "none"; } else { thisele.container.style.pointerEvents = "all"; } });

	new ElementAnimation("section-18__title-1", "opacity", 1.0, 0.0, 1750, 1765);
	new ElementAnimation("section-18__title-2", "opacity", 1.0, 0.0, 1750, 1765);
	new ElementAnimation("section-18__subtitle", "opacity", 1.0, 0.0, 1750, 1765);


	new ElementAnimation("section-18__background", "opacity", 1.0, 0.0, 1765, 1800);
	new ElementAnimation("section-18", "opacity", 1.0, 0.0, 1800, 1810);


	new ElementAnimation("section-19__background", "scale", 1.0, 1.05, 1765, 1900);
	new ElementAnimation("section-19__pretitle", "opacity", 0.0, 1.0, 1815, 1840);
	new ElementAnimation("section-19__pretitle", "margin-left", 50, 0, 1815, 1840);
	new ElementAnimation("section-19__title", "opacity", 0.0, 1.0, 1820, 1845);
	new ElementAnimation("section-19__title", "margin-left", 50, 0, 1820, 1845);
	new ElementAnimation("section-19__text", "opacity", 0.0, 1.0, 1850, 1855);
	// new ElementAnimation("section-19__text", "margin-left", 50, 0, 1835, 1865);

	new ElementAnimation("section-19", "opacity", 1.0, 0.0, 1865, 1900);



	new ElementAnimation("section-20__background", "scale", 1.0, 1.05, 1865, 2000);
	new ElementAnimation("section-20__pretitle", "opacity", 0.0, 1.0, 1895, 1920);
	new ElementAnimation("section-20__pretitle", "margin-left", 50, 0, 1900, 1925);
	new ElementAnimation("section-20__title", "opacity", 0.0, 1.0, 1905, 1930);
	new ElementAnimation("section-20__title", "margin-left", 50, 0, 1905, 1930);
	new ElementAnimation("section-20__text", "opacity", 0.0, 1.0, 1860, 1870);

	new ElementAnimation("section-20", "opacity", 1.0, 0.0, 1965, 2000);


	new ElementAnimation("section-21__pretitle", "opacity", 0.0, 1.0, 2015, 2040);
	new ElementAnimation("section-21__pretitle", "margin-left", 50, 0, 2020, 2045);
	new ElementAnimation("section-21__title", "opacity", 0.0, 1.0, 2015, 2040);
	new ElementAnimation("section-21__title", "margin-left", 50, 0, 2015, 2045);
	new ElementAnimation("section-21__main-content", "opacity", 0.0, 1.0, 2015, 2025);
	new ElementAnimation("section-21__main-content__image", "scale", 0.975, 1.0, 2015, 2040);
	// new ElementAnimation("section-21__text", "scale", 0.9, 1.0, 2020, 2070);
	new ElementAnimation("section-21__quoter", "opacity", 0.0, 1.0, 2020, 2045);

	new ElementAnimation("section-21", "opacity", 1.0, 0.0, 2110, 2115);


	// new ElementAnimation("section-22__pretitle", "opacity", 0.0, 1.0, 2115, 2165);
	// new ElementAnimation("section-22__pretitle", "margin-left", 50, 0, 2120, 2170);
	// new ElementAnimation("section-22__title", "opacity", 0.0, 1.0, 2115, 2175);
	// new ElementAnimation("section-22__title", "margin-left", 50, 0, 2115, 2175);
	new ElementAnimation("section-22__main-content", "opacity", 0.0, 1.0, 2115, 2175);

	new ElementAnimation("section-22", "opacity", 1.0, 0.0, 2165, 2200);


	new ElementAnimation("section-23__pretitle", "opacity", 1.0, 0.0, 2265, 2290);
	// new ElementAnimation("section-23__pretitle", "margin-left", 50, 0, 2215, 2235);
	new ElementAnimation("section-23__title", "opacity", 1.0, 0.0, 2265, 2290);
	// new ElementAnimation("section-23__title", "margin-left", 50, 0, 2215, 2235);
	new ElementAnimation("button-next-slide-section-23", "opacity", 0.0, 1.0, 2215, 2235);

	new ElementAnimation("section-23__sector sector-1", "opacity", 0.0, 1.0, 2225, 2245);
	new ElementAnimation("section-23__sector sector-2", "opacity", 0.0, 1.0, 2235, 2255);
	new ElementAnimation("section-23__sector sector-3", "opacity", 0.0, 1.0, 2245, 2265);

	new ElementAnimation("section-23", "opacity", 1.0, 0.0, 2300, 2320);


	new ElementAnimation("section-24__background", "scale", 1.0, 1.05, 2265, 2500);
	new ElementAnimation("section-24__pretitle", "margin-left", 150, 0, 2340, 2350);
	new ElementAnimation("section-24__pretitle", "opacity", 0.0, 1.0, 2340, 2350);
	new ElementAnimation("section-24__title", "margin-left", 150, 0, 2340, 2350);
	new ElementAnimation("section-24__title", "opacity", 0.0, 1.0, 2340, 2350);
	new ElementAnimation("section-24__subtitle", "margin-left", 100, 0, 2340, 2350);
	new ElementAnimation("section-24__subtitle", "opacity", 0.0, 1.0, 2340, 2350);

	new ElementAnimation("section-24", "opacity", 1.0, 0.0, 2365, 2420);


	new ElementAnimation("section-25__background", "scale", 1.0, 1.05, 2265, 2500);
	new ElementAnimation("section-25__text", "opacity", 0.0, 1.0, 2400, 2410);

	new ElementAnimation("section-25", "opacity", 1.0, 0.0, 2485, 2500);


	new ElementAnimation("section-26__title", "margin-left", 150, 50, 2485, 2530);
	new ElementAnimation("section-26__title", "opacity", 0.0, 1.0, 2485, 2620);
	new ElementAnimation("section-26__subtitle", "margin-left", 140, 0, 2490, 2535);
	new ElementAnimation("section-26__subtitle", "opacity", 0.0, 1.0, 2485, 2530);
	new ElementAnimation("section-26__icon", "opacity", 0.0, 1.0, 2485, 2530);
	new ElementAnimation("section-26__icon", "opacity", 1.0, 0.0, 2575, 2585, function(thisele, sp, ssta, ssto) {
		if (sp >= ssto) { thisele.container.style.pointerEvents = "none"; } else { thisele.container.style.pointerEvents = "all"; } });

	new ElementAnimation("section-26__title-1", "opacity", 1.0, 0.0, 2530, 2585);
	new ElementAnimation("section-26__title-2", "opacity", 1.0, 0.0, 2530, 2585);
	new ElementAnimation("section-26__subtitle", "opacity", 1.0, 0.0, 2530, 2585);
	new ElementAnimation("section-26", "opacity", 1.0, 0.0, 2585, 2600);


	new ElementAnimation("section-27__pretitle", "opacity", 0.0, 1.0, 2600, 2625);
	new ElementAnimation("section-27__pretitle", "margin-left", 50, 0, 2600, 2625);
	new ElementAnimation("section-27__title-1", "opacity", 0.0, 1.0, 2550, 2600);
	new ElementAnimation("section-27__title-1b", "opacity", 0.0, 1.0, 2605, 2630);
	new ElementAnimation("section-27__title-1", "margin-left", 50, 0, 2605, 2630);
	new ElementAnimation("section-27__title-2", "opacity", 0.0, 1.0, 2605, 2630);
	new ElementAnimation("section-27__title-2", "margin-left", 50, 0, 2605, 2630);
	new ElementAnimation("section-27__main-content", "opacity", 0.0, 1.0, 2610, 2640, function (thisele, sp, ssta, ssto) {
		var seizeCreate = document.getElementsByClassName("section-27-28__seize-create")[0];
		if (sp >= ssta && sp <= ssto && seizeCreate.innerHTML != "seize")
			seizeCreate.innerHTML = "seize";
	});

	//new ElementAnimation("section-27", "opacity", 1.0, 0.0, 2685, 2700);


	//new ElementAnimation("section-27__title-1", "opacity", 1.0, 0.0, 2685, 2700);
	new ElementAnimation("section-27__background", "opacity", 1.0, 0.0, 2685, 2700, function (thisele, sp, ssta, ssto) {
		var section27 = document.getElementsByClassName("section-27")[0];
		var seizeCreate = document.getElementsByClassName("section-27-28__seize-create")[0];
		if (sp >= ssto && seizeCreate.innerHTML != "create")
			seizeCreate.innerHTML = "create";

		if (sp >= ssto) { section27.style.pointerEvents = "none"; } else { section27.style.pointerEvents = "all"; }
	});
	new ElementAnimation("section-27-28__seize-create", "opacity", 1.0, 0.0, 2685, 2780);
	new ElementAnimation("button-next-slide-section-27", "opacity", 1.0, 0.0, 2685, 2700);
	new ElementAnimation("section-27__main-content", "opacity", 1.0, 0.0, 2685, 2700);



	//new ElementAnimation("section-28__main-content", "opacity", 0.0, 1.0, 2710, 2730);

	// new ElementAnimation("section-28__pretitle", "opacity", 0.0, 1.0, 2700, 2800);
	// new ElementAnimation("section-28__pretitle", "margin-left", 50, 0, 2700, 2800);
	//new ElementAnimation("section-28__title-2", "opacity", 0.0, 1.0, 2705, 2730);
	//new ElementAnimation("section-28__title-2", "margin-left", 50, 0, 2705, 2730);
	new ElementAnimation("section-27-28__seize-create", "opacity", 0.0, 1.0, 2690, 2740);
	new ElementAnimation("button-next-slide-section-28", "opacity", 0.0, 1.0, 2710, 2740);
	new ElementAnimation("section-28__main-content", "opacity", 0.0, 1.0, 2700, 2740);

	new ElementAnimation("section-27", "opacity", 1.0, 0.0, 2785, 2800);
	new ElementAnimation("section-28", "opacity", 1.0, 0.0, 2785, 2800);


	new ElementAnimation("section-29__background", "scale", 1.0, 1.05, 2785, 2900);
	new ElementAnimation("section-29__pretitle", "opacity", 0.0, 1.0, 2800, 2830);
	new ElementAnimation("section-29__pretitle", "margin-left", 50, 0, 2800, 2830);
	new ElementAnimation("section-29__title", "opacity", 0.0, 1.0, 2805, 2835);
	new ElementAnimation("section-29__title", "margin-left", 50, 0, 2805, 2835);
	new ElementAnimation("section-29__text", "opacity", 0.0, 1.0, 2830, 2855);
	// new ElementAnimation("section-29__text", "margin-left", 50, 0, 2810, 2815);

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

	new ElementAnimation("section-32", "opacity", 1.0, 1.0, 3085, 3200); // animation to add active class

	// Load page
	ElementAnimation.setScrollDummyHeight();

	setTimeout(function() {
		scrollElementAnimations(window.pageYOffset / ElementAnimation.scrollFactor);
	}, 15);

	document.getElementsByClassName("header-top")[0].classList.remove("hidden");

	setTimeout (function () {

		document.getElementsByTagName("body")[0].classList.add("page-loaded");

	}, 1);


	// Update animations on scroll

	var elementPropertyCount = undefined, elementPropertyIndex = undefined,
		elementAnimationObject = undefined,
		firstAnimationObject = undefined, activeAnimationObject = undefined, completedAnimationObject = undefined;

	// Dirty change to interrupted
	var section2aTextScrollPreviewScrolled = false;

	window.addEventListener('scroll', function(e) {
		console.log (window.pageYOffset);

		var pageScrollPosition = window.pageYOffset;

		if (!ElementAnimation.scrollDisabled) {
			scrollElementAnimations(pageScrollPosition / ElementAnimation.scrollFactor);
		}
		else {
			//e.preventDefault();
			window.scroll(0, ElementAnimation.scrollDisabledPosition);
			//scrollTo(window, ElementAnimation.scrollDisabledPosition, 10);
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
	 							completedAnimationObject = elementAnimationObject; // set for use in this bracket and for updating final completed animation styling as to not update styling multiple times for completed animations when all that is necessary is callback functions
	 							completedAnimationObject.update(completedAnimationObject.scrollStopOffset, true); // there may be callback functions from one or more animations of the same property

	 							// Because callback only update does not do this
	 							if (!elementAnimationObject.complete)
	 								elementAnimationObject.setToComplete();
	 						}
	 						// range start - stop
	 						else if (pageScrollPosition >= elementAnimationObject.scrollStartOffset) {
	 							activeAnimationObject = elementAnimationObject;
	 							break;
	 						} else if (elementAnimationObject.active) {
	 							// scroll position before these animations but may not be first (which is also updated) could optimize to only update elements here when index above first then make note of first updating active state below in post property animation review loop phase for updating property animations at their various state positionings or occurances
	 							elementAnimationObject.setToUnactive();
	 						}
	                    }


	                    if (activeAnimationObject != undefined) {
	                    	activeAnimationObject.update(pageScrollPosition);
	                    }
	                    else {
	                    	// Dirty redo this
	                    	// Element start and stop breakpoints are not applicable for pageScrollPosition comparison
							if (completedAnimationObject != undefined && completedAnimationObject.active)
								completedAnimationObject.setToUnactive();
							else if (firstAnimationObject != undefined && firstAnimationObject.active)
								firstAnimationObject.setToUnactive();

	                    	// Dirty move to .update
		                    var inactivePageRangeThreshold = 3;
		                    var test = ((window.innerHeight * inactivePageRangeThreshold) * ElementAnimation.scrollFactor);

		                    if (Math.abs(elementAnimationObject.scrollStartOffset - pageScrollPosition) < test ||
	                			Math.abs(elementAnimationObject.scrollStopOffset - pageScrollPosition) < test) {
		                    		// if has class inactive
	                				elementAnimationObject.container.classList.remove("out-of-context");
	                				elementAnimationObject.container.classList.add("of-context");
	                			}
	                		else {
	                				elementAnimationObject.container.classList.remove("of-context"); // display: block
	                				elementAnimationObject.container.classList.add("out-of-context"); // display: block
	                			}

	                    	if (completedAnimationObject != undefined) {
		                    	completedAnimationObject.update(completedAnimationObject.scrollStopOffset); // there may be callback functions from one or more animations of the same property
		                    }
		                    else {
		                    	firstAnimationObject = ElementAnimation.createdAnimations[elementIdentifier][property][0];
		                    	firstAnimationObject.update(firstAnimationObject.scrollStartOffset);

		                    	if (firstAnimationObject.active)
									firstAnimationObject.setToUnactive();
		                    }


		                }
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

			// Wait for opacity transition duration
			setTimeout(function () {

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

			}, 1000); // quotesContainer opacity transition duration is 1.0s

	    }, 6100);
	}

	cycleQuotesRecursively();

	/*
		Comma seperated list of class names. or a single class name
	*/
	//
	var toggleTimeouts = [];

	function toggle (query, uniqueClasses = undefined) {

		var toggleElements = document.querySelectorAll(query);

		for (var i = 0; i < toggleElements.length; i++) {
			if (!toggleElements[i].classList.contains("toggle")) {

				if (uniqueClasses != undefined)
					toggleElements[i].classList.add(uniqueClasses);

				toggleHelper(query, i);
			}
			else {
				toggleElements[i].classList.remove("toggle");
				toggleHelper2(query, i);
				toggleHelper3(query, uniqueClasses, i);

				ElementAnimation.scrollDisabled = false;
			}
			// remove class
		}
	}

	// Wasting time on figuring this polish out
	// may come back to it
		function toggleHelper(query, index) {
			// toggleElements from parameter
			var toggleElements = document.querySelectorAll(query);
			setTimeout(function() { console.log(index);

					toggleTimeouts[index] = undefined;
					toggleElements[index].classList.add("toggle");
					toggleElements[index].classList.add("toggled");
					ElementAnimation.scrollDisabled = true;
					ElementAnimation.scrollDisabledPosition = window.pageYOffset;
			 }, 100);
		}

		function toggleHelper2(query, index) {
			// toggleElements from parameter
			var toggleElements = document.querySelectorAll(query);
			toggleTimeouts[index] = setTimeout(function() { console.log(index); toggleElements[index].classList.remove("toggled"); }, 333);
		}

		function toggleHelper3(query, uniqueClasses, index) {
			// toggleElements from parameter
			var toggleElements = document.querySelectorAll(query);
			setTimeout(function() { console.log(index);

					if (uniqueClasses != undefined)
						toggleElements[index].classList.remove(uniqueClasses); }, 500);
		}





	document.querySelectorAll("[data-toggle]").forEach(item => {

	  item.addEventListener('click', event => {
	  	if (item.classList.contains("button-next-slide-section-2")) {

			//If user has not scrolled, maybe they do not know about the scroll;


		setTimeout(function() {
				if (document.getElementsByClassName("section-2a__text")[0].scrollTop == 0) {
					document.getElementsByClassName("section-2a__text-overlay")[0].classList.remove("hidden");
			scrollTo(document.getElementsByClassName("section-2a__text")[0], 50, 300);
				setTimeout(function() {
					scrollTo(document.getElementsByClassName("section-2a__text")[0], 0, 300);

					setTimeout(function() {
						document.getElementsByClassName("section-2a__text-overlay")[0].classList.add("hidden");
					}, 300);

				}, 350);
			}
			}, 667);
		}

	  	item.classList.add("clicked");

	  	setTimeout(function() { item.classList.remove("clicked"); }, 1);

	    var query = item.getAttribute("data-toggle");

		setTimeout(function() {
			toggle(item.getAttribute("data-toggle"), item.getAttribute("data-toggle-unique-class"));

		}, 167);
	  });
	});


	document.getElementsByClassName("button-arrow-red-section-1")[0].addEventListener('click', function() {
		scrollTo(window, window.innerHeight * 2.2, 2000);
	});

	document.querySelectorAll("[data-offset]").forEach(item => {
		item.addEventListener('click', event => {
			// (parseInt(event.srcElement.getAttribute("data-section")) - 1)

			var scrollToPosition = (parseInt(event.srcElement.getAttribute("data-offset")) / 100) * window.innerHeight;
			ElementAnimation.scrollDisabled = false;
			scrollTo(window, scrollToPosition, 2000);

			//console.log (window.pageYOffset);
			event.preventDefault();
		});

	});

	// jQuery scrollTo in vanilla JS
	// https://gist.github.com/andjosh/6764939
	function scrollTo(scrollElement, to, duration, callback = undefined) {
	    var start = window.pageYOffset;
	    if (scrollElement != window)
	        	start = scrollElement.scrollTop;
	        change = to - start,
	        currentTime = 0,
	        increment = 20;



	    var animateScroll = function(){
	        currentTime += increment;
	        var val = Math.easeInOutQuad(currentTime, start, change, duration);
	        scrollElement.scroll(0,val); // Edited for use with scroll-dummy-overlay

	        if(!section2aTextScrollPreviewScrolled && currentTime < duration) {
	            setTimeout(animateScroll, increment);
	        }
	        // else
	        // {
	        // 	if (typeof callback == "function")
	        // 		callback();
	        // }
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


		// all custom jQuery will go here

		jQuery(document).ready(function($){
 			console.log("working jquery")
			//open nav and make menu an "x"
			$( '.menu-btn' ).click(function(){
				$('.header-left-nav').toggleClass('toggle');
				$('.menu-btn').toggleClass('active');
				console.log("jquery")
			});
			//close nav in clicked outside of nav and return hamburger menu
			$(document).on("click", function(e){
				e.stopPropagation()
				if(
					$(e.target).closest(".menu-btn").length === 0 &&
					$(".header-left-nav").hasClass("toggle") &&
					$(e.target).closest(".toggle").length === 0 ||
					$(e.target).hasClass("hideMenu")

				){
					console.log("toggle")
					$('.header-left-nav').toggleClass('toggle');
					$('.menu-btn').toggleClass('active');
				}
			});


			// 	$("a").click(function(event) {
			// 		event.preventDefault();
			// 		linkLocation = this.href;
			// 		$("body").fadeOut(2000, redirectPage);
			// 		console.log("j-fade")
			// 	});
			// //todo: add functionality "if scrollPosition !equals <a> location , fade white"
			// 	function redirectPage() {
			// 		window.location = linkLocation;
			// 		$("body").fadeIn(2000);
			// 	}


		});


});





