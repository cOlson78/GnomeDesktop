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
		let icon = new St.Icon({
			icon_name: 'face-smile-symbolic',
			style_class : 'system-status-icon',
		});

		this.add_child(icon);

		//Title section text
		let titleSection = new PopupMenu.PopupMenuSection();
		titleSection.actor.add_child(new PopupMenu.PopupMenuItem('The \"Lovely\" switchblade widget'));
		this.menu.addMenuItem(titleSection);

		let pmItem = new PopupMenu.PopupMenuItem('Unit converter');
		pmItem.add_child(new St.Label({text : '-metric'}));
		this.menu.addMenuItem(pmItem);

		pmItem.connect('activate', () => {
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
		let subItem = new PopupMenu.PopupSubMenuMenuItem('Calculators');
		this.menu.addMenuItem(subItem);
		let normCalc = new PopupMenu.PopupMenuItem('Normal');
		subItem.menu.addMenuItem(normCalc);
		let mortCalc = new PopupMenu.PopupMenuItem('Mortgage');
		subItem.menu.addMenuItem(mortCalc);

		normCalc.connect('activate', () => {
			normPopup = new normCalcPopup();
		});

		mortCalc.connect('activate', () => {
			Main.notify(_('Here is a primitive mortgage calculator.'));
		});

		// second sub menu
		let subItem2 =  new PopupMenu.PopupSubMenuMenuItem('Time tools');
		this.menu.addMenuItem(subItem2);
		subItem2.menu.addMenuItem(new PopupMenu.PopupMenuItem('Stopwatch'));
		subItem2.menu.addMenuItem(new PopupMenu.PopupMenuItem('Timer'));
		subItem2.menu.addMenuItem(new PopupMenu.PopupMenuItem('Clock'));

		// section
		//let popupMenuSection = new PopupMenu.PopupMenuSection();
		//popupMenuSection.actor.add_child(new PopupMenu.PopupMenuItem('section'));
		//this.menu.addMenuItem(popupMenuSection);

		// image item
		let popupImageMenuItem = new PopupMenu.PopupImageMenuItem(
			'Linux Shell Commands',
			'security-high-symbolic',
		);
		this.menu.addMenuItem(popupImageMenuItem);

		// you can close, open and toggle the menu with
		// this.menu.close();
		// this.menu.open();
		// this.menu.toggle();
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
		section1.actor.add_child(new PopupMenu.PopupMenuItem('Put in first number'));
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
			let textNum = parseInt(text,10);
			num1 = textNum;
		});

		this.menu.addMenuItem(entryMenuItem);

		//Section text for number 2
		let section2 = new PopupMenu.PopupMenuSection();
		section2.actor.add_child(new PopupMenu.PopupMenuItem('Put in second number'));
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
			let textNum2 = parseInt(text2,10);
			num2 = textNum2;
		});

		this.menu.addMenuItem(entryMenuItem2);

		//Third section text for the operator
		let section3 = new PopupMenu.PopupMenuSection();
		section3.actor.add_child(new PopupMenu.PopupMenuItem('Put in operator (1 for add, 2 for sub, 3 for mult, 4 for mod)'));
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

