/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

//Look at readme.txt file for references used in this project.

/* exported init */

const Main = imports.ui.main;
const St = imports.gi.St;
const GObject = imports.gi.GObject;
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let myPopup;

const MyPopup = GObject.registerClass(
class MyPopup extends PanelMenu.Button {

	_init () {
		super._init(0);

		//Code for the smiley icon
		let smile = new St.Icon({
			icon_name: 'face-smile-symbolic',
			style_class : 'system-status-icon',
		});

		this.add_child(smile);

		//Title section text
		let titleSection = new PopupMenu.PopupMenuSection();
		titleSection.actor.add_child(new PopupMenu.PopupMenuItem('The \"Lovely\" swiss army  widget', {reactive : false}));
		this.menu.addMenuItem(titleSection);

      
        	//sub menu for unit converter
		let unitc = new PopupMenu.PopupMenuItem('Unit converter');
		this.menu.addMenuItem(unitc);

		unitc.connect('activate', () => {
			convPopup = new unitConvPopup();
		});


		//this.menu.addMenuItem(
		//	new PopupMenu.PopupMenuItem(
		//		"User cannot click on this item",
		//		{reactive : false},
		//	)
		//);

		//this.menu.connect('open-state-changed', (menu, open) => {
		//	if (open) {
		//		log('opened');
		//	} else {
		//		log('closed');
		//	}
		//});

		// sub menu for calculators
		let calcs = new PopupMenu.PopupSubMenuMenuItem('Calculators');
		this.menu.addMenuItem(calcs);
		let normCalc = new PopupMenu.PopupMenuItem('Normal');
		calcs.menu.addMenuItem(normCalc);
		let mortCalc = new PopupMenu.PopupMenuItem('Mortgage');
		calcs.menu.addMenuItem(mortCalc);

		normCalc.connect('activate', () => {
			normPopup = new normCalcPopup();
		});

		mortCalc.connect('activate', () => {
			mortPopup = new mortCalcPopup();
		});

		// second sub menu for time tools
		let times =  new PopupMenu.PopupSubMenuMenuItem('Time tools');
		this.menu.addMenuItem(times);
		let stopwatch = new PopupMenu.PopupMenuItem('Stopwatch');
		times.menu.addMenuItem(stopwatch);
		let timer = new PopupMenu.PopupMenuItem('Timer');
		times.menu.addMenuItem(timer);
		let clock = new PopupMenu.PopupMenuItem('Clock');
		times.menu.addMenuItem(clock);

		// section
		//let popupMenuSection = new PopupMenu.PopupMenuSection();
		//popupMenuSection.actor.add_child(new PopupMenu.PopupMenuItem('section'));
		//this.menu.addMenuItem(popupMenuSection);

		//Log command
		let logCommand = new PopupMenu.PopupImageMenuItem(
			'Log Command',
			'security-high-symbolic'
		);
		logCommand.connect('activate', () => {
			logCom = new logComPopup();
		});
		this.menu.addMenuItem(logCommand);

		// Shell commands
		let shellCommands = new PopupMenu.PopupImageMenuItem(
			'Linux Shell Commands',
			'security-high-symbolic',
		);
		this.menu.addMenuItem(shellCommands);

		// you can close, open and toggle the menu with
		// this.menu.close();
		// this.menu.open();
		// this.menu.toggle();
	}
});

