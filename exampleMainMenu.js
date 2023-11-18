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
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let myPopup;

const MyPopup = GObject.registerClass(
class MyPopup extends PanelMenu.Button {

	_init () {
		super._init(0);

		let icon = new St.Icon({
			gicon : Gio.icon_new_for_string( Me.dir.get_path() + '/icon.svg' ),
			style_class : 'system-status-icon',
		});

		this.add_child(icon);

		let pmItem = new PopupMenu.PopupMenuItem('Unit converter');
		pmItem.add_child(new St.Label({text : '-Converts units'}));
		this.menu.addMenuItem(pmItem);

		pmItem.connect('activate', () => {
			log('clicked');
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
		subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem('Normal'));
		subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem('Mortgage'), 0);

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
		this.menu.open();
		// this.menu.toggle();
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
