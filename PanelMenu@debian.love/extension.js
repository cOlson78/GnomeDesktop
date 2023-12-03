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

		let unitc = new PopupMenu.PopupMenuItem('Unit converter');
		unitc.add_child(new St.Label({text : '-metric'}));
		this.menu.addMenuItem(unitc);

		unitc.connect('activate', () => {
			log('clicked');
			Main.notify(_('This is the unit converter'));
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

		// sub menu
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

		// second sub menu
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

		// image item
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

			//Main.notify(_('Monthly interest: ' + monthInt));
			//Main.notify(_('Monthly payment: ' + monthPay));
			Main.notify(_('Total pay: $' + totalPayFix + ', overpaid: $' + overpayFix));
			//Main.notify(_('Amount overpaid: ' + overpay));
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