//Popup class for unit converter-----------------------------
const unitConvPopup = GObject.registerClass(
class unitConvPopup extends PanelMenu.Button{
	_init(){
		super._init(0);

		//Variables
		var message1;
	    
	    //Variables
		var impAmount = 1;		
		var metAmount = 1;
		var validUnits = false;
		var formulaImpToMet;
		var formulaMetToImp;
		
		var impUnitEntry;
		
		var metUnitEntry;

		//Section text for instructions
		let lcinst11 = new PopupMenu.PopupMenuSection();
		lcinst11.actor.add_child(new PopupMenu.PopupMenuItem('This is a unit converter for metric and imperial (USA) units', {reactive: false}));
		this.menu.addMenuItem(lcinst11);

		//1 Text box for imperial unit----------------
		let impUnitLabel = new PopupMenu.PopupMenuSection();
		impUnitLabel.actor.add_child(new PopupMenu.PopupMenuItem('Imperial Unit', {reactive: false}));
		this.menu.addMenuItem(impUnitLabel);
		
		let entry1;
		entry1 = new St.Entry({
			hint_text: 'Enter imperial unit (singular, not case sensitive)',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem1 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem1.actor.add_child(entry1);

		entry1.clutter_text.connect('text-changed', (widget) => {
			let text1 = widget.get_text();
			impUnitEntry = text1.toLowerCase();
		});

		this.menu.addMenuItem(entryMenuItem1);
		
		//2 Text box for metric unit----------------
		let metUnitLabel = new PopupMenu.PopupMenuSection();
		metUnitLabel.actor.add_child(new PopupMenu.PopupMenuItem('Metric Unit', {reactive: false}));
		this.menu.addMenuItem(metUnitLabel);
		
		let entry2;
		entry2 = new St.Entry({
			hint_text: 'Enter metric unit (singular, not case sensitive)',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem2 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem2.actor.add_child(entry2);

		entry2.clutter_text.connect('text-changed', (widget) => {
			let text2 = widget.get_text();
			metUnitEntry = text2.toLowerCase();
		});

		this.menu.addMenuItem(entryMenuItem2);
		
		//3 Text box for metric amount----------------
		let metValueLabel = new PopupMenu.PopupMenuSection();
		metValueLabel.actor.add_child(new PopupMenu.PopupMenuItem('Metric Value', {reactive: false}));
		this.menu.addMenuItem(metValueLabel);
		
		let entry3;
		entry3 = new St.Entry({
			hint_text: 'Enter metric amount',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem3 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem3.actor.add_child(entry3);

		entry3.clutter_text.connect('text-changed', (widget) => {
			let text3 = widget.get_text();
			metAmount = parseFloat(text3);
		});

		this.menu.addMenuItem(entryMenuItem3);
		
		//4 Text box for imperial amount----------------
		let impValueLabel = new PopupMenu.PopupMenuSection();
		impValueLabel.actor.add_child(new PopupMenu.PopupMenuItem('Imperial Value', {reactive: false}));
		this.menu.addMenuItem(impValueLabel);
		
		let entry4;
		entry4 = new St.Entry({
			hint_text: 'Enter imperial amount',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem4 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem4.actor.add_child(entry4);

		entry4.clutter_text.connect('text-changed', (widget) => {
			let text4 = widget.get_text();
			impAmount = parseFloat(text4);
		});

		this.menu.addMenuItem(entryMenuItem4);

		//Button to compute imperial to metric conversion
		let computeImptoMet = new PopupMenu.PopupMenuItem('Compute imperial to metric conversion');
		this.menu.addMenuItem(computeImptoMet);

		computeImptoMet.connect('activate', () => {
			//check if units are in same domain
			if(metUnitEntry == 'gram'){
			    if(impUnitEntry == 'pound' || impUnitEntry == 'ounce' || impUnitEntry == 'ton'){
			        validUnits = true;
			        if(impUnitEntry == 'pound'){
			            formulaImpToMet = (impAmount * 453.6)
			        }
			        if(impUnitEntry == 'ounce'){
			            formulaImpToMet = (impAmount * 28.35)
			        }
			        if(impUnitEntry == 'ton'){
			            formulaImpToMet = (impAmount * 907200.00)
			        }
			    }
			}
			
			if(metUnitEntry == 'meter'){
			    if(impUnitEntry == 'inch' || impUnitEntry == 'foot' || impUnitEntry == 'yard' || impUnitEntry == 'mile' || impUnitEntry == 'nautical mile'){
			        validUnits = true;
			        if(impUnitEntry == 'inch'){
			            formulaImpToMet = (metAmount / 39.37)
			        }
			        if(impUnitEntry == 'foot'){
			            formulaImpToMet = (metAmount / 3.28)
			        }
			        if(impUnitEntry == 'yard'){
			            formulaImpToMet = (metAmount / 1.094)
			        }
			        if(impUnitEntry == 'mile'){
			            formulaImpToMet = (metAmount * 1609.344)
			        }
			        if(impUnitEntry == 'nautical mile'){
			            formulaImpToMet = (metAmount * 1852.00)
			        }
			    }
			}
			
			if(metUnitEntry == 'liter'){
			    if(impUnitEntry == 'gallon' || impUnitEntry == 'quart' || impUnitEntry == 'pint' || impUnitEntry == 'cup' || impUnitEntry == 'tablespoon' || impUnitEntry == 'teaspoon'){
			        validUnits = true;
			        if(impUnitEntry == 'gallon'){
			            formulaImpToMet = (metAmount / 3.79)
			        }
			        if(impUnitEntry == 'quart'){
			            formulaImpToMet = (metAmount * 1.06)
			        }
			        if(impUnitEntry == 'pint'){
			            formulaImpToMet = (metAmount * 2.11)
			        }
			        if(impUnitEntry == 'cup'){
			            formulaImpToMet = (metAmount * 4.23)
			        }
			        if(impUnitEntry == 'tablespoon'){
			            formulaImpToMet = (metAmount * 67.63)
			        }
			        if(impUnitEntry == 'teaspoon'){
			            formulaImpToMet = (metAmount * 202.88)
			        }
			    }
			}
			
			if(metUnitEntry == 'celcius' || metUnitEntry == 'kelvin'){
			    if(impUnitEntry == 'fahrenheit'){
			        validUnits = true;
			        if(metUnitEntry == 'celcius'){
			            formulaImpToMet = (impAmount -32)*(5/9)
			        }
			        if(metUnitEntry == 'kelvin'){
			            formulaImpToMet = ((((impAmount - 32)*5)/9)+273.15)
			        }
			    }
			}
            
			Main.notify(_(impAmount+' '+impUnitEntry+ 's = ' +formulaImpToMet+' '+metUnitEntry+'s'));
			
			if(validUnits == false){
			    Main.notify(_('Invalid units, check your entries and try again'));
			}
		});
		
		//Button to compute metric to imperial conversion
		let computeMetToImp = new PopupMenu.PopupMenuItem('Compute metric to imperial conversion');
		this.menu.addMenuItem(computeMetToImp);

		computeMetToImp.connect('activate', () => {
			//check if units are in same domain
			if(metUnitEntry == 'gram'){
			    if(impUnitEntry == 'pound' || impUnitEntry == 'ounce' || impUnitEntry == 'ton'){
			        validUnits = true;
			        if(impUnitEntry == 'pound'){
			            formulaMetToImp = (metAmount / 453.6)
			        }
			        if(impUnitEntry == 'ounce'){
			            formulaMetToImp = (metAmount / 28.35)
			        }
			        if(impUnitEntry == 'ton'){
			            formulaMetToImp = (metAmount / 907200.00)
			        }
			    }
			}
			
			if(metUnitEntry == 'meter'){
			    if(impUnitEntry == 'inch' || impUnitEntry == 'foot' || impUnitEntry == 'yard' || impUnitEntry == 'mile' || impUnitEntry == 'nautical mile'){
			        validUnits = true;
			        if(impUnitEntry == 'inch'){
			            formulaMetToImp = (metAmount * 39.37)
			        }
			        if(impUnitEntry == 'foot'){
			            formulaMetToImp = (metAmount * 3.28)
			        }
			        if(impUnitEntry == 'yard'){
			            formulaMetToImp = (metAmount * 1.094)
			        }
			        if(impUnitEntry == 'mile'){
			            formulaMetToImp = (metAmount / 1609.344)
			        }
			        if(impUnitEntry == 'nautical mile'){
			            formulaMetToImp = (metAmount / 1852.00)
			        }
			    }
			}
			
			if(metUnitEntry == 'liter'){
			    if(impUnitEntry == 'gallon' || impUnitEntry == 'quart' || impUnitEntry == 'pint' || impUnitEntry == 'cup' || impUnitEntry == 'tablespoon' || impUnitEntry == 'teaspoon'){
			        validUnits = true;
			        if(impUnitEntry == 'gallon'){
			            formulaMetToImp = (metAmount * 3.79)
			        }
			        if(impUnitEntry == 'quart'){
			            formulaMetToImp = (metAmount / 1.06)
			        }
			        if(impUnitEntry == 'pint'){
			            formulaMetToImp = (metAmount / 2.11)
			        }
			        if(impUnitEntry == 'cup'){
			            formulaMetToImp = (metAmount / 4.23)
			        }
			        if(impUnitEntry == 'tablespoon'){
			            formulaMetToImp = (metAmount / 67.63)
			        }
			        if(impUnitEntry == 'teaspoon'){
			            formulaMetToImp = (metAmount / 202.88)
			        }
			    }
			}
			
			if(metUnitEntry == 'celcius' || metUnitEntry == 'kelvin'){
			    if(impUnitEntry == 'fahrenheit'){
			        validUnits = true;
			        if(metUnitEntry == 'celcius'){
			            formulaMetToImp = ((metAmount * (9/5)) + 32)
			        }
			        if(metUnitEntry == 'kelvin'){
			            formulaMetToImp = ((((metAmount - 273.15)*9)/5)+32)
			        }
			    }
			}
            
			Main.notify(_(formulaMetToImp+' '+impUnitEntry+ 's =' +metAmount+' '+metUnitEntry+'s'));
			
			if(validUnits == false){
			    Main.notify(_('Invalid units, check your entries and try again'));
			}
		});

		//Button for canceling
		let cancelBtn = new PopupMenu.PopupMenuItem('Close this menu');
		this.menu.addMenuItem(cancelBtn);
		cancelBtn.connect('activate', () => {
			this.destroy();
		});

		//Opens menu
		this.menu.open();
	}
});

//Popup class for Log Command
const logComPopup = GObject.registerClass(
class logComPopup extends PanelMenu.Button{
	_init(){
		super._init(0);

		//Variable
		var message;

		//Section text for instructions
		let lcinst = new PopupMenu.PopupMenuSection();
		lcinst.actor.add_child(new PopupMenu.PopupMenuItem('This command logs a statement in the terminal,\nif you are running this extension in wayland, it will be\nin the terminal used to run dbus.', {reactive: false}));
		this.menu.addMenuItem(lcinst);

		//Text box for log statement
		let entry;
		entry = new St.Entry({
			hint_text: 'Enter message',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem.actor.add_child(entry);

		entry.clutter_text.connect('text-changed', (widget) => {
			let text = widget.get_text();
			message = text;
		});

		this.menu.addMenuItem(entryMenuItem);

		//Button to log
		let logButton = new PopupMenu.PopupMenuItem('Log command!');
		this.menu.addMenuItem(logButton);

		logButton.connect('activate', () => {
			log('' + message);
			Main.notify(_('Message logged in terminal'));
		});

		//Button for canceling
		let lccancel = new PopupMenu.PopupMenuItem('Cancel');
		this.menu.addMenuItem(lccancel);
		lccancel.connect('activate', () => {
			this.destroy();
		});

		//Opens menu
		this.menu.open();
	}
});

//Popup class for the mortgage calculator
const mortCalcPopup = GObject.registerClass(
class mortCalcPopup extends PanelMenu.Button {
	_init(){
		super._init(0);

		//Variables
		var amount;
		var years;
		var intrest;

		//Section text for instructions
		let insection = new PopupMenu.PopupMenuSection();
		insection.actor.add_child(new PopupMenu.PopupMenuItem('This is a primative mortgage calculator. \nIt is designed to be an estimate, so actual values may differ in real life.', {reactive: false}));
		this.menu.addMenuItem(insection);

		//Section text for amount
		let amountSection = new PopupMenu.PopupMenuSection();
		amountSection.actor.add_child(new PopupMenu.PopupMenuItem('Put in the amount borrowed', {reactive: false}));
		this.menu.addMenuItem(amountSection);

		//First textbox for the amount
		let entry;

		entry = new St.Entry({
			hint_text: 'Enter borrowed amount:',
			track_hover: true,
			can_focus: true
		});

		let entryItem = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryItem.actor.add_child(entry);

		entry.clutter_text.connect('text-changed', (widget) => {
			let text = widget.get_text();
			let textNum = parseFloat(text);
			amount = textNum;
		});

		this.menu.addMenuItem(entryItem);

		//Section text for years
		let yearSection = new PopupMenu.PopupMenuSection();
		yearSection.actor.add_child(new PopupMenu.PopupMenuItem('Put in the years the mortgage will be held', {reactive: false}));
		this.menu.addMenuItem(yearSection);

		//Textbox for the years
		let entry2;
		entry2 = new St.Entry({
			hint_text: 'Enter years:',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem2 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem2.actor.add_child(entry2);

		entry2.clutter_text.connect('text-changed', (widget) => {
			let text2 = widget.get_text();
			let textNum2 = parseFloat(text2);
			years = textNum2;
		});

		this.menu.addMenuItem(entryMenuItem2);

		//Section text for interest
		let intSection = new PopupMenu.PopupMenuSection();
		intSection.actor.add_child(new PopupMenu.PopupMenuItem('Put in the annual intrest as a decimal', {reactive: false}));
		this.menu.addMenuItem(intSection);

		//Textbox for interest
		let entry3;
		entry3 = new St.Entry({
			hint_text: 'Enter intrest:',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem3 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem3.actor.add_child(entry3);

		entry3.clutter_text.connect('text-changed', (widget) => {
			let text3 = widget.get_text();
			let textNum3 = parseFloat(text3);
			intrest = textNum3;
		});

		this.menu.addMenuItem(entryMenuItem3);

		//Button for calculation
		let calculate = new PopupMenu.PopupMenuItem('Calculate!');
		this.menu.addMenuItem(calculate);
		calculate.connect('activate', () => {
			//Variables
			var monthInt = (intrest / 12); //Monthly interest
			var monthPay = (monthInt * amount) / (1-(1/(Math.pow((1+monthInt), (years * 12))))); //Monthly payment
			var totalPay = monthPay * (12*years); //Total payment
			var totalPayFix = totalPay.toFixed(2); //Rounds totalPay to two decimals
			var overpay = totalPayFix - amount; //Amount overpaid
			var overpayFix = overpay.toFixed(2) //Rounds overpay

			Main.notify(_('Total pay: $' + totalPayFix + ', overpaid: $' + overpayFix));
		});

		//Button for canceling
		let popupMenuCancel = new PopupMenu.PopupMenuItem('Cancel');
		this.menu.addMenuItem(popupMenuCancel);
		popupMenuCancel.connect('activate', () => {
			this.destroy();
		});
		this.menu.open();
	}
});

//Popup class for the normal calculator
const normCalcPopup = GObject.registerClass(
class normCalcPopup extends PanelMenu.Button {
	_init(){
		super._init(0);
		//Variables
		var num1;
		var num2;
		var op;

		//Section text for number 1
		let section1 = new PopupMenu.PopupMenuSection();
		section1.actor.add_child(new PopupMenu.PopupMenuItem('Put in first number', {reactive: false}));
		this.menu.addMenuItem(section1);

		//First textbox for number 1
		let entry; //define entry

		entry = new St.Entry({
			hint_text: 'Enter first number:',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem.actor.add_child(entry);

		entry.clutter_text.connect('text-changed', (widget) => {
			let text = widget.get_text();
			let textNum = parseFloat(text);
			num1 = textNum;
		});

		this.menu.addMenuItem(entryMenuItem);

		//Section text for number 2
		let section2 = new PopupMenu.PopupMenuSection();
		section2.actor.add_child(new PopupMenu.PopupMenuItem('Put in second number', {reactive: false}));
		this.menu.addMenuItem(section2);

		//Second textbox for number 2
		let entry2;
		entry2 = new St.Entry({
			hint_text: 'Enter second number:',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem2 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem2.actor.add_child(entry2);

		entry2.clutter_text.connect('text-changed', (widget) => {
			let text2 = widget.get_text();
			let textNum2 = parseFloat(text2);
			num2 = textNum2;
		});

		this.menu.addMenuItem(entryMenuItem2);

		//Third section text for the operator
		let section3 = new PopupMenu.PopupMenuSection();
		section3.actor.add_child(new PopupMenu.PopupMenuItem('Put in operator (1=add, 2=sub, 3=mult, 4=mod, 5=div, 6=pow)', {reactive: false}));
		this.menu.addMenuItem(section3);

		//Third textbox for the operation
		let entry3;
		entry3 = new St.Entry({
			hint_text: 'Enter operator:',
			track_hover: true,
			can_focus: true
		});

		let entryMenuItem3 = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		entryMenuItem3.actor.add_child(entry3);

		entry3.clutter_text.connect('text-changed', (widget) => {
			let text3 = widget.get_text();
			let textNum3 = parseInt(text3, 10);
			op = textNum3;
		});

		this.menu.addMenuItem(entryMenuItem3);

		//Button for carrying out the calculation
		let calculate = new PopupMenu.PopupMenuItem('Calculate!');
		this.menu.addMenuItem(calculate);
		calculate.connect('activate', () => {
			//Branches for calculations based on operator
			switch(op){
				case 1:
					Main.notify(_('' + num1 + ' + ' + num2 + ' = ' + (num1+num2)));
					break;
				case 2:
					Main.notify(_('' + num1 + ' - ' + num2 + ' = ' + (num1-num2)));
					break;
				case 3:
					Main.notify(_('' + num1 + ' * ' + num2 + ' = ' + (num1*num2)));
					break;
				case 4:
					Main.notify(_('' + num1 + ' % ' + num2 + ' = ' + (num1%num2)));
					break;
				case 5:
					Main.notify(_('' + num1 + ' / ' + num2 + ' = ' + (num1/num2)));
					break;
				case 6:
					Main.notify(_('' + num1 + ' ^ ' + num2 + ' = ' + (Math.pow(num1, num2))));
					break;
				default:
					Main.notify(_('Invalid operator number'));
			}
			this.destroy();
		});

		//Button for canceling
		let popupMenuCancel = new PopupMenu.PopupMenuItem('Cancel');
		this.menu.addMenuItem(popupMenuCancel);
		popupMenuCancel.connect('activate', () => {
			this.destroy();
		});

		//Opens the menu
		this.menu.open();
	}
});

function init() {
}

function enable() {
	myPopup = new MyPopup();
	Main.panel.addToStatusArea('myPopup', myPopup, 1);
}

function disable() {
	myPopup.destroy();
}

